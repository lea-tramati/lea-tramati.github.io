/* ========================================
   DATA - PROJECTS
   ======================================== */
const projects = [
    {
        title: 'Zaha Hadid, the box',
        type: 'ESAD AMIENS',
        img: 'img/003.jpg',
        url: 'projets_01.html'
    },
    {
        title: 'Baskerville, specimen',
        type: 'ESAD AMIENS',
        img: 'img/038.jpg',
        url: 'projets_02.html'
    },
    {
        title: 'Haute Couture',
        type: 'ESAD AMIENS',
        img: 'img/039.jpg',
        url: 'projets_03.html'
    },
    {
        title: 'Slash',
        type: 'ESAD AMIENS',
        img: 'img/015.jpg',
        url: 'projets_04.html'
    },
    {
        title: 'Vinyls',
        type: 'ESAD AMIENS',
        img: 'img/011.jpg',
        url: 'projets_05.html'
    },
    {
        title: 'Metamorphosis',
        type: 'ESAD AMIENS',
        img: 'img/001.jpg',
        url: 'projets_06.html'
    },
    {
        title: 'Portofino',
        type: 'PREPART',
        img: 'img/030.jpg',
        url: 'projets_07.html'
    },
    {
        title: 'Portofino, font',
        type: 'PREPART',
        img: 'img/035.jpg',
        url: 'projets_08.html'
    },
    {
        title: 'Slay',
        type: 'ESAD AMIENS',
        img: 'img/049.jpg',
        url: 'projets_09.html'
    },  
     {
        title: 'IA vs Non IA',
        type: 'ESAD AMIENS',
        img: 'img/037.jpg',
        url: 'projets_10.html'
    },
    {
        title: 'The Stranger',
        type: 'PREPART',
        img: 'img/050.jpg',
        url: 'projets_11.html'
    },

     {      
        title: 'The Passers-by',
        type: 'ESAD AMIENS',
        img: 'img/051.jpg',
        url: 'projets_12.html'
    }
];

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function isTouchDevice() {
    return ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           (navigator.msMaxTouchPoints > 0);
}

function isReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ========================================
   RENDER PROJECTS
   ======================================== */
function renderProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    const loadingIndicator = document.querySelector('.loading-indicator');
    
    if (!projectsGrid) {
        console.error('Projects grid container not found');
        return;
    }
    
    // Show loading
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
    }
    
    // Simulate async loading (remove in production if not needed)
    setTimeout(() => {
        projectsGrid.innerHTML = projects.map((project, index) => {
            const number = String(index + 1).padStart(2, '0');
            return `
                <article class="project-card" 
                         data-url="${project.url}" 
                         role="listitem"
                         tabindex="0"
                         aria-label="Project ${number}: ${project.title}">
                    <div class="project-number" aria-hidden="true">${number}</div>
                    <div class="project-content">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-type">${project.type}</p>
                    </div>
                    <div class="project-preview" aria-hidden="true">
                        <img src="${project.img}" 
                             alt="${project.title} preview" 
                             loading="lazy"
                             width="400"
                             height="240">
                    </div>
                </article>
            `;
        }).join('');
        
        // Hide loading
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        
        // Initialize features after render
        attachProjectClickHandlers();
        initLazyLoading();
        initKeyboardNav();
        
        console.log(`✓ Portfolio initialized with ${projects.length} projects`);
    }, 100);
}

/* ========================================
   PROJECT CLICK HANDLERS
   ======================================== */
function attachProjectClickHandlers() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Click handler
        card.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToProject(this);
        });
        
        // Enter key handler
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigateToProject(this);
            }
        });
        
        // Touch handling for mobile
        if (isTouchDevice()) {
            let touchStartTime;
            
            card.addEventListener('touchstart', function() {
                touchStartTime = Date.now();
                this.style.background = 'var(--color-hover)';
            });
            
            card.addEventListener('touchend', function(e) {
                const touchDuration = Date.now() - touchStartTime;
                
                // Only navigate if it's a quick tap (not a scroll)
                if (touchDuration < 200) {
                    e.preventDefault();
                    navigateToProject(this);
                }
                
                setTimeout(() => {
                    this.style.background = '';
                }, 150);
            });
            
            card.addEventListener('touchcancel', function() {
                this.style.background = '';
            });
        }
    });
}

function navigateToProject(card) {
    const url = card.getAttribute('data-url');
    
    if (url) {
        // Visual feedback
        card.style.transform = 'scale(0.98)';
        card.style.opacity = '0.7';
        
        // Announce to screen readers
        announceNavigation(card.querySelector('.project-title').textContent);
        
        // Navigate after animation
        setTimeout(() => {
            window.location.href = url;
        }, 150);
    }
}

function announceNavigation(projectTitle) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `Navigating to ${projectTitle}`;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

/* ========================================
   KEYBOARD NAVIGATION
   ======================================== */
function initKeyboardNav() {
    const projectCards = document.querySelectorAll('.project-card');
    let currentIndex = -1;
    
    document.addEventListener('keydown', (e) => {
        // Only handle arrow keys if no input is focused
        if (document.activeElement.tagName === 'INPUT' || 
            document.activeElement.tagName === 'TEXTAREA') {
            return;
        }
        
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            currentIndex = Math.min(currentIndex + 1, projectCards.length - 1);
            projectCards[currentIndex]?.focus();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            currentIndex = Math.max(currentIndex - 1, 0);
            projectCards[currentIndex]?.focus();
        } else if (e.key === 'Home') {
            e.preventDefault();
            currentIndex = 0;
            projectCards[currentIndex]?.focus();
        } else if (e.key === 'End') {
            e.preventDefault();
            currentIndex = projectCards.length - 1;
            projectCards[currentIndex]?.focus();
        }
    });
    
    // Track focus
    projectCards.forEach((card, index) => {
        card.addEventListener('focus', () => {
            currentIndex = index;
        });
    });
}

/* ========================================
   LAZY LOADING IMAGES
   ======================================== */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Add loaded class when image loads
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });
                    
                    // Handle errors
                    img.addEventListener('error', () => {
                        handleImageError(img);
                    });
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        document.querySelectorAll('.project-preview img').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

function handleImageError(img) {
    const parent = img.closest('.project-preview');
    if (parent) {
        parent.style.background = '#f5f5f5';
        parent.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;font-size:0.875rem;padding:1rem;text-align:center;">
                Image unavailable
            </div>
        `;
    }
}

/* ========================================
   HEADER SCROLL EFFECT
   ======================================== */
function initHeaderScroll() {
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    const handleScroll = debounce(() => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, 10);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

/* ========================================
   BACK TO TOP BUTTON
   ======================================== */
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (!backToTopBtn) return;
    
    const handleScroll = debounce(() => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
            setTimeout(() => {
                backToTopBtn.classList.add('visible');
            }, 10);
        } else {
            backToTopBtn.classList.remove('visible');
            setTimeout(() => {
                if (!backToTopBtn.classList.contains('visible')) {
                    backToTopBtn.style.display = 'none';
                }
            }, 300);
        }
    }, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: isReducedMotion() ? 'auto' : 'smooth'
        });
    });
}

/* ========================================
   MOBILE MENU (if needed in future)
   ======================================== */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.header-nav');
    
    if (!menuToggle || !nav) return;
    
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('open');
    });
    
    // Close menu on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('open')) {
            menuToggle.setAttribute('aria-expanded', 'false');
            nav.classList.remove('open');
            menuToggle.focus();
        }
    });
}

/* ========================================
   UPDATE YEAR IN FOOTER
   ======================================== */
function updateYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/* ========================================
   PRELOAD CRITICAL IMAGES
   ======================================== */
function preloadCriticalImages() {
    const criticalImages = projects.slice(0, 4).map(p => p.img);
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

/* ========================================
   SMOOTH SCROLL LINKS
   ======================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#main-content') {
                e.preventDefault();
                const target = href === '#' ? 
                    document.body : 
                    document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: isReducedMotion() ? 'auto' : 'smooth',
                        block: 'start'
                    });
                    
                    // Focus target for accessibility
                    if (href !== '#') {
                        target.focus();
                    }
                }
            }
        });
    });
}

/* ========================================
   PERFORMANCE MONITORING (Optional)
   ======================================== */
function logPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`📊 Page load time: ${pageLoadTime}ms`);
        });
    }
}

/* ========================================
   VIEWPORT HEIGHT FIX (Mobile Safari)
   ======================================== */
function fixMobileViewportHeight() {
    const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', debounce(setVH, 250));
}

/* ========================================
   INITIALIZE ON DOM READY
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Initializing Léa Tramati Portfolio...');
    
    // Core functionality
    renderProjects();
    updateYear();
    
    // Enhancement features
    initHeaderScroll();
    initBackToTop();
    initSmoothScroll();
    initMobileMenu();
    
    // Performance
    preloadCriticalImages();
    fixMobileViewportHeight();
    
    // Optional monitoring
    if (window.location.hostname === 'localhost') {
        logPerformance();
    }
    
    console.log('✓ Portfolio ready');
});

/* ========================================
   WINDOW RESIZE HANDLER
   ======================================== */
window.addEventListener('resize', debounce(() => {
    console.log('📐 Window resized');
}, 250));

/* ========================================
   PAGE VISIBILITY API
   ======================================== */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('👋 Page hidden');
    } else {
        console.log('👀 Page visible');
    }
});

/* ========================================
   SERVICE WORKER (Optional - for PWA)
   ======================================== */
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('✓ Service Worker registered'))
        //     .catch(err => console.log('✗ Service Worker registration failed', err));
    });
}
// Back to top functionality
const backToTop = document.querySelector('.back-to-top');

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.style.display = 'flex';
        setTimeout(() => backToTop.classList.add('visible'), 10);
    } else {
        backToTop.classList.remove('visible');
        setTimeout(() => {
            if (!backToTop.classList.contains('visible')) {
                backToTop.style.display = 'none';
            }
        }, 300);
    }
});

// Header scroll effect
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
