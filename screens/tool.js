import { React, T } from './runtime.js';
import { TOOLS, TOOL_GROUPS } from './data.js';

const h = React.createElement;
const TOOL_IDS = TOOL_GROUPS.flatMap(group => group.items);


function Arrow({ direction, disabled, onClick }) {
  if (disabled) return null;
  const label = direction === 'prev' ? 'Предыдущий инструмент' : 'Следующий инструмент';
  return h(T.Button, {
    appearance: 'flat', size: 's', icon: direction === 'prev' ? 'service/chevron-left' : 'service/chevron-right', title: label, onClick,
    style: {
      position: 'absolute', top: '50%', [direction === 'prev' ? 'left' : 'right']: 12,
      transform: 'translateY(-50%)', borderRadius: '50%', width: 32, minWidth: 32, height: 32,
      minHeight: 32, padding: 0, background: 'var(--tui-status-info-pale)', color: 'var(--tui-text-action)'
    }
  });
}

function Pagination({ active }) {
  return h('div', {
    role: 'status', 'aria-label': `Инструмент ${active + 1} из ${TOOL_IDS.length}`,
    style: { display: 'flex', justifyContent: 'center', gap: 4, minHeight: 12, alignItems: 'center' }
  }, TOOL_IDS.map((id, index) => h('span', {
    key: id, 'aria-hidden': true,
    style: {
      width: index === active ? 6 : 4, height: index === active ? 6 : 4, borderRadius: '50%',
      background: index === active ? 'var(--tui-background-accent-1)' : 'var(--tui-background-neutral-1)'
    }
  })));
}

/* Карусель позволяет сравнивать все инструменты, не возвращаясь к сетке лендинга. */
export function Tool({ id, onDone }) {
  const initialIndex = Math.max(0, TOOL_IDS.indexOf(id));
  const [index, setIndex] = React.useState(initialIndex);
  const tool = TOOLS[TOOL_IDS[index]];
  const select = next => setIndex(Math.max(0, Math.min(TOOL_IDS.length - 1, next)));

  React.useEffect(() => {
    const onKeyDown = event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key === 'ArrowLeft' && index > 0) { event.preventDefault(); select(index - 1); }
      if (event.key === 'ArrowRight' && index < TOOL_IDS.length - 1) { event.preventDefault(); select(index + 1); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [index]);

  return h('div', { style: { width: '100%', display: 'flex', flexDirection: 'column', gap: 24 } },
    h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
      h('div', { style: { position: 'relative', height: 272, borderRadius: 20, overflow: 'hidden',
        background: 'radial-gradient(120% 120% at 30% 20%, #ffd9a8 0%, #ffc98f 45%, #ffb877 100%)' } },
        tool.img && h('img', { src: tool.img, alt: '', style: { position: 'absolute', inset: 0, margin: 'auto', width: 208, height: 208, objectFit: 'contain' } }),
        h(Arrow, { direction: 'prev', disabled: index === 0, onClick: () => select(index - 1) }),
        h(Arrow, { direction: 'next', disabled: index === TOOL_IDS.length - 1, onClick: () => select(index + 1) })),
      h(Pagination, { active: index })),
    h('div', null,
      h('h1', { className: 'tui-heading-4', style: { margin: '0 0 12px' } }, tool.title),
      h('p', { className: 'tui-body-m', style: { margin: 0, color: 'var(--tui-text-primary)' } }, tool.text)),
    h('div', null, h(T.Button, { onClick: onDone }, 'Понятно')));
}
