# AimMenu — Умное выпадающее меню с отслеживанием траектории мыши  

**Легковесный JavaScript-скрипт** для создания адаптивных меню без jQuery.  
Анализирует движение курсора, чтобы предотвратить случайные открытия подменю.  

[![Demo](https://img.shields.io/badge/🟣-Live_Demo-8A2BE2)](http://ivankrivenko.github.io/aimmenu/example.html) 
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)  

![AimMenu Preview](preview.gif) *(Пример работы: меню реагирует на направление мыши)*  

## 🔥 Особенности  
- **Траектория мыши** — учитывает направление движения для точного открытия подменю.  
- **Задержка активации** — предотвращает случайные срабатывания.  
- **Адаптивность** — работает с любыми структурами HTML/CSS.  
- **Без зависимостей** — не требует jQuery или других библиотек.  
- **Гибкие настройки** — направление подменю, тайминги, обработчики событий.  

## 🛠 Установка  
1. Подключите стили и скрипт:  
```html
<link rel="stylesheet" href="aimmenu.css">
<script src="aimmenu.js"></script>
```

2. HTML-структура:  
```html
<ul class="aimmenu">
  <li class="has-sub">
    <a href="#">Меню 1</a>
    <div class="is-sub">
      <h3>Заголовок</h3>
      <div>Контент подменю...</div>
    </div>
  </li>
</ul>
```

3. Инициализация:  
```javascript
aimmenu('.aimmenu', {
  submenuDirection: 'right', // или 'left'/'above'/'below'
  tolerance: 75,            // чувствительность к движению мыши (пиксели)
  delay: 300                // задержка активации (мс)
});
```

## ⚙️ Настройки  
| Параметр           | По умолчанию | Описание                          |
|--------------------|--------------|-----------------------------------|
| `submenuDirection` | `'right'`    | Направление подменю (`left`/`above`/`below`) |
| `tolerance`        | `75`         | Зона чувствительности к движению мыши |
| `delay`            | `300`        | Задержка перед открытием (мс)     |
| `activate`         | `null`       | Кастомная функция при открытии    |
| `deactivate`       | `null`       | Кастомная функция при закрытии    |

## 📜 Примеры  
**Кастомизация событий:**  
```javascript
aimmenu('.aimmenu', {
  activate: (row) => {
    row.classList.add('glow-effect');
  },
  deactivate: (row) => {
    row.classList.remove('glow-effect');
  }
});
```

**Меню с подпунктами слева:**  
```javascript
aimmenu('.vertical-menu', {
  submenuDirection: 'left'
});
```

## 📌 FAQ  
**Q: Как добавить меню в несколько элементов на странице?**  
```javascript
document.querySelectorAll('.menu-class').forEach(menu => {
  aimmenu(menu);
});
```

**Q: Можно ли использовать с React/Vue?**  
Да! Инициализируйте после монтирования компонента (например, в `useEffect` или `mounted`).


