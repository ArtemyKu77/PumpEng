// script-v2.js (Новый, самодостаточный скрипт для главной страницы)

// === БЛОК 1: ИНТЕРАКТИВНЫЕ ФУНКЦИИ ===

// Функция для анимации счетчика
function startCounterAnimation(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = document.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const goal = +counter.getAttribute('data-goal');
                if (counter.animated) return;
                counter.animated = true;
                let current = 0;
                const increment = Math.ceil(goal / 100);
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= goal) {
                        clearInterval(timer);
                        counter.textContent = (counter.dataset.goal === "500" ? "+" : "") + goal;
                    } else {
                        counter.textContent = (counter.dataset.goal === "500" ? "+" : "") + current;
                    }
                }, 20);
            });
            observer.unobserve(entry.target);
        }
    });
}

// НОВЫЙ Слайдер для отзывов
function setupTestimonialsSlider() {
    const wrapper = document.querySelector('.slider-wrapper');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');

    if (!wrapper || !prevBtn || !nextBtn) return;

    const slides = document.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let autoSlideInterval;

    const goToSlide = (index) => {
        wrapper.style.transform = `translateX(-${index * 100}%)`;
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % slides.length;
        goToSlide(currentIndex);
    };

    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(currentIndex);
    };

    const startAutoSlide = () => {
        autoSlideInterval = setInterval(nextSlide, 5000); // 5 секунд
    };

    const stopAutoSlide = () => {
        clearInterval(autoSlideInterval);
    };
    
    const resetAutoSlide = () => {
        stopAutoSlide();
        startAutoSlide();
    };

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    startAutoSlide();
}

// ЛОГИКА СМЕНЫ ТЕМЫ (СВЕТЛАЯ/ТЕМНАЯ)
function setupThemeSwitcher() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (!themeToggleBtn) return;

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme('light'); // Всегда светлая по умолчанию
    }

    themeToggleBtn.addEventListener('click', () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const newTheme = isDarkMode ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// === БЛОК 2: ИНИЦИАЛИЗАЦИЯ ===
function initializeMainPageScripts() {
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(startCounterAnimation, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }
    setupTestimonialsSlider();
    setupThemeSwitcher();
}

// Запускаем все после загрузки контента
initializeMainPageScripts();
