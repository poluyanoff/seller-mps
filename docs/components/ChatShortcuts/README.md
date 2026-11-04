# ChatShortcuts (`horisontal-list`)

Ряд разделов над списком чатов: «Поддержка», «Обращения», «Архив». По Figma «TMSG. Library» → search → horisontal-list.

## Построение
- Пункт: `Avatar` 56 и подпись UI XS `text-primary` через 6, ширина пункта 72, подпись в одну строку с обрезкой.
- Между пунктами 8, слева 8. Не помещаются — ряд прокручивается по горизонтали.
- Фон `base`, без тени. Ряд закреплен, а список прокручивается под ним — `elevated: true`, тень `shadow-small`.
- Разделы банка — Fancy-иконка на `accent-2` (`{ icon: 'doc', tone: 'accent-2' }`), чат поддержки — логотип (`{ bank: 't-bank' }`).

## API
```js
h(TaigaUI.ChatShortcuts, { platform: 'mobile', items: [
  { label: 'Поддержка', avatar: { bank: 't-bank' }, onClick: openSupport },
  { label: 'Обращения', avatar: { icon: 'doc', tone: 'accent-2' }, onClick: openRequests },
  { label: 'Архив', avatar: { icon: 'archive', tone: 'accent-2' }, onClick: openArchive }] })
```
- `platform`, `system`, `items: [{ label, avatar, onClick }]`, `elevated`, `className`, `style`.

## Пробелы
- Бейджи непрочитанного на пунктах, десктоп и Android в макете не показаны.
