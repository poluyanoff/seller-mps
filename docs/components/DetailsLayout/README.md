# DetailsLayout — экран «Детали операции»

Экран операции из ленты на компонентах ДС. Источник — TUI Templates: `[desktop] template-feed-details`, `[mobile] template-details-modal`. Размеры и отступы — в разделе «Лейауты страниц → Детали операции».

## Построение
Сверху вниз: `BlockDetails` → ряд `ButtonVertical` → карточки `CardLarge`.

| | Десктоп, модалка (по умолчанию) | Десктоп, `mode: 'fullscreen'` | Мобилка |
|---|---|---|---|
| Контейнер | `Dialog` M 600, крестик | полноэкранный `Dialog`, колонка 720 | полноэкранный диалог |
| Дата и время | заголовок Heading 6 по центру | тайтл аппбара, «Закрыть» слева | тайтл `NavigationBar`, «Закрыть» слева |
| Между блоками | 40 | 40 | 32 (внутри блоков) |
| Кнопки | 80 × 70 через 8 | 80 × 70 через 8 | 90 × 70 через 12 |
| Карточки | compact, через 20 | обычные, через 20 | мобильные, через 20 |
| Фон | окно `elevation-1` | `background-base` | экран `elevation-1`, карточки `elevation-2` |

- В полноэкранном режиме при скролле в аппбаре вместо даты появляются название и сумма (fade, `duration-fast`).
- **Кнопки действий** — одинаковой ширины по самой длинной подписи в одну строку; до 12 символов — одна строка, длиннее — две, высота по самой высокой (карточка Row).
- **Иконки — Fancy** (`medium/…`): в кнопках действий, аватарах ячеек и превью. Pragmatic в этом экране не используем.
- В модалке карточкам без `space` лейаут ставит `compact`, на мобилке карточкам и компонентам внутри без `platform` — `mobile`.

## API
```js
h(TaigaUI.DetailsLayout, {
  open, onClose: close,
  mode: 'modal',                      // десктоп: 'modal' (по умолчанию) или 'fullscreen'
  date: '28 февраля • 11:34',
  details: { preview: 'medium/star', title: 'TitleValue', description: 'TitleDescription', amount: 123.45, decimals: 2, amountDescription: 'AmountDescription', status: 'Обрабатываем операцию' },
  actions: [{ icon: 'medium/star', label: 'Label', onClick: act }],
},
  h(TaigaUI.CardLarge, { title: 'Title', subtitle: 'Subtitle', accessory: h(TaigaUI.Avatar, { size: 's', icon: 'medium/star' }) }))
```
| Проп | Что делает |
|---|---|
| `open`, `onClose` | как у `Dialog` |
| `mode` | десктоп: `modal` (по умолчанию) или `fullscreen` |
| `date` | дата и время операции: заголовок модалки или тайтл аппбара |
| `details` | пропсы `BlockDetails`; `skeleton` — скелетон шапки и кнопок |
| `actions` | кнопки `ButtonVertical` (`{ icon, label, onClick, disabled }`) или свои элементы |
| `children` | карточки `CardLarge` |
| `titleOnScroll` | `false` — в полноэкранном не менять тайтл при скролле |
| `platform`, `system` | `mobile` — мобильный полноэкранный диалог |
| `closeLabel`, `label`, `actionsLabel` | тексты для кнопки и озвучки |
| `inline`, `container`, `dialog` | рендер внутри родителя, доп. пропсы `Dialog` |

## Пробелы
