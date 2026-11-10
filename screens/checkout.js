import { React, T } from './runtime.js';

const h = React.createElement;

/* Лигал оформления: серый, с подчёркиванием — это делает сам Dialog (prop legal).
   Название кнопки в кавычках зависит от варианта: «Подключить» у нового Селлера, «Запланировать переход» у старого. */
export const checkoutLegal = button => h(React.Fragment, null,
  `Нажимая «${button}», вы принимаете условия `,
  h(T.Link, { href: 'https://www.tbank.ru/business/', target: '_blank', rel: 'noopener noreferrer' }, 'оферты'));

/* Оформление пробного периода: три шага связанными ячейками.
   Старый Селлер (макет 8618:226607): другие иконки, подпись у второго шага — даты, плюс строка про отзыв согласия.
   Кнопка и лигал справа от неё задаются в Dialog (см. main.js). */
export function Checkout({ variant = 'new' }) {
  const legacy = variant === 'legacy';
  return h('div', { style: { width: '100%' } },
    h('h1', { className: 'tui-heading-3', style: { margin: '0 0 20px' } }, 'Попробуйте MPSTATS бесплатно'),
    h(T.Cell, { connected: true, connectTop: false, inset: 'none', size: 'l', title: 'Сейчас ничего не платите',
      avatar: legacy ? 'medium/bonus-zero' : 'medium/coin', avatarTone: 'accent-2' }),
    h(T.Cell, { connected: true, inset: 'none', size: 'l', title: '14 дней бесплатного использования',
      description: legacy ? 'С 1 по 14 февраля включительно' : 'Все инструменты MPSTATS доступны для вашего магазина',
      avatar: legacy ? 'medium/hourglass' : 'medium/rocket', avatarTone: 'neutral' }),
    h(T.Cell, { connected: true, connectBottom: false, inset: 'none', size: 'l', title: '15 февраля спишем 6\u00a0495\u00a0₽',
      description: 'Напомним о списании за день', avatar: 'medium/card-frontside', avatarTone: 'neutral' }),
    legacy && h('p', { className: 'tui-body-m', style: { margin: '4px 0 0', color: 'var(--tui-text-secondary)' } },
      'Согласие можно будет отозвать в любой момент через чат'));
}

/* Результат. Новый Селлер: подписка подключена, «Перейти в MPSTATS» открывает реальную ссылку.
   Старый Селлер: переход запланирован на 1 февраля, пока работаем как обычно (макет 8843:308318). */
export function Success({ variant = 'new', onHome }) {
  if (variant === 'legacy') {
    return h('div', { style: { minHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' } },
      h(T.Illustration, { name: 'check', size: 144 }),
      h('h1', { className: 'tui-heading-4', style: { margin: '32px 0 16px' } }, 'Переход запланирован'),
      h('p', { className: 'tui-body-m', style: { margin: '0 0 32px', color: 'var(--tui-text-secondary)', maxWidth: 560 } },
        '1 февраля переключим на новый тариф.', h('br'), 'До этого продолжайте пользоваться Селлером как обычно'),
      h(T.CardLarge, { appearance: 'flat', hover: '', style: { width: '100%', textAlign: 'left' } },
        h(T.Cell, { inset: 'none', size: 'l', title: 'Бесплатный период', right: 'С 1 по 14 февраля включительно' }),
        h(T.Cell, { inset: 'none', size: 'l', title: 'Первое списание', right: '15 февраля 6\u00a0495\u00a0₽' })),
      h('div', { style: { paddingTop: 32 } }, h(T.Button, { size: 'l', onClick: onHome }, 'На главную')));
  }
  return h('div', { style: { minHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 0 } },
    h(T.Illustration, { name: 'check', size: 160 }),
    h('h1', { className: 'tui-heading-4', style: { margin: '24px 0 8px' } }, 'Тариф подключен'),
    h('p', { className: 'tui-body-m', style: { margin: '0 0 24px', color: 'var(--tui-text-secondary)', maxWidth: 360 } }, 'Все инструменты MPSTATS уже доступны для вашего магазина'),
    h(T.Button, { onClick: () => window.open('https://mpstats.io/login', '_blank', 'noopener,noreferrer') }, 'Перейти в MPSTATS'),
    h('div', { style: { marginTop: 16 } }, h(T.Button, { appearance: 'flat', size: 'm', onClick: onHome }, 'На главную')));
}
