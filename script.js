// script.js (Финальная, упрощенная версия)

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
                        // Форматируем финальное значение
                        if (counter.textContent.includes('%')) {
                            counter.textContent = `${goal}%`;
                        } else if (counter.textContent.includes('+')) {
                            counter.textContent = `+${goal}`;
                        } else {
                            counter.textContent = goal;
                        }
                    } else {
                        // Форматируем промежуточное значение
                        if (counter.textContent.includes('%')) {
                            counter.textContent = `${current}%`;
                        } else if (counter.textContent.includes('+')) {
                            counter.textContent = `+${current}`;
                        } else {
                            counter.textContent = current;
                        }
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
    if (slides.length === 0) return;

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
        // Запускаем автопрокрутку только если слайдов больше одного
        if (slides.length > 1) {
            autoSlideInterval = setInterval(nextSlide, 5000); // 5 секунд
        }
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
// Когда DOM-структура полностью готова, запускаем скрипты.
document.addEventListener('DOMContentLoaded', () => {
    initializePageScripts();
});
