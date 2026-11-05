import { React, T } from './runtime.js';
import { TOOLS } from './data.js';

const h = React.createElement;

/* Описание инструмента: та же 3D-картинка, что в плитке, на оранжевой подложке.
   Назад — в лендинг, Понятно — тоже в лендинг. */
export function Tool({ id, onDone }) {
  const tool = TOOLS[id];
  return (
    h('div', { style: { width: '100%', display: 'flex', flexDirection: 'column', gap: 32 } },
      h('div', { style: { position: 'relative', height: 272, borderRadius: 20, overflow: 'hidden',
        background: 'radial-gradient(120% 120% at 30% 20%, #ffd9a8 0%, #ffc98f 45%, #ffb877 100%)' } },
        h('img', { src: tool.img, alt: '', style: { position: 'absolute', inset: 0, margin: 'auto', width: 208, height: 208, objectFit: 'contain' } })),
      h('div', null,
        h('h1', { className: 'tui-heading-4', style: { margin: '0 0 12px' } }, tool.title),
        h('p', { className: 'tui-body-m', style: { margin: 0, color: 'var(--tui-text-primary)' } }, tool.text)),
      h('div', null, h(T.Button, { onClick: onDone }, 'Понятно'))));
}
