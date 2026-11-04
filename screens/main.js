import { React, createRoot } from './runtime.js';
import { Home } from './home.js';
import { Landing } from './landing.js';
import { Tool } from './tool.js';
import { Checkout, Success } from './checkout.js';

const h = React.createElement;

/* Прототип воронки подключения MPSTATS.
   Экран воронки — запись в стеке: { name, ...параметры }. «Назад» снимает верхнюю запись,
   «Закрыть» возвращает на главную. Состояние connected живёт в памяти и сбрасывается перезагрузкой. */
function App() {
  const [stack, setStack] = React.useState([]);
  const [connected, setConnected] = React.useState(false);
  const push = s => setStack(st => [...st, s]);
  const back = () => setStack(st => st.slice(0, -1));
  const close = () => setStack([]);
  const top = stack[stack.length - 1];

  /* Главная лежит под воронкой и остаётся на фоне, пока открыт любой её экран */
  const home = h(Home, { connected, open: ctx => setStack([{ name: 'landing', ctx }]) });

  let screen = null;
  if (top && top.name === 'landing') {
    screen = h(Landing, { key: 'landing', ctx: top.ctx, onBack: back, onClose: close,
      onOpenTool: id => push({ name: 'tool', id }), onConnect: () => push({ name: 'checkout' }) });
  } else if (top && top.name === 'tool') {
    screen = h(Tool, { key: 'tool', id: top.id, onBack: back, onDone: back });
  } else if (top && top.name === 'checkout') {
    screen = h(Checkout, { key: 'checkout', onBack: back, onClose: close,
      onConnect: () => { setConnected(true); push({ name: 'success' }); } });
  } else if (top && top.name === 'success') {
    screen = h(Success, { key: 'success', onClose: close, onHome: close });
  }
  return h(React.Fragment, null, home, screen);
}

createRoot(document.getElementById('root')).render(h(App));
