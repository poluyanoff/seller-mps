# ButtonTooltip (`tui-button [tooltip]`)

Кнопка-подсказка: «?» или «i» в круге. Открывает тултип с пояснением к соседнему тексту, полю или строке. Источник — компонент `tui-button [tooltip]` в Figma-библиотеках TUI Desktop и TUI Mobile.

## Виды (`appearance`)
- `hint` — «?», иконка `tui-ic-small/question`. По умолчанию.
- `info` — «i», иконка `tui-ic-small/info`.

## Размеры (`size`)
| | Круг | Иконка | Отступ до иконки |
|---|---|---|---|
| `m` (medium) | 20 | 12 | 4 |
| `s` (small) | 16 | 12 | 2 |
| мобилка (`platform: 'mobile'`) | 22 | 12 | 5 |

На мобилке размер один, `size` не действует.

## Цвета и состояния
**Десктоп**

| Состояние | Фон | Иконка |
|---|---|---|
| normal | `background-neutral-1` | `text-tertiary` |
| hover | `background-neutral-1-hover` | `text-tertiary-hover` |
| pressed | `background-neutral-1-hover` | `text-tertiary-pressed` |

- Так в Figma: у pressed фон тот же, что у hover, а не `neutral-1-pressed`.

**Мобилка (iOS и Android)**

| Состояние | Фон | Иконка |
|---|---|---|
| normal | `background-neutral-1` | `text-secondary` |
| pressed | `background-neutral-1-pressed` | `text-secondary` |
| selected — тултип открыт | `background-accent-2` | `text-primary-on-dark` |
| selected + pressed | `background-accent-2-pressed` | `text-primary-on-dark` |

- Hover на мобилке нет.
- Android: в Figma при нажатии ещё ripple 40 (`service-android-ripple`). В вебе ripple не делаем, как и в остальных компонентах ДС; нажатие — сменой фона.
- Night — значения тех же токенов, отдельной отрисовки нет.
- Смена состояний — `duration-fast`, `productive-standard`.
- Фокус с клавиатуры — обводка `border-focus` 2 через 2.

## Поведение
- С `content` кнопка оборачивается в `TooltipHost`: на десктопе тултип появляется при наведении и фокусе, на мобилке — по нажатию, по правилам карточки Tooltip.
- На мобилке кнопка выбрана (`accent-2`), пока открыт тултип. Управлять вручную — `selected`.
- Без `content` — просто кнопка, действие задаёт `onClick` (например, открыть диалог с подробностями).
- Подпись для озвучки по умолчанию «Подсказка» или «Информация»; свою — `label`.

## Где ставить
- В строке ячейки — `accessory` у `Cell`.
- Рядом с текстом или значением в своей вёрстке.
- Не заменяет синюю `Button`: «?» не красим в `text-action`.

## API
```js
h(TaigaUI.ButtonTooltip, { content: 'Взносы за себя уменьшают налог' })
h(TaigaUI.ButtonTooltip, { appearance: 'info', size: 's', content: 'Срок патента — до 31 августа' })
h(TaigaUI.ButtonTooltip, { platform: 'mobile', content: 'Взносы за себя уменьшают налог' })
h(TaigaUI.Cell, { size: 'l', caption: 'Вычли страховые взносы', title: '−53\u00a0658\u00a0₽',
  accessory: h(TaigaUI.ButtonTooltip, { content: 'Взносы за себя уменьшают налог' }) })
```
Пропсы: `appearance` (hint · info), `size` (m · s), `platform` (desktop · mobile), `system` (ios · android), `selected`, `onOpenChange`, `content`, `side`, `tooltipAppearance`, `width`, `maxWidth`, `label`, `state` (hover · pressed — для превью), `onClick`, `className`, `style`.

## Пробелы
- **Ripple на Android** не сделан — в вебе его нет ни у одного компонента.
- **Disabled и focus** в Figma не нарисованы ни на десктопе, ни на мобилке. Disabled не сделан, фокус — по аналогии с кнопками.
- **Хинты в других компонентах.** `Header` (`hint`), `Input` (`tooltip`), `Checkbox` и `RadioBlock` рисуют «?» иконкой `small-pragmatic/question-circle` без круга. В Figma `tui-input` ставит в поле `tui-button [tooltip]`. Переводить их на этот компонент не стали — нужно решение.
- **Где использовать `info`, а где `hint`**, в спеке не описано.
