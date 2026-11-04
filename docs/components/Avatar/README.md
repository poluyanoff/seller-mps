# Avatar (`tui-avatar`, `tui-avatar-stack`, `tui-avatar-labelled`, `tui-avatar [subscription]`)

Аватар по гайду tui-avatar: человек, компания, категория или продукт. Описывает внешний вид; где ставить — в ячейках (`Cell`), заголовках, карточках, `Row`.

## Размеры
| Размер | px | Квадрат: радиус | Иконка | Инициалы, десктоп | Инициалы, мобилка |
|---|---|---|---|---|---|
| xx-large | 128 | 20 | 80 | H2 44 | — |
| x-large | 96 | 16 | 56 | H3 36 | — |
| large | 80 | 12 | 48 | H3 36 | 36 |
| medium | 56 | 12 | 34 | H6 20 | 24 |
| **small** (по умолчанию) | 40 | 12 | 24 | Body M Bold 15 | 16 |
| x-small | 32 | 8 | 20 | Body S Bold 13 | — |
| xx-small | 24 | 8 | 14 | UI XS Bold 11 | 11, одна буква |

На мобилке размеры: large, medium, small, xx-small. Форма — круг (`ellipse`) или квадрат (`shape: 'square'`).

## Содержимое
- **Инициалы** — фон `background-neutral-4`, текст `text-primary-on-dark`. `name` → две первые буквы.
- **Иконка** — по умолчанию (`tone: 'accent-icon'`) фон `background-neutral-1`, иконка цветом `text-action` из **medium**-набора (Fancy). `tone: 'accent-2'` — белая иконка на `background-accent-2`; `tone: 'neutral'` — серая. Другие тона — только по требованию. Pragmatic-иконки не используем: в контейнере хорошо смотрятся только плотные. Исключение — иконка 16 и меньше (xx-small): если её нет в Fancy Small, берём Pragmatic Small, а не уменьшенную Fancy Medium. В коде имя без набора берётся из Fancy (для иконки 16 и меньше — из `small`); если Fancy-версии нет, подставляется обычная, чтобы аватар не остался пустым. Small-иконки не растягиваем и не ставим в исходном размере — не хватает иконки, заказываем в `~tui-design-ask`.
- **Картинка** — фото или логотип на всю площадь.
- **Логотип банка** — белый знак на фирменном фоне: `bank: 't-bank'` (белый щит с тёмной буквой Т — `text-primary-on-t-bank` — на `brand-t-bank`) или вручную `icon: 'medium/logo-sber'` + `background` (имя токена или цвет) + `color`. Знак — одноцветный логотип из Fancy (`medium/logo-*`: `logo-t-shield`, `logo-sber`, `logo-rosbank`, `logo-rosbank-circle` и др.). Фирменных цветов других банков в токенах нет — цвет передаёт продукт («вне ДС»). Логотипа Альфа-Банка среди иконок нет.
- **Текст** — «99+», фон `background-neutral-1`, `text-secondary`.
- **Скелетон** — при загрузке.
- **Аватар не должен сливаться с фоном:** подбирайте изображение с отличающимся фоном или добавляйте бордер (`bordered`).

## Бейджи (мобилка)
Сверху справа (`badgeTop`) и снизу справа (`badgeBottom`), можно оба — например, счётчик и иконка платёжной системы или «Т-клиент». Положение — по `tui-badged-content` (карточка Badge): центр круглого бейджа на окружности аватара под 45° (80 → 12, 56 → 8, 40 → 6 от угла), обводка-маска 1, у `notification` без обводки. «Т-клиент» — `Badge appearance="t-client"`.

## Подписка (`subscription`)
Кольцо цвета подписки: 2 px до 40 включительно, 3 px от 56. Между кольцом и аватаром — зазор фона, аватар внутри меньше на 6 (на 10 от 56). Варианты: `pro` (`brand-element-pro`, по умолчанию), `premium`, `private`, `tinkoff`.

## Стек (`AvatarStack`)
- Несколько аватаров в ряд, в Figma от 1 до 4. Размеры: XS 24, S 40, M 56, L 80; шаг **18 / 28 / 32 / 46** (≈ 0.7 размера).
- **Маска** на 4 больше аватара — как бордер 2 снаружи цвета фона (`maskColor`). Шаг одинаковый с маской и без. Крайний элемент виден целиком.
- **Первый сверху** (по умолчанию) или **последний сверху** (`flip`).
- Каждый аватар настраивается по правилам `Avatar`; шаг можно поменять (`step`).
- Можно ставить на место обычного аватара в ячейках и карточках.

## С подписью (`AvatarLabelled`)
Аватар и подпись 12 в одну-две строки (вторая — `text-secondary`), по центру. Small 40 (ширина 72, между 6), **medium 56** (72, 6), large 80 (96, 8). Длинная подпись — многоточие или фейд (`fade`). Используется в `Row` (`avatar-labelled`).

## API
```js
h(TaigaUI.Avatar, { name: 'Анна Белова' })                                   // small 40, инициалы
h(TaigaUI.Avatar, { size: 'large', icon: 'medium/star' })
h(TaigaUI.Avatar, { size: 'medium', src: photo, alt: 'Анна Белова', bordered: true, subscription: 'premium' })
h(TaigaUI.Avatar, { platform: 'mobile', size: 'medium', text: '99+', badgeTop: h(TaigaUI.Badge, { size: 'm' }, '3') })
h(TaigaUI.AvatarStack, { size: 'small', items: [{ src: a }, { name: 'Иван Петров' }, { text: '+5' }], flip: false })
h(TaigaUI.AvatarLabelled, { size: 'medium', label: 'Анна', secondLine: 'Т-Банк', initials: 'АБ' })
```
`Avatar`: `size`, `shape`, `platform`, `system`, `name` / `initials`, `icon`, `iconSize`, `src` / `image` + `alt`, `text`, `skeleton`, `bordered`, `subscription`, `badgeTop`, `badgeBottom`, `badgeOutline`, `badgeMaskColor`, `onClick`.

## Пробелы
- Фирменные цвета сторонних банков (Сбер, Альфа, ВТБ…) не токены. Если банков в продукте много, стоит завести набор `brand-*` для партнёров.
- Логотипа Альфа-Банка нет среди иконок: `alfa-bank` есть только в описании ассетов `tui-logo-square`, файлов в ДС нет.

- Размер шрифта для «текстового» аватара известен только для medium (17) и large (30); остальные — по аналогии.
- Цвет кольца подписки `tinkoff` — токена нет, взят `background-accent-1`.
- Вид бордера у фото не указан: 1 px `border-normal` внутри.
- `AvatarLabelled`: инициалы теперь на `neutral-4`, как в гайде (раньше были на `accent-2`).
