import { React, T, createRoot } from './runtime.js';
import './proto.css';
import { Home } from './home.js';
import { Landing } from './landing.js';
import { Tool } from './tool.js';
import { Checkout, Success, CHECKOUT_LEGAL } from './checkout.js';

const h = React.createElement;

/* Прототип воронки подключения MPSTATS.
   Вся воронка — один полноэкранный Dialog, экраны сменяются как шаги (prop step):
   по гайду ориджинейшена текущий шаг уходит на 16 влево, следующий приезжает с 32 справа.
   Открытие и закрытие самого диалога — шторкой снизу с затемнением главной (screens/proto.css).
   Экран воронки — запись в стеке: { name, ...параметры }. «Назад» снимает верхнюю запись,
   «Закрыть» закрывает диалог. Состояние connected живёт в памяти и сбрасывается перезагрузкой. */
function App() {
  const [stack, setStack] = React.useState([]);
  const [session, setSession] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const [connected, setConnected] = React.useState(false);
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
  const close = () => { scrolls.current = []; setStack([]); setBusy(false); };
  const open = ctx => { scrolls.current = []; setSession(n => n + 1); direction.current = 'forward'; setStack([{ name: 'landing', ctx }]); };
  const connect = () => {
    setBusy(true);
    setTimeout(() => { setBusy(false); setConnected(true); push({ name: 'success' }); }, 700);
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
    body = h(Landing, { ctx: shown.ctx, onOpenTool: id => push({ name: 'tool', id }), onConnect: () => push({ name: 'checkout' }) });
  } else if (shown && shown.name === 'tool') {
    body = h(Tool, { id: shown.id, onDone: back });
    extra = { onBack: back };
  } else if (shown && shown.name === 'checkout') {
    body = h(Checkout);
    extra = { onBack: back, actions: [{ label: 'Подключить', onClick: connect, loading: busy }], legalPosition: 'right', legal: CHECKOUT_LEGAL };
  } else if (shown && shown.name === 'success') {
    body = h(Success, { onHome: close });
  }

  return h(React.Fragment, null,
    h(Home, { connected, open }),
    shown && h(T.Dialog, Object.assign({
      key: session, open: stack.length > 0, fullscreen: true, closePosition: 'right', dismissible: false,
      className: 'proto-funnel', onClose: close,
      step: shown.name + (shown.id || ''), stepDirection: direction.current
    }, extra), body));
}

createRoot(document.getElementById('root')).render(h(App));
