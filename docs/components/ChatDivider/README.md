# ChatDivider (`tmsg-border`)

Разделитель в ленте чата. По Figma «TMSG. Library» → border. Ставится между сообщениями [`ChatMessage`](../ChatMessage/README.md), свои отступы вокруг не нужны.

## Виды (`type`)
| `type` | что | построение |
|---|---|---|
| `date` (по умолчанию) | дата над сообщениями дня: «Сегодня», «Вчера», «12 октября» | высота 24, текст по центру |
| `new` | граница непрочитанного, по умолчанию «Новые сообщения» | подложка `background-neutral-1` во всю ширину, поля 4 сверху и снизу |
| `system` | системное сообщение в истории: «Переключаем ваш диалог на сотрудника…» | поля 5 сверху и снизу, текст в несколько строк |

## Текст
По бокам поля 32, текст по центру, цвет `text-secondary`. Мобилка — UI XS Bold (`ios-ui-xs-bold` / `android-ui-xs-bold`), десктоп — UI S Bold.

## API
```js
h(TaigaUI.ChatDivider, { platform: 'mobile', type: 'date' }, 'Сегодня')
h(TaigaUI.ChatDivider, { platform: 'mobile', type: 'new' })
h(TaigaUI.ChatDivider, { platform: 'mobile', type: 'system' }, 'Переключаем ваш диалог на сотрудника')
```
- `type`, `platform`, `system`, `children` / `text`, `className`, `style`.

## Пробелы
- Липкая дата при прокрутке в TMSG не описана.
