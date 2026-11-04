# Illustration (`tui-illustrations-common`)

Иллюстрации TUI для статусных экранов, ошибок, пустых состояний, онбординга и промо: 269 сюжетов, у каждого светлая и тёмная версия. Размер 220×220: картинка вписана в круглую подложку («bubble»), поэтому иллюстрацию не кладём ни в какой круг или карточку.

## Подключение
Данные лежат отдельно от бандла — `components/illustrations.js` (≈2,6 МБ), чтобы не утяжелять экраны без иллюстраций. Подключайте **после** `bundle.js`:
```html
<script src="ds/taigaui/components/bundle.js"></script>
<script src="ds/taigaui/components/illustrations.js"></script>
```
Без этого файла компонент рисует пустое место нужного размера с `data-illustration="missing:<имя>"`.

## Пропсы
- `name` — имя сюжета: `check`, `error`, `wi-fi-off`, `lock-cross`, `card-cross`, `magnifier`, `sandclock`, `car-check` и т. д. Список: `TaigaUI.Illustration.names()` или галерея ниже.
- `size` — сторона в px, по умолчанию **160**; родной размер 220.
- `theme` — по умолчанию берётся тема предка: в `data-theme="*-night"` показывается тёмная версия, иначе светлая. `light` / `dark` — зафиксировать.
- `label` — альтернативный текст, если иллюстрация несёт смысл; без него скрыта от скринридера (декоративная).

## Как называются сюжеты
Имя = объект + состояние: `card-check`, `card-cross`, `card-clock`, `card-freeze`, `card-defrosting`, `card-alert-red`. Тот же набор состояний есть у браслета, кольца, брелока, стикера и других носителей оплаты (`ring-…`, `keyring-…`, `sticker-…`, `runner-…`). Суффиксы:
- `-check` — готово, успех; `-cross` — отказ, отмена, нельзя;
- `-clock` — ждём, в процессе; `-warning`, `-alert`, `-alert-red` — внимание, проблема;
- `-plus` — добавить; `-coins`, `-rub`, `-usd` — про деньги; `-freeze` / `-defrosting` — заморозка и разморозка; `-broken` — сломано, потеряно; `-limit` — лимит.

## Где что использовать
| Ситуация | Сюжеты |
|---|---|
| Успех, заявка отправлена | `check`, `smiley-happy-check`, `<объект>-check` (`car-check`, `doc-check`, `card-check`) |
| Ждём, на проверке | `sandclock`, `<объект>-clock` (`doc-clock`, `user-clock`) |
| Отказ | `smiley-sad-cross`, `<объект>-cross` |
| Техническая ошибка | `error-red` (красный крестик; у `BlockStatus` с `kind: 'error'` — по умолчанию), `tools`. Синий `error` для ошибок не берем |
| Нет интернета | `wi-fi-off`, `wi-fi-alert-red` |
| Нет доступа | `lock-cross`, `lock-key`, `user-key` |
| Проблема с платежом | `card-cross`, `coin-cross`, `coins-cross` |
| Ничего не найдено, пусто | `magnifier`, `drawer-empty`, `doc-magnifier` |

Выбор по смыслу ошибки — в разделе «Ошибки» (5 категорий иллюстраций). На статусном экране и в `tui-block-status` иллюстрация стоит над заголовком, по центру. Стиль иллюстраций не меняем и не перекрашиваем.
