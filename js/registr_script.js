document.addEventListener('DOMContentLoaded', function() {
            const registerForm = document.getElementById('register-form');
            
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.getElementById('reg-name').value;
                const email = document.getElementById('reg-email').value;
                const password = document.getElementById('reg-password').value;
                const confirmPassword = document.getElementById('reg-confirm').value;
                
                // Сбрасываем ошибки
                document.getElementById('reg-email-error').textContent = '';
                document.getElementById('reg-password-error').textContent = '';
                document.getElementById('reg-confirm-error').textContent = '';
                
                // Проверка данных
                if (!validateEmail(email)) {
                    document.getElementById('reg-email-error').textContent = 'Введите корректный email';
                    return;
                }
                
                if (password.length < 6) {
                    document.getElementById('reg-password-error').textContent = 'Пароль должен быть не менее 6 символов';
                    return;
                }
                
                if (password !== confirmPassword) {
                    document.getElementById('reg-confirm-error').textContent = 'Пароли не совпадают';
                    return;
                }
                
                // Проверка существующего email
                const users = JSON.parse(localStorage.getItem('users')) || [];
                if (users.some(u => u.email === email)) {
                    document.getElementById('reg-email-error').textContent = 'Этот email уже зарегистрирован';
                    return;
                }
                
                // Создаем нового пользователя
                const newUser = {
                    id: Date.now(),
                    name: name,
                    email: email,
                    password: password,
                    createdAt: new Date().toISOString()
                };
                
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                
                // Автоматический вход
                localStorage.setItem('currentUser', JSON.stringify(newUser));
                alert('Регистрация прошла успешно!');
                window.location.href = 'todo.html';
            });
            
            // Функция валидации email
            function validateEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            }
        });