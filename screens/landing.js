import { React, T } from './runtime.js';
import { TOOLS, TOOL_GROUPS, AUTOMATION, CONTEXT } from './data.js';
import hero from '../assets/hero.png';

const h = React.createElement;

/* Плитка инструмента: CardMedium + 3D-картинка, нажатие открывает описание */
function Tile({ id, span, big, onOpen }) {
  const tool = TOOLS[id];
  const pic = big ? 120 : 72;
  return h('div', { style: { position: 'relative', gridColumn: span ? `span ${span}` : undefined, gridRow: big ? 'span 2' : undefined, minHeight: 92 } },
    h(T.CardMedium, { title: tool.title, size: 92, onClick: () => onOpen(id), style: { width: '100%', height: '100%' } }),
    tool.img && h('img', { src: tool.img, alt: '', style: { position: 'absolute', right: 0, bottom: 0, width: pic, height: pic, objectFit: 'contain', pointerEvents: 'none' } }));
}

function Group({ group, onOpen }) {
  const [a, b, c, d, e] = group.items;
  let tiles;
  let grid;
  if (group.grid === 'fin') {
    grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(2, 92px)', gap: 8 };
    tiles = [h(Tile, { key: a, id: a, big: true, onOpen }), h(Tile, { key: b, id: b, onOpen }), h(Tile, { key: c, id: c, onOpen })];
  } else if (group.grid === 'wide') {
    grid = { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 };
    tiles = [h(Tile, { key: a, id: a, span: 4, onOpen }), h(Tile, { key: b, id: b, span: 2, onOpen }),
      h(Tile, { key: c, id: c, span: 2, onOpen }), h(Tile, { key: d, id: d, span: 2, onOpen }), h(Tile, { key: e, id: e, span: 2, onOpen })];
  } else if (group.grid === 'pair') {
    grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 };
    tiles = group.items.map(id => h(Tile, { key: id, id, onOpen }));
  } else {
    grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 };
    tiles = [
      h(Tile, { key: a, id: a, onOpen }),
      h(Tile, { key: b, id: b, onOpen }),
      h(Tile, { key: c, id: c, span: 2, onOpen })
    ];
  }
  return h('div', { style: grid }, tiles);
}

function Tools({ onOpen }) {
  const [selected, setSelected] = React.useState(TOOL_GROUPS[0].title);
  const group = TOOL_GROUPS.find(item => item.title === selected) || TOOL_GROUPS[0];
  return h(T.CardLarge, {
    appearance: 'elevated',
    hover: '',
    title: 'Более 200 инструментов для роста',
    subtitle: 'Под любой запрос',
    accessory: h(T.Avatar, { icon: 'medium/chart-grow', shape: 'square', background: 'tui-status-info-pale', color: 'tui-status-info' })
  },
  h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
    h(T.ChipGroup, {
      items: TOOL_GROUPS.map(item => ({ label: item.title, value: item.title })),
      mode: 'single',
      value: selected,
      onChange: setSelected,
      size: 's'
    }),
    h(Group, { group, onOpen })));
}

/* Логотип MPSTATS из макета (белый знак на зелёном аватаре) */
const partnerIcon = h('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none' },
  h('path', { d: 'M18.6339 14.8764L6.90323 21.4658C6.4242 21.7356 5.84071 21.3778 5.84071 20.8162V7.6428C5.84071 7.08132 6.42411 6.72625 6.90323 6.99321C7.13341 7.12255 7.2779 7.373 7.2779 7.6428V15.2369C7.2779 15.7984 7.86406 16.1562 8.34319 15.8838L15.1626 12.0193C15.3768 11.8981 15.639 11.8981 15.8531 12.0165L18.6312 13.5744C19.1343 13.8607 19.1343 14.5983 18.6338 14.8763L18.6339 14.8764Z', fill: '#fff' }),
  h('path', { d: 'M17.5975 7.5873C18.0634 7.8767 18.0634 8.58351 17.5975 8.87281L14.0299 11.0932L13.9717 11.1294L9.67364 13.8061C9.19995 14.1011 8.60177 13.7421 8.60177 13.1634V3.29684C8.60177 2.71812 9.19995 2.35913 9.67364 2.6541L17.5975 7.5873Z', fill: '#fff' }));

function Automation() {
  const [tab, setTab] = React.useState(AUTOMATION[0].tab);
  const item = AUTOMATION.find(x => x.tab === tab) || AUTOMATION[0];
  return h(T.CardLarge, { appearance: 'elevated', hover: '', title: 'Автоматизация',
    subtitle: 'Упрощайте рутину, анализируя по MCP 500+ ТБ данных WB и Ozon' },
  h('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } },
    h(T.ChipGroup, { items: AUTOMATION.map(x => ({ label: x.tab, value: x.tab })), mode: 'single', value: tab, onChange: setTab, size: 's' }),
    h('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } },
      h(T.ProgressBar, { value: item.ai.share, max: 1, thickness: 12, animated: true, color: 'tui-brand-t-ai-assistant', labels: { topLeft: 'С MPSTATS AI', topRight: item.ai.time } }),
      h(T.ProgressBar, { value: item.other.share, max: 1, thickness: 12, animated: true, color: 'tui-status-neutral', labels: { topLeft: item.other.label, topRight: item.other.time } }))));
}

