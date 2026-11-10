import { React, T, createRoot } from './runtime.js';
import { DialRoot, useDialKitController } from 'dialkit';
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
  /* Без persist: при каждой загрузке стартуем со старого Селлера */
  const dial = useDialKitController('Настройки', { 'Режим Селлера': false }, {
    id: 'seller-mode-tabs',
    defaultCollapsed: true
  });
  const mode = dial.values;
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
    const toTop = () => { window.scrollTo(0, 0); document.scrollingElement && (document.scrollingElement.scrollTop = 0); };
    body = h(Success, { variant: newSeller ? 'new' : 'legacy', onHome: shown.fromNotif
      ? () => { direction.current = 'forward'; setStack([{ name: 'fork' }]); }
      : () => { close(); toTop(); } });
  } else if (shown && shown.name === 'fork') {
    /* Развилка после просмотра условий перехода из серого нотифа: оба пути ведут в начало сценария */
    const restart = toNew => {
      scrolls.current = []; setStack([]); setBusy(false);
      if (toNew) dial.setValue('Режим Селлера', true);
      else setConnected(false);
      window.scrollTo(0, 0);
    };
    body = h('div', { style: { minHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 12 } },
      h(T.Button, { size: 'l', appearance: 'secondary', onClick: () => restart(false) }, 'Посмотреть подключение в старом Селлере ещё раз'),
      h(T.Button, { size: 'l', onClick: () => restart(true) }, 'К подключению в новом Селлере'));
  }

  return h(React.Fragment, null,
    newSeller
      ? h(Home, { connected, open, tipOpen, onTipClose: () => setTipOpen(false), onAllTools: () => { setSession(n => n + 1); direction.current = 'forward'; setStack([{ name: 'alltools' }]); } })
      : h(LegacySeller, { onDetails: () => open(), onScheduled: () => { setSession(n => n + 1); direction.current = 'forward'; setStack([{ name: 'success', fromNotif: true }]); }, scheduled: connected }),
    shown && h(T.Dialog, Object.assign({
      key: session, open: stack.length > 0, fullscreen: true, closePosition: 'right', dismissible: false,
      className: `proto-funnel${shown && shown.name === 'tool' ? ' proto-funnel--tool' : ''}${shown && shown.name === 'alltools' ? ' proto-funnel--alltools' : ''}`, onClose: close,
      step: shown.name + (shown.id || ''), stepDirection: direction.current
    }, extra), body),
    h(DialRoot, { position: 'bottom-right', theme: 'dark', defaultOpen: false, productionEnabled: true, versions: 'menu' }));
}

/* Вход по паролю: после верного ввода на 15 минут запоминаем время в localStorage и пароль не спрашиваем.
   Это защита от случайного просмотра, а не настоящая авторизация: пароль лежит в коде страницы. */
const PASSWORD = '777';
const PASS_KEY = 'seller-proto-unlocked-at';
const PASS_TTL = 15 * 60 * 1000;
const isUnlocked = () => {
  try { return Date.now() - Number(localStorage.getItem(PASS_KEY)) < PASS_TTL; } catch (e) { return false; }
};

function PasswordGate({ children }) {
  const [ok, setOk] = React.useState(isUnlocked);
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState(false);
  if (ok) return children;
  const submit = e => {
    e.preventDefault();
    if (value === PASSWORD) {
      try { localStorage.setItem(PASS_KEY, String(Date.now())); } catch (err) { /* без хранилища спросим снова при перезагрузке */ }
      setOk(true);
    } else setError(true);
  };
  return h('form', { onSubmit: submit, style: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, boxSizing: 'border-box' } },
    h('div', { style: { width: 320, display: 'flex', flexDirection: 'column', gap: 16 } },
      h('h1', { className: 'tui-heading-5', style: { margin: 0 } }, 'Введите пароль'),
      h(T.InputPassword, { size: 'l', value, error: error ? 'Неверный пароль' : undefined, onChange: v => { setValue(v); setError(false); }, inputProps: { autoFocus: true } }),
      h(T.Button, { type: 'submit', size: 'l', block: true }, 'Войти')));
}

createRoot(document.getElementById('root')).render(h(PasswordGate, null, h(App)));
