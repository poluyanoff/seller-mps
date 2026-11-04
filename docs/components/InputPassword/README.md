# InputPassword (`tui-input-password`)

Поле пароля. Наследует `Input`. Правила — «Поля с маской» в разделе «Формы и поля ввода». Десктоп — `tui-input-password`, React — inputPassword, мобилка — `tui-textfield`.

- Кнопка **показать / скрыть** справа; на десктопе с тултипом «Показать пароль» / «Скрыть пароль». Иконки `eye` / `eye-off`: 16 на десктопе, 24 на мобилке.
- На формах входа вместо неё можно **«Не помню»** (`forgotLabel`, `onForgot`), тогда крестик выключен.
- Типовые ошибки: «Напишите пароль», «Неправильный пароль», «Минимум N символов», «Максимум N символов», «Пароль и подтверждение не совпадают».
- `autoComplete` по умолчанию `current-password`; для регистрации передайте `new-password`.

```js
h(TaigaUI.InputPassword, { size: 'l', value, onChange })
h(TaigaUI.InputPassword, { size: 'l', forgotLabel: 'Не помню', onForgot: openRecovery })
```

## Пробелы
- Размер иконки показа пароля в гайде не указан: взяты 16 (десктоп) и 24 (мобилка), как у других accessories.
