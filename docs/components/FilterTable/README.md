# FilterTable · FilterBuilder · Pagination

Шаблон табличного листинга по гайду FilterTable: **FilterBuilder → 16 → Table → 16 → Pagination**. Правила выбора шаблона (1, 1.1, 1.2, 2, 3), нейминг и поведение — в разделе «Табличные листинги».

## FilterTable — шаблон целиком
Сам фильтрует строки, считает «Результат: N», показывает пустые состояния и подгружает по 50 / 75 / 100.
```js
h(TaigaUI.FilterTable, {
  label: 'Группы', rows, columns,
  search: { keys: ['name', 'desc'], placeholder: 'Поиск по названию или описанию' },
  filters: [{ key: 'status', label: 'Статус' }, { key: 'role', label: 'Роль в тенанте', multiple: true }],
  segmented: { items: [{ label: 'Все' }, { label: 'Мои группы', filter: r => r.mine }] },
  toggles: [{ label: 'Показать только управляемые', filter: r => r.managed }]
})
```
| Проп | Что делает |
|---|---|
| `rows`, `columns`, `tableProps` | данные и колонки `Table`; остальные пропсы таблицы — в `tableProps` (sort, selectable, actions…) |
| `size` | `m` (по умолчанию) или `s` — размер полей и ячеек таблицы |
| `search` | `{ keys, placeholder }` — поиск по нескольким столбцам, совпадения подсвечиваются |
| `filters` | селекты `{ key, label, options?, multiple? }`. Первые 4 видимы (без поиска — 5), следующие (до 10) уходят в поповер. Без `options` значения берутся из данных |
| `filters` с `type: 'period'` | фильтр «Период» по столбцу с датой (ISO, `Date` или ДД.ММ.ГГГГ): `{ key: 'due', label: 'Срок оплаты', type: 'period' }`. Ниже — «Фильтр «Период»» |
| `segmented` | `{ items: [{ label, filter? }] }` — первый сегмент «Все» |
| `chips` | до 2 групп `{ label?, items: [{ label, filter }] }`: внутри группы «или», между группами «и» |
| `toggles` | один: `{ label, filter }` |
| `pageSize` | 50 · 75 · 100; пагинация появляется от 100 строк (`paginationFrom`), размер — `paginationSize` (`s` · `xs`) |
| `pagination` | `more` — «Показать еще», `paging` — постраничная. По умолчанию `paging`, если в `tableProps` есть `selectable` (массовые действия). Место пейджера — `pagingPosition`: `bottom` · `top` (в End фильтров) · `both` |
| состояния | `loading`, `error` (`errorState`, `onRetry` — кнопка «Повторить»), пустые данные (`emptyTitle` / `emptyState`), «ничего не нашлось» (`noResultsState`, `noResultsObject`) |
| прочее | `resultCount` — число для серверных данных (при порциях — сколько уже получено, без «+»), `result: false` — без «Результат», `action` (primary-кнопка в конце основной строки, M и S), `onClear` |

## Фильтр «Период»
Счета, операции, документы фильтруют по периоду — для этого фильтр `type: 'period'` (в `FilterTable` — в `filters`, в `FilterBuilder` — в `selects` и `moreFilters`). Два `InputDate` «с» и «по» в строку фильтров не ставим.
- Поле как у селекта: лейбл «Период» (или свой), справа крестик и иконка `small-pragmatic/calendar`. Выбранное — «1–15 октября», «28 сентября – 4 октября»; год пишем, если он не текущий (TP10).
- По клику — `CalendarDropdown` в режиме `range` под полем через 4: календарь, саджесты периодов справа, футер «Сбросить» и «Готово». Фильтр применяется по «Готово»; «Сбросить» и крестик в поле очищают период.
- Саджесты по умолчанию — «Сегодня», «Вчера», «Последние 7 дней», «Последние 30 дней», «Этот месяц», «Прошлый месяц». Свои — `presets: [{ label, value: [от, до] }]`, без саджестов — `presets: false`. Ограничить даты — `min`, `max`.
- Значение — `[от, до]` в ISO или `null`. Строка подходит, если ее дата в периоде включительно.
```js
filters: [{ key: 'status', label: 'Статус', multiple: true }, { key: 'due', label: 'Срок оплаты', type: 'period' }]
h(TaigaUI.FilterBuilder, { selects: [{ type: 'period', label: 'Период', value: range, onChange: setRange }] })
```
- **Пробел:** набор саджестов периодов в гайде не показан — взяли частые. Нужен другой набор для продукта — `presets`.

## Тексты пустых состояний
По умолчанию — по `copy.md` (решение команды, 30.10.2026):
- **пусто по фильтру или поиску** (ER8) — «Таких записей нет», «Попробуйте изменить фильтры», кнопка «Сбросить фильтры». Объект в заголовке — `noResultsObject`: `'счетов'` → «Таких счетов нет»;
- **ошибка загрузки** (ER5) — «Не загрузилось», «Попробуйте снова», кнопка «Повторить» при `onRetry`.

