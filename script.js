// script.js

// === БЛОК 1: ЗАГРУЗКА КОМПОНЕНТОВ ДЛЯ ВНУТРЕННИХ СТРАНИЦ ===
async function loadComponent(elementSelector, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            if (response.status === 404) return;
            throw new Error(`Could not fetch ${filePath}: ${response.statusText}`);
        }
        const html = await response.text();
        const element = document.querySelector(elementSelector);
        if (element) element.innerHTML = html;
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

function initializeComponents() {
    // Не загружаем компоненты, если мы на новой главной странице
    if (!document.body.classList.contains('new-design')) {
        loadComponent('header', 'header.html');
        loadComponent('footer', 'footer.html');
    }
}

// === БЛОК 2: ЛОГИКА КНОПКИ "НАВЕРХ" ===
function setupScrollToTop() {
    const scrollTopButton = document.getElementById("scrollToTopBtn");
    if (!scrollTopButton) return;

    window.onscroll = () => {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            scrollTopButton.style.display = "block";
        } else {
            scrollTopButton.style.display = "none";
        }
    };
    scrollTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// === БЛОК 3: НОВЫЕ ИНТЕРАКТИВНЫЕ ФУНКЦИИ ДЛЯ ГЛАВНОЙ СТРАНИЦЫ ===

// Функция для анимации счетчика
function startCounterAnimation(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = document.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const goal = +counter.getAttribute('data-goal');
                counter.textContent = '0';
                let current = 0;
                const increment = Math.ceil(goal / 100);

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= goal) {
                        clearInterval(timer);
                        counter.textContent = goal;
                    } else {
                        counter.textContent = current;
                    }
                }, 20);
            });
            observer.unobserve(entry.target);
        }
    });
}

// НОВЫЙ СЛАЙДЕР ДЛЯ ОТЗЫВОВ
function setupTestimonialsSlider() {
    const wrapper = document.querySelector('.slider-wrapper');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');

    if (!wrapper || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    const slides = document.querySelectorAll('.testimonial-card');
    const slideWidth = slides[0].offsetWidth;

    nextBtn.addEventListener('click', () => {
        if (currentIndex < slides.length - 3) { // Показываем по 3 слайда
            currentIndex++;
            wrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            wrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        }
    });
}

// === БЛОК 4: ИНИЦИАЛИЗАЦИЯ ВСЕХ ФУНКЦИЙ ===
function initializeMainPageScripts() {
    // Настраиваем IntersectionObserver для счетчика
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(startCounterAnimation, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }
    // Запускаем слайдер
    setupTestimonialsSlider();
}

// Главная логика загрузки
document.addEventListener('DOMContentLoaded', () => {
    initializeComponents();
    setupScrollToTop();

    // Следим за загрузкой контента в #main-content
    const mainContentContainer = document.getElementById('main-content');
    if (mainContentContainer) {
        const contentObserver = new MutationObserver((mutationsList, observer) => {
            if (mainContentContainer.children.length > 0) {
                initializeMainPageScripts();
                observer.disconnect();
            }
        });
        contentObserver.observe(mainContentContainer, { childList: true });
    }
});
