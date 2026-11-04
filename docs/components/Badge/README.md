# Badge (`tui-badge`) и BadgedContent (`tui-badged-content`)

Неинтерактивный бейдж по гайду tui-badge v1.7.0: короткая метка, статус или счётчик в пилюле. Готов на всех платформах.

**Когда.** Количество вложенных элементов, статус элемента или блока.
Новый раздел или бета-версия — `accent-2` `small` справа от названия через 8 (раздел «Обучение пользователя»).
**Когда не бейдж.**
- Интерактивные подсказки под полем и кликабельные теги — `Chip`.
- Кликабельное пояснение (тултип, переход) — `Button` или `Link`.

Бейдж не кликается. Минимальная ширина равна высоте.

## Стили (`appearance`)
| стиль | десктоп | мобилка |
|---|---|---|
| `light-text` — светлый текст на тёмном или любом фоне | `background-neutral-4` + blur 10, `text-primary-on-dark` | так же |
| `dark-text` — тёмный текст на светлом или любом фоне | `background-neutral-1`, `text-primary` | `background-neutral-4`, `text-primary-on-light` |
| `accent-1` — кешбэк | `background-accent-1`, `text-primary-on-accent-1` | так же |
| `accent-2` — рассрочка | `background-accent-2`, `text-primary-on-accent-2` | так же |
| `positive-pale` · `negative-pale` · `warning-pale` · `info-pale` · `neutral-pale` — статусы | `status-*-pale`, `text-primary`; точка `status-*` (`dot`) | нет |

Иконка красится цветом текста.

## Размеры
По умолчанию — **medium**. Высота фиксирована, ширина по контенту.

**Десктоп**
| `size` | высота | поле | у текста ещё | текст | иконка | только иконка |
|---|---|---|---|---|---|---|
| `x-large` | 32 | 8 | 4 | UI M 15/20 | 16 | 32×32 |
| `large` | 24 | 4 | 4 | UI S 13/16 | 16 | 24×24 |
| `medium` | 20 | 4 | 2 | UI S 13/16 | 12 | 20×20 |
| `small` | 16 | 2 | 2 | UI XS 11/13 | 10 | 16×16 |

Точка статуса (`dot`, только десктоп): 8 / 6 / 6 / 4.

**Мобилка** (`platform="mobile"`, `system: 'ios' | 'android'`)
- Высоты 28 / 24 / 20 / 16, поля 6 / 4 / 4 / 2, у текста ещё 4 / 4 / 2 / 2.
- Текст: UI S Bold 13; у small — UI XXS Bold 11.
- В нативе отступы считаются от высоты (X = 22 / 17 / 20 / 19 % высоты) для увеличенных шрифтов. В мобильном вебе они статичные.

## Содержимое
- **Текст**, **иконка + текст**, **только иконка**. Иконки из набора `small`.
- **Картинка:** `image` — элементом (логотип партнёра внутри) или URL (заливка).
- **Два лейбла** (`secondLabel`) через 4. Внешние отступы и отступ до иконки не меняются. Иконка может стоять слева или справа (`iconPosition`).
  - Если не помещается, первой сжимается левая часть: приоритет у правой.
  - Левая часть не становится меньше 30 % ширины. Дальше в фейд уходит и правая.

## Поведение
- **Обрезка** — `maxWidth`: после него текст уходит в фейд 16.
- **Скелетон** (`skeleton`) повторяет форму и высоту бейджа. Ширина берётся по контенту или задаётся через `skeletonWidth`.
- **Анимация** одинаковая для всех бейджей (`visible`):
  - появление: scale 50 → 100 %, opacity 0 → 1, `cubic-bezier(0.4, 1.8, 0.6, 1)`, `duration-moderate`;
  - скрытие: обратно, `cubic-bezier(1, -0.7, 0.4, 1)`.
- **Кастомизация:**
  - свой фон, в том числе градиент (`background`);
  - тень `shadow-small`, в том числе цветная (`shadow`);
  - свой цвет текста и иконки (`color`).
- **Озвучка.** Бейдж отдельно не фокусируем: строку озвучивает родительский компонент. По умолчанию бейдж не озвучивается (`aria-hidden` / `ariaLabel` — по задаче).

## Тексты
- Однострочно, максимально коротко, без потери смысла.
- Статусы в одной форме. Правильно: «Отправлен, Ожидает, Исполнен»; неправильно: «Отправлен, Ожидание, Исполнено».
- Без больших чисел: «99+», а не «123 986 098».
- Общие правила текстов и коды — раздел «Тексты интерфейса» (`copy.md`): статусы — ST1, ST2.

