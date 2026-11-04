# ChatMessage (`tmsg-message`)

Сообщение в ленте чата: текст, время, статус отправки, имя и аватар автора. По Figma «TMSG. Library» → message-bubbles. Разделители ленты (дата, «Новые сообщения», системное сообщение) — [`ChatDivider`](../ChatDivider/README.md).

Не путать с `MessageBubble`: он для короткого инлайнового комментария (например, под операцией), без времени и статуса.

## Направление (`direction`)
| | фон | текст | время | где |
|---|---|---|---|---|
| `incoming` (по умолчанию) | мобилка `background-neutral-1-opaque`, десктоп `background-neutral-1` | `text-primary` | `text-secondary` | слева, сообщения собеседника |
| `outgoing` | `background-accent-2` | `text-primary-on-dark` | `text-secondary-on-dark` | справа, сообщения пользователя |

## Построение
- Баббл: поля 10 по бокам, 8 сверху и снизу; радиус 12 на мобилке, 14 на десктопе.
- Сверху и снизу у сообщения по 4, между соседними сообщениями — 8. Свои отступы между сообщениями не добавляй.
- Мобилка: от «своего» края 10. От противоположного: у входящих 36 (iOS) или 40 (Android), у исходящих — **80** на обеих платформах. Отсюда максимальная ширина: входящий 329 на экране 375 и 310 на экране 360, исходящий 285 и 270.
- **Исходящий не заходит за край бабла собеседника** (решение команды, 02.11.2026): 80 от левого края — правее колонки аватаров (10 + 36 + 8 = 54) с запасом. Значение снято с примеров ленты TMSG: самый длинный исходящий начинается в 80. В разделе «Построение» TMSG указано 36 для обоих направлений — это расходится с примерами, ориентируемся на примеры.
- Десктоп: от «своего» края 12, от противоположного 64.
- Аватар 36 (мобилка) или 32 (десктоп) слева от входящего, через 8, прижат к низу баббла.
- Время и статус стоят в правом нижнем углу на одной строке с концом текста. Если места не хватает, они переносятся на свою строку.

## Текст
- Мобилка: сообщение — Body L (`ios-body-l` / `android-body-l`) со строкой 20, время — UI XS, имя — UI XS Bold `text-action` внутри баббла.
- Десктоп: сообщение — UI M, время — UI S, имя — UI S Bold `text-action` внутри баббла, как на мобилке.
- Текст сообщения пишут люди, поэтому проверка редполитики его не трогает (`data-tui-copy-ignore`). Подписи в ленте (`ChatDivider`) проверяются как обычно.

## Статус (`status`, только у исходящих)
| `status` | иконка |
|---|---|
| `sending` | `small-pragmatic/clock-circle` |
| `sent` | `small-pragmatic/check` |
| `read` | `small-pragmatic/check-double` |
| `error` | `small-pragmatic/alert-circle`, `status-negative` |

## Аватар и имя
- `avatar` — пропсы `Avatar` (`{ name, src, icon }`), строка-имя или готовый элемент. Только у входящих.
- В подряд идущих сообщениях одного автора аватар ставь только у последнего, у остальных `avatarSpace: true` — отступ сохранится.
- `name` — имя автора: в групповых чатах и когда отвечают разные сотрудники (ассистент, специалист). В диалоге один на один имя не нужно.

## Вложения
- **Ответ на сообщение** — `reply: { name, text, onClick }`: цитата над текстом, полоса 4 × 36 (во входящих `text-action`, в исходящих `background-neutral-4`), имя и текст в одну строку с обрезкой. `onClick` — переход к исходному сообщению.
- **Файл** — `file: { name, size, icon, onClick }`: заменяет текст. Квадратный `Avatar` 36 с Fancy-иконкой (входящее — `tone: 'accent-2'`, синяя плитка; исходящее — белая плитка `background-base` на синем баббле) (`doc` по умолчанию, для PDF — `doc-pdf`, картинки — `doc-image`, архива — `doc-zip`), имя Body M, размер «1,8 МБ» и время в одной строке.
- **Фото** — `image: { src, alt, width, height, onClick }`: без баббла, 240 × 240 по умолчанию, радиус 20, время и статус — на плашке `background-overlay-on-image` в 12 от угла. Без `src` — заглушка с иконкой, пока фото загружается.
- **Голосовое** — `voice: { duration, progress, playing, waveform, onPlay, transcribe, onTranscribe, text }`: баббл 262, кнопка 36 (`medium-pragmatic/play-filled` / `pause-filled`), волна высотой 16 — прослушанная часть (`progress` 0–1) ярче, под ней длительность UI XS. `transcribe` — кнопка «Аа» справа; расшифровку передавай в `text`, она встанет под волной. Голосовое еще не скачано — `download: true`: на кнопке стрелка вниз (`medium-pragmatic/arrow-down`), `onPlay` скачивает.

