# Проект: Аверс-Про — сайт 1С-консалтинга

Корпоративный сайт компании «Аверс-Про» (партнёр 1С с 1999 г.). Стек: чистый HTML + CSS + Vanilla JS. Никакого сборщика, фреймворка или npm.

---

## Страницы (HTML)

| Файл | Назначение |
|------|-----------|
| `index.html` | Главная: герой, услуги, кейсы, команда, отзывы |
| `services-its.html` | Услуга: 1С:ИТС (обновления и сервисы) |
| `services-zup.html` | Услуга: 1С:ЗУП (зарплата и кадры) |
| `services-buh.html` | Услуга: 1С:Бухгалтерия |
| `services-gkh-nko.html` | Услуга: 1С для ЖКХ / НКО |
| `services-other.html` | Услуга: прочие решения |
| `projects.html` | Кейсы/портфолио |
| `blog.html` | Блог: статьи + байки (фильтры по категориям) |
| `contacts.html` | Контакты + форма + карта |
| `privacy-policy.html` | Политика конфиденциальности |

Шапка и футер **одинаковы на всех страницах** — при изменении менять везде.

---

## CSS (style.css — один файл)

### CSS-переменные
```
Цвета:    --blue-900, --blue-700, --blue-50 / --red-600, --red-hover / --gray-900…--gray-50
Размеры:  --container:1200px / --header-h:76px / --radius:14px / --gap:24px
Тени:     --shadow-sm / --shadow-md / --shadow-lg / --shadow-card
Анимация: --transition: 0.3s cubic-bezier(...)
Шрифт:    --font-display / --font-body → Nunito Sans
```

### Ключевые классы
- **Кнопки:** `.btn` + модификаторы `.btn-red .btn-blue .btn-outline .btn-white .btn-sm .btn-lg .btn-full`
- **Секции:** `.section` / `.section-alt` (серый фон) / `.section-blue`
- **Карточки блога:** `.blog-card .blog-card-classic` + `.blog-card-bayky` (байки, янтарный тег)
- **Фильтры:** `.blog-filter[data-filter]` — all / zup / buh / tips / video / bayky
- **Аккордеоны:** `.accordion-trigger` / `.accordion-content`
- **Формы:** `.form-group .form-error .form-status`
- **Анимации:** `.reveal` → `.visible` через IntersectionObserver (автоматически на все карточки)

---

## JS (script.js — один файл)

Всё написано в одном IIFE. Уже реализовано — **не дублировать**:

- Бургер-меню + блокировка скролла body
- Десктоп-дропдаун + мобильные подменю с анимацией высоты
- Аккордеоны (взаимоисключение внутри `.cases-list`)
- **Фильтрация блога:** `data-filter` на кнопках → `data-category` на карточках → класс `.hidden`
- Валидация форм: имя, телефон, email, select — с inline-ошибками
- Маска телефона: формат `+7 (___) ___-__-__`, обработка Backspace/Delete/Paste
- Scroll Reveal: IntersectionObserver, stagger 70ms на siblings
- Счётчик: анимация числа за 1.8s, easing cubic-bezier
- Активный пункт меню: по `location.pathname`

---

## Изображения

```
images/
  brand/      → logo.webp
  blog/       → фото для статей (.webp) + байка1.png
  company/    → фото команды, сертификаты, офис
  home/       → герой-изображения главной
  services/   → баннеры страниц услуг
  projects/   → фото для кейсов
  icons/      → icon-buh/gkh/nko/zup.svg
```

---

## Правила — что НЕ делать

- **Не создавать новые CSS/JS файлы** — всё добавляется в `style.css` / `script.js`
- **Не использовать фреймворки/библиотеки** — чистый JS и CSS
- **Не трогать структуру шапки/футера** без явной просьбы
- **Не менять существующие переменные** CSS без явной просьбы
- Новые компоненты — по существующему паттерну (карточка, секция, кнопка)

---

## Код-стиль

- Читаемость важнее краткости (см. Human Code Skill ниже)
- Классы: kebab-case, описательные имена
- Анимации: через CSS-переменную `--transition` или IntersectionObserver (уже в script.js)

---

@.claude/skills/human-code.md
@.claude/skills/git-commit.md
@.claude/skills/security.md
@.claude/skills/performance.md
@.claude/skills/code-review.md
