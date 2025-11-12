// ============================================
// MOODSYNC - JavaScript Interactivity
// God-Tier Animations & Scroll Effects
// ============================================

// ============================================
// SMOOTH SCROLL & NAVIGATION
// ============================================

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

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.08)';
        navbar.style.boxShadow = '0 5px 20px rgba(102, 126, 234, 0.2)';
    } else {
        navbar.style.background = 'transparent';
        navbar.style.boxShadow = 'none';
    }
    
    lastScrollTop = scrollTop;
});

// ============================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.animationDelay = `${index * 0.2}s`;
    observer.observe(card);
});

// ============================================
// CTA BUTTON CLICK HANDLER
// ============================================

const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'rippleEffect 0.6s ease-out';
        
        const rect = ctaButton.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        
        ctaButton.style.position = 'relative';
        ctaButton.style.overflow = 'hidden';
        ctaButton.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
}

// ============================================
// FEATURE CARD HOVER EFFECTS
// ============================================

const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transition = 'all 0.4s ease';
    });
});

// ============================================
// DYNAMIC GRADIENT ANIMATION
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
        }
    }
    
    @keyframes gradientShift {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================

const createScrollIndicator = () => {
    const indicator = document.createElement('div');
    indicator.style.position = 'fixed';
    indicator.style.top = '0';
    indicator.style.left = '0';
    indicator.style.height = '3px';
    indicator.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f5576c 100%)';
    indicator.style.zIndex = '999';
    indicator.style.width = '0%';
    indicator.style.transition = 'width 0.1s ease';
    document.body.appendChild(indicator);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (scrollTop / docHeight) * 100;
        indicator.style.width = scrolled + '%';
    });
};

createScrollIndicator();

// ============================================
// TYPING ANIMATION FOR HERO TITLE
// ============================================

const typewriterEffect = () => {
    const title = document.querySelector('.hero-title');
    const originalText = title.textContent;
    title.textContent = '';
    
    let index = 0;
    const typeSpeed = 50;
    
    const type = () => {
        if (index < originalText.length) {
            title.textContent += originalText.charAt(index);
            index++;
            setTimeout(type, typeSpeed);
        }
    };
    
    // Start typing after page loads
    setTimeout(type, 500);
};

// Uncomment to enable typewriter effect
// window.addEventListener('load', typewriterEffect);

// ============================================
// CURSOR GLOW EFFECT
// ============================================

const createCursorGlow = () => {
    const glow = document.createElement('div');
    glow.style.position = 'fixed';
    glow.style.width = '30px';
    glow.style.height = '30px';
    glow.style.borderRadius = '50%';
    glow.style.background = 'radial-gradient(circle, rgba(102, 126, 234, 0.5) 0%, transparent 70%)';
    glow.style.pointerEvents = 'none';
    glow.style.zIndex = '9999';
    glow.style.display = 'none';
    document.body.appendChild(glow);
    
    document.addEventListener('mousemove', (e) => {
        glow.style.display = 'block';
        glow.style.left = (e.clientX - 15) + 'px';
        glow.style.top = (e.clientY - 15) + 'px';
    });
    
    document.addEventListener('mouseleave', () => {
        glow.style.display = 'none';
    });
};

createCursorGlow();

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Throttle scroll events for better performance
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Scroll-based animations here
            ticking = false;
        });
        ticking = true;
    }
});

// ============================================
// PAGE LOAD ANIMATION
// ============================================

window.addEventListener('load', () => {
    document.body.style.animation = 'fadeIn 0.8s ease-out';
});

// Add fade-in animation to style
const loadStyle = document.createElement('style');
loadStyle.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(loadStyle);

// ============================================
// MOBILE MENU OPTIMIZATION
// ============================================

const handleMobileOptimization = () => {
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (window.innerWidth < 768) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Add mobile-specific behavior if needed
            });
        });
    }
};

handleMobileOptimization();
window.addEventListener('resize', handleMobileOptimization);

// ============================================
// CONSOLE MESSAGE
// ============================================

console.log('%c🧠 Welcome to MoodSync!', 'font-size: 20px; color: #667eea; font-weight: bold;');
console.log('%cSync your mind, feel your mood 🌈', 'font-size: 14px; color: #00f2fe;');