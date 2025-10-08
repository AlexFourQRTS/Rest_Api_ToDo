# 🏪 Redux Store

## Быстрый старт

### Использование в компоненте

```javascript
import useLanguage from '../hooks/useLanguage';

function MyComponent() {
  const { currentLanguage, setLanguage, supportedLanguages } = useLanguage();
  
  return (
    <select 
      value={currentLanguage} 
      onChange={(e) => setLanguage(e.target.value)}
    >
      {supportedLanguages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
```

## Структура

- `store.js` - главный Redux store
- `slices/languageSlice.js` - управление языком интерфейса

## Хуки

### useLanguage()
Для работы с выбором языка:
```javascript
const { currentLanguage, setLanguage, supportedLanguages } = useLanguage();
```

### useLocalization()
Для переводов (теперь с Redux):
```javascript
const { t, currentLanguage, setLanguage } = useLocalization();
```

## Redux DevTools

Установите расширение для отладки: [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools)

## Документация

См. `/REDUX_LANGUAGE.md` для полной документации.