function Stat({ title, subtitle }) {
  return h(T.CardMedium, { title, subtitle, size: 140, style: { width: '100%', height: 92, gap: 4, justifyContent: 'flex-start' } });
}

/* Лендинг подписки — один компонент на два режима Селлера.
   variant 'legacy' — старый Селлер: объявление о переезде в MPSTATS, кнопки «К условиям» и «Позвоните мне».
   variant 'new' — новый Селлер: контекстный заголовок (ctx — ключ виджета главной) и кнопка «К подключению».
   Всё остальное общее. Кнопки «Назад» нет, только «Закрыть» (в Dialog). */
export function Landing({ variant = 'new', ctx, onOpenTool, onConnect }) {
  const legacy = variant === 'legacy';
  const context = !legacy && ctx && CONTEXT[ctx];
  const title = legacy ? 'С 1 февраля Селлер станет частью MPSTATS' : context ? context.title : 'Рост продаж на маркетплейсах';
  const subtitle = legacy
    ? 'Ваши API-ключи останутся и добавлять повторно их не нужно. До конца текущей подписки все инструменты Селлера будут доступны'
    : context ? context.text : 'С подпиской MPSTATS\u00a0×\u00a0Т-Бизнес';
  return (
    h('div', { style: { width: '100%', display: 'flex', flexDirection: 'column', gap: 24 } },
      h('div', { style: { textAlign: 'center' } },
        h('div', { style: { position: 'relative', width: 528, maxWidth: '100%', height: 280, overflow: 'hidden', margin: '0 auto' } },
          h('img', { src: hero, alt: '', style: { position: 'absolute', top: 0, left: '19.62%', width: '84.85%', height: '100%', maxWidth: 'none' } })),
        h('h1', { className: 'tui-heading-4', style: { margin: '32px auto 8px', maxWidth: 560 } }, title),
        h('p', { className: legacy ? 'tui-ui-m' : 'tui-body-m', style: { margin: '0 auto', maxWidth: 560 } }, subtitle)),

      h(T.CardLarge, { appearance: 'elevated', hover: '' },
        h(T.Cell, { title: legacy ? '14 дней бесплатно и 50% скидку на первый месяц для новой подписки' : '14 дней бесплатно и 50% скидка на первый месяц',
          avatar: h(T.Avatar, { icon: 'medium/percent', shape: 'square', background: 'tui-status-positive-pale', color: 'tui-status-positive' }) })),

      h(T.CardLarge, { appearance: 'elevated', hover: '', title: 'Понимаем проблемы селлеров', subtitle: 'И уже более 6 лет помогаем решать их' },
        h(T.Cell, { title: 'Продажи и конверсии падают', avatar: h(T.Avatar, { icon: 'medium/chart-bar-decrease', shape: 'square', tone: 'neutral' }) }),
        h(T.Cell, { title: 'Конкуренты растут и действуют непрозрачно', avatar: h(T.Avatar, { icon: 'medium/eye-off', shape: 'square', tone: 'neutral' }) }),
        h(T.Cell, { title: 'Реклама сжигает бюджеты', avatar: h(T.Avatar, { icon: 'medium/flash', shape: 'square', tone: 'neutral' }) }),
        h(T.Cell, { title: 'Рутина отнимает время команды', avatar: h(T.Avatar, { icon: 'medium/clock', shape: 'square', tone: 'neutral' }) })),

      h(Tools, { onOpen: onOpenTool }),
      h(Automation),

      h(T.CardLarge, { appearance: 'elevated', hover: '',
        title: h(React.Fragment, null, h('span', { className: 'tui-caps-s-bold', style: { display: 'block', color: 'var(--tui-text-secondary)', marginBottom: 4 } }, 'О партнере'), 'MPSTATS'),
        subtitle: 'Бизнес-экосистема для селлеров на маркетплейсах',
        accessory: h(T.Avatar, { size: 'small', shape: legacy ? 'ellipse' : 'square', icon: partnerIcon, background: '#62d13d' }) },
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
          h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 } },
            h(Stat, { title: '500 000 селлеров', subtitle: 'уже прошли регистрацию' }),
            h(Stat, { title: '6 лет опыта', subtitle: 'в аналитике маркетплейсов' }),
            h(Stat, { title: '3 миллиона отчетов', subtitle: 'в сутки генерирует сервис' }),
            h(Stat, { title: '95%', subtitle: 'точность данных' })),
          h(T.NotificationBanner, { appearance: 'info', size: 'l', icon: 'medium/bonus-check', iconColor: 'var(--tui-status-info)', onClose: false, text: 'Сертифицированный партнер Wildberries' }))),

      /* Floating-container: кнопки парят над контентом без подложки */
      h('div', { style: { position: 'sticky', bottom: 24, display: 'flex', flexDirection: 'column', gap: 8 } },
        h(T.Button, { size: 'l', block: true, onClick: onConnect }, legacy ? 'К условиям' : 'К подключению'),
        legacy && h(T.Button, { size: 'l', appearance: 'flat', block: true }, 'Позвоните мне'))));
}