## Виджеты (`widget`)
Виджет встает вместо баббла, аватар и поля строки — как у сообщения. Время передавай в `time`, оно встанет внутри виджета.
| `type` | что | пропсы |
|---|---|---|
| `csat` | оценка работы: заголовок и 5 залитых звезд 36 через 12 (пустые `background-neutral-4`, выбранные `background-accent-1`), подложка `neutral-2`, поля 20, радиус 14 | `title`, `value`, `onRate`, `disabled` |
| `payment` | платеж в переписке: тип операции с иконкой 12, сумма `Amount` `numbers-xl`, комментарий, кнопка XS и время. Исходящий — `accent-2` | `label`, `icon`, `amount`, `text`, `action` (пропсы `Button`) |
| `list` | список ячеек `Cell` с кнопкой на всю ширину: контакты, операции. Подложка `neutral-2`, радиус 24 (десктоп 16) | `items` (пропсы `Cell`), `action` |
| `carousel` | выбор из картинок: заголовок и горизонтальная лента карточек 100 × 64 с подписью до 2 строк. `base` с тенью `shadow-small` | `title`, `items: [{ title, subtitle, src, onClick }]` |

## API
```js
h(TaigaUI.ChatMessage, { platform: 'mobile', direction: 'outgoing', time: '9:41', status: 'read' }, 'Какие условия по кредитам?')
h(TaigaUI.ChatMessage, { platform: 'mobile', name: 'Александр', avatar: { name: 'Александр' }, time: '9:42' }, 'Подскажите, по какому вопросу нужна помощь?')
```
- Новое сообщение — `appear: true`: проявление и рост 0.9 → 1 из своего угла, `duration-moderate`, `productive-entrance`. Старым сообщениям не ставь.
- `direction`, `platform` (`desktop` / `mobile`), `system` (`ios` / `android`), `children` / `text`, `time`, `status`, `name`, `avatar`, `avatarSpace`, `className`, `style`.

## Экран чата целиком
Сверху — шапка чата `NavigationBar` (`large: false`, `avatar`, `background: 'base'`), в середине — лента с прокруткой, прижатая к низу, снизу — `ChatInput` (подсказки — `hints`).
```js
h('div', { style: { height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--tui-background-base)' } },
  h(TaigaUI.NavigationBar, { large: false, background: 'base', title: 'Поддержка', subtitle: 'На связи 24/7', avatarProps: { bank: 't-bank' }, onBack: back }),
  h('div', { style: { flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' } },
    h(TaigaUI.ChatDivider, { platform: 'mobile', type: 'date' }, 'Сегодня'),
    messages.map(function (m) { return h(TaigaUI.ChatMessage, Object.assign({ platform: 'mobile' }, m)); })),
  h(TaigaUI.ChatInput, { platform: 'mobile', onSend: send, hints: ['Позвать специалиста'] }))
```

## Пустая лента
В новом чате без сообщений по центру ленты — `BlockStatus` с иллюстрацией `paper-plane` и одним текстом, без заголовка и кнопок. Шапка и `ChatInput` остаются (TMSG feed, empty state).
```js
h(TaigaUI.BlockStatus, { platform: 'mobile', image: 'paper-plane', text: 'Здесь пока нет сообщений — можно начать беседу с приветствия' })
```

## Новый чат
Экран выбора собеседника (TMSG new-message) собирается из готовых компонентов: шапка `NavigationBar` «Новое сообщение», `SearchBar`, первой строкой `Cell` «Новый номер» с аватаром `accent-2`, ниже контакты `Cell` с аватаром 40 и телефоном в `description`. Ввод номера — `InputPhone`. Отдельного компонента нет.

## Пробелы
- Радиус: в разделе «Построение» TMSG 12, а в части примеров и на десктопе 14. Взяли 12 для мобилки и 14 для десктопа.
- Межстрочный интервал на мобилке: в Figma `normal` (около 20), а Body L в ДС — 24. Взяли 20.
- Время на iOS в TMSG встречается и 11, и 12. Взяли UI XS (12).
- Поле от противоположного края на десктопе в TMSG не задано. Взяли 64.
- Иконка ошибки отправки: в TMSG красная точка, в ДС иконки точки нет. Взяли `alert-circle` цвета `status-negative`. На синем баббле она контрастна слабо, лучше уточнить.
- Пока не сделано: ссылки-превью, теги, hover-меню на десктопе; виджеты payment-old и payment-new-future (будущий платеж).
- Вложения: подпись к фото, несколько фото в одном сообщении, прогресс загрузки и скачивания файла, ответ на фото (миниатюра в цитате) — в макете не показаны.
- Размер фото на десктопе и на Android и цвет полосы цитаты в Night — не видно в материалах.
- Голосовое: стиль расшифровки — в макете не показан. Цвета кнопки во входящих и исходящих сверены с TMSG button (play incoming / outgoing).
- Виджеты: входящий payment (взяли фон входящего баббла), кнопка в list (в макете белая — взяли `floating`), размеры на десктопе и Android — в макете не видно. Сумма в payment в макете 28, ближайший размер ДС — `numbers-xl`.
