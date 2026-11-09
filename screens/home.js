import { React, T } from './runtime.js';
import './home.css';
import { CHART, DAYS, PRODUCTS_BEST, PRODUCTS_WORST, PRODUCTS_BEST_REV, PRODUCTS_WORST_REV, ABC_REVENUE } from './data.js';
import promoBg from '../assets/home/promo-bg.png';
import collage from '../assets/home/collage.png';

const h = React.createElement;

/* Плитка-метрика (tui-card-medium): значение, подпись, подсказка и изменение */
const ign = t => h('span', { 'data-tui-copy-ignore': true }, t);
const POS = 'var(--tui-text-positive)';
const NEG = 'var(--tui-text-negative)';
const Delta = ({ text, tone }) => h(T.Badge, { appearance: tone === 'bad' ? 'negative-pale' : 'positive-pale', size: 'medium', color: tone === 'bad' ? NEG : POS }, ign(text));
const Hint = ({ label }) => h(T.ButtonTooltip, { size: 's', content: label });

function Metric({ value, label, labelRest, sub, delta, tone, hint = true, gap = 20 }) {
  return h('div', { style: { flex: 1, minWidth: 0, boxSizing: 'border-box', background: 'var(--tui-background-neutral-1)', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap, justifyContent: 'space-between' } },
    h('div', null,
      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 } },
        h('span', { className: 'tui-heading-6' }, value),
        hint && h('span', { style: { height: 24, display: 'inline-flex', alignItems: 'center' } }, h(Hint, { label }))),
      h('div', { className: 'tui-body-s' }, label, labelRest && h('span', { style: { color: 'var(--tui-text-secondary)' } }, labelRest)),
      sub && h('div', { className: 'tui-body-s', style: { color: 'var(--tui-text-secondary)' } }, sub)),
    delta && h('div', { style: { display: 'flex' } }, h(Delta, { text: delta, tone })));
}

/* Один раз при появлении: true, когда блок виден на 40%. При reduced-motion — сразу true. */
function useReveal(threshold = 0.4) {
  const ref = React.useRef(null);
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!el || reduce || typeof IntersectionObserver !== 'function') { setOn(true); return undefined; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setOn(true); io.disconnect(); }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on];
}

/* Столбчатый график недели: три слоя цвета акцента, как в макете.
   Появление — столбцы вырастают снизу со сдвигом 40 мс. */
function Bars() {
  const [ref, on] = useReveal(0.35);
  const axis = { width: 45, textAlign: 'right', color: 'var(--tui-text-tertiary)' };
  return h('div', { ref, style: { position: 'relative', height: 229 } },
    h('div', { style: { position: 'absolute', inset: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: 12 } },
      ['60\u00a0000\u00a0₽', '40\u00a0000\u00a0₽', '20\u00a0000\u00a0₽', '0\u00a0₽'].map((t, i) => h('div', { key: t, style: { flex: 1, display: 'flex', alignItems: i === 3 ? 'flex-end' : 'center', gap: 12 } },
        h('div', { style: { flex: 1, borderTop: (i === 3 ? '1px solid' : '1px dashed') + ' var(--tui-border-normal)' } }),
        h('span', { className: 'tui-body-xs', style: axis }, t)))),
    h('div', { style: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 20, paddingRight: 57 } },
      CHART.map((v, i) => h('div', { key: i, style: { flex: '1 1 0', maxWidth: 36, minWidth: 1, height: v, display: 'flex', flexDirection: 'column', gap: 4 } },
        h('div', { style: { flex: 1, position: 'relative', overflow: 'hidden', borderRadius: 8 } },
          h('div', { className: on ? 'proto-grow is-on' : 'proto-grow', style: { position: 'absolute', inset: 0, transitionDelay: (i * 40) + 'ms' } },
            h('div', { style: { position: 'absolute', inset: 0, borderRadius: 8, background: 'var(--tui-background-accent-2)', opacity: 0.25 } }),
            h('div', { style: { position: 'absolute', inset: '33.33% 0 0 0', borderRadius: '0 0 8px 8px', background: 'var(--tui-background-accent-2)', opacity: 0.5 } }),
            h('div', { style: { position: 'absolute', inset: '67.32% 0 0 0', borderRadius: '0 0 8px 8px', background: 'var(--tui-background-accent-2)' } }))),
        h('span', { className: 'tui-body-xs', style: { height: 20, textAlign: 'center', color: 'var(--tui-text-tertiary)' } }, DAYS[i])))));
}

