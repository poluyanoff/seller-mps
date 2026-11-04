# ChatInput (`tmsg-write panel`)

Панель ввода сообщения внизу экрана чата: скрепка, поле, кнопка отправки или микрофон. Над панелью при необходимости — ответ на сообщение и подсказки [`ChatHints`](../ChatHints/README.md). По Figma «TMSG. Library» → write-panel, button. Сообщения ленты — [`ChatMessage`](../ChatMessage/README.md).

## Построение
| | мобилка | десктоп |
|---|---|---|
| поля панели | 10 по бокам, 8 сверху и снизу | 10 по бокам, 12 сверху, 16 снизу |
| между элементами | 8, все прижаты к низу | 8 |
| скрепка | 32, иконка `medium-pragmatic/paper-clip` 24 `text-action` | круг 40 `background-base-alt`, иконка `text-secondary` |
| поле | от 32, радиус 32 (в несколько строк — 12), поля 12 / 8, фон `background-neutral-2` | от 40, радиус 18, поля 12 / 10, фон `background-base-alt` |
| текст | Body L (`ios-body-l` / `android-body-l`), строка 20 | UI M |
| кнопка справа | пусто — микрофон 32 (`mic` 24 `text-action`); есть текст — отправка: круг 32 `background-accent-2`, стрелка вверх `text-primary-on-dark` | всегда отправка: круг 40; пусто — прозрачность 0.3, неактивна |

Поле растёт вместе с текстом до 5 строк (`maxRows`), дальше прокручивается.

## Поведение
- Отправка — кнопкой; на десктопе ещё Enter, перенос строки — Shift + Enter. После отправки поле очищается.
- Пустое или из пробелов не отправляется.
- `reply` — блок ответа над панелью: полоска `accent-2`, имя (`text-action`), текст сообщения (`text-secondary`) в одну строку, крестик `ButtonClose` x-small.
- `hints` — подсказки над панелью (`ChatHints`), нажатие — `onHint`.

## API
```js
h(TaigaUI.ChatInput, { platform: 'mobile', onSend: function (text) { … }, onAttach: …, onVoice: … })
h(TaigaUI.ChatInput, { platform: 'mobile', hints: ['Кредит наличными', 'Позвать специалиста'], onHint: function (item) { … } })
h(TaigaUI.ChatInput, { platform: 'mobile', reply: { name: 'Поддержка', text: 'Ставка от 14,9%', onClose: … } })
```
- `platform`, `system`, `value` / `defaultValue`, `onChange`, `onSend`, `placeholder` (по умолчанию «Сообщение»), `attach` (false — без скрепки), `onAttach`, `voice` (false — без микрофона), `onVoice`, `maxRows`, `disabled`, `reply`, `hints`, `onHint`, `className`, `style`.

## Только чтение (`readOnly`)
Когда писать в чат нельзя (чат заблокирован, обращение закрыто), вместо поля встает панель на всю ширину: фон `base`, разделитель сверху, тень `shadow-small`.
- `readOnly: { text }` — объяснение по центру, Body M `text-secondary`, поля 12. Без `text` — «Вы не можете отправлять сообщения».
- `readOnly: { action: { children, onClick } }` — плоская кнопка L на всю ширину, если ситуацию можно исправить («Разблокировать чат»). Пока запрос идет — `loading: true`.
```js
h(TaigaUI.ChatInput, { platform: 'mobile', readOnly: { text: 'Пользователь заблокировал чат. Вы не можете отправлять сообщения' } })
h(TaigaUI.ChatInput, { platform: 'mobile', readOnly: { action: { children: 'Разблокировать чат', onClick: unblock } } })
```
Пробел: read-only на десктопе в макете нет — панель та же, текст Body M.

## Перевод в чате (`p2p`)
В чате с человеком (TMSG write-panel / p2p) вместо микрофона справа желтая кнопка ₽ (`background-accent-1`).
- Нажатие на ₽ — режим суммы: поле с цифровой клавиатурой и знаком «₽».
- Введена сумма — над панелью строка «Перевести 1 839 ₽» (Body L `text-action`), справа желтая стрелка. Нажатие на строку или стрелку — `p2p.onTransfer(1839)`.
- Сумма стерта — кнопка снова ₽, нажатие возвращает к сообщению.
- Есть текст — обычная синяя отправка.
```js
h(TaigaUI.ChatInput, { platform: 'mobile', onSend: send, p2p: { onTransfer: function (amount) { … } } })
```

## Подсказки по мере ввода (`suggestions`)
Список строк над панелью (TMSG suggestion block): Body L `text-action`, поля 12 / 10 / 12 / 12, между строками 4, сверху разделитель. Нажатие — `onSuggestion(item)`, без него строка подставляется в поле. Не путать с `hints` — это готовые ответы чипами, а `suggestions` — продолжение того, что человек печатает.

## Запись голосового (`recording`)
Пока идет запись (TMSG voice-line), вместо поля — синяя полоса `background-accent-2` с белой волной и временем UI S `text-secondary-on-dark`. Справа — отправка (`recording.onSend`), слева — удаление записи (`recording.onCancel`, иконка `trash`).

## Поиск по чату (`searchNav`)
Во время поиска внутри чата (TMSG search-results) вместо панели — строка «3 из 12» (Body M) и стрелки вверх / вниз `text-action` к предыдущему и следующему совпадению. Ничего не нашлось — «Нет результатов», стрелки `upDisabled` / `downDisabled`.

## Поле с иконкой (`icon`)
Иконка Pragmatic Small 16 `text-action` слева в поле: адрес, почта, период (`small-pragmatic/calendar`). Плейсхолдер — «Выберите период», «Напишите адрес».

## Пробелы
- Иконка эмодзи в поле на десктопе (`tmsg-ic / M / sticker`) не сделана: в ДС нет такого действия. Есть `medium-pragmatic/emoji-smile`, если понадобится.
- Кнопка микрофона во время записи (фиолетовая, TMSG button / micro) не сделана: в ДС нет такого цвета. Волна записи статичная.
- Радиус десктопного поля в несколько строк в TMSG не показан — оставили 18.
- Тени панели (`shadow-small` из TMSG, помечен устаревшим) нет: панель отделяется от ленты фоном.
- P2P: в макете скрепка и поле 36 (в обычной панели 32) — оставили 32, как в остальной панели. Режим суммы на десктопе в TMSG не показан.
