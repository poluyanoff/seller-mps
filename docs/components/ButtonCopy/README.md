# ButtonCopy

Самостоятельная кнопка копирования. Используется внутри `CopyTooltip` и `InputCopy`; можно поставить отдельно. Только Desktop.

```js
h(TaigaUI.ButtonCopy, {
  value: 'Анна Белова', label: 'Скопировать имя'
})
h(TaigaUI.ButtonCopy, {
  value: '4070 2810 9000 0123 4567',
  copyProcessor: function (value) { return value.replace(/ /g, ''); },
  iconOnly: true, ariaLabel: 'Скопировать счет'
})
```

- После успешной записи в буфер — тост «Скопировано» (`showToast`), подпись и иконка кнопки не меняются (решение команды, 30.10.2026).
- `toast: false` — старое поведение: подпись становится «Скопировано», иконка — цветной галочкой; уход курсора или фокуса сбрасывает результат, `duration` — автоматический сброс в миллисекундах.
- У `iconOnly` подписи и подсказки по наведению нет: иконка сама говорит о действии (решение команды, 30.10.2026). Кнопка имеет доступное имя (`ariaLabel`), результат озвучивается.
- Ошибка отображается как «Повторить» с иконкой ошибки; у кнопки-иконки появляется пояснение. Повторное нажатие пробует скопировать ещё раз.
- `copyProcessor(value)` вызывается перед записью; его ошибка также вызывает `onCopyError` и не запускает запись в буфер.

Пропсы: `value`, `label` / `children`, `copyProcessor`, `size`, `appearance`, `icon`, `iconOnly`, `ariaLabel`, `disabled`, `duration`, `onClick`, `onCopy`, `onCopyError`, `className`, `style`. Значения `size` и `appearance` — как у [Button](../Button/README.md). Действие всегда имеет тип `button` и не отправляет форму.

Источник: [официальный пример ButtonCopy](https://taiga-ui.tcsbank.ru/components/copy#button-copy). В Angular это атрибут `tuiButtonCopy`; здесь — React-компонент на существующем Button.