/* Кольцо (арка 270°, 170): value 0..1. Заполняется с нуля при появлении в кадре. */
function Ring({ value, color, big, label, delta, tone }) {
  const [ref, on] = useReveal(0.3);
  return h('div', { ref, style: { position: 'relative', width: 170, height: 170, margin: '20px auto 0' } },
    h(T.ProgressCircle, { value: on ? value : 0.0001, max: 1, size: 128, thickness: 8, open: true, color, content: 'none', className: 'proto-ring',
      style: { position: 'absolute', left: 21, top: 21, transform: 'scale(1.328)', transformOrigin: 'center' } }),
    h('div', { style: { position: 'absolute', left: 0, right: 0, top: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 } },
      h('div', { style: { textAlign: 'center' } },
        h('div', { className: 'tui-heading-6' }, big),
        h('div', { className: 'tui-body-s', style: { color: 'var(--tui-text-secondary)', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' } }, label, h(Hint, { label }))),
      h(Delta, { text: delta, tone })));
}

function Seg({ items, value, onChange }) {
  return h('div', { onClick: e => e.stopPropagation(), style: { display: 'inline-block', cursor: 'default' } },
    h(T.Segmented, { items, size: 's', shape: 'rounded', activeIndex: value, onChange }));
}

/* Статичные фильтры страницы плюс их копия в фикс-хедере.
   Хедер выезжает сверху только при скролле вверх, когда фильтры уже ушли за верх экрана:
   показ после +160 px, скрытие после возврата к +80 px (гистерезис против мигания).
   Появление и уход — CSS-переход по data-open: анимируются только transform и opacity,
   реверс посреди анимации отрабатывает плавно. */
const FIXED_SHOW = 160;
const FIXED_HIDE = 80;

function FiltersRow({ children }) {
  return h('div', { style: { display: 'flex', gap: 4, alignItems: 'center' } }, children);
}

function StickyFilters({ children }) {
  const bar = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const el = bar.current;
    let last = window.scrollY;
    let shown = false;
    let frame = 0;
    const tick = () => {
      frame = 0;
      const y = window.scrollY;
      const from = el ? el.getBoundingClientRect().top + y : 0;
      const past = y - from;
      const up = y < last - 2;
      const down = y > last + 2;
      last = y;
      if (past > FIXED_SHOW && up && !shown) { shown = true; setOpen(true); }
      else if ((past < FIXED_HIDE || (down && past < FIXED_SHOW)) && shown) { shown = false; setOpen(false); }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(tick); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (frame) cancelAnimationFrame(frame); };
  }, []);
  return h(React.Fragment, null,
    h('div', { ref: bar, style: { maxWidth: 1104, margin: '0 auto 20px', padding: '0 32px', boxSizing: 'content-box' } }, h(FiltersRow, null, children)),
    h('div', { className: 'proto-fixedbar', 'data-open': open ? '' : undefined, inert: open ? undefined : '',
      'aria-hidden': open ? undefined : 'true' },
      h('div', { className: 'proto-fixedbar__in' }, h(FiltersRow, null, children))));
}

function ProductRow({ p }) {
  return h(T.Cell, { inset: 'none', title: p.title, description: p.sku, right: h('span', { style: { display: 'inline-block', width: 77, textAlign: 'right' } }, p.sum),
    avatar: h(T.Avatar, { src: p.img, alt: '', size: 'medium', shape: 'square' }) });
}

/* Полоса долевого состава. Каждый сегмент — слой на всю ширину, сдвинутый и сжатый
   через translateX + scaleX: меняется только transform, layout не пересчитывается.
   При первом появлении доли вырастают со сдвигом 60 мс, при смене вкладки — плавно
   перетекают из старых значений в новые за 260 мс. */
function Share({ parts }) {
  const [ref, on] = useReveal(0.3);
  /* steady — после первого роста: дальше доли перетекают коротким переходом */
  const [steady, setSteady] = React.useState(false);
  React.useEffect(() => {
    if (!on) return undefined;
    const t = setTimeout(() => setSteady(true), 900);
    return () => clearTimeout(t);
  }, [on]);
  let acc = 0;
  const total = parts.reduce((s, p) => s + p.w, 0) || 1;
  return h('div', { ref, className: 'proto-share', style: { height: 8, borderRadius: 6, overflow: 'hidden' } },
    parts.map((p, i) => {
      const start = acc / total * 100;
      acc += p.w;
      const width = p.w / total * 100;
      return h('div', { key: 's' + i, className: 'proto-share__seg',
        style: {
          background: p.color,
          transform: on ? `translateX(${start}%) scaleX(${width / 100})` : 'translateX(0) scaleX(0)',
          transition: steady
            ? 'transform 260ms cubic-bezier(0.4, 0, 0.2, 1)'
            : `transform 600ms cubic-bezier(0.165, 0.84, 0.44, 1) ${on ? i * 60 : 0}ms`
        } });
    }));
}

const ABC_PROFIT = [
  { w: 38, color: 'var(--tui-status-positive)', label: '80% прибыли', pcs: '30 шт', pct: '50%' },
  { w: 14, color: 'var(--tui-categorical-05)', label: '15% прибыли', pcs: '12 шт', pct: '20%' },
  { w: 48, color: 'var(--tui-status-negative)', label: '5% прибыли', pcs: '18 шт', pct: '30%' }
];

const REV_COLORS = ['var(--tui-status-positive)', 'var(--tui-categorical-05)', 'var(--tui-status-negative)'];

function AbcRow({ color, label, pcs, pct }) {
  return h('div', { style: { display: 'flex', alignItems: 'center', height: 40 } },
    h('span', { style: { width: 20, display: 'flex', alignItems: 'center' } }, h('span', { style: { width: 8, height: 8, borderRadius: 4, background: color } })),
    h('span', { className: 'tui-ui-m', style: { flex: 1 } }, label),
    h('span', { className: 'tui-ui-m', style: { marginLeft: 16 } }, pcs),
    h('span', { className: 'tui-ui-m', style: { marginLeft: 16, width: 32, textAlign: 'right', color: 'var(--tui-text-secondary)' } }, pct));
}

/* ABC-анализ: вкладка «По прибыли» и фейк-данные «По выручке».
   Внутри вкладки контент живёт в одном дереве, поэтому смена таба не ломает вложенный
   OnboardingFlow у карточки; на первом появлении первый таб уже подставлен без анимации. */
function AbcBody({ tab }) {
  const rows = tab === 0
    ? ABC_PROFIT
    : ABC_REVENUE.map((r, i) => ({ w: r.w, color: REV_COLORS[i], label: r.label, pcs: r.pcs, pct: r.pct }));
  return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
    h(Share, { parts: rows }),
    rows.map((r, i) => h(AbcRow, { key: 'r' + i, color: r.color, label: r.label, pcs: r.pcs, pct: r.pct })));
}

const tools = [
  { label: 'Внешняя аналитика', icon: 'medium/chart-grow', c: '--tui-categorical-21', bg: 'rgba(9,174,158,0.1)' },
  { label: 'Студия AI-контента', icon: 'medium/logo-ai-assistant', c: '--tui-categorical-06', bg: 'rgba(208,143,255,0.1)' },
  { label: 'Внешняя реклама', icon: 'medium/target-arrow', c: '--tui-categorical-09', bg: 'rgba(245,146,0,0.1)' },
  { label: 'Управление ценой', icon: 'medium/two-coins', c: '--tui-categorical-08', bg: 'rgba(102,163,255,0.1)' }
];

const SMILES = [
  ['M17.2 16.6C14.6 13.1333 9.4 13.1333 6.8 16.6C6.46869 17.0418 5.84189 17.1314 5.4 16.8C4.95823 16.4686 4.86869 15.8418 5.2 15.4C8.6 10.8667 15.4 10.8667 18.8 15.4C19.1314 15.8418 19.0419 16.4686 18.6 16.8C18.1582 17.1314 17.5314 17.0418 17.2 16.6Z', 'M7 8.5C7 9.32843 6.32843 10 5.5 10C4.67157 10 4 9.32843 4 8.5C4 7.67157 4.67157 7 5.5 7C6.32843 7 7 7.67157 7 8.5Z', 'M20 8.5C20 9.32843 19.3284 10 18.5 10C17.6716 10 17 9.32843 17 8.5C17 7.67157 17.6716 7 18.5 7C19.3284 7 20 7.67157 20 8.5Z'],
  ['M5 16C5 15.4477 5.44772 15 6 15H18C18.5523 15 19 15.4477 19 16C19 16.5523 18.5523 17 18 17H6C5.44772 17 5 16.5523 5 16Z', 'M7 9.5C7 10.3284 6.32843 11 5.5 11C4.67157 11 4 10.3284 4 9.5C4 8.67157 4.67157 8 5.5 8C6.32843 8 7 8.67157 7 9.5Z', 'M20 9.5C20 10.3284 19.3284 11 18.5 11C17.6716 11 17 10.3284 17 9.5C17 8.67157 17.6716 8 18.5 8C19.3284 8 20 8.67157 20 9.5Z'],
  ['M5.4 12.2C5.84189 11.8686 6.46869 11.9582 6.8 12.4C9.4 15.8667 14.6 15.8667 17.2 12.4C17.5314 11.9582 18.1582 11.8686 18.6 12.2C19.0419 12.5314 19.1314 13.1582 18.8 13.6C15.4 18.1333 8.6 18.1333 5.2 13.6C4.86869 13.1582 4.95823 12.5314 5.4 12.2Z', 'M7 8.5C7 9.32843 6.32843 10 5.5 10C4.67157 10 4 9.32843 4 8.5C4 7.67157 4.67157 7 5.5 7C6.32843 7 7 7.67157 7 8.5Z', 'M20 8.5C20 9.32843 19.3284 10 18.5 10C17.6716 10 17 9.32843 17 8.5C17 7.67157 17.6716 7 18.5 7C19.3284 7 20 7.67157 20 8.5Z']
];

function Smile({ kind }) {
  return h(T.Button, { appearance: 'secondary-grayscale', size: 'm', rounded: true, title: ['Плохо', 'Нормально', 'Хорошо'][kind], style: { width: 44, minWidth: 44, padding: 0 } },
    h('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'currentColor' }, SMILES[kind].map((d, i) => h('path', { key: i, d }))));
}

/* Главная Т-Бизнеса. connected — подписка оформлена: меняется бейдж и пропадают промо-блоки.
   open(ctx) — открыть лендинг; ctx подсказывает, с какого виджета пришли. */
export function Home({ connected, open, toast }) {
  const go = ctx => () => open(ctx);
  const [abcTab, setAbcTab] = React.useState(0);
  const [ratingTab, setRatingTab] = React.useState(0);
  const nb = t => t.replace(/ /g, '\u00a0');
  const card = (props, ...kids) => h(T.CardLarge, Object.assign({ appearance: 'elevated', hover: '', platform: 'desktop' }, props, props.ctx && !connected ? { onClick: go(props.ctx), className: props.disclosure ? 'proto-widget' : undefined } : null), ...kids);
  const pad = (n, node) => h('div', { style: { paddingTop: n } }, node);
  /* Виджет-вход: вся карточка — зона клика (палец), заголовок синеет, шеврон уезжает вправо (см. home.css).
     После подключения виджеты перестают быть кликабельными. */
  const clickable = (ctx, node, flex) => h('div', { key: 'c-' + ctx, style: { flex: flex ? 1 : undefined, minWidth: 0 } }, node);
  const nav = { disclosure: true };
  const row = (...c) => h('div', { style: { display: 'flex', gap: 12 } }, ...c);

  const main = [
    clickable('summary', card({ key: 'sum', title: 'Сводка', ctx: 'summary' },
      h(Bars),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
        row(
          h(Metric, { value: nb('1 335 481 ₽'), label: 'Заказы', labelRest: nb(' · 1 345 шт'), delta: nb('+200 000 ₽ · 15%') }),
          h(Metric, { value: nb('830 481 ₽'), label: 'Выкупы', labelRest: nb(' · 467 шт'), delta: nb('+4 573 ₽ · 15%') }),
          h(Metric, { value: nb('301 481 ₽'), label: 'Чистая прибыль', delta: nb('+2 096 ₽ · 20%') })),
        row(
          h(Metric, { value: '23 дня', label: 'Оборачиваемость', delta: '−0,3 дня' }),
          h(Metric, { value: '87%', label: 'Процент выкупа', delta: '−1,4 п.п.', tone: 'bad' }),
          h(Metric, { value: '15%', label: 'Маржинальность', delta: '+2,3 п.п.' }))))),

    !connected && h(T.CardLarge, { key: 'promo', appearance: 'flat', platform: 'desktop', hover: '', shadow: false,
      style: { backgroundColor: 'var(--tui-background-accent-on-light)', backgroundImage: `url(${promoBg})`, backgroundSize: 'cover', backgroundPosition: 'right center', backgroundRepeat: 'no-repeat' },
      titleClassName: 'tui-heading-5',
      title: h('span', { style: { color: 'var(--tui-text-primary-on-dark)' } }, 'Попробуйте MPSTATS бесплатно'),
      description: h('span', { className: 'tui-body-m', style: { color: 'var(--tui-text-primary-on-dark)' } }, '14 дней бесплатно и скидка 50% на первый месяц подписки'),
      footer: h(T.Button, { appearance: 'primary-grayscale-on-dark', size: 'm', onClick: go('summary') }, ign('Подробнее')) }),

    h('div', { key: 'row', style: { display: 'flex', gap: 32, alignItems: 'flex-start' } },
      clickable('ads', card({ title: 'Реклама', ...nav, ctx: 'ads', style: { width: '100%' } },
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
          h(Ring, { value: 0.15, color: 'var(--tui-categorical-09)', big: '15%', label: 'ДРР', delta: '−2,3 п.п.' }),
          row(
            h(Metric, { value: nb('25 487 ₽'), label: 'Расходы на рекламу', delta: '−10%', hint: false, gap: 60 }),
            h(Metric, { value: nb('0,34 ₽'), label: 'CPC', delta: '+15%', tone: 'bad' })))), true),
      clickable('stock', card({ title: 'Остатки', ...nav, ctx: 'stock', style: { width: '100%' } },
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
          h(Ring, { value: 0.89, color: 'var(--tui-status-positive)', big: '89%', label: 'Локализация', delta: '−3 п.п.', tone: 'bad' }),
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
            h(Metric, { value: nb('54 465 ₽'), label: 'Упущенная выручка', labelRest: ' · 22 арт.', gap: 20 }),
            row(
              h(Metric, { value: ign('454 арт.'), label: 'На складах', sub: nb('234 465 ₽'), hint: false }),
              h(Metric, { value: ign('33 арт.'), label: 'К поставке', sub: nb('34 465 ₽') }))))), true)),

    clickable('abc', card({ key: 'abc', title: 'ABC\u2011анализ', ...nav, ctx: 'abc' },
      h(React.Fragment, null, h(Seg, { items: ['По прибыли', 'По выручке'], value: abcTab, onChange: setAbcTab }), h(AbcBody, { tab: abcTab })))),

    clickable('rating', card({ key: 'rate', title: 'Рейтинг товаров', ...nav, ctx: 'rating' },
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } },
        h(Seg, { items: ['По прибыли', 'По выручке'], value: ratingTab, onChange: setRatingTab }),
        h('div', null, h('div', { className: 'tui-ui-l-bold', style: { marginBottom: 8 } }, 'Продаются лучше'), (ratingTab === 0 ? PRODUCTS_BEST : PRODUCTS_BEST_REV).map((p, i) => h(ProductRow, { key: ratingTab + '-' + i, p }))),
        h('div', null, h('div', { className: 'tui-ui-l-bold', style: { marginBottom: 8 } }, 'Продаются хуже'), (ratingTab === 0 ? PRODUCTS_WORST : PRODUCTS_WORST_REV).map((p, i) => h(ProductRow, { key: ratingTab + '-' + i, p })))))),

    h('div', { key: 'more', style: { textAlign: 'center', padding: '8px 0 0' } },
      h('img', { src: collage, alt: '', style: { width: 672, maxWidth: '100%', display: 'block' } }),
      h('h2', { className: 'tui-heading-4', style: { margin: '32px 0 16px', color: 'var(--tui-text-primary)' } }, connected ? 'Данные MPSTATS подключены' : 'Еще больше данных по магазину'),
      h('p', { className: 'tui-body-l', style: { margin: '0 0 32px' } }, 'С подпиской MPSTATS\u00a0×\u00a0Т-Бизнес'),
      !connected && h(T.Button, { appearance: 'secondary', size: 'l', onClick: go('summary') }, ign('Подробнее')))
  ].filter(Boolean);

  const aside = [
    card({ key: 'tools', title: 'Инструменты MPSTATS', footer: connected ? null : h(T.Button, { appearance: 'secondary', size: 'm', onClick: go('tools') }, 'Все инструменты') },
      tools.map(t => h(T.Cell, { key: t.label, inset: 'none', title: t.label, onClick: connected ? undefined : go('tools'),
        avatar: h(T.Avatar, { icon: t.icon, size: 'small', shape: 'square', background: t.bg, color: `var(${t.c})` }) }))),
    card({ key: 'csat', title: 'Как вам новая главная?', titleClassName: 'tui-heading-6' },
      h('div', { style: { display: 'flex', gap: 16 } }, [0, 1, 2].map(k => h(Smile, { key: k, kind: k }))))
  ];

  const filters = [
    h(T.Chip, { key: 'wb', size: 'm', shape: 'rounded', dropdown: true }, 'Wildberries'),
    h(T.Chip, { key: 'date', size: 'm', shape: 'rounded', icon: 'medium/calendar' }, nb('15 – 21 июня')),
    h('span', { key: 'cmp', className: 'tui-body-m', style: { color: 'var(--tui-text-secondary)', paddingLeft: 8 } }, nb('По сравнению с 8 – 14 июня'))
  ];

  const header = h(React.Fragment, null,
    h(T.PageHeader, {
      brand: 'business', size: 'l',
      products: [{ label: 'Селлер', active: true }, 'Кассы и эквайринг', 'Бухгалтерия', 'Интернет-эквайринг', { label: 'Все сервисы', dropdown: true }],
      sections: false, search: true, user: { name: 'Зеленоглазое такси' },
      title: 'Тестовый магазин',
      header: { titleSuffix: h(T.Icon, { name: 'medium-pragmatic/chevron-down', size: 24 }),
        accessory: connected
          ? h(T.Badge, { appearance: 'positive-pale', size: 'x-large', dot: true }, 'mpstats подключен')
          : h(T.Badge, { appearance: 'neutral-pale', size: 'x-large', dot: true }, 'mpstats не подключен') }
    }),
    h(StickyFilters, null, filters));

  return h(T.PageLayout, { platform: 'desktop', layout: 'reversed', footer: false, header, main, aside });
}
