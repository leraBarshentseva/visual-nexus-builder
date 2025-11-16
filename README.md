### 🌐 Language Switcher

[🇬🇧/🇺🇸 Read in English](#english-version)  
[🇷🇺 Читать на русском](#russian-version)

---

## 🇬🇧 English Version <a name="english-version"></a>

### What is it?

**Visual Nexus Builder** is a tool for designers and developers. Upload an image, and it automatically extracts 10 primary colors from it.

You can lock the colors you like and generate variations based on color theory (analogous, monochrome, complementary, and other modes). Then, drag the colors into the sandbox to test them on UI elements (headings, buttons, text) and instantly see the WCAG contrast calculation.

The project is built on vanilla JavaScript, SCSS, and standard browser APIs. The compressed project size is about 50 KB. It supports local state storage, so sessions are not lost on page reload.

### ✨ Key Features

*   🎨 **Palette Generation**: Drag-and-drop image upload; extracts 10 colors using `ColorThief`.
*   🔐 **Palette Management**: Lock colors, regenerate unlocked ones via `TheColorAPI` (modes: analogic, monochrome, complement, triad, quad).
*   🖌️ **Sandbox**: Drag colors onto UI elements with automatic style updates. WCAG AA/AAA contrast calculation is displayed with badges.
*   ⚫️ **Utility Colors**: Built-in neutrals (black, white, grays) for quick testing.
*   🔗 **Export & Sharing**: CSS variables (copy/download file). The URL encodes the palette, locks, and sandbox state for easy sharing.
*   📱 **Mobile Support**: "Brush" mode for touch devices.
*   💾 **Storage**: Uses `LocalStorage` for state persistence and `IndexedDB` for image previews.

### 🎬 Demo

**[Try it Live!](https://vnb-app.netlify.app/)**

![A GIF showcasing the application's functionality](https://github.com/leraBarshentseva/visual-nexus-builder/blob/main/public/gif/PC.gif)

| **Mobile Demo (Phone)** | *See the brush mode in action on mobile!* <br><br>|
<img src="https://github.com/leraBarshentseva/visual-nexus-builder/blob/main/public/gif/phone.gif" width="300" alt="A GIF showcasing the application's functionality on mobile">

### 🛠️ Tech Stack

*   **JavaScript**: Vanilla JS (ES modules, async/await).
*   **Styles**: SCSS (compiled with Vite), semantic classes.
*   **Dependencies**: `ColorThief`, `SortableJS`, `idb`.
*   **Build**: Vite for development and production.

### 📊 Comparison with Analogs

| Tool | From Image | Sandbox with Drag & Drop | Real-Time WCAG Contrast | Regeneration Modes | CSS Export | Mobile Support | Size |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Visual Nexus** | ✅ | ✅ (on UI elements) | ✅ (with badges) | ✅ (5+ modes) | ✅ (variables + file) | ✅ (brush mode) | ~50 KB |
| [Coolors.co](https://coolors.co/) | ✅ | ❌ | ✅ (static) | ✅ | ✅ | ❌ | Larger |
| [Adobe Color](https://color.adobe.com/) | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | Heavy |
| [Color Safe](https://colorsafe.co/) | ❌ | ❌ | ✅ (basic) | ❌ | ✅ | ❌ | Lightweight |

### ⚙️ Installation & Setup

Want to run the project locally? It's simple!

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/leraBarshentseva/visual-nexus-builder.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd visual-nexus-builder
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    Then, open your browser and go to the URL provided by Vite (usually `http://localhost:5173`).

### 🙏 Acknowledgments

*   [Lokesh Dhakar](https://lokeshdhakar.com/) for the excellent `ColorThief` library.
*   The [TheColorAPI](https://www.thecolorapi.com/) team for their free and convenient service.
*   The GitHub community for inspiration and open-source projects.

---
<br>

## 🇷🇺 Русская версия <a name="russian-version"></a>

### 🚀 Что это?

**Visual Nexus Builder** — это инструмент для дизайнеров и разработчиков. Загрузите изображение, и он автоматически извлечет из него 10 основных цветов.

Вы можете закрепить понравившиеся цвета, выбрать один за основу и сгенерировать по нему вариации на основе теории цвета. Затем перетащите цвета в «песочницу», чтобы протестировать их на элементах интерфейса (заголовках, кнопках, тексте) и мгновенно увидеть расчет контрастности по стандартам WCAG.

Проект построен на чистом JavaScript, SCSS и стандартных браузерных API. Размер проекта — около 50 КБ в сжатом виде. Поддерживается сохранение состояния в локальном хранилище, поэтому сессии не теряются при перезагрузке страницы.

### ✨ Ключевые фичи

*   🎨 **Генерация палитры**: Загрузка изображения перетаскиванием; извлекает 10 цветов с помощью `ColorThief`.
*   🔐 **Управление палитрой**: Закрепляйте цвета, перегенерируйте остальные через `TheColorAPI` (режимы: аналоговый, монохромный, комплементарный, триада, квад).
*   🖌️ **Песочница**: Перетаскивайте цвета на элементы интерфейса с автоматическим обновлением стилей. Расчет контрастности WCAG AA/AAA отображается с помощью значков (badges).
*   ⚫️ **Утилитарные цвета**: Встроенные нейтральные цвета (черный, белый, серый) для быстрого тестирования.
*   🔗 **Экспорт и шеринг**: CSS-переменные (копирование/скачивание файла). URL кодирует палитру, закрепленные цвета и состояние песочницы для удобного обмена.
*   📱 **Поддержка мобильных устройств**: Режим «Кисти» (Brush) для сенсорных экранов.
*   💾 **Хранилище**: Использование `LocalStorage` для сохранения состояний и `IndexedDB` для превью изображений.

### 🎬 Демонстрация

**[Попробовать вживую!](https://vnb-app.netlify.app/)**

![Gif, демонстрирующее работу приложения](https://github.com/leraBarshentseva/visual-nexus-builder/blob/main/public/gif/PC.gif)

| **Демонстрация работы VNB на телефоне** | *Посмотрите режим работы кисти в действии на мобильном устройстве!* <br><br>|
<img src="https://github.com/leraBarshentseva/visual-nexus-builder/blob/main/public/gif/phone.gif" width="300" alt="A GIF showcasing the application's functionality on mobile">
### 🛠️ Стек технологий

*   **JavaScript**: Нативный JS (ES modules, async/await).
*   **Стили**: SCSS (сборка через Vite), семантические классы.
*   **Зависимости**: `ColorThief`, `SortableJS`, `idb`.
*   **Сборка**: Vite для разработки и продакшена.

### 📊 Сравнение с аналогами

| Инструмент | Из изображения | Песочница с Drag & Drop | Контраст WCAG в реальном времени | Режимы регенерации | Экспорт в CSS | Поддержка моб. устройств | Размер |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Visual Nexus** | ✅ | ✅ (на элементах UI) | ✅ (со значками) | ✅ (5+ режимов) | ✅ (переменные + файл) | ✅ (режим «кисти») | ~50 КБ |
| [Coolors.co](https://coolors.co/) | ✅ | ❌ | ✅ (статично) | ✅ | ✅ | ❌ | Больше |
| [Adobe Color](https://color.adobe.com/) | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | Тяжелый |
| [Color Safe](https://colorsafe.co/) | ❌ | ❌ | ✅ (базовый) | ❌ | ✅ | ❌ | Легкий |

### ⚙️ Установка и запуск

Хотите запустить проект локально? Нет ничего проще!

1.  **Клонируйте репозиторий:**
    ```bash
    git clone https://github.com/leraBarshentseva/visual-nexus-builder.git
    ```

2.  **Перейдите в директорию проекта:**
    ```bash
    cd visual-nexus-builder
    ```

3.  **Установите зависимости:**
    ```bash
    npm install
    ```

4.  **Запустите сервер для разработки:**
    ```bash
    npm run dev
    ```
    После этого откройте браузер и перейдите по адресу, который Vite укажет в консоли (обычно `http://localhost:5173`).

### 🙏 Благодарности

*   [Lokesh Dhakar](https://lokeshdhakar.com/) за прекрасную библиотеку `ColorThief`.
*   Команде [TheColorAPI](https://www.thecolorapi.com/) за их бесплатный и удобный сервис.
*   Сообществу GitHub за вдохновение и открытые проекты.
