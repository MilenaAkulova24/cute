// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE'; // Replace with your bot token
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID_HERE'; // Replace with your chat ID

// Form submission handler
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Create formatted message
    const message = `
📬 <b>Новая заявка с сайта!</b>

👤 <b>Имя:</b> ${data.name || 'Не указано'}
📧 <b>Email:</b> ${data.email || 'Не указано'}
📱 <b>Телефон:</b> ${data.phone || 'Не указано'}
🛠️ <b>Тип услуги:</b> ${data.service || 'Не выбрано'}

💬 <b>Сообщение:</b>
${data.message || 'Без сообщения'}

📅 <b>Дата и время:</b> ${new Date().toLocaleString('ru-RU')}

🔗 <b>Источник:</b> Контактная форма сайта
    `.trim();
    
    // Send to Telegram
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
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
        
        const result = await response.json();
        
        if (result.ok) {
            // Show success message
            showNotification('✅ Сообщение успешно отправлено! Я свяжусь с вами в ближайшее время.', 'success');
            
            // Reset form
            this.reset();
        } else {
            throw new Error(result.description || 'Ошибка при отправке');
        }
        
    } catch (error) {
        console.error('Ошибка:', error);
        showNotification('❌ Произошла ошибка при отправке. Пожалуйста, попробуйте позже или свяжитесь напрямую.', 'error');
    }
});

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

// Form validation enhancement
document.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
            this.classList.add('error');
        } else {
            this.classList.remove('error');
        }
    });
});

// Add loading state to submit button
function setButtonLoading(loading = true) {
    const button = document.querySelector('.submit-btn');
    if (loading) {
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        button.disabled = true;
    } else {
        button.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить сообщение';
        button.disabled = false;
    }
}

// Update the form submission to include loading state
const originalSubmitHandler = document.getElementById('contactForm').onsubmit;
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    setButtonLoading(true);
    
    try {
        // Your existing submission logic here
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        const message = `
📬 <b>Новая заявка с сайта!</b>

👤 <b>Имя:</b> ${data.name || 'Не указано'}
📧 <b>Email:</b> ${data.email || 'Не указано'}
📱 <b>Телефон:</b> ${data.phone || 'Не указано'}
🛠️ <b>Тип услуги:</b> ${data.service || 'Не выбрано'}

💬 <b>Сообщение:</b>
${data.message || 'Без сообщения'}

📅 <b>Дата и время:</b> ${new Date().toLocaleString('ru-RU')}

🔗 <b>Источник:</b> Контактная форма сайта
        `.trim();
        
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
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
        
        const result = await response.json();
        
        if (result.ok) {
            showNotification('✅ Сообщение успешно отправлено! Я свяжусь с вами в ближайшее время.', 'success');
            this.reset();
        } else {
            throw new Error(result.description || 'Ошибка при отправке');
        }
        
    } catch (error) {
        console.error('Ошибка:', error);
        showNotification('❌ Произошла ошибка при отправке. Пожалуйста, попробуйте позже или свяжитесь напрямую.', 'error');
    } finally {
        setButtonLoading(false);
    }
});
