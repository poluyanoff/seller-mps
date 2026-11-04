# Checkbox (`tui-checkbox`) · CheckboxGroup

Чекбокс по гайду tui-checkbox. Правила выбора, редполитика и доступность — в разделе «Чекбоксы, радиокнопки, тогглы».

## Десктоп
- **Medium** — 24, радиус 8. **Small** — 16, радиус 4.
- **Фон:**
  - выкл. — `neutral-2` (наведение `-hover`, нажатие `-pressed`);
  - вкл. — `accent-1`, галочка `accent-on-light`;
  - accent — `accent-2` с белой галочкой.
- **Indeterminate** — тот же фон с минусом.
- **Disabled** — 56 %, лейбл `text-secondary`.
- **Ошибка** — `status-negative-pale`, выбранный — `status-negative`.
- **Лейбл:**
  - Medium — `body-m` 15/24 через 12;
  - Small — `body-s` 13/20 через 8.
- **Описание** — `body-s` `text-secondary`, подсказка «?» — через 4 после лейбла.

## Мобилка
Только внутри других компонентов (`Cell`, `Header`). Контрол — круг 22:
- **iOS:** выбран — `accent-2` с `check-ios`.
- **Android:** выбран — `accent-2` с `check-android`.

Система выбирается пропом `system` или темой `android-*`.

## Группа и частичный выбор
`CheckboxGroup`:
- вертикально 20 (S — 16), горизонтально 32;
- ошибка группы — под ней через 20;
- `parent` — родительский чекбокс «Выбрать все» с indeterminate:
  - normal — выбирает всё;
  - selected — снимает всё;
  - indeterminate — выбирает оставшиеся.

```js
h(TaigaUI.Checkbox, { label: 'Получать уведомления о новых предложениях', checked: on, onChange: setOn })
h(TaigaUI.Checkbox, { size: 's', label: 'Я принимаю условия', error: 'Нужно согласие' })
h(TaigaUI.CheckboxGroup, { title: 'Присылать уведомления', parent: 'Все', items: [{ value: 'doc', label: 'Получен документ' }, { value: 'reply', label: 'Контрагент ответил' }], value: v, onChange: setV })
```
Пропсы `Checkbox`:
- `checked`, `onChange`, `defaultChecked` — состояние; `checked` может быть `true`, `false` или `'indeterminate'`;
- `size` — `m` или `s`;
- текст: `label`, `description`, `hint`;
- `disabled`;
- `error` — `true` или текст;
- `appearance` — `primary` или `accent`;
- `platform`, `system`;
- атрибуты поля: `name`, `value`.

## Чекбокс в плашке
Крупный выбор нескольких вариантов в кликабельных плашках — [`CheckboxBlock`](../CheckboxBlock/README.md) и `CheckboxBlockGroup`.
