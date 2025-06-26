document.addEventListener('DOMContentLoaded', function() {
    // Проверка авторизации
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Пожалуйста, войдите в систему');
        window.location.href = 'login.html';
        return;
    }

    // Элементы DOM
    const taskInput = document.getElementById('task-input');
    const deadlineInput = document.getElementById('task-deadline');
    const dayInput = document.getElementById('task-day');
    const addTaskBtn = document.getElementById('add-task-btn');
    const tasksContainer = document.getElementById('tasks-container');
    const emptyState = document.getElementById('empty-state');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const totalTasksElement = document.getElementById('total-tasks');
    const completedTasksElement = document.getElementById('completed-tasks');
    const overdueTasksElement = document.getElementById('overdue-tasks');
    const dayElements = document.querySelectorAll('.day');
    
    // Загрузка задач для текущего пользователя
    let tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser.id}`)) || [];
    let currentFilter = 'all';
    
    // Обновление статистики
    function updateStats() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const overdueTasks = tasks.filter(task => !task.completed && isOverdue(task.deadline)).length;
        
        totalTasksElement.textContent = totalTasks;
        completedTasksElement.textContent = completedTasks;
        overdueTasksElement.textContent = overdueTasks;
        
        // Обновление счетчиков дней
        dayElements.forEach(dayElement => {
            const day = dayElement.dataset.day;
            const dayTasks = tasks.filter(task => 
                task.day === day && !task.completed && !isOverdue(task.deadline)
            ).length;
            
            // Удаляем старый счетчик
            const oldCounter = dayElement.querySelector('.task-count');
            if (oldCounter) oldCounter.remove();
            
            if (dayTasks > 0) {
                const counter = document.createElement('div');
                counter.className = 'task-count';
                counter.textContent = dayTasks;
                dayElement.appendChild(counter);
            }
        });
    }
    
    // Проверка просроченной задачи
    function isOverdue(deadline) {
        if (!deadline) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const deadlineDate = new Date(deadline);
        return deadlineDate < today;
    }
    
    // Форматирование даты
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    // Получение названия дня недели
    function getDayName(dayValue) {
        const days = {
            '0': 'Воскресенье',
            '1': 'Понедельник',
            '2': 'Вторник',
            '3': 'Среда',
            '4': 'Четверг',
            '5': 'Пятница',
            '6': 'Суббота'
        };
        return days[dayValue] || '';
    }
    
    // Сохранение задач в localStorage
    function saveTasks() {
        localStorage.setItem(`tasks_${currentUser.id}`, JSON.stringify(tasks));
        updateStats();
    }
    
    // Создание элемента задачи
    function createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.className = `task ${task.completed ? 'completed' : ''}`;
        taskElement.dataset.id = task.id;
        taskElement.dataset.day = task.day || '';
        
        const overdue = !task.completed && isOverdue(task.deadline);
        
        const dayName = task.day ? getDayName(task.day) : '';
        
        taskElement.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <div class="task-info">
                <div class="task-text">${task.text}</div>
                ${task.day ? `<div class="day-label">${dayName}</div>` : ''}
                ${task.deadline ? `
                    <div class="deadline ${overdue ? 'overdue' : ''}">
                        <i class="far fa-calendar-alt"></i>
                        ${formatDate(task.deadline)} 
                        ${overdue ? '<i class="fas fa-exclamation-triangle"></i> Просрочено!' : ''}
                    </div>
                ` : ''}
            </div>
            <div class="task-actions">
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        // Обработчики событий
        const checkbox = taskElement.querySelector('.task-checkbox');
        const editBtn = taskElement.querySelector('.edit-btn');
        const deleteBtn = taskElement.querySelector('.delete-btn');
        const taskText = taskElement.querySelector('.task-text');
        
        checkbox.addEventListener('change', function() {
            task.completed = this.checked;
            taskElement.classList.toggle('completed', task.completed);
            saveTasks();
            filterTasks(currentFilter);
        });
        
        deleteBtn.addEventListener('click', function() {
            taskElement.classList.add('deleting');
            setTimeout(() => {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
                renderTasks();
            }, 300);
        });
        
        // Редактирование задачи
        editBtn.addEventListener('click', function() {
            const editContainer = document.createElement('div');
            editContainer.className = 'edit-container';
            
            const textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.className = 'edit-input';
            textInput.value = task.text;
            textInput.placeholder = 'Текст задачи';
            
            const dateInput = document.createElement('input');
            dateInput.type = 'date';
            dateInput.className = 'edit-input';
            dateInput.value = task.deadline || '';
            
            const daySelect = document.createElement('select');
            daySelect.className = 'edit-input';
            daySelect.innerHTML = `
                <option value="">Без дня</option>
                <option value="1" ${task.day === '1' ? 'selected' : ''}>Понедельник</option>
                <option value="2" ${task.day === '2' ? 'selected' : ''}>Вторник</option>
                <option value="3" ${task.day === '3' ? 'selected' : ''}>Среда</option>
                <option value="4" ${task.day === '4' ? 'selected' : ''}>Четверг</option>
                <option value="5" ${task.day === '5' ? 'selected' : ''}>Пятница</option>
                <option value="6" ${task.day === '6' ? 'selected' : ''}>Суббота</option>
                <option value="0" ${task.day === '0' ? 'selected' : ''}>Воскресенье</option>
            `;
            
            const saveBtn = document.createElement('button');
            saveBtn.className = 'save-edit-btn';
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Сохранить';
            
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'cancel-edit-btn';
            cancelBtn.innerHTML = '<i class="fas fa-times"></i> Отмена';
            
            editContainer.appendChild(textInput);
            editContainer.appendChild(dateInput);
            editContainer.appendChild(daySelect);
            editContainer.appendChild(saveBtn);
            editContainer.appendChild(cancelBtn);
            
            taskElement.innerHTML = '';
            taskElement.appendChild(editContainer);
            textInput.focus();
            
            // Сохранение изменений
            saveBtn.addEventListener('click', function() {
                const newText = textInput.value.trim();
                if (newText) {
                    task.text = newText;
                    task.deadline = dateInput.value;
                    task.day = daySelect.value;
                    saveTasks();
                }
                renderTasks();
            });
            
            // Отмена редактирования
            cancelBtn.addEventListener('click', function() {
                renderTasks();
            });
        });
        
        return taskElement;
    }
    
    // Фильтрация задач
    function filterTasks(filter) {
        currentFilter = filter;
        let filteredTasks = tasks;
        
        if (filter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (filter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        } else if (filter === 'overdue') {
            filteredTasks = tasks.filter(task => !task.completed && isOverdue(task.deadline));
        }
        
        // Обновление активной кнопки фильтра
        filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        return filteredTasks;
    }
    
    // Фильтрация задач по дням
    function filterTasksByDay(day) {
        dayElements.forEach(d => d.classList.remove('active'));
        const dayElement = document.querySelector(`.day[data-day="${day}"]`);
        if (dayElement) dayElement.classList.add('active');
        
        return tasks.filter(task => task.day === day);
    }
    
    // Отрисовка задач
    function renderTasks() {
        tasksContainer.innerHTML = '';
        
        const filteredTasks = filterTasks(currentFilter);
        
        if (filteredTasks.length === 0) {
            tasksContainer.appendChild(emptyState);
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            filteredTasks.forEach(task => {
                const taskElement = createTaskElement(task);
                tasksContainer.appendChild(taskElement);
            });
        }
        
        updateStats();
    }
    
    // Добавление новой задачи
    function addTask() {
        const text = taskInput.value.trim();
        const deadline = deadlineInput.value;
        const day = dayInput.value;
        
        if (text) {
            const newTask = {
                id: Date.now(),
                text: text,
                completed: false,
                createdAt: new Date().toISOString(),
                deadline: deadline,
                day: day
            };
            
            tasks.unshift(newTask);
            saveTasks();
            renderTasks();
            taskInput.value = '';
            deadlineInput.value = '';
            dayInput.value = '';
            taskInput.focus();
        }
    }
    
    // Обработчики событий
    addTaskBtn.addEventListener('click', addTask);
    
    taskInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Обработчики фильтров
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            currentFilter = this.dataset.filter;
            renderTasks();
        });
    });
    
    // Обработчики дней недели
    dayElements.forEach(day => {
        day.addEventListener('click', function() {
            const dayValue = this.dataset.day;
            tasksContainer.innerHTML = '';
            
            const dayTasks = filterTasksByDay(dayValue);
            
            if (dayTasks.length === 0) {
                tasksContainer.appendChild(emptyState);
                emptyState.style.display = 'block';
            } else {
                emptyState.style.display = 'none';
                dayTasks.forEach(task => {
                    const taskElement = createTaskElement(task);
                    tasksContainer.appendChild(taskElement);
                });
            }
        });
    });
    
    // Установка минимальной даты как сегодняшней
    const today = new Date().toISOString().split('T')[0];
    deadlineInput.min = today;
    
    // Инициализация
    renderTasks();
    updateStats();
});