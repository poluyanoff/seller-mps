import { React, T } from './runtime.js';

const h = React.createElement;

/* Оформление пробного периода: три шага связанными ячейками, «Подключить» + лигал справа */
export function Checkout({ onBack, onClose, onConnect }) {
  const [busy, setBusy] = React.useState(false);
  const connect = () => {
    setBusy(true);
    setTimeout(onConnect, 700);
  };
  return h(T.Dialog, {
    open: true, fullscreen: true, closePosition: 'right', dismissible: false, onBack, onClose,
    actions: [{ label: 'Подключить', onClick: connect, loading: busy }],
    legalPosition: 'right',
    legal: h(React.Fragment, null, 'Нажимая «Подключить», вы принимаете условия ', h(T.Link, { href: 'https://www.tbank.ru/business/', target: '_blank', rel: 'noopener noreferrer' }, 'оферты'))
  },
  h('div', { style: { width: 528, maxWidth: '100%', margin: '0 auto' } },
    h('h1', { className: 'tui-heading-3', style: { margin: '0 0 48px' } }, 'Попробуйте MPSTATS бесплатно'),
    h(T.Cell, { connected: true, connectTop: false, inset: 'none', size: 'l', title: 'Сейчас ничего не платите', avatar: 'medium/coin', avatarTone: 'accent-2' }),
    h(T.Cell, { connected: true, inset: 'none', size: 'l', title: '14 дней бесплатного использования', description: 'Все инструменты MPSTATS доступны для вашего магазина', avatar: 'medium/rocket', avatarTone: 'neutral' }),
    h(T.Cell, { connected: true, connectBottom: false, inset: 'none', size: 'l', title: '15 февраля спишем 6 495 ₽', description: 'Напомним о списании за день', avatar: 'medium/card-frontside', avatarTone: 'neutral' })));
}

/* Результат: подписка подключена. «Перейти в MPSTATS» открывает реальную ссылку в новой вкладке */
export function Success({ onClose, onHome }) {
  return h(T.Dialog, { open: true, fullscreen: true, closePosition: 'right', dismissible: false, onClose },
    h('div', { style: { minHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 0 } },
      h(T.Illustration, { name: 'check', size: 160 }),
      h('h1', { className: 'tui-heading-4', style: { margin: '24px 0 8px' } }, 'Тариф подключен'),
      h('p', { className: 'tui-body-m', style: { margin: '0 0 24px', color: 'var(--tui-text-secondary)', maxWidth: 360 } }, 'Все инструменты MPSTATS уже доступны для вашего магазина'),
      h(T.Button, { onClick: () => window.open('https://mpstats.io/login', '_blank', 'noopener,noreferrer') }, 'Перейти в MPSTATS'),
      h('div', { style: { marginTop: 16 } }, h(T.Button, { appearance: 'flat', size: 'm', onClick: onHome }, 'На главную'))));
}
