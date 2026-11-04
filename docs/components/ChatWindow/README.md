# ChatWindow

Плавающее окно чата на десктопе поверх личного кабинета, как в проде: открывается кнопкой чата `PageLayout` в правом нижнем углу. Внутри — экраны чата: список ([`ChatHeader`](../ChatHeader/README.md) + [`ChatCell`](../ChatCell/README.md)), переписка ([`ChatMessage`](../ChatMessage/README.md), [`ChatInput`](../ChatInput/README.md)), разделы. На мобилке окна нет — чат открывается экраном.

## Построение
- 400 × 550, радиус 20, фон `background-base`, тень `shadow-popup`.
- В 8 над кнопкой чата `PageLayout` и по ее правому краю: окно само находит кнопку и держит отступ при любой ширине, в том числе когда страница уменьшена (`scale`). Без кнопки — в 20 от правого края и 84 от низа. Не выше окна браузера минус 20 сверху.
- Рендерится порталом в `body`, поверх страницы.

## Закрытие
- Крестик на кнопке чата `PageLayout` (`chatOpen`).
- Клик в любом месте вне окна и Escape — `onClose(reason)`: `outside` или `escape`. Не закрывают: кнопка чата (она сама переключает окно), меню и выпадашки поверх окна (`role="menu"`, `listbox`, `dialog`) и элементы с `data-tui-chat-keep`. Отключить — `closeOnOutside: false`.

## Анимации
По шаблонам раздела «Анимации» (`motion.md`), только токены.
| что | как |
|---|---|
| открытие | opacity 0 → 1, сдвиг снизу 8 → 0, `duration-moderate`, `productive-entrance` |
| закрытие | обратно, `duration-fast`, `productive-exit` — быстрее открытия |
| смена экрана (`view`) | въезд на 24 с проявлением, `duration-moderate`, `productive-entrance`; вперед — справа, назад (`direction: 'back'`) — слева |
| новое сообщение (`ChatMessage` `appear`) | проявление и рост 0.9 → 1 из своего угла (входящее — левый нижний, исходящее — правый нижний), `duration-moderate`, `productive-entrance` |
| иконка кнопки чата (`PageLayout` `chatOpen`) | смена чат ↔ крестик — `fade-in-scale` micro |

При `prefers-reduced-motion` анимации мгновенные. При повторном открытии экран не въезжает — окно появляется целиком.

## API
```js
var o = React.useState(false), open = o[0];
var v = React.useState({ view: 'list', direction: 'forward' });
h(React.Fragment, null,
  h(TaigaUI.PageLayout, { header: { … }, chat: function () { o[1](!open); }, chatFixed: true, chatOpen: open, main: … }),
  h(TaigaUI.ChatWindow, { open: open, onClose: function () { o[1](false); }, view: v[0].view, direction: v[0].direction },
    v[0].view === 'list' ? h(ListScreen) : h(ChatScreen)))
```
- `open`, `onClose`, `closeOnOutside`, `view`, `direction` (`forward` / `back`), `children`, `width`, `height`, `right`, `bottom`, `animateOnMount`, `inline`, `ariaLabel`, `className`, `style`.
- Экран внутри — колонка на всю высоту окна: шапка, лента с `flex: 1` и прокруткой, `ChatInput` внизу.
- Новое сообщение — `h(TaigaUI.ChatMessage, { appear: true, direction: 'outgoing', … })`. Старым сообщениям `appear` не ставь, иначе лента анимируется целиком.

## Пробелы
- Окна в TMSG нет: размер, положение и радиус сняты с прода и тестовой страницы (решение команды). Отступ 8 над кнопкой — по ревью.
- Анимации окна в гайдах не описаны: собраны из шаблонов `motion.md`. Масштаб при открытии убран по ревью.
