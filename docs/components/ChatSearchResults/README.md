# ChatSearchResults (`search`)

Выдача поиска по чатам. По Figma «TMSG. Library» → search. Сверху — [`SearchBar`](../SearchBar/README.md), под ним — `ChatSearchResults`. Таб-бар остается.

## Построение
- Результаты группируются в секции-карточки: «Контакты», «Сообщения». Фон `background-neutral-1-on-base`, радиус 20, поля 20 сверху и 16 снизу, заголовок Heading S (`ios-heading-s-bold`), между секциями 20.
- Строка: аватар 40, текст через 12, поля 16 / 8, между строками 4.
- Контакт — только имя (Body L).
- Сообщение — имя и справа время со статусом (UI XS `text-secondary`), ниже текст в одну строку UI S `text-secondary`. Автор реплики в групповом или своем сообщении — «Вы: », «Валентина: » (`author`).
- Совпадение с запросом (`query`) подсвечено фоном `status-warning-pale`.

## Пустые состояния
- Ничего не нашлось — «Ничего не найдено» (`emptyText`) по центру, UI S `text-secondary`.
- До ввода запроса — подсказка «Можно искать по сообщениям или именам собеседников» (`hint`).

## API
```js
h(TaigaUI.SearchBar, { value: q, onChange: setQ, active: true, onCancel: close }),
h(TaigaUI.ChatSearchResults, { platform: 'mobile', query: q, sections: [
  { title: 'Контакты', items: [{ name: 'Анна Александрова', onClick: open }] },
  { title: 'Сообщения', items: [{ name: 'Поддержка', avatar: { bank: 't-bank' }, time: '9:41', status: 'read', author: 'Вы', text: 'Давайте на завтра', onClick: open }] }] })
```
- `platform`, `system`, `query`, `sections: [{ title, items: [{ name, avatar, text, author, time, status, onClick }] }]`, `emptyText`, `hint`, `className`, `style`.
- `avatar` — пропсы `Avatar`, строка-имя или элемент. Без него — инициалы по `name`.

## Пробелы
- Цвет подсветки запроса в макете — желтая заливка без токена. Взяли `status-warning-pale`.
- Время и текст сообщения в макете 12 и 13 — взяли UI XS и UI S.
- Поиск на десктопе в TMSG не показан.
