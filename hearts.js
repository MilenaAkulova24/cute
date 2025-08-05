// Create floating hearts animation
document.addEventListener('DOMContentLoaded', function() {
    const heartsContainer = document.createElement('div');
    heartsContainer.className = 'floating-hearts';
    document.body.appendChild(heartsContainer);

    // Create heart elements
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '💗';
        
        // Random horizontal position
        heart.style.left = Math.random() * 100 + 'vw';
        
        // Random animation duration
        const duration = 6 + Math.random() * 4;
        heart.style.animationDuration = duration + 's';
        
        // Random delay
        heart.style.animationDelay = Math.random() * 2 + 's';
        
        heartsContainer.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, duration * 1000);
    }

    // Create hearts periodically
    setInterval(createHeart, 3000);
    
    // Create initial hearts
    for (let i = 0; i < 3; i++) {
        setTimeout(createHeart, i * 1000);
    }
});
