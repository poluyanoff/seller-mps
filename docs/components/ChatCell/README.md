# ChatCell (`chat-cell`)

Ячейка в списке чатов: аватар, имя, время и статус последнего сообщения, превью, счётчик непрочитанных. По Figma «TMSG. Library» → chat-cell. Нажатие открывает чат: [`NavigationBar`](../NavigationBar/README.md) (шапка чата), [`ChatMessage`](../ChatMessage/README.md), [`ChatInput`](../ChatInput/README.md).

## Построение
- Поля 16 по бокам, 8 сверху и снизу. Аватар 56, текст через 16 (десктоп — через 12).
- Строка 1: имя и иконка «без звука» (`muted`), справа статус и время.
- Строка 2: превью и бейдж непрочитанных `Badge` `notification` large.
- Ячейки идут вплотную, без разделителей.

| | имя | время | превью |
|---|---|---|---|
| iOS | Heading S | UI XS | Body M, до 2 строк с многоточием |
| Android | Heading S (Roboto Medium 16) | UI XS | Body M, одна строка с фейдом |
| десктоп | UI M Bold | UI S | Body M, одна строка с фейдом |

Цвета: имя `text-primary`, время и превью `text-secondary`, статус «прочитано» `text-action`.

## Превью
| проп | что | вид |
|---|---|---|
| `text` | последнее сообщение | `text-secondary` |
| `draft` | черновик | «Черновик:» `text-negative` + текст |
| `attachment` | вложение: «Фото», «Файл» | скрепка `small-pragmatic/paper-clip` + подпись |
| `typing` | собеседник печатает | «печатает» `text-action` |
| `amountLabel` + `amount` | перевод или запрос денег | подпись + `Amount`: пополнение — `{ sign: 'always', color: 'positive' }`, перевод — с минусом |

Превью пишут люди, поэтому проверка редполитики его не трогает.

## Статус (`status`)
Статус последнего исходящего: `sending`, `sent`, `read`, `error` — те же иконки, что у `ChatMessage`.

## API
```js
h(TaigaUI.ChatCell, { platform: 'mobile', title: 'Поддержка', avatarProps: { bank: 't-bank' }, time: '20:15', text: 'Выберите карту', unread: 1, onClick: open })
h(TaigaUI.ChatCell, { platform: 'mobile', title: 'Анна Белова', time: '19:40', amountLabel: 'Пополнение', amount: { value: 2000, sign: 'always', color: 'positive' } })
```
- `title`, `avatar` (имя, пропсы `Avatar` или элемент) / `avatarProps`, `time`, `status`, `muted`, `unread`, `text` / `children`, `draft`, `attachment`, `typing`, `amountLabel`, `amount`, `onClick`, `selected`, `platform`, `system`, `className`, `style`.

## Экран списка чатов
Мобилка: `NavigationBar` с крупным заголовком «Чаты» и поиском справа, под ним ячейки `ChatCell`, внизу `TabBar`. В Т-Бизнесе — `TabBar preset: 'business'` с вкладкой «Чат».

## Пробелы
- В TMSG превью iOS в 2 строки уходит в фейд, здесь — многоточие.
- Иконка «без звука» в TMSG своя (`tmsg-ic / S / mute`), здесь `small-pragmatic/sound-off`. «Печатает» в TMSG с анимированными точками, здесь только текст.
- Горизонтальный список избранных чатов над списком (horizontal-list) и десктопная шапка списка не сделаны.
- Ховер на десктопе — `background-neutral-1-hover`, выбранный чат — `background-neutral-1` (в TMSG не показаны).

Без звука (`muted`) бейдж непрочитанного серый (`Badge` `notification` `muted`, тот же размер, что у красного), как в архиве в проде; со звуком — красный `notification`.
