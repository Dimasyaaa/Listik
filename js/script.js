document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        updateThemeIcon(savedTheme);
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        
        const currentTheme = body.classList.contains('dark-theme') ? 'dark-theme' : '';
        localStorage.setItem('theme', currentTheme);
        
        updateThemeIcon(currentTheme);
    });
    
    // Update theme icon based on current theme
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark-theme') {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    }
    
    // Highlight active navigation link
    const currentPage = location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (currentPage === linkPage) {
            link.parentElement.classList.add('active');
        } else {
            link.parentElement.classList.remove('active');
        }
    });

    // Auth UI and functionality
    const authButtons = document.querySelector('.auth-buttons');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const userMenu = document.getElementById('user-menu');
    const usernameSpan = document.getElementById('username');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Check authentication and update UI
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    updateAuthUI(currentUser);
    
    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            updateAuthUI(null);
            window.location.href = 'index.html';
        });
    }
    
    // Update UI based on authentication
    function updateAuthUI(user) {
        if (user) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            if (userMenu) {
                userMenu.style.display = 'flex';
                if (usernameSpan) usernameSpan.textContent = user.name || user.email;
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (registerBtn) registerBtn.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';
        }
    }
});
// Карусель изображений
        document.addEventListener('DOMContentLoaded', function() {
            const carouselInner = document.querySelector('.carousel-inner');
            const prevBtn = document.querySelector('.carousel-control.prev');
            const nextBtn = document.querySelector('.carousel-control.next');
            const indicators = document.querySelectorAll('.indicator');
            
            let currentIndex = 0;
            const totalItems = document.querySelectorAll('.carousel-item').length;
            
            // Функция обновления карусели
            function updateCarousel() {
                carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
                
                // Обновление индикаторов
                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === currentIndex);
                });
            }
            
            // Переключение на следующий слайд
            function nextSlide() {
                currentIndex = (currentIndex + 1) % totalItems;
                updateCarousel();
            }
            
            // Переключение на предыдущий слайд
            function prevSlide() {
                currentIndex = (currentIndex - 1 + totalItems) % totalItems;
                updateCarousel();
            }
            
            // Автоматическое переключение
            let carouselInterval = setInterval(nextSlide, 5000);
            
            // Обработчики событий
            nextBtn.addEventListener('click', function() {
                clearInterval(carouselInterval);
                nextSlide();
                carouselInterval = setInterval(nextSlide, 5000);
            });
            
            prevBtn.addEventListener('click', function() {
                clearInterval(carouselInterval);
                prevSlide();
                carouselInterval = setInterval(nextSlide, 5000);
            });
            
            // Обработчики для индикаторов
            indicators.forEach(indicator => {
                indicator.addEventListener('click', function() {
                    clearInterval(carouselInterval);
                    currentIndex = parseInt(this.dataset.index);
                    updateCarousel();
                    carouselInterval = setInterval(nextSlide, 5000);
                });
            });
            
            // Остановка автопрокрутки при наведении
            const carousel = document.querySelector('.carousel');
            carousel.addEventListener('mouseenter', () => clearInterval(carouselInterval));
            carousel.addEventListener('mouseleave', () => {
                carouselInterval = setInterval(nextSlide, 5000);
            });
        });