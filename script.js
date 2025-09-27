/* script.js (Восстановленная версия для ВСЕХ страниц, кроме главной) */

/**
 * Загружает HTML-компоненты (шапку, подвал) в соответствующие теги.
 * @param {string} elementSelector - Селектор тега (напр. 'header').
 * @param {string} filePath - Путь к HTML-файлу.
 */
async function loadComponent(elementSelector, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            // Если компонент не найден (404), просто ничего не делаем.
            if (response.status === 404) return;
            throw new Error(`Ошибка загрузки: ${response.statusText}`);
        }
        const html = await response.text();
        const element = document.querySelector(elementSelector);
        if (element) {
            element.innerHTML = html;
        }
    } catch (error) {
        console.error(`Не удалось загрузить компонент из ${filePath}:`, error);
    }
}

/**
 * Инициализирует загрузку шапки и подвала.
 */
function initializeSharedComponents() {
    loadComponent('header', 'header.html');
    loadComponent('footer', 'footer.html');
}

/**
 * Настраивает логику для кнопки "Наверх".
 */
function setupScrollToTop() {
    const scrollTopButton = document.getElementById("scrollToTopBtn");
    if (!scrollTopButton) return;

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

// === ГЛАВНЫЙ ЗАПУСК ДЛЯ ВНУТРЕННИХ СТРАНИЦ ===
document.addEventListener('DOMContentLoaded', () => {
    initializeSharedComponents();
    setupScrollToTop();
});
