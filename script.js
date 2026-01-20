// Слайдер
class Slider {
    constructor(container) {
        this.container = container;
        this.slides = container.querySelectorAll('.slide');
        this.dots = container.querySelectorAll('.slider__dot');
        this.currentSlide = 0;
        this.interval = null;
        
        this.init();
    }
    
    init() {
        // Создаем точки навигации
        this.createDots();
        
        // Запускаем автопрокрутку
        this.startAutoSlide();
        
        // Добавляем обработчики событий
        this.addEventListeners();
    }
    
    createDots() {
        const dotsContainer = this.container.querySelector('.slider__controls');
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'slider__dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        this.dots = dotsContainer.querySelectorAll('.slider__dot');
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlider();
    }
    
    updateSlider() {
        const offset = -this.currentSlide * 100;
        this.container.querySelector('.slider__container').style.transform = `translateX(${offset}%)`;
        
        // Обновляем активную точку
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    startAutoSlide() {
        this.interval = setInterval(() => this.nextSlide(), 5000);
    }
    
    stopAutoSlide() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    
    addEventListeners() {
        // Пауза автопрокрутки при наведении
        this.container.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.container.addEventListener('mouseleave', () => this.startAutoSlide());
    }
}

// Тема
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.init();
    }
    
    init() {
        // Проверяем сохраненную тему
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme);
        
        // Добавляем обработчик переключения
        if (this.themeToggle) {
            this.themeToggle.addEventListener('change', (e) => {
                const theme = e.target.checked ? 'light' : 'dark';
                this.setTheme(theme);
                localStorage.setItem('theme', theme);
            });
            
            // Устанавливаем начальное состояние переключателя
            this.themeToggle.checked = savedTheme === 'light';
        }
    }
    
    setTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
    }
}

// Бургер-меню
class BurgerMenu {
    constructor(burger, menu) {
        this.burger = burger;
        this.menu = menu;
        this.init();
    }
    
    init() {
        this.burger.addEventListener('click', () => {
            this.toggleMenu();
        });
        
        // Закрытие меню при клике на ссылку
        this.menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
    }
    
    toggleMenu() {
        this.burger.classList.toggle('active');
        this.menu.classList.toggle('active');
        document.body.style.overflow = this.menu.classList.contains('active') ? 'hidden' : '';
    }
    
    closeMenu() {
        this.burger.classList.remove('active');
        this.menu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация слайдера
    const sliderContainer = document.querySelector('.slider');
    if (sliderContainer) {
        new Slider(sliderContainer);
    }
    
    // Инициализация темы
    new ThemeManager();
    
    // Инициализация бургер-меню
    const burger = document.querySelector('.burger');
    const navList = document.querySelector('.nav__list');
    if (burger && navList) {
        new BurgerMenu(burger, navList);
    }
    
    // Обработка форм
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Валидация
            const inputs = form.querySelectorAll('input[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'var(--error-color)';
                } else {
                    input.style.borderColor = '';
                }
                
                // Валидация email
                if (input.type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        isValid = false;
                        input.style.borderColor = 'var(--error-color)';
                    }
                }
                
                // Валидация пароля
                if (input.type === 'password') {
                    if (input.value.length < 6) {
                        isValid = false;
                        input.style.borderColor = 'var(--error-color)';
                    }
                }
            });
            
            if (isValid) {
                // В реальном приложении здесь был бы AJAX-запрос
                alert('Форма успешно отправлена!');
                form.reset();
            } else {
                alert('Пожалуйста, заполните все обязательные поля корректно.');
            }
        });
    });
    
    // Фильтр в каталоге
    const filterToggle = document.querySelector('.filter-toggle');
    const filters = document.querySelector('.filters');
    
    if (filterToggle && filters) {
        filterToggle.addEventListener('click', () => {
            filters.classList.toggle('active');
        });
    }
    
    // Рейтинг звездочками
    const ratingStars = document.querySelectorAll('.rating');
    ratingStars.forEach(rating => {
        const value = parseInt(rating.dataset.value) || 5;
        let stars = '';
        
        for (let i = 1; i <= 5; i++) {
            stars += i <= value ? '★' : '☆';
        }
        
        rating.textContent = stars;
    });
    
    // Анимации при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами для анимации
    document.querySelectorAll('.feature-card, .game-card').forEach(el => {
        observer.observe(el);
    });
});

// Утилиты
const Utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(price);
    }
};