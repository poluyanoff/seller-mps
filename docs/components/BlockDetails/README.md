# BlockDetails (`tui-block-details`)

Блок с деталями: шапка экрана операции, платежа, сделки или контакта. По гайду tui-block-details v1.2.2. Используется в шаблонах «Детали операции»: десктоп — `template-feed-details`, мобилка — `template-details-modal`.

## Построение
Один лейаут для десктопа и мобилки, всё по центру. **Порядок элементов менять нельзя.** Обязательны только превью и `title`.

| элемент | что это | десктоп | iOS / Android |
|---|---|---|---|
| **Preview** (обязательный) | `tui-avatar`; можно заменить своим контентом | 96 (x-large) | 80 (large) |
| **Title** | `title` — основной текст (обязателен), `description` — описание | Body L / Body M `text-secondary` | Body L / UI S `text-secondary` |
| **Amount** | сумма (`tui-amount`, Numbers XL) и `amountDescription` | Numbers XL 36/40 | Numbers XL 30 |
| **Extra description** | важное из описания, например сумма в валюте | Body M `text-secondary` | UI S `text-secondary` |
| **Comment** | облачко: `accent-2`, радиус 16, поля 8 / 12, хвостик 24×8 сверху, мин. ширина 64; текст Body M `text-primary-on-dark` | | |
| **Badge** | `Badge` large, можно несколько разных стилей | через 8 | через 8 |
| **Status** | иконка 16 `text-tertiary` + 4 + текст, например статус операции | Body M `text-secondary` | UI S `text-secondary` |

## Вертикальные отступы
Одинаковые на десктопе и мобилке:
- превью → title — **16**;
- title value → description — **4**;
- title → amount — **20**;
- сумма → её description — **4**;
- amount → extra description — **16**;
- extra description → comment — **12**, до кончика хвостика;
- comment → бейджи — **20**;
- бейджи → status — **20**.

На мобилке у блока свои поля: **16** сверху и по бокам, **32** снизу.

## Сумма
- Число форматируется само: разряды через пробел, дробь через запятую, минус — U+2212, плюс у положительных (`plusSign={false}` — без плюса).
- Валюта справа через неразрывный пробел (`currency`, по умолчанию ₽).
- Цвет суммы и её описания можно менять (`amountColor`).

## Дополнительные возможности
- **Ограничение строк.** По умолчанию текстовые блоки многострочные. Их можно ограничить (`titleLines`, `descriptionLines`, `amountDescriptionLines`, `extraDescriptionLines`, `commentLines`), дальше фейд.
- **Сложный фейд** (раздел «Сложные лейблы и фейд»):
  - возможен в description под title и под amount, если они ограничены одной строкой; при другом лимите строк suffix уходит в фейд вместе с текстом;
  - prefix и suffix — бейдж или иконка, отступ от них **8**;
  - статус с иконкой — одна строка с фейдом, иконка через **4**.
- **Скелетон** (`skeleton`): текст и сумма — плашки `service-skeleton`, превью, облачко и бейджи — скелетоны своих компонентов. В гайде он есть только в Figma, в вебе собран по макету.

## Кастомизация
- **Превью** — любой свой контент вместо аватара (`preview` — элемент).
- **Сумма** — цвет value и description.
- **Description** — иконки с любой стороны (передаётся узлом).
- **Комментарий** — цвет фона и текста (`commentBackground`, `commentColor`).

## Доступность
- **Увеличение шрифтов:** до AX1 на iOS и 150 % на Android. Вложенные компоненты масштабируются по своим правилам, отступы не меняются.
- **Озвучка:** текстовые блоки — подряд сверху вниз, слева направо («TitleValue, TitleDescription, −123 ₽, AmountDescription…»). Вложенные компоненты озвучиваются по своим правилам. Превью по умолчанию не озвучивается.

## API
```js
h(TaigaUI.BlockDetails, {
  preview: 'medium/cart',        // элемент, пропсы Avatar, имя (инициалы), ссылка на картинку или иконка
  title: 'Amazon.com', description: 'Оплата картой • MCC 2342',
  amount: -123, currency: '₽', amountDescription: 'Списано с Black',
  extraDescription: '−1,35\u00a0$ по курсу 91,2\u00a0₽',
  comment: 'На книги',
  badges: [{ appearance: 'accent-1', icon: 'crown', children: '5% кэшбэк' }],
  status: { label: 'Исполнен', icon: 'fixed-color/check-circle-positive' },   // или строка
  platform: 'mobile', system: 'ios' | 'android', skeleton
})
```

## Пробелы
- **Numbers XL на мобилке** — по новой типографике Foundations: iOS SF Pro Rounded 30/36 700, Android Open Runde 30/35 700. Файлов этих шрифтов в ДС нет: в WebView на iOS подхватится системный `ui-rounded`, на Android и в превью — запасной Roboto/Arial.
- **Шрифт комментария на десктопе.** В макете стоит iOS Body M; в коде Neue Haas Unica 15/18.
- **Скрытый блок с кнопками в компоненте Figma** (buttonCont) в гайде не описан, не собран. Кнопки-действия под блоком — по шаблону «Детали операции».
- **Иконка статуса** по умолчанию `small/clock-circle`. Её цвет на десктопе в макете не задан, взят `text-tertiary`, как на мобилке.
