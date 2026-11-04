# ChatHeader (`navigation-bar / chat`, `navigation-bar / chat-list`, десктоп)

Шапка окна чата и списка чатов на десктопе. По Figma «TMSG. Library» → navigation-bar, chat-cell, feed (Desktop). На мобилке — `NavigationBar` (`large: false`, `avatarProps`), см. «Шапка чата» в его README.

## Шапка чата
Есть `onBack`, `avatar` / `avatarProps` или `subtitle`.
- Высота 56, поля 8 / 10, между блоками 10, фон `base`.
- «Назад» — `medium-pragmatic/arrow-left` 24 в зоне 36, `text-action`.
- Аватар 40, через 8 имя Body M Bold `text-primary` и статус UI S `text-secondary` («На связи 24/7»). Длинное имя — многоточие.
- Справа иконки 24 в зонах 36, `text-action`: поиск `medium-pragmatic/magnifier`, меню `medium-pragmatic/more`.
- `onTitleClick` — нажатие на аватар и имя: профиль собеседника.
- Меню «Еще» — `items` у действия: `{ icon: 'medium-pragmatic/more', label: 'Еще', items: [{ label: 'Отключить уведомления', avatar: 'sound-off', onClick }] }`, открывается `Dropdown` по правому краю кнопки.

## Шапка списка чатов
Только `title`: заголовок Heading 5, поля 20 сверху и по бокам, 8 снизу. Ниже — `ChatCell` вплотную.

## Разделы в шапке списка
Как в проде: справа от «Чат» — разделы аватарами 40 с бейджем-счетчиком. `right: [{ label: 'Обращения', avatar: 'doc-clock', badge: 1 }, { label: 'Архив', avatar: 'archive', badge: 17, badgeMuted: true }]`. Строка-аватар — Fancy-иконка на `accent-2`. Бейдж `notification` красный; `badgeMuted` — серый (`notification` `muted`, тот же размер), для архива и чатов без звука. В TMSG тот же набор — рядом `ChatShortcuts` под шапкой: на десктопе бери шапку с разделами, на мобилке — `ChatShortcuts`.

## Вложенный раздел
Только `title` и `onBack`, без аватара и статуса: «Назад» слева, заголовок Body M Bold по центру — «Обращения», «Архив». Ниже — список `ChatCell` или карточки обращений.

## Карточка обращения
Список карточек — в контейнере с прокруткой и полями 20 / 16 / 24: меньше — тень карточки обрезается по краю прокрутки под шапкой.
Отдельного компонента нет: `CardLarge` с `title` (тема, `titleClassName: 'tui-heading-6'` — в узком окне чата заголовок H4 крупный), `description` (последний ответ), в `accessory` — красная точка `Badge` `notification` `small` (есть непрочитанное), в контенте — статус `Badge` `positive-pale` с иконкой `check` «Решено» (в работе — `info-pale`, ждем ответа — `warning-pale`).

## API
```js
h(TaigaUI.ChatHeader, { title: 'Чат' })
h(TaigaUI.ChatHeader, { title: 'Поддержка', subtitle: 'На связи 24/7', avatarProps: { bank: 't-bank' }, onBack: back,
  right: [{ icon: 'medium-pragmatic/magnifier', label: 'Поиск', onClick: search }, { icon: 'medium-pragmatic/more', label: 'Еще', onClick: menu }] })
```
- `title`, `subtitle`, `avatar` / `avatarProps`, `onBack`, `backLabel`, `onTitleClick`, `right` (`{ label, icon }` или `{ label, avatar, badge, badgeMuted }`), `className`, `style`.

## Окно чата целиком
Шапка `ChatHeader`, лента `ChatDivider` + `ChatMessage` с прокруткой, прижатая к низу, внизу `ChatInput` (подсказки — `hints`). Ширина окна в TMSG — 400.

## Пробелы
- Наведение на иконки — `text-action-hover`: в макете не показано.
- Ответ на сообщение в десктопной панели ввода в TMSG — плитка 32 со стрелкой вместо полосы; в `ChatInput` пока полоса.
- Статусы обращений, кроме «Решено», в проде не видны — цвета бейджей взяты по смыслу.
- Прод сейчас на английском («Chat», «Requests», «Archive», «Resolved», «No results»): это ошибка локализации прода, в ДС тексты русские.