## Пресеты
- **`notification`** (tui-badge [notification]) — уведомления в заголовках, ячейках, карточках, аватарах:
  - фон `component-badge-notification`, текст `text-primary-on-dark`, без обводки;
  - десктоп: `x-large` 24 (поле 8), `large` 20 (6), `medium` 16 (4, UI XS), `small` — точка 6;
  - мобилка: `large` 24 (iOS, 15/18) / 22 (Android, 14/16), `medium` 18 (13/16 / 12/14), `small` — точка 6;
  - `muted` — серый залитый фон при тех же размерах (`border-normal-opaque-hover`: непрозрачного серого фона в токенах нет): счетчик чата без звука, архив;
  - озвучка — в родителе: «Есть одно обновление», «Есть больше 99 обновлений».
- **`t-client`** — клиент Т-Банка на аватаре: точка `brand-t-bank`, десктоп 6, мобилка 8. Маска 8 / 10, то есть обводка 1.
- **Кешбэк** (tui-badge [cashback]) — `all-airlines`, `black`, `all-games-debit`, `all-games-credit`, `platinum`:
  - градиент слева направо, текст и иконка `text-primary-on-dark`;
  - иконка по умолчанию справа: airplane / crown / bonus. Её можно перенести влево (`iconPosition`), отступы как у обычного бейджа.
- **Подписки** (tui-badge [subscription]) — `pro` (`brand-pro`), `premium`, `private` (градиенты):
  - текст `text-primary-on-light`;
  - в `logo` — логотип из `tui-logo`: `subscription-pro-capsule-2`, `subscription-premium-capsule-inverse`, `subscription-private-capsule`;
  - или иконка: `subscription-dot-pro`, `tui-logo-square/t-shield-black` (Premium), `t-private` (Private);
  - логотип высотой 18 / 14 / 12 / 10, слева поле на 1 больше обычного: 7 / 5 / 4 / 3.
- **Только знак подписки** (tui-badge [subscription-icon] / [subscription-icon-shield]) — 32 / 24 / 20 / 16 на десктопе, 28 / 24 / 20 / 16 на мобилке:
  - это логотип `tui-logo/subscription-pro-compact`, `ts-shield-premium`, `t-private`, `t-shield` без подложки;
  - на аватаре — маска 2.

## BadgedContent
`tui-badged-content` — бейдж на хосте: аватаре, иконке, карточке. Принципы одинаковые на всех платформах.
- **Положение.** Центр круглого бейджа лежит на границе хоста. Некруглый бейдж растёт внутрь хоста.
  - У скруглённого хоста точка — на дуге под 45°: отступ от угла = R × (1 − 1/√2).
  - Для аватара круга: 80 → 12, 56 → 8, 40 → 6. Сверху справа — `badgeTop`, снизу справа — `badgeBottom`.
- **Обводка-маска 1** у обычных бейджей любого размера. У `notification` обводки нет. Толщину можно увеличить или убрать (`outline`).
  - В коде это маска: через неё виден фон. Цвет по умолчанию — `background-base`, другой — `maskColor`.

## API
```js
h(TaigaUI.Badge, {
  children: 'Текст', secondLabel,
  appearance: 'accent-1', // light-text | dark-text | accent-1 | accent-2 | positive-pale … neutral-pale | notification | t-client | all-airlines | black | all-games-debit | all-games-credit | platinum | pro | premium | private
  size: 'medium',         // x-large | large | medium | small
  platform: 'mobile', system: 'ios' | 'android',
  icon, iconPosition: 'left' | 'right', dot, image, logo,
  maxWidth, skeleton, skeletonWidth, visible,
  background, color, shadow, ariaLabel, className, style
})
h(TaigaUI.BadgedContent, { badgeTop, badgeBottom, radius, shape: 'circle' | 'rect', inset, outline: 1, maskColor: 'background-base' }, host)
// В Avatar: badgeTop / badgeBottom (+ badgeOutline, badgeMaskColor) — положение считается само
```

## Пробелы
- Sensitive mode (пиксельная маска поверх содержимого) не собран.
- Увеличенные шрифты (iOS до AX1, Android до 150 %) не собраны: в мобильном вебе отступы статичные.
- Бейдж-картинка с заливкой: ширина в гайде не указана, берём `width` или высоту.
- Градиенты кешбэка и подписок Premium и Private — значения из гайда, токенов для них нет. Угол градиента Private приблизительный.
- Цвет иконки в статусных бейджах в гайде не задан — берём цвет текста.
- Маска на хосте сделана обводкой цвета фона, а не вырезом: на пёстром фоне это видно.
- Логотипы подписок лежат в ассетах ДС (`tui-logo`), но бандл их сам не подставляет: их передают в `logo`.
