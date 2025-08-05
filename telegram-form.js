// Telegram Bot Configuration
// IMPORTANT: Replace these with your actual values
const TELEGRAM_BOT_TOKEN = '8348796407:AAH2ok1TXB-A66is-ua0v5ReejCUHaDVm0c'; // Format: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz
const TELEGRAM_CHAT_ID = '848857955'; // Format: 123456789 (your user ID)

// Debug mode - set to true to see console logs
const DEBUG_MODE = true;

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    
    if (!form) {
        console.error('Форма не найдена!');
        return;
    }
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (DEBUG_MODE) console.log('Форма отправляется...');
        
        // Configuration validation removed - using actual values
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Validate required fields
        if (!data.name || !data.email || !data.message) {
            showNotification('❌ Пожалуйста, заполните все обязательные поля', 'error');
            return;
        }
        
        // Create formatted message
        const message = `
📬 <b>Новая заявка с сайта!</b>

👤 <b>Имя:</b> ${data.name}
📧 <b>Email:</b> ${data.email}
📱 <b>Телефон:</b> ${data.phone || 'Не указано'}
🛠️ <b>Тип услуги:</b> ${getServiceName(data.service) || 'Не выбрано'}

💬 <b>Сообщение:</b>
${data.message}

📅 <b>Дата и время:</b> ${new Date().toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
})}

🔗 <b>Источник:</b> Контактная форма сайта
        `.trim();
        
        if (DEBUG_MODE) console.log('Отправляемое сообщение:', message);
        
        // Show loading state
        setButtonLoading(true);
        
        try {
            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
            if (DEBUG_MODE) console.log('URL запроса:', url);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            
            if (DEBUG_MODE) console.log('Ответ сервера:', response);
            
            if (!response.ok) {
                throw new Error(`HTTP ошибка! статус: ${response.status}`);
            }
            
            const result = await response.json();
            if (DEBUG_MODE) console.log('Результат:', result);
            
            if (result.ok) {
                showNotification('✅ Сообщение успешно отправлено! Я свяжусь с вами в ближайшее время.', 'success');
                this.reset();
            } else {
                throw new Error(result.description || 'Неизвестная ошибка Telegram');
            }
            
        } catch (error) {
            console.error('Ошибка при отправке:', error);
            showNotification(`❌ Ошибка: ${error.message}. Проверьте консоль для деталей.`, 'error');
            
            // Additional debugging for common issues
            if (error.message.includes('Failed to fetch')) {
                showNotification('❌ Ошибка сети. Проверьте подключение к интернету или CORS политику.', 'error');
            }
        } finally {
            setButtonLoading(false);
        }
    });
});

// Helper function to get service names
function getServiceName(serviceValue) {
    const services = {
        'landing': 'Лендинг',
        'shop': 'Интернет-магазин',
        'corporate': 'Корпоративный сайт',
        'support': 'Поддержка сайта',
        'other': 'Другое'
    };
    return services[serviceValue] || serviceValue;
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span class="notification-text">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                max-width: 400px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .notification-success {
                border-left: 4px solid #28a745;
            }
            
            .notification-error {
                border-left: 4px solid #dc3545;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                padding: 16px;
                gap: 12px;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #666;
                margin-left: auto;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Loading state management
function setButtonLoading(loading = true) {
    const button = document.querySelector('.submit-btn');
    if (button) {
        if (loading) {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            button.disabled = true;
            button.style.opacity = '0.7';
        } else {
            button.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить сообщение';
            button.disabled = false;
            button.style.opacity = '1';
        }
    }
}

// Form validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.querySelectorAll('[required]').forEach(field => {
            field.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.style.borderColor = '#dc3545';
                } else {
                    this.style.borderColor = '#ddd';
                }
            });
        });
    }
});
