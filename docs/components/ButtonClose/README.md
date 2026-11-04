# ButtonClose (`tui-button [close]`)

Кнопка-крестик: закрыть пуш, карточку, баннер, промо на картинке. По Figma TUI Desktop → «tui-button [close]».

## Размеры
Круг, иконка `small-pragmatic/cross` 16 по центру.

| `size` | диаметр | поле |
|---|---|---|
| `x-small` (по умолчанию) | 24 | 4 |
| `small` | 32 | 8 |

## Вид (`appearance`)
| вид | фон · hover · pressed | иконка | где |
|---|---|---|---|
| `default` | `background-neutral-1` · `-hover` · `-pressed` | `text-tertiary` | на базовых фонах и карточках |
| `glass-on-light` | `background-overlay-glass-on-light` · `-hover` · `-pressed`, блюр 16 | `text-primary-on-dark` | на светлой картинке или пёстром светлом фоне |
| `glass-on-dark` | `background-overlay-glass-on-dark` · `-hover` · `-pressed`, блюр 16 | `text-primary-on-dark` | на тёмной картинке |

Цвет иконки в состояниях не меняется. Hover — только десктоп.

## API
```js
h(TaigaUI.ButtonClose, { onClick: close })                                   // 24, default
h(TaigaUI.ButtonClose, { size: 'small', appearance: 'glass-on-light', onClick: close })
```
- `size`, `appearance`, `label` / `ariaLabel` (по умолчанию «Закрыть»), `onClick`, `state` (`hover` / `pressed` — для превью), `className`, `style`.

## Где уже стоит
- `NotificationPush`, `NotificationFeed` — x-small; у пуша на картинке — `glass-on-light`.

## Пробелы
- Disabled, focus и правила выбора вида в Figma не показаны. Фокус — рамка `border-focus`, как у остальных кнопок ДС.
- Крестики в `Dialog`, `Toast`, `NotificationBanner`, `ImageViewer` собраны раньше и на `ButtonClose` не переведены.
