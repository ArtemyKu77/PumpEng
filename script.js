/* script.js (Восстановленная версия для ВСЕХ страниц, кроме главной) */

/**
 * Загружает HTML-компоненты (шапку, подвал) в соответствующие теги.
 * Эта функция универсальна и используется для динамической загрузки контента.
 * @param {string} elementSelector - CSS селектор элемента, куда будет вставлен HTML (напр., 'header', 'footer').
 * @param {string} filePath - Путь к HTML-файлу, который нужно загрузить (напр., 'header.html', 'footer.html').
 */
async function loadComponent(elementSelector, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            // Если файл не найден (ошибка 404), просто выводим предупреждение и не вставляем ничего,
            // чтобы не ломать страницу. Это позволяет страницам без header/footer работать без ошибок.
            if (response.status === 404) {
                console.warn(`[loadComponent] Файл не найден: ${filePath}. Элемент ${elementSelector} останется пустым.`);
                return; 
            }
            throw new Error(`Ошибка загрузки ${filePath}: ${response.statusText}`);
        }
        const html = await response.text();
        const element = document.querySelector(elementSelector);
        if (element) {
            element.innerHTML = html;
        }
    } catch (error) {
        console.error('Ошибка при загрузке HTML-компонента:', error);
    }
}

/**
 * Инициализирует загрузку общих компонентов (шапки и подвала) для внутренних страниц.
 * Проверяет, что текущая страница - НЕ главная, чтобы не конфликтовать с index.html.
 */
function initializeSharedComponents() {
    // Проверяем, является ли текущая страница 'index.html'
    const isHomePage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/index.html');

    // Если это не главная страница, загружаем общие компоненты.
    // Главная страница теперь содержит шапку и подвал прямо в своем HTML.
    if (!isHomePage) {
        loadComponent('header', 'header.html');
        loadComponent('footer', 'footer.html');
    }
}

/**
 * Настраивает логику для кнопки "Наверх".
 */
function setupScrollToTop() {
    const scrollTopButton = document.getElementById("scrollToTopBtn");
    if (!scrollTopButton) return; // Если кнопки нет на странице, ничего не делаем

    // Показываем/скрываем кнопку при прокрутке
    window.onscroll = () => {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            scrollTopButton.style.display = "block";
        } else {
            scrollTopButton.style.display = "none";
        }
    };

    // Прокручиваем наверх при клике
    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// === ГЛАВНЫЙ ЗАПУСК СКРИПТОВ ДЛЯ ВНУТРЕННИХ СТРАНИЦ ===
document.addEventListener('DOMContentLoaded', () => {
    initializeSharedComponents();
    setupScrollToTop();
});
