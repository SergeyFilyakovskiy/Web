// Класс для управления таймером
class CountdownTimer {
    constructor() {
        this.timerId = null;
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.halfTimeNotified = false;
        this.endTimeNotified = false;
        
        // Коллекция для хранения элементов DOM
        this.elements = new Map([
            ['hours', document.getElementById('hours')],
            ['minutes', document.getElementById('minutes')],
            ['seconds', document.getElementById('seconds')],
            ['progress', document.getElementById('progress')],
            ['halfTimeNotification', document.getElementById('halfTimeNotification')],
            ['endTimeNotification', document.getElementById('endTimeNotification')],
            ['startButton', document.getElementById('startTimer')],
            ['timeInput', document.getElementById('minutes')]
        ]);
        
        // Коллекция для хранения уведомлений
        this.notifications = new Set(['halfTimeNotification', 'endTimeNotification']);
        
        this.initEventListeners();
    }
    
    // Инициализация обработчиков событий
    initEventListeners() {
        this.elements.get('startButton').addEventListener('click', () => this.startTimer());
    }
    
    // Запуск таймера
    startTimer() {
        // Сброс предыдущего таймера
        this.stopTimer();
        
        // Скрытие всех уведомлений
        this.hideAllNotifications();
        
        // Сброс флагов уведомлений
        this.halfTimeNotified = false;
        this.endTimeNotified = false;
        
        // Получение времени от пользователя
        const minutes = parseInt(this.elements.get('timeInput').value);
        if (isNaN(minutes) || minutes <= 0) {
            alert('Пожалуйста, введите корректное количество минут');
            return;
        }
        
        this.totalSeconds = minutes * 60;
        this.remainingSeconds = this.totalSeconds;
        
        // Обновление отображения
        this.updateDisplay();
        
        // Запуск таймера
        this.timerId = setInterval(() => this.tick(), 1000);
    }
    
    // Остановка таймера
    stopTimer() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }
    
    // Тик таймера
    tick() {
        this.remainingSeconds--;
        
        // Проверка на завершение времени
        if (this.remainingSeconds <= 0) {
            this.stopTimer();
            this.remainingSeconds = 0;
            this.showNotification('endTimeNotification');
            this.endTimeNotified = true;
        }
        
        // Проверка на половину времени
        if (!this.halfTimeNotified && this.remainingSeconds <= this.totalSeconds / 2) {
            this.showNotification('halfTimeNotification');
            this.halfTimeNotified = true;
        }
        
        this.updateDisplay();
    }
    
    // Обновление отображения таймера
    updateDisplay() {
        const hours = Math.floor(this.remainingSeconds / 3600);
        const minutes = Math.floor((this.remainingSeconds % 3600) / 60);
        const seconds = this.remainingSeconds % 60;
        
        this.elements.get('hours').textContent = hours.toString().padStart(2, '0');
        this.elements.get('minutes').textContent = minutes.toString().padStart(2, '0');
        this.elements.get('seconds').textContent = seconds.toString().padStart(2, '0');
        
        // Обновление прогресс-бара
        const progressPercentage = (this.remainingSeconds / this.totalSeconds) * 100;
        this.elements.get('progress').style.width = `${progressPercentage}%`;
        
        // Изменение цвета прогресс-бара при уменьшении времени
        if (progressPercentage < 30) {
            this.elements.get('progress').style.background = '#e74c3c';
        } else if (progressPercentage < 60) {
            this.elements.get('progress').style.background = '#f39c12';
        }
    }
    
    // Показать уведомление
    showNotification(notificationId) {
        // Сначала скрываем все уведомления
        this.hideAllNotifications();
        
        // Показываем нужное уведомление
        const notification = this.elements.get(notificationId);
        if (notification) {
            notification.style.display = 'block';
            
            // Анимация появления
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateY(0)';
            }, 10);
        }
    }
    
    // Скрыть все уведомления
    hideAllNotifications() {
        this.notifications.forEach(id => {
            const notification = this.elements.get(id);
            if (notification) {
                notification.style.display = 'none';
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-20px)';
                notification.style.transition = 'all 0.3s ease';
            }
        });
    }
}

// Инициализация таймера при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const timer = new CountdownTimer();
    
    // Пример использования замыкания с setTimeout
    const showWelcomeMessage = (() => {
        let shown = false;
        
        return () => {
            if (!shown) {
                setTimeout(() => {
                    alert('Добро пожаловать на нашу специальную акцию!');
                    shown = true;
                }, 1000);
            }
        };
    })();
    
    showWelcomeMessage();
    
    // Пример использования call/apply с коллекцией
    const logElements = function() {
        console.log('Элементы таймера:');
        this.elements.forEach((value, key) => {
            console.log(`${key}:`, value);
        });
    };
    
    setTimeout(() => logElements.call(timer), 2000);
    
    // Пример использования bind
    const updateDisplayBound = timer.updateDisplay.bind(timer);
    setTimeout(() => {
        console.log('Принудительное обновление дисплея через 3 секунды');
        updateDisplayBound();
    }, 3000);
});