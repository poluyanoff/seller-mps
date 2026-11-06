import { React, T } from './runtime.js';

const h = React.createElement;

const products = [{ label: 'Селлер', active: true }, 'Кассы и эквайринг', 'Бухгалтерия', 'Интернет-эквайринг', { label: 'Все сервисы', dropdown: true }];
const sections = ['Аналитика', 'Отзывы', 'AI-редактор карточек', 'Реклама', 'Товары', 'Магазины', 'Тарифы'];

function SummaryChart() {
  const values = [[78, 63], [64, 50], [56, 43], [70, 56], [61, 47], [82, 69], [54, 39], [60, 46], [73, 59], [65, 49], [87, 72], [84, 70]];
  const days = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс', 'пн', 'вт', 'ср', 'чт', 'пт'];
  return h('section', { className: 'legacy-chart' },
    h('h2', { className: 'tui-ui-l-bold', style: { margin: 0 } }, 'Заказано и выкуплено'),
    h('div', { className: 'legacy-chart__plot' },
      h('div', { className: 'legacy-chart__grid', 'aria-hidden': true }, [0, 1, 2, 3].map(i => h('span', { key: i }))),
      h('div', { className: 'legacy-chart__bars' }, values.map(([ordered, bought], index) => h('div', { className: 'legacy-chart__column', key: index },
        h('span', { className: 'legacy-chart__ordered', style: { height: ordered + '%' } }),
        h('span', { className: 'legacy-chart__bought', style: { height: bought + '%' } }),
        h('span', { className: 'legacy-chart__day' }, days[index])))),
      h('div', { className: 'legacy-chart__axis', 'aria-hidden': true }, ['100 тыс ₽', '60 тыс ₽', '20 тыс ₽', '0 ₽'].map(label => h('span', { key: label }, label)))));
}

function SmallSummary({ title, value }) {
  return h(T.CardLarge, { appearance: 'flat', hover: '', style: { minHeight: 151, background: 'var(--tui-background-base-alt)', borderRadius: 24 } },
    h('div', { className: 'tui-body-s', style: { color: 'var(--tui-text-secondary)', marginBottom: 8 } }, '26 февраля — 1 марта'),
    h('div', { className: 'tui-heading-5' }, value),
    h('div', { className: 'tui-body-s', style: { color: 'var(--tui-text-secondary)', marginTop: 8 } }, title));
}

function LegacyNav() {
  return h('div', { style: { background: 'var(--tui-background-neutral-1-on-elevation-1)' } },
    h('div', { style: { width: 1104, maxWidth: 'calc(100% - 64px)', margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', gap: 24 } },
      sections.map((label, index) => h('span', { key: label, className: 'tui-body-s', style: { color: index === 0 ? 'var(--tui-text-primary)' : 'var(--tui-text-secondary)', borderBottom: index === 0 ? '2px solid var(--tui-text-primary)' : undefined, height: '100%', display: 'inline-flex', alignItems: 'center' } }, label))));
}

export function LegacySeller({ onDetails }) {
  const filters = h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, margin: '24px 0 20px' } },
    h(T.Chip, { size: 'm', shape: 'rounded', dropdown: true, style: { background: 'var(--tui-background-base)', border: '1px solid var(--tui-border-normal)', borderRadius: 8 } }, 'Эта неделя'),
    h(T.Chip, { size: 'm', shape: 'rounded', dropdown: true, style: { background: 'var(--tui-background-base)', border: '1px solid var(--tui-border-normal)', borderRadius: 8 } }, 'Wildberries'),
    h(T.Chip, { size: 'm', shape: 'rounded', style: { background: 'var(--tui-background-base)', border: '1px solid var(--tui-border-normal)', borderRadius: 8 } }, 'Все товары'),
    h(T.Button, { appearance: 'flat', size: 's', style: { marginLeft: 'auto' } }, 'Как считаем данные'));

  const main = h('div', { style: { width: '100%' } },
    filters,
    h('div', { style: { display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(250px, 1fr)', gap: 24 } },
      h(SummaryChart),
      h('div', { style: { display: 'grid', gap: 16 } },
        h(SmallSummary, { title: 'Заказано', value: '121 686 ₽' }),
        h(SmallSummary, { title: 'Продано', value: '90 000 ₽' }))));

  const header = h(React.Fragment, null,
    h(T.PageHeader, { brand: 'business', size: 'l', products, sections: false, search: true, user: { name: 'Зеленоглазое такси' } }),
    h(LegacyNav),
    h('div', { style: { background: 'var(--tui-background-base)', padding: '32px 0 24px' } },
      h('div', { style: { width: 1104, maxWidth: 'calc(100% - 64px)', margin: '0 auto' } },
        h(T.NotificationBanner, {
          appearance: 'info', size: 'l', title: 'С 1 февраля Селлер изменится',
          text: 'Сервис станет MPSTATS × Т‑Бизнес. Рассказываем, что изменится для вас',
          action: 'Узнать подробности', onAction: onDetails, onClose: false
        }))),
    h('div', { style: { width: 1104, maxWidth: 'calc(100% - 64px)', margin: '28px auto 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--tui-border-normal)' } },
      h('h1', { className: 'tui-heading-6', style: { margin: '0 0 16px' } }, 'Аналитика — Тестовый магазин'),
      h('div', { style: { display: 'flex', gap: 20 } }, ['Сводка', 'Прибыли и убытки', 'Юнит-экономика', 'ABC-анализ', 'Реклама'].map((label, index) => h('span', { key: label, className: 'tui-body-s', style: { color: index === 0 ? 'var(--tui-text-primary)' : 'var(--tui-text-secondary)', paddingBottom: 16, borderBottom: index === 0 ? '2px solid var(--tui-text-primary)' : undefined } }, label)))));

  return h(React.Fragment, null,
    header,
    h('main', { style: { width: 1104, maxWidth: 'calc(100% - 64px)', margin: '0 auto', paddingBottom: 48 } }, main));
}
