# RadioBlock · RadioBlockGroup (`tui-radio-block`)

Радио-кнопка в кликабельной плашке, гайд tui-radio-block / tui-checkbox-block v1.2.0. Чекбокс-вариант — [`CheckboxBlock`](../CheckboxBlock/README.md): построение то же.

**Когда:** выбор одного варианта, когда вариантов мало и их нужно показать крупно и равноправно — тариф, способ оформления, тип размещения. Поведение самой радио-кнопки — как в [`Radio`](../Radio/README.md).

Компонент готов на всех платформах. На мобилке меняются только шрифты и отступы в тексте. Контрол везде десктопный `tui-switches`.

## Построение
Отступы у радио-блока и чекбокс-блока одинаковые.

| Размер | Поля | Контрол → текст | Контрол | Радиус | Мин. высота | Лейбл | Описание |
|---|---|---|---|---|---|---|---|
| `l` (large) | 16 | 12 | 24 | 12 | 56 | Body M 15/24 | UI S 13/16 |
| `m` (medium) | 12 | 10 | 16 в контейнере 20 | 8 | 44 | UI M 15/20 | UI S 13/16 |
| `s` (small) | 8 | 8 | 16 | 8 | 32 | UI S 13/16 | UI XS 11/13 |

- Контрол выровнен по первой строке лейбла.
- Хинт «?» (16, `text-tertiary`) — справа от лейбла через 4, во всех размерах, включая S (в компоненте S в Figma нарисовано 2 — неточность, ориентируемся на текст гайда).
- Описание — сразу под лейблом, без отступа, `text-secondary`. Не длиннее трёх строк.

## Вид и состояния
- **Вид:**
  - `outline` (по умолчанию) — обводка 1 `border-normal-opaque`, без фона;
  - `background` — фон `background-neutral-1`, без обводки.
- **Выбор** плашку не меняет: меняется только контрол (`accent-1`).
- **Hover** (только десктоп):
  - `outline` — обводка `border-normal-opaque-hover`;
  - `background` — фон `background-neutral-1-hover`;
  - контрол — `neutral-2-hover` / `accent-1-hover`.
- **Focus** — обводка 2 `border-focus` вместо обычной (у `background` — поверх фона).
- **Disabled** — контрол 56 %, лейбл `text-secondary`, плашка без изменений.

## Иконка выбора справа
`controlPosition: 'right'` — контрол после текста, текст занимает всю ширину. Альтернатива для исключительных случаев, когда нужно выровнять баланс композиции.

## Мобилка
Мобильные шрифты выше, поэтому в тексте есть дополнительные отступы, чтобы строка встала по контролу:
- **L** — iOS UI M 15/18 и UI S 13/16. У текста поля 4 сверху и снизу, между лейблом и описанием 4.
- **M** — iOS UI M 15/18 и UI S 13/16. Поля 2, зазор 2.
- **S** — iOS UI S 13/16 и UI XS 12/14, без дополнительных отступов.
- Hover на мобилке нет.

## Расположение блоков
- **Отдельные блоки** — рекомендуемый отступ между ними 12, можно менять. Вертикально или горизонтально.
- **Группа** (`tui-radio-block [group]`) — блоки вплотную в общей обводке, между ними разделитель 1. Собрана на [`Group`](../Group/README.md) `collapsed`.
  - Горизонтально — блоки делят ширину поровну. Подходит при ограниченном горизонтальном пространстве.
  - Вертикально — компактно для большого числа вариантов.
  - Скругления только у внешних углов группы: L 12, M и S 8.
  - Высота — от блоков. У S в группе поля по бокам 10.
  - В группе только вид `outline`.
  - Скелетон закрывает всю группу.

## API
```js
h(TaigaUI.RadioBlock, { name: 'car', value: 'num', label: 'Ввести номер авто', description: 'Остальное заполним сами', hint: 'Номер есть в СТС', checked: v === 'num', onChange: () => setV('num') })

// Группа: слитная (по умолчанию) или раздельные блоки с gap
h(TaigaUI.RadioBlockGroup, { label: 'Размещение', size: 'm', items: ['PaaS', 'SaaS', 'On-premise'], value: v, onChange: setV })
h(TaigaUI.RadioBlockGroup, { orientation: 'vertical', gap: 12, appearance: 'background', items: [{ value: 'num', label: 'Ввести номер авто', description: '…' }, …], value: v, onChange: setV })
```
Пропсы `RadioBlock`:
- `label` (или `children`), `description`, `descriptionLines`, `hint`, `hintLabel`;
- `checked`, `defaultChecked`, `onChange(checked)`, `name`, `value`, `id`;
- `size` — `l` (по умолчанию), `m`, `s`;
- `appearance` — `outline` (по умолчанию) или `background`;
- `controlPosition` — `left` (по умолчанию) или `right`;
- `controlAppearance: 'accent'` — контрол `accent-2`, как у `Radio`;
- `platform: 'mobile'`, `system: 'ios' | 'android'`;
- `disabled`, `skeleton`, `ariaLabel`, `className`, `style`.

Пропсы `RadioBlockGroup`:
- `items` — `{ value, label, description?, hint?, disabled? }` или строки;
- `value`, `defaultValue`, `onChange(value, item)`;
- `orientation` — `horizontal` (по умолчанию) или `vertical`;
- `gap` — раздельные блоки с этим отступом вместо слитной группы; тогда работает `appearance`;
- `size`, `controlPosition`, `platform`, `system`, `disabled`, `skeleton`, `label` (подпись для озвучки), `name`.

Клавиатура как у обычных радио: Tab — в группу, стрелки — между вариантами.

## Пробелы
- **Названия.** В гайде React-компоненты группы называются `radioGroup` и `checkboxGroup`. У нас эти имена заняты обычными группами `RadioGroup` / `CheckboxGroup`, поэтому группы блоков — `RadioBlockGroup` / `CheckboxBlockGroup`.
- **Высота S в группе.** На схеме группы подписано «min 36 px», в компоненте группы и одиночном блоке — 32. Взяли 32.
- **Нажатие (pressed)** и анимации плашки в гайде не описаны.
- **Android.** Шрифты в гайде только для iOS. Для Android взяты Body M / UI S (S — UI S / UI S).
- **Ошибка** (invalid) для блоков в гайде не описана.
