import { React, T } from './runtime.js';
import { HERO, TOOLS, TOOL_GROUPS, CONTEXT } from './data.js';
import hero from '../assets/hero.png';

const h = React.createElement;

/* Плитка инструмента: CardMedium + 3D-картинка, нажатие открывает описание */
function Tile({ id, span, big, onOpen }) {
  const tool = TOOLS[id];
  const pic = big ? 120 : 72;
  return h('div', { style: { position: 'relative', gridColumn: span ? `span ${span}` : undefined, gridRow: big ? 'span 2' : undefined, minHeight: 92 } },
    h(T.CardMedium, { title: tool.title, size: big ? 140 : 92, onClick: () => onOpen(id), style: { width: '100%', height: '100%' } }),
    h('img', { src: tool.img, alt: '', style: { position: 'absolute', right: 0, bottom: 0, width: pic, height: pic, objectFit: 'contain', pointerEvents: 'none' } }));
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
  } else {
    grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 };
    tiles = group.items.map(id => h(Tile, { key: id, id, onOpen }));
  }
  return h(T.CardLarge, { appearance: 'elevated', hover: '', title: group.title, subtitle: group.subtitle }, h('div', { style: grid }, tiles));
}

const tabs = ['Аудит карточки', 'Поиск ниши', 'Ответы на отзывы', 'Создание фото'];

function Automation() {
  const [tab, setTab] = React.useState('Аудит карточки');
  return h(T.CardLarge, { appearance: 'elevated', hover: '', title: 'Автоматизация',
    subtitle: 'Упрощайте рутину, анализируя по MCP 500+ ТБ данных WB и Ozon' },
  h('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } },
    h(T.ChipGroup, { items: tabs.map(t => ({ label: t, value: t })), mode: 'single', value: tab, onChange: setTab, size: 's' }),
    h(T.ProgressBar, { value: 0.2, max: 1, thickness: 8, color: '#986dd4', labels: { topLeft: 'С MPSTATS AI', topRight: 'До 3 минут' } }),
    h(T.ProgressBar, { value: 1, max: 1, thickness: 8, color: '#8a8f99', labels: { topLeft: 'Без MPSTATS AI', topRight: '4–6 часов' } })));
}

function Stat({ title, subtitle }) {
  return h(T.CardMedium, { title, subtitle, size: 140, style: { width: '100%', height: 92, gap: 4, justifyContent: 'flex-start' } });
}

/* Лендинг подписки. ctx — ключ контекста с главной; без него — общий заголовок.
   Назад показываем только когда пришли с главной (onBack), Закрыть — всегда. */
export function Landing({ ctx, onBack, onClose, onOpenTool, onConnect }) {
  const context = ctx && CONTEXT[ctx];
  const title = context ? context.title : 'Рост продаж на маркетплейсах';
  const subtitle = context ? context.text : 'С подпиской MPSTATS × Т-Бизнес';
  return h(T.Dialog, { open: true, fullscreen: true, closePosition: 'right', dismissible: false, onBack, onClose },
    h('div', { style: { width: 528, maxWidth: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 } },
      h('div', { style: { textAlign: 'center' } },
        h('div', { style: { position: 'relative', width: 528, maxWidth: '100%', height: 280, overflow: 'hidden', margin: '0 auto' } },
          h('img', { src: hero, alt: '', style: { position: 'absolute', top: 0, left: '19.62%', width: '84.85%', height: '100%', maxWidth: 'none' } })),
        h('h1', { className: 'tui-heading-4', style: { margin: '0 0 8px' } }, title),
        h('p', { className: 'tui-body-m', style: { margin: 0 } }, subtitle)),

      h(T.CardLarge, { appearance: 'elevated', hover: '' },
        h(T.Cell, { title: '14 дней бесплатно и 50% скидка на первый месяц', avatar: 'medium/percent', avatarBackground: 'tui-status-positive-pale', avatarColor: 'tui-status-positive' })),

      h(T.CardLarge, { appearance: 'elevated', hover: '', title: 'Понимаем проблемы селлеров', subtitle: 'И уже более 6 лет помогаем решать их' },
        h(T.Cell, { title: 'Продажи и конверсии падают', avatar: 'medium/chart-bar-decrease', avatarTone: 'neutral' }),
        h(T.Cell, { title: 'Конкуренты растут и действуют непрозрачно', avatar: 'medium/eye-off', avatarTone: 'neutral' }),
        h(T.Cell, { title: 'Реклама сжигает бюджеты', avatar: 'medium/flash', avatarTone: 'neutral' }),
        h(T.Cell, { title: 'Рутина отнимает время команды', avatar: 'medium/clock', avatarTone: 'neutral' })),

      h(T.CardLarge, { appearance: 'elevated', hover: '', title: 'Более 200 инструментов для роста продаж', subtitle: 'Под любой запрос',
        accessory: h(T.Avatar, { icon: 'medium/chart-bar-grow', tone: 'accent-2' }) }),

      TOOL_GROUPS.map(g => h(Group, { key: g.title, group: g, onOpen: onOpenTool })),
      h(Automation),

      h(T.CardLarge, { appearance: 'elevated', hover: '',
        title: h(React.Fragment, null, h('span', { className: 'tui-caps-s-bold', style: { display: 'block', color: 'var(--tui-text-secondary)', marginBottom: 4 } }, 'О партнере'), 'MPSTATS'),
        subtitle: 'Бизнес-экосистема для селлеров на маркетплейсах',
        accessory: h(T.Avatar, { size: 'medium', icon: 'medium/chart-bar-grow' }) },
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
          h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 } },
            h(Stat, { title: '500 000 селлеров', subtitle: 'уже прошли регистрацию' }),
            h(Stat, { title: '6 лет опыта', subtitle: 'в аналитике маркетплейсов' }),
            h(Stat, { title: '3 миллиона отчетов', subtitle: 'в сутки генерирует сервис' }),
            h(Stat, { title: '95%', subtitle: 'точность данных' })),
          h(T.NotificationBanner, { appearance: 'info', size: 'l', onClose: false, text: 'Сертифицированный партнер Wildberries' }))),

      h('div', { style: { position: 'sticky', bottom: 0, display: 'flex', justifyContent: 'center', padding: '16px 0 24px', background: 'var(--tui-background-base)' } },
        h(T.Button, { size: 'l', onClick: onConnect }, 'К подключению'))));
}
