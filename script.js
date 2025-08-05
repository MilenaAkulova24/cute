// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handler
function handleSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Show success message
    alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время. 🐱');
    
    // Reset form
    event.target.reset();
}

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .portfolio-item, .testimonial');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Service Modal Functions
let serviceModal = null;

// Initialize modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create modal if it doesn't exist
    if (document.getElementById('serviceModal')) {
        serviceModal = document.getElementById('serviceModal');
    }
});

// Open service modal
function openServiceModal(serviceType) {
    if (!serviceModal) {
        createModal();
    }
    
    document.getElementById('serviceType').value = getServiceName(serviceType);
    serviceModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Focus on first input
    setTimeout(() => {
        document.getElementById('clientName').focus();
    }, 300);
}

// Get service name from type
function getServiceName(type) {
    const services = {
        'landing': 'Лендинг',
        'shop': 'Интернет-магазин',
        'corporate': 'Корпоративный сайт',
        'support': 'Поддержка сайта'
    };
    return services[type] || 'Услуга';
}

// Close modal
function closeModal() {
    if (serviceModal) {
        serviceModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Create modal if it doesn't exist
function createModal() {
    const modalHTML = `
        <div id="serviceModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal()">&times;</span>
                <h2>Оформление заявки</h2>
                <form id="serviceRequestForm" onsubmit="submitServiceRequest(event)">
                    <input type="hidden" id="serviceType" name="serviceType">
                    
                    <div class="form-group">
                        <label for="clientName">Ваше имя *</label>
                        <input type="text" id="clientName" name="clientName" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="clientPhone">Телефон *</label>
                        <input type="tel" id="clientPhone" name="clientPhone" required placeholder="+7 (999) 123-45-67">
                    </div>
                    
                    <div class="form-group">
                        <label for="clientEmail">Email</label>
                        <input type="email" id="clientEmail" name="clientEmail" placeholder="example@mail.ru">
                    </div>
                    
                    <div class="form-group">
                        <label for="projectDescription">Описание проекта</label>
                        <textarea id="projectDescription" name="projectDescription" rows="4" placeholder="Расскажите о вашем проекте, пожеланиях и сроках..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="budget">Бюджет</label>
                        <select id="budget" name="budget">
                            <option value="">Выберите бюджет</option>
                            <option value="до 15000">до 15 000 ₽</option>
                            <option value="15000-30000">15 000 - 30 000 ₽</option>
                            <option value="30000-50000">30 000 - 50 000 ₽</option>
                            <option value="50000-100000">50 000 - 100 000 ₽</option>
                            <option value="100000+">100 000 ₽ и выше</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="deadline">Желаемые сроки</label>
                        <input type="date" id="deadline" name="deadline">
                    </div>
                    
                    <button type="submit" class="submit-btn">
                        <i class="fas fa-paper-plane"></i>
                        Отправить заявку
                    </button>
                    
                    <div id="formMessage" style="display: none; margin-top: 1rem; padding: 1rem; border-radius: 10px;"></div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    serviceModal = document.getElementById('serviceModal');
    
    // Add event listeners
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === serviceModal) {
            closeModal();
        }
    });
}

// Submit service request
async function submitServiceRequest(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
    submitBtn.disabled = true;
    
    try {
        // Send to Telegram
        const message = formatTelegramMessage(data);
        await sendToTelegram(message);
        
        // Show success message
        showFormMessage('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время. 🐱', 'success');
        
        // Reset form and close modal after delay
        form.reset();
        setTimeout(() => {
            closeModal();
            document.getElementById('formMessage').style.display = 'none';
        }, 3000);
        
    } catch (error) {
        console.error('Error:', error);
        showFormMessage('Произошла ошибка при отправке. Пожалуйста, попробуйте позже или свяжитесь с нами напрямую.', 'error');
    } finally {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Format message for Telegram
function formatTelegramMessage(data) {
    const serviceNames = {
        'Лендинг': 'лендинг',
        'Интернет-магазин': 'интернет-магазин',
        'Корпоративный сайт': 'корпоративный сайт',
        'Поддержка сайта': 'поддержка сайта'
    };
    
    return `
🎉 *Новая заявка на услугу*

📋 *Услуга:* ${data.serviceType || 'Не указана'}
👤 *Имя:* ${data.clientName || 'Не указано'}
📞 *Телефон:* ${data.clientPhone || 'Не указан'}
📧 *Email:* ${data.clientEmail || 'Не указан'}
💰 *Бюджет:* ${data.budget || 'Не указан'}
📅 *Сроки:* ${data.deadline ? new Date(data.deadline).toLocaleDateString('ru-RU') : 'Не указаны'}

📝 *Описание проекта:*
${data.projectDescription || 'Не указано'}

⏰ *Время заявки:* ${new Date().toLocaleString('ru-RU')}
    `.trim();
}

// Send message to Telegram
async function sendToTelegram(message) {
    // Replace with your actual Telegram bot token and chat ID
    const BOT_TOKEN = '8348796407:AAH2ok1TXB-A66is-ua0v5ReejCUHaDVm0c';
    const CHAT_ID = '48857955';
    
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        })
    });
    
    if (!response.ok) {
        throw new Error('Failed to send to Telegram');
    }
    
    return response.json();
}

// Show form message
function showFormMessage(text, type) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.textContent = text;
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.style.display = 'block';
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && serviceModal && serviceModal.style.display === 'block') {
        closeModal();
    }
});

// Update service buttons to use modal
document.addEventListener('DOMContentLoaded', () => {
    // Remove old click handlers and add new ones
    document.querySelectorAll('.service-btn').forEach(btn => {
        btn.removeEventListener('click', () => {}); // Remove old handler
        btn.onclick = function() {
            const serviceType = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            openServiceModal(serviceType);
        };
    });
});

// Add cute cursor effect
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.98) {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.position = 'fixed';
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        heart.style.pointerEvents = 'none';
        heart.style.animation = 'floatUp 2s ease-out forwards';
        heart.style.zIndex = '9999';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 2000);
    }
});

// Add CSS for floating hearts
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px) scale(0.5);
        }
    }
`;
document.head.appendChild(style);

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Add responsive behavior
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.querySelector('.nav-menu').classList.remove('active');
    }
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
});

// Easter egg: Click on logo for surprise
document.querySelector('.nav-logo').addEventListener('click', (e) => {
    if (e.detail === 3) { // Triple click
        document.body.style.animation = 'rainbow 2s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
});

// Hamburger menu toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
});
