# ListCard и CardList (`tui-list-card`)

Карточка объекта в карточном виде списка: заголовок, поля, действия, сворачиваемые подробности, группа объектов. `CardList` — стопка таких карточек с выбором для `ActionBar`. По Figma «Card list view» (компонент ListCard, в библиотеке Beaver — `beaver-card-large`). Когда выбирать карточки, а когда таблицу — раздел «Карточный вид списка» (`design-system/card-list.md`).

## Построение
- **Карточка:** фон `background-elevation-1`, обводка 1 px `border-darkmode-only` (ночью отделяет карточку от фона), радиус 16, без тени. Между карточками 16.
- **Фон под списком — `background-base-alt`.** Без тени белая карточка на белом фоне не видна. Страница листинга — `PageLayout` со `style: { background: 'var(--tui-background-base-alt)' }`.
- **Шапка:** поля 16 сверху и снизу, 20 по бокам.
  - Строка заголовка: чекбокс S (`selectable`) → 12 → заголовок `ui-m-bold` 15/20 до 680, под ним через 2 подзаголовок `body-s` `text-secondary` → справа ID и кнопки.
  - **ID** (`idValue`): «ID» `ui-s` `text-tertiary` → 8 → значение `ui-s` `text-secondary` в одну строку с многоточием → `ButtonCopy` XS.
  - **Кнопки** (`actions`): `Button` S `secondary`, между ними 8. Без подписи — кнопка-иконка с `ariaLabel`; с `items` — меню `Dropdown`.
  - Через 16 — **строка полей** (`fields`): подпись `body-xs` `text-secondary` → 4 → значение `body-s`. Между полями 48. В значении — текст, `Link`, `Badge`, иконка 16 со статусом. Значение идет строкой: длинный текст переносится, бейдж или ссылка встают сразу за последним словом, части фрагмента — через 8. Пустое значение — «—». Чтобы поля карточек стояли колонками, задайте им `width`.
- **Полоса статуса** (`marker`): 3 px справа, в 5 от края, высотой с шапку. Цвет — `status-negative`, `-warning`, `-positive`, `-info`, `-neutral`. Ставится на любую карточку, с группой не связана.

## Сворачивание подробностей
Если подробностей много, часть убирают в разворачивающийся блок (`collapsible`, подробности — `children`).
- Кнопка разворота — `Button` S `secondary`, шеврон 16, справа внизу шапки, по низу строки полей.
- Подробности — под шапкой: поля 0 20 20, подложка `background-neutral-1`, радиус 8, поля 8 / 16. Внутри — `Table` S с `background: 'inherit'`, сетка полей, `Pagination`.
- По умолчанию свернуто (`defaultExpanded`, `expanded` / `onExpandedChange`).
- Без `collapsible` и `group` подробности видны всегда.

## Группа объектов
Несколько объектов с общим признаком объединяются в группу (`group`). Признак группировки должен быть четко определен.
- Группа по умолчанию свернута. Кнопка разворота — с подписью и шевроном: «3 инцидента ▾».
- **Маркер свернутой группы — «стопка»:** полоса 12 под карточкой, в 20 от краев, `background-neutral-3`, нижние углы 12. У развернутой группы и у карточки со свернутыми подробностями стопки нет.
- В развернутом виде объекты группы — внутри карточки на подложке, обычно `Table` S.

## Список и выбор
- `CardList` — список `ul` с карточками через 16, данные — `items` или `ListCard` детьми.
- Выбор как у `Table`: `selectable`, `selected` / `onSelectionChange` по `id`. Выбранная карточка отличается только отмеченным чекбоксом.
- Массовые действия — `ActionBar` small (`floating`, внизу контентной области).

## Решения команды и отличия от Figma
- **Подписи полей — `body-xs` 12/19.** В Figma — Legacy Body XS 11/16, как и в `Timeline` его не используем.
- **Цвета без токенов в Figma заменены токенами:** «ID» — `text-tertiary`, значение ID — `text-secondary`, подложка подробностей — `background-neutral-1`, «стопка» — `background-neutral-3`, ссылки (`#336fee`) — `text-action`, текст рядом с бейджами — `text-primary`.
- **Маркер группы — «стопка».** Полоса справа — отдельный маркер статуса (`marker`), к группе не привязан. В гайде «маркер группы» не определен.
- **Пагинация в карточке и под списком — `Pagination` ДС («Показать еще»).** При выборе карточек и массовых действиях под списком — постраничная, `type: 'paging'` (раздел «Пагинация»).
- **Поля не помещаются в строку — переносятся,** между строками 16. В Figma поведение не описано, ячейки просто обрезаются.

## Пробелы
- Узкие карточки (плитка) — только критерии выбора, без макета и размеров. Не собраны.
- Переключатель вида (карточки, плитка, таблица) не показан.
- Нет наведения, нажатия и клика по карточке, ночной темы, мобилки, скелетона, пустого списка.
- Радиус «стопки» не размечен, взят 12. Анимация разворота не описана, разворот без анимации.
- `card-footer` в Figma скрыт и не описан — не переносим.

## API
```js
h(TaigaUI.CardList, { label: 'Подозрения', selectable: true, selected: sel, onSelectionChange: setSel, items: [
  { id: 1, title: '[26.09, 15:31] Подозрение на юните Интеграции', idValue: '148671-9184756',
    fields: [{ label: 'Статус', value: 'Создано', width: 120 }, { label: 'Юнит', value: h(TaigaUI.Badge, { label: 'BO', appearance: 'info-pale', size: 'small' }) }] }
] })

h(TaigaUI.ListCard, { title: 'Ошибка при совершении сделки', subtitle: 'Описание', marker: 'negative',
  actions: [{ label: 'Одобрить', icon: 'thumb-up', onClick: approve }, { ariaLabel: 'Еще', icon: 'more', items: ['Назначить', 'В архив'] }],
  fields: [...], group: { label: '3 инцидента' } },
  h(TaigaUI.Table, { size: 's', background: 'inherit', hover: false, rows, columns }))
```
- **`ListCard`:** `title`, `subtitle`, `selectable`, `checked`, `onCheckedChange`, `checkLabel`, `idValue`, `idLabel`, `actions` (`{ label, ariaLabel, icon, appearance, onClick, disabled, loading, items }` или элемент), `fields` (`{ label, value, width }`), `marker`, `collapsible`, `group` (`{ label }`), `expanded`, `defaultExpanded`, `onExpandedChange`, `expandLabel`, `collapseLabel`, `children` — подробности.
- **`CardList`:** `items` (пропсы `ListCard` + `id`) или детьми, `selectable`, `selected`, `onSelectionChange`, `label`.
- Иконки кнопок — имя без набора (`small-pragmatic`) или с набором.
