// script.js (Новая версия с нуля)

/**
 * Функция для загрузки HTML-контента в указанный контейнер.
 * @param {string} containerId - ID элемента, куда будет загружен HTML.
 * @param {string} filePath - Путь к HTML-файлу.
 */
async function loadComponent(containerId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.statusText}`);
        }
        const html = await response.text();
        const element = document.getElementById(containerId);
        
        if (element) {
            element.innerHTML = html;
            // После успешной загрузки HTML, запускаем все скрипты, которые с ним работают
            initializePageScripts();
        }
    } catch (error) {
        console.error(`Не удалось загрузить компонент из ${filePath}:`, error);
    }
}

/**
 * Инициализирует все интерактивные элементы на странице.
 */
function initializePageScripts() {
    setupCounters();
    setupTestimonialsSlider();
}

/**
 * Настраивает анимацию счетчиков при их появлении на экране.
 */
function setupCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const goal = parseInt(counter.dataset.goal, 10);
                
                if (counter.animated) return; // Предотвращаем повторную анимацию
                counter.animated = true;
                
                let current = 0;
                const increment = Math.ceil(goal / 100);
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= goal) {
                        clearInterval(timer);
                        counter.textContent = counter.textContent.includes('%') ? `${goal}%` : (counter.textContent.includes('+') ? `+${goal}`: goal);
                    } else {
                         counter.textContent = counter.textContent.includes('%') ? `${current}%` : (counter.textContent.includes('+') ? `+${current}`: current);
                    }
                }, 20);
                
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.7 });

    counters.forEach(counter => observer.observe(counter));
}

/**
 * Настраивает слайдер отзывов: один отзыв, автопрокрутка, стрелки.
 */
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


// === ГЛАВНЫЙ ЗАПУСК ===
// Когда DOM-структура готова, начинаем загрузку основного контента.
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('main-content', 'main.html');
});
