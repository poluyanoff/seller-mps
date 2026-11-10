import { React, T } from './runtime.js';
import { ALL_TOOLS } from './home.js';

const h = React.createElement;

/* Экран «Инструменты MPSTATS» после подключения (макет 8402:22520): колонка 720, две колонки списков,
   заголовок группы 20, цветные квадратные аватары. Строка подсвечивается при наведении, справа стрелка ↗ только у неё. */
function Row({ title, description, icon, color, bg }) {
  return h('div', { className: 'proto-tool proto-tool--all', onClick: () => window.open('https://mpstats.io/login', '_blank', 'noopener,noreferrer') },
    h(T.Cell, { inset: 'none', size: 'l', title, description,
      avatar: h(T.Avatar, { icon, size: 'small', shape: 'square', background: bg, color: `var(${color})` }),
      accessory: h('span', { className: 'proto-tool__end proto-tool__end--hover' }, h(T.Icon, { name: 'small-pragmatic/arrow-top-right', size: 16 })) }));
}

function Group({ group }) {
  return h('section', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
    h('h2', { className: 'tui-heading-6', style: { margin: 0 } }, group.group),
    h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } },
      group.items.map(([title, description, icon]) => h(Row, { key: title, title, description, icon, color: group.color, bg: group.bg }))));
}

export function AllTools() {
  const [a, b, c] = ALL_TOOLS;
  return h('div', { style: { width: '100%' } },
    h('h1', { className: 'tui-heading-3', style: { margin: '0 0 32px' } }, 'Инструменты MPSTATS'),
    h('div', { className: 'proto-alltools' },
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 32, flex: 1, minWidth: 0 } }, h(Group, { group: a }), h(Group, { group: b })),
      h('div', { style: { flex: 1, minWidth: 0 } }, h(Group, { group: c }))));
}
