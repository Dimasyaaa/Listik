document.addEventListener('DOMContentLoaded', function() {
            const loginForm = document.getElementById('login-form');
            
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                // Проверка введенных данных
                if (!validateEmail(email)) {
                    document.getElementById('email-error').textContent = 'Введите корректный email';
                    return;
                }
                
                if (password.length < 6) {
                    document.getElementById('password-error').textContent = 'Пароль должен быть не менее 6 символов';
                    return;
                }
                
                // Проверка существования пользователя
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    // Сохраняем текущего пользователя
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    alert('Вы успешно вошли!');
                    window.location.href = 'todo.html';
                } else {
                    document.getElementById('password-error').textContent = 'Неверный email или пароль';
                }
            });
            
            // Функция валидации email
            function validateEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            }
        });