# CheckboxBlock · CheckboxBlockGroup (`tui-checkbox-block`)

Чекбокс в кликабельной плашке, гайд tui-radio-block / tui-checkbox-block v1.2.0.

Построение, размеры, вид, состояния, мобилка и группировка — те же, что у [`RadioBlock`](../RadioBlock/README.md). Ниже только отличия.

**Когда:** выбор нескольких вариантов из небольшого набора, когда их нужно показать крупно. Поведение самого чекбокса — как в [`Checkbox`](../Checkbox/README.md).

## Отличия от RadioBlock
- **Контрол** — чекбокс:
  - L — 24 с радиусом 8;
  - M и S — 16 с радиусом 4 (у M — в контейнере 20).
- **Выбор** — каждый блок независимо.
- **Indeterminate** — `checked: 'indeterminate'`, как у `Checkbox`. В гайде блока не показан.
- **Группа** (`tui-checkbox-block [group]`) — значение массивом.

## API
```js
h(TaigaUI.CheckboxBlock, { label: 'Страхование жизни', description: 'На случай ухода из жизни и инвалидности', checked: life, onChange: setLife })

h(TaigaUI.CheckboxBlockGroup, { label: 'Мониторинг', orientation: 'vertical', size: 'm', items: ['Бизнес-мониторинг', 'Инфраструктурный мониторинг', 'SRE/DevOps Tool', 'Другое'], value: list, onChange: setList })
```
- Пропсы `CheckboxBlock` — как у `RadioBlock`; `onChange(checked)`.
- Пропсы `CheckboxBlockGroup` — как у `RadioBlockGroup`; `value` и `defaultValue` — массивы, `onChange(values, item)`.

## Пробелы
Общие с `RadioBlock` — см. его раздел «Пробелы».
