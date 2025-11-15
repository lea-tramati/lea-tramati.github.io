// Variables globales
let currentIndex = 0;
let isCarouselMode = true;
let isScrolling = false;
let scrollTimeout;

// Éléments DOM
const projectsGrid = document.getElementById('projectsGrid');
const carouselBtn = document.getElementById('carouselBtn');
const listBtn = document.getElementById('listBtn');

// Données des projets
const projects = [
    { title: 'Zaha Hadid, the box', type: '[ESAD AMIENS]', img: 'img/1706522245-found-stella-artois-still-5.jpeg' },
    { title: 'Baskerville, specimen', type: '[ESAD AMIENS]', img: 'img/1695829139-community_2-2-min.jpeg' },
    { title: 'Haute Couture', type: '[ESAD AMIENS]', img: 'img/1692388902-346300243_959632565224075_8512582370672738388_n.jpeg' },
    { title: 'Splash', type: '[ESAD AMIENS]', img: 'img/1695825726-sese_v001_window.jpeg' },
    { title: 'Vinyls', type: '[ESAD AMIENS]', img: 'img/1689061639-sona_sh03.jpeg' },
    { title: 'Metamorphosis', type: '[ESAD AMIENS]', img: 'img/1680684622-lp_ss23_dark_rnd_v018_rm.jpeg' },
    { title: 'Portofino', type: '[PREPART]', img: 'img/1706962557-adidas_subculture_3_cover-gigapixel-lines-scale-2_00x_1.jpeg' },
    { title: 'Portofino, font', type: '[PREPART]', img: 'img/1706963110-owater_grid-min.jpeg' }
];
// Fonction pour rendre les projets
function renderProjects() {
    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card">
            <div class="project-info">
                <div class="project-title">${project.title}</div>
                <div class="project-type">${project.type}</div>
            </div>
            <img src="${project.img}" alt="${project.title}">
        </div>
    `).join('');

    // Ajouter les gestionnaires d'événements de clic
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.project-title').textContent;
            alert(`Ouverture du projet: ${title}`);
        });
    });
}

// Fonction pour mettre à jour le carousel
function updateCarousel() {
    if (isCarouselMode) {
        const cards = projectsGrid.querySelectorAll('.project-card');
        
        // Retirer toutes les classes
        cards.forEach(card => {
            card.classList.remove('center', 'side');
        });

        // Ajouter les classes selon la position
        cards.forEach((card, index) => {
            if (index === currentIndex + 1) {
                card.classList.add('center');
            } else if (index === currentIndex || index === currentIndex + 2) {
                card.classList.add('side');
            }
        });

        // Calculer et appliquer la transformation
        const baseCardWidth = window.innerWidth * 0.25;
        const offset = currentIndex * baseCardWidth;
        projectsGrid.style.transform = `translateX(-${offset}px)`;
    }
}

// Fonction pour basculer vers le mode carousel
function switchToCarousel() {
    isCarouselMode = true;
    document.body.classList.add('carousel-active');
    document.body.classList.remove('list-mode');
    carouselBtn.classList.add('active');
    listBtn.classList.remove('active');
    currentIndex = 0;
    updateCarousel();
}

// Fonction pour basculer vers le mode liste
function switchToList() {
    isCarouselMode = false;
    document.body.classList.remove('carousel-active');
    document.body.classList.add('list-mode');
    carouselBtn.classList.remove('active');
    listBtn.classList.add('active');
    projectsGrid.style.transform = 'translateX(0)';
}

// Gestion du scroll avec la molette
function handleWheel(e) {
    if (!isCarouselMode || isScrolling) return;

    e.preventDefault();
    isScrolling = true;

    clearTimeout(scrollTimeout);

    const delta = Math.sign(e.deltaY);

    if (delta > 0 && currentIndex < projects.length - 3) {
        // Scroll vers le bas - slide suivant
        currentIndex++;
        updateCarousel();
    } else if (delta < 0 && currentIndex > 0) {
        // Scroll vers le haut - slide précédent
        currentIndex--;
        updateCarousel();
    }

    scrollTimeout = setTimeout(() => {
        isScrolling = false;
    }, 800);
}

// Event Listeners
window.addEventListener('wheel', handleWheel, { passive: false });

carouselBtn.addEventListener('click', (e) => {
    e.preventDefault();
    switchToCarousel();
});

listBtn.addEventListener('click', (e) => {
    e.preventDefault();
    switchToList();
});

document.querySelector('.contact').addEventListener('click', () => {
    alert('Formulaire de contact à venir');
});

document.querySelectorAll('.clients-list span').forEach(span => {
    span.addEventListener('click', () => {
        const client = span.textContent.trim().replace(',', '');
        if (client) {
            alert(`Filtrer les projets: ${client}`);
        }
    });
});

window.addEventListener('resize', () => {
    if (isCarouselMode) {
        updateCarousel();
    }
});

// Initialisation
renderProjects();
switchToCarousel();