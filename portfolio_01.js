/* ========================================
   VARIABLES GLOBALES
   ======================================== */
let currentIndex = 0;
let isCarouselMode = true;
let isScrolling = false;
let scrollTimeout;

/* ========================================
   DONNÉES DES PROJETS
   ======================================== */
const projects = [
    {
        title: 'Zaha Hadid, the box', 
        type: '[ESAD AMIENS]', 
        img: 'img/1706522245-found-stella-artois-still-5.jpeg', 
        url: 'projets_01.html'
    },
    {
        title: 'Baskerville, specimen', 
        type: '[ESAD AMIENS]', 
        img: 'img/1695829139-community_2-2-min.jpeg', 
        url: 'projets_02.html'
    },
    {
        title: 'Haute Couture', 
        type: '[ESAD AMIENS]', 
        img: 'img/1692388902-346300243_959632565224075_8512582370672738388_n.jpeg', 
        url: 'projets_03.html'
    },
    {
        title: 'Splash', 
        type: '[ESAD AMIENS]', 
        img: 'img/1695825726-sese_v001_window.jpeg', 
        url: 'projets_04.html'
    },
    {
        title: 'Vinyls', 
        type: '[ESAD AMIENS]', 
        img: 'img/1689061639-sona_sh03.jpeg', 
        url: 'vinyls.html'
    },
    {
        title: 'Metamorphosis', 
        type: '[ESAD AMIENS]', 
        img: 'img/1680684622-lp_ss23_dark_rnd_v018_rm.jpeg', 
        url: 'metamorphosis.html'
    },
    {
        title: 'Portofino', 
        type: '[PREPART]', 
        img: 'img/1706962557-adidas_subculture_3_cover-gigapixel-lines-scale-2_00x_1.jpeg', 
        url: 'portofino.html'
    },
    {
        title: 'Portofino, font', 
        type: '[PREPART]', 
        img: 'img/1706963110-owater_grid-min.jpeg', 
        url: 'portofino-font.html'
    }
];

/* ========================================
   GESTION DU LOADER
   ======================================== */
function initLoader() {
    document.body.classList.add('loading');
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            const loader = document.getElementById('loader');
            const mainContent = document.getElementById('mainContent');
            
            // Remove loading class to allow scrolling
            document.body.classList.remove('loading');
            
            // Fade out loader
            loader.classList.add('fade-out');
            
            // Show main content
            setTimeout(function() {
                mainContent.classList.add('visible');
            }, 500);
        }, 2500);
    });
}

/* ========================================
   FONCTIONS CAROUSEL
   ======================================== */
function renderProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    
    projectsGrid.innerHTML = projects.map(function(project) {
        return `
            <div class="project-card" data-url="${project.url}">
                <div class="project-info">
                    <div class="project-title">${project.title}</div>
                    <div class="project-type">${project.type}</div>
                </div>
                <img src="${project.img}" alt="${project.title}">
            </div>
        `;
    }).join('');

    // Ajouter les gestionnaires d'événements de clic
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(function(card) {
        card.addEventListener('click', function() {
            const url = card.getAttribute('data-url');
            if (url) {
                window.location.href = url;
            }
        });
    });
}

function updateCarousel() {
    if (isCarouselMode) {
        const projectsGrid = document.getElementById('projectsGrid');
        const cards = projectsGrid.querySelectorAll('.project-card');
        
        // Retirer toutes les classes
        cards.forEach(function(card) {
            card.classList.remove('center', 'side');
        });

        // Ajouter les classes selon la position
        cards.forEach(function(card, index) {
            if (index === currentIndex + 1) {
                card.classList.add('center');
            } else if (index === currentIndex || index === currentIndex + 2) {
                card.classList.add('side');
            }
        });

        // Calculer et appliquer la transformation
        const baseCardWidth = window.innerWidth * 0.25;
        const offset = currentIndex * baseCardWidth;
        projectsGrid.style.transform = 'translateX(-' + offset + 'px)';
    }
}

function switchToCarousel() {
    const carouselBtn = document.getElementById('carouselBtn');
    const listBtn = document.getElementById('listBtn');
    
    isCarouselMode = true;
    document.body.classList.add('carousel-active');
    document.body.classList.remove('list-mode');
    carouselBtn.classList.add('active');
    listBtn.classList.remove('active');
    currentIndex = 0;
    updateCarousel();
}

function switchToList() {
    const carouselBtn = document.getElementById('carouselBtn');
    const listBtn = document.getElementById('listBtn');
    const projectsGrid = document.getElementById('projectsGrid');
    
    isCarouselMode = false;
    document.body.classList.remove('carousel-active');
    document.body.classList.add('list-mode');
    carouselBtn.classList.remove('active');
    listBtn.classList.add('active');
    projectsGrid.style.transform = 'translateX(0)';
}

/* ========================================
   GESTION DU SCROLL
   ======================================== */
function handleWheel(e) {
    if (!isCarouselMode || isScrolling) return;

    e.preventDefault();
    isScrolling = true;

    clearTimeout(scrollTimeout);

    const delta = Math.sign(e.deltaY);

    if (delta > 0 && currentIndex < projects.length - 3) {
        currentIndex++;
        updateCarousel();
    } else if (delta < 0 && currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }

    scrollTimeout = setTimeout(function() {
        isScrolling = false;
    }, 800);
}

/* ========================================
   GESTION DES CLICS EN MODE LIST
   ======================================== */
function initListClickHandlers() {
    const clientSpans = document.querySelectorAll('.clients-list span[data-url]');
    
    clientSpans.forEach(function(span) {
        span.addEventListener('click', function() {
            const url = span.getAttribute('data-url');
            if (url) {
                window.location.href = url;
            }
        });
    });
}

/* ========================================
   EVENT LISTENERS
   ======================================== */
function initEventListeners() {
    const carouselBtn = document.getElementById('carouselBtn');
    const listBtn = document.getElementById('listBtn');
    
    // Gestion du scroll
    window.addEventListener('wheel', handleWheel, { passive: false });

    // Boutons de navigation
    carouselBtn.addEventListener('click', function(e) {
        e.preventDefault();
        switchToCarousel();
    });

    listBtn.addEventListener('click', function(e) {
        e.preventDefault();
        switchToList();
    });

    // Resize
    window.addEventListener('resize', function() {
        if (isCarouselMode) {
            updateCarousel();
        }
    });
}

/* ========================================
   INITIALISATION
   ======================================== */
document.addEventListener('DOMContentLoaded', function() {
    initLoader();
    renderProjects();
    initListClickHandlers();
    initEventListeners();
    switchToCarousel();
});