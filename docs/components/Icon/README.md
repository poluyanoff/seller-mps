# Icon

Иконка из TUI Assets. Монохромные наборы рисуются маской и красятся `currentColor` — цвет задаёт токен текста родителя (`tui-text-primary`, `-secondary`, `-tertiary`, `-action`). Fixed Color выводятся как есть.

## Наборы
- `medium-pragmatic` — 24 px, 356 иконок, по умолчанию для размеров больше 16.
- `small-pragmatic` — 16 px, 359 иконок, по умолчанию для 16 и меньше.
- `service` — системные: iOS/Android назад-закрыть-поиск-ещё, шевроны и крестик 16 для полей, drag, filter.
- `fixed-color` — статусные круги, не перекрашиваются: `info-circle-accent`, `info-circle-neutral`, `check-circle-positive`, `alert-warning`, `alert-negative`, `cross-circle-negative`, `clock-neutral`.
- `medium` — **Fancy Medium** (`tui-ic-medium`), 24 px, 875 иконок, из них 170 логотипов (`logo-*`). Выразительные, с полупрозрачными слоями и градиентами прозрачности — для продуктов, категорий, промо: `coffee`, `cup-coffee`, `taxi`, `burger`, `gas-station`, `airplane`, `gift`, `shopping-cart`, `cards`, `cash`. Тоже красятся `currentColor`: слои — это прозрачность одного цвета.
- `small` — **Fancy Small** (`tui-ic-small`), 16 px, 193 иконки — упрощённые версии для мелких размеров (145 имён совпадают с Medium). Для 16 px и меньше Fancy ищется сначала в `small`.

Pragmatic — для интерфейса: кнопки, поля, ячейки-действия. Fancy — для смысловых изображений: аватары категорий в ячейках, продукты, промо. По имени без набора сначала ищется pragmatic, потом service и fixed-color, и только потом Fancy — чтобы получить Fancy-версию одноимённой иконки (`home`, `cards`), указывайте `medium/home` или `set: 'medium'`.

**Исключение — аватары.** Иконка в аватаре по умолчанию Fancy: компоненты с аватаром (`Avatar`, `Cell`, `Header`, `NavigationBar`, `CardMedium`, `BlockStatus`, таблица) сами ищут имя без набора сначала в Fancy, а если его там нет — как обычно. Для 16 и меньше — только Fancy Small; если там нет, берём Pragmatic Small, а не уменьшенную Fancy Medium. В остальных случаях Pragmatic в аватар — только с явным набором.

**Не смешивайте стили в одной группе.** В ряду кнопок, наборе однотипных элементов, одном списке — либо все иконки Pragmatic, либо все Fancy. Для группы набор указывайте явно: имя без набора может молча уйти в Fancy, если в Pragmatic такой иконки нет.

## Пропсы
- `name` — имя из Figma без префикса (`bell`, `arrow-right`), либо с набором: `service/cross`, `tui-ic-small-pragmatic / check`, `medium/taxi` (то же `tui-ic-medium / taxi`, `fancy/taxi`).
- `size` — высота в px, по умолчанию 24. Ширина следует пропорции иконки (у `service/more-android` она 12×24).
- `set` — принудительный набор.
- `label` — подпись для скринридера; без неё иконка скрыта от него.
- `color` — свой цвет вместо `currentColor` (лучше задавать цвет родителю).

Список имён — `names.md` рядом (генерируется при сборке) или `TaigaUI.Icon.names('medium-pragmatic')`. Если имени нет, элемент остаётся пустым, получает `data-icon="missing:…"`, и `TaigaUI.check()` дает нарушение `icon`.
