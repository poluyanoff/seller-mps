import { React, T, createRoot } from './runtime.js';
import { DialRoot, useDialKit } from 'dialkit';
import 'dialkit/styles.css';
import './proto.css';
import { LegacySeller } from './legacy.js';
import { Home } from './home.js';
import { Landing } from './landing.js';
import { Tool } from './tool.js';
import { AllTools } from './alltools.js';
import { Checkout, Success, checkoutLegal } from './checkout.js';

const h = React.createElement;

/* Прототип воронки подключения MPSTATS.
   Вся воронка — один полноэкранный Dialog, экраны сменяются как шаги (prop step):
   по гайду ориджинейшена текущий шаг уходит на 16 влево, следующий приезжает с 32 справа.
   Открытие и закрытие самого диалога — шторкой снизу с затемнением главной (screens/proto.css).
   Экран воронки — запись в стеке: { name, ...параметры }. «Назад» снимает верхнюю запись,
   «Закрыть» закрывает диалог. Состояние connected живёт в памяти и сбрасывается перезагрузкой. */
function App() {
  const mode = useDialKit('Настройки', { 'Режим Селлера': false }, {
    id: 'seller-mode-tabs',
    persist: true,
    defaultCollapsed: true
  });
  const newSeller = !!mode['Режим Селлера'];
  const [stack, setStack] = React.useState([]);
  const [session, setSession] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const [connected, setConnected] = React.useState(false);
  /* Тултип у бейджа «mpstats подключен»: показывается после закрытия результирующего экрана */
  const [tipOpen, setTipOpen] = React.useState(false);
  const justConnected = React.useRef(false);
  /* Переключение «Старый ↔ Новый»: статус подключения не переносим, всегда стартуем с «не подключено» */
  const prevMode = React.useRef(newSeller);
  React.useEffect(() => {
    if (prevMode.current === newSeller) return;
    prevMode.current = newSeller;
    setConnected(false);
    setTipOpen(false);
    justConnected.current = false;
    setStack([]);
    setBusy(false);
  }, [newSeller]);
  const direction = React.useRef('forward');
  const lastTop = React.useRef(null);

  /* Dialog сам сбрасывает прокрутку при смене шага; запоминаем позицию и возвращаем при «Назад» */
  const scrolls = React.useRef([]);
  const restore = React.useRef(null);
  const scroller = () => document.querySelector('.proto-funnel');
  const push = s => {
    direction.current = 'forward';
    const el = scroller();
    scrolls.current.push(el ? el.scrollTop : 0);
    if (el) el.style.setProperty('--proto-from', el.scrollTop + 'px');
    setStack(st => [...st, s]);
  };
  const back = () => {
    direction.current = 'back';
    restore.current = scrolls.current.pop() || 0;
    /* Уходящий шаг остаётся на глазах: сдвиг = прокрутка до перехода минус прокрутка после */
    const el = scroller();
    if (el) el.style.setProperty('--proto-from', (el.scrollTop - restore.current) + 'px');
    setStack(st => st.slice(0, -1));
  };
  const close = () => {
    scrolls.current = []; setStack([]); setBusy(false);
    /* Закрыли результирующий экран нового Селлера — показываем тултип у бейджа */
    if (justConnected.current) { justConnected.current = false; if (newSeller) setTipOpen(true); }
  };
  const open = ctx => { scrolls.current = []; setSession(n => n + 1); direction.current = 'forward'; setStack([{ name: 'landing', ctx: typeof ctx === 'string' ? ctx : undefined }]); };
  const connect = () => {
    setBusy(true);
    setTimeout(() => { setBusy(false); setConnected(true); justConnected.current = true; push({ name: 'success' }); }, 700);
  };

  React.useLayoutEffect(() => {
    if (restore.current == null) return;
    const el = scroller();
    if (el) el.scrollTop = restore.current;
    restore.current = null;
  }, [stack]);

  const top = stack[stack.length - 1];
  if (top) lastTop.current = top;
  /* При закрытии диалог доигрывает выезд вниз с тем же содержимым */
  const shown = top || lastTop.current;

  let body = null;
  let extra = {};
  if (shown && shown.name === 'landing') {
    body = h(Landing, { variant: newSeller ? 'new' : 'legacy', ctx: shown.ctx, onOpenTool: id => push({ name: 'tool', id }), onConnect: () => push({ name: 'checkout' }) });
  } else if (shown && shown.name === 'alltools') {
    body = h(AllTools);
    extra = { closePosition: 'right' };
  } else if (shown && shown.name === 'tool') {
    body = h(Tool, { id: shown.id, onDone: back });
    extra = { onBack: back };
  } else if (shown && shown.name === 'checkout') {
    const legacyFlow = !newSeller;
    const cta = legacyFlow ? 'Запланировать переход' : 'Подключить';
    body = h(Checkout, { variant: legacyFlow ? 'legacy' : 'new' });
    extra = { onBack: back, actions: [{ label: cta, onClick: connect, loading: busy }], legalPosition: 'right', legal: checkoutLegal(cta) };
  } else if (shown && shown.name === 'success') {
    body = h(Success, { variant: newSeller ? 'new' : 'legacy', onHome: () => { close(); window.scrollTo(0, 0); document.scrollingElement && (document.scrollingElement.scrollTop = 0); } });
  }

  return h(React.Fragment, null,
    newSeller
      ? h(Home, { connected, open, tipOpen, onTipClose: () => setTipOpen(false), onAllTools: () => { setSession(n => n + 1); direction.current = 'forward'; setStack([{ name: 'alltools' }]); } })
      : h(LegacySeller, { onDetails: () => open(), onScheduled: () => { setSession(n => n + 1); direction.current = 'forward'; setStack([{ name: 'success' }]); }, scheduled: connected }),
    shown && h(T.Dialog, Object.assign({
      key: session, open: stack.length > 0, fullscreen: true, closePosition: 'right', dismissible: false,
      className: `proto-funnel${shown && shown.name === 'tool' ? ' proto-funnel--tool' : ''}${shown && shown.name === 'alltools' ? ' proto-funnel--alltools' : ''}`, onClose: close,
      step: shown.name + (shown.id || ''), stepDirection: direction.current
    }, extra), body),
    h(DialRoot, { position: 'bottom-right', theme: 'dark', defaultOpen: false, productionEnabled: true, versions: 'menu' }));
}

createRoot(document.getElementById('root')).render(h(App));
