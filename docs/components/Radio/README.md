# Radio · RadioGroup (`tui-radio`)

Радиокнопки по гайду tui-radio: выбор одного из 2–5 вариантов. Для бинарного «да / нет» — чекбокс.

## Десктоп
- **Medium** — круг 24, точка 12. **Small** — 16, точка 8.
- **Фон:**
  - выкл. — `neutral-2` (наведение `-hover`, нажатие `-pressed`);
  - выбран — `accent-1` с точкой `primary-on-accent-1`;
  - accent — `accent-2` с белой точкой.
- **Disabled** — 56 %.
- **Ошибка** — `status-negative-pale`, выбранный — `status-negative` с белой точкой.
- **Анимация** — точка растёт из 0 за 150 мс.
- **Лейбл** — как у чекбокса: Medium — 12 и `body-m`, Small — 8 и `body-s`.

## Мобилка
Только внутри других компонентов, круг 22:
- **iOS** — выбран: `accent-2` с белой галочкой, как у чекбокса.
- **Android** — кольцо 18, выбран: кольцо и точка `accent-2`, 500 мс.

## Группа
`RadioGroup`:
- **Расположение:** вертикально 20 (S — 16) — рекомендуемый вариант; горизонтально 32, не больше 2–3 пунктов.
- **Название группы** — с заглавной, повторяющуюся часть пунктов выносим в него.
- **Ошибка** — под группой через 20.

```js
h(TaigaUI.RadioGroup, { title: 'Частота уведомлений', items: [{ value: 'm', label: 'Ежемесячно' }, { value: 'w', label: 'Еженедельно' }], value: f, onChange: setF })
h(TaigaUI.Radio, { name: 'receipt', value: 'sms', label: 'По СМС', checked: v === 'sms', onChange: () => setV('sms') })
```
Пропсы `RadioGroup`:
- `items` — `{ value, label, description?, hint?, disabled? }` или строки;
- `value`, `defaultValue`, `onChange(value, item)` — состояние;
- `size` — `m` или `s`;
- `direction` — `vertical` или `horizontal`;
- `title`;
- `error` — `true` или текст;
- `appearance`, `disabled`, `name`.

## Радио в плашке
Крупный выбор из нескольких вариантов в кликабельных плашках — [`RadioBlock`](../RadioBlock/README.md) и `RadioBlockGroup`.