## FilterBuilder — только фильтрация
Для серверной фильтрации, когда данные фильтрует бэкенд.
```js
h(TaigaUI.FilterBuilder, {
  search: { placeholder: 'Поиск по названию', value: q, onChange: setQ },
  selects: [{ label: 'Статус', options: ['Активна', 'Архив'], value: st, onChange: setSt }],
  moreFilters: [/* те же объекты: до 10, в поповере */],
  segmented: { items: ['Все', 'Мои группы'], value: seg, onChange: setSeg },
  toggles: [{ label: 'Показать только опубликованные', checked: pub, onChange: setPub }],
  result: 120, onClear: reset
})
```
Без `value` FilterBuilder держит значения сам: «Очистить», счетчик и точка работают и без внешнего состояния.
- Размеры:
  - **M**: поля 44, блок 88;
  - **S**: поля 32, блок 76.
- Поля делят строку поровну, между ними 8. Кнопка фильтров — secondary с иконкой `filter`. Если в поповере что-то выбрано, на её углу точка: бейдж-нотификация 10, `status-warning`.
- Строка быстрых фильтров 32: сегменты S → чипсы → тогглы → «Результат: N» → «Очистить», между ними 12, тогглы, результат и «Очистить» разделены линией 16. Свои элементы справа — `quickEnd`, через 64.
- Пресеты: **Search** (только поиск), **Select** (до 5 селектов), **Search + Select** (поиск + до 4 селектов).
- Ширина: селект 180–360, поиск — остаток строки, не уже 180. Кнопки — строго в конце: фильтров, затем действие. Селекты, которые не помещаются, уходят в поповер первыми.
- `segmented` — объект или массив до 2 групп (до 5 значений).
- `chips` — до 2 групп чипсов после сегментов: `{ items, value, onChange, label }`, множественный выбор. Чип whiteblock S, через 4, до 180, длинный текст — в тултипе. Иконки не ставим.
- Перенос: строка переносится по рядам через 8. Группа чипсов и связка «тоггл · результат · Очистить» переносятся целиком.
- Поповер: `moreContent` — свой контент под селектами (поля даты, чипсы, тоггл), `moreActive` — точка для него, `popoverWidth` — 408–528.
- Сортировка списка карточек — в `quickEnd`: `Button` flat с `iconRight` и меню `Dropdown`. В таблице сортировка в шапке `Table`, не в фильтрах.
```js
h(TaigaUI.FilterBuilder, {
  search: { placeholder: 'Поиск', value: q, onChange: setQ },
  selects: [{ label: 'Команда', options: teams, value: team, onChange: setTeam }],
  segmented: { items: ['Все', 'Мои оповещения'], value: seg, onChange: setSeg },
  chips: { label: 'Статус', items: ['С моим участием', 'Активные'], value: st, onChange: setSt },
  result: 999, onClear: reset,
  quickEnd: h(TaigaUI.Button, { appearance: 'flat', size: 'xs', iconRight: 'small-pragmatic/sort-down', onClick: openSort }, 'По дате создания')
})
```
- «Очистить» скрыта, пока сбрасывать нечего (`canClear` — задать явно, `clear: false` — убрать совсем). После выбора — счетчик: «Очистить (2)», число можно задать `clearCount`.
- Тоггл — один. Результат опционален: без `result` его нет.
- Поповер: в шапке «Очистить» — сбрасывает только селекты поповера, свой контент — через `onClearMore`. Пока в поповере ничего не выбрано — неактивна. Под шапкой линия.
- Селект отдельно — `TaigaUI.FilterSelect`: поле M/S с шевроном 16 и крестиком сброса, `multiple` — с чекбоксами.
  Список — `DropdownList` (tui-dropdown) того же размера, во всю ширину поля.

## Pagination
```js
h(TaigaUI.Pagination, { shown: 50, total: 1000, onMore: loadMore, size: 's' })
h(TaigaUI.Pagination, { type: 'paging', total: 1000, page, onPageChange: setPage })
```
- Кнопка «Показать еще» (secondary S 32 или XS 24).
- Через 12 — «Просмотрено 50 из 1000», `ui-s`, `text-secondary`.
- Когда `shown ≥ total`, кнопка скрывается.
- Остальные пропсы: `align: 'right'`, `counter: false`, `loading`, `label`.
- Постраничная (`type: 'paging'`) и все пропсы — карточка `Pagination`, правила — раздел «Пагинация».

## ListingStatus
Блок пустого состояния или ошибки в контентной области (`tui-block-status` card M, в коде — `BlockStatus`, карточка BlockStatus):
- иллюстрация 96;
- заголовок 20/24;
- текст `text-secondary`;
- ширина до 480, высота 440.
```js
h(TaigaUI.ListingStatus, { kind: 'error', title: 'Не загрузилось', text: 'Попробуйте снова' })
```
