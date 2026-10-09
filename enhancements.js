/**
 * enhancements.js — Mejoras interactivas de la página principal
 * Casa Condesa · Parallax · Carrusel · Ticker · Modal · Status Badge
 */
(function () {
    'use strict';

    // ════════════════════════════════════════════════════════════
    // 1. BADGE DE ESTADO ABIERTO / CERRADO
    // Horario: L-V 8:00-17:00 | S-D 9:00-16:30
    // ════════════════════════════════════════════════════════════
    function updateStatusBadge() {
        const now = new Date();
        const day = now.getDay(); // 0=Dom, 1=Lun...6=Sáb
        const hour = now.getHours();
        const min = now.getMinutes();
        const totalMin = hour * 60 + min;

        const isWeekend = day === 0 || day === 6;
        const openMin  = isWeekend ? 9 * 60  : 8 * 60;
        const closeMin = isWeekend ? 16 * 60 + 30 : 17 * 60;

        const isOpen = totalMin >= openMin && totalMin < closeMin;

        const dot  = document.getElementById('hero-status-dot');
        const text = document.getElementById('hero-status-text');
        const time = document.getElementById('hero-status-time');

        if (!dot || !text || !time) return;

        if (isOpen) {
            dot.className = 'hero-status-dot open';
            text.innerHTML = '<span class="hero-status-text-open">Abierto ahora</span> · 4 sucursales';
            const closeH = isWeekend ? '4:30' : '5:00';
            time.textContent = `Cierra a las ${closeH} PM`;
        } else {
            dot.className = 'hero-status-dot closed';
            const openH = isWeekend ? '9:00' : '8:00';
            const tomorrowIsWeekend = (day + 1) % 7 === 0 || (day + 1) % 7 === 6;
            const tomorrowOpen = tomorrowIsWeekend ? '9:00' : '8:00';
            if (totalMin >= closeMin) {
                text.textContent = 'Cerrado por hoy';
                time.textContent = `Abre mañana a las ${tomorrowOpen} AM`;
            } else {
                text.textContent = 'Aún no abrimos';
                time.textContent = `Abrimos hoy a las ${openH} AM`;
            }
        }
    }

    // ════════════════════════════════════════════════════════════
    // 2. CARRUSEL AUTOMÁTICO DE FOTOS
    // ════════════════════════════════════════════════════════════
    const CAROUSEL_PHOTOS = [
        { src: 'images/terraza_leones.jpg', label: 'La Terraza & Patio', sub: 'Casa Condesa · Chapultepec' },
        { src: 'images/waffles_condesa.jpg', label: 'Waffles con Frutos Rojos', sub: 'Favorito de la casa' },
        { src: 'images/salon_vintage.jpg', label: 'Salón Vintage', sub: 'Casa Madre · Centro' },
        { src: 'images/chilaquiles.jpg', label: 'Chilaquiles de la Casa', sub: 'Receta artesanal' },
        { src: 'images/latte.jpg', label: 'Café de Especialidad', sub: 'Granos mexicanos' },
        { src: 'images/lamparas_vitral.jpg', label: 'Lámparas de Vitral', sub: 'Crema y Nata · Acueducto' },
        { src: 'images/divan_verde.jpg', label: 'Rincón Colonial', sub: 'Casa Fonda Centro' },
        { src: 'images/panaderia.jpg', label: 'Panadería Artesanal', sub: 'Horneada cada mañana' },
        { src: 'images/waffles.jpg', label: 'Desayuno en Terraza', sub: 'Mañanas con calma' },
        { src: 'images/hero.jpg', label: 'Casa Condesa', sub: 'Tu lugar favorito de Morelia' },
    ];

    function buildCarousel() {
        const track = document.getElementById('photo-carousel-track');
        if (!track) return;

        // Duplicamos para loop infinito
        const allPhotos = [...CAROUSEL_PHOTOS, ...CAROUSEL_PHOTOS];

        allPhotos.forEach(photo => {
            const card = document.createElement('div');
            card.className = 'carousel-photo-card';

            card.innerHTML = `
                <img src="${photo.src}" alt="${photo.label}" loading="lazy">
                <div class="carousel-photo-overlay">
                    <div>
                        <div class="carousel-photo-label">${photo.label}</div>
                        <div class="carousel-photo-sub">${photo.sub}</div>
                    </div>
                </div>
            `;
            track.appendChild(card);
        });
    }

    // ════════════════════════════════════════════════════════════
    // 3. TICKER TAPE DE RESEÑAS
    // ════════════════════════════════════════════════════════════
    const REVIEWS = [
        { quote: 'La terraza se siente como el jardín de tu mejor amiga. Los chilaquiles verdes son insuperables.', author: 'Valeria M.', source: 'Google' },
        { quote: 'El café latte de Casa Condesa es de los mejores de Morelia, sin duda.', author: 'Carlos Mendoza', source: 'TikTok' },
        { quote: '100% pet friendly, mi perrita siempre es bienvenida con un platito de agua.', author: 'Fernanda R.', source: 'Restaurant Guru' },
        { quote: 'Los waffles con frutos rojos son una obra de arte. Vengo cada fin de semana.', author: 'Sofía Lp.', source: 'Instagram' },
        { quote: 'El ambiente es tan relajado que siempre termino quedándome tres horas.', author: 'Jorge A.', source: 'Google' },
        { quote: 'Panadería recién horneada, café de especialidad y una terraza llena de plantas. ¿Qué más necesitas?', author: 'Mariana T.', source: 'Yelp' },
        { quote: 'Me encanta que puedes venir con tu perro. El servicio es siempre cálido y amable.', author: 'Claudia V.', source: 'Google' },
        { quote: 'El chocolate de olla es auténtico, preparado en barro. Una joya de Morelia.', author: 'Rodrigo S.', source: 'TripAdvisor' },
    ];

    const STAR_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="#D69038" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';

    function buildTicker() {
        const track = document.getElementById('ticker-track');
        if (!track) return;

        const allReviews = [...REVIEWS, ...REVIEWS]; // duplicar para loop
        allReviews.forEach(r => {
            const item = document.createElement('div');
            item.className = 'ticker-item';
            item.innerHTML = `
                <div class="ticker-stars">${STAR_SVG.repeat(5)}</div>
                <span class="ticker-quote">${r.quote}</span>
                <span class="ticker-sep">—</span>
                <span class="ticker-author">${r.author} · ${r.source}</span>
            `;
            track.appendChild(item);
        });
    }

    // ════════════════════════════════════════════════════════════
    // 4. MODAL EXPANDIBLE DE MENÚ
    // ════════════════════════════════════════════════════════════
    const MENU_DATA = {
        'waffles-frutos': {
            tag: 'Favorito de la Casa',
            category: 'Panadería & Dulce',
            title: 'Waffles con Frutos Rojos',
            price: '$135',
            img: 'images/waffles_condesa.jpg',
            desc: 'Cuatro piezas de waffles dorados artesanales servidos con fresas rebanadas, zarzamoras, arándanos frescos, crema batida y jarabe de chocolate de la casa. Una experiencia que te hará regresar cada domingo.',
            ingredients: ['Fresas del día', 'Arándanos frescos', 'Crema batida', 'Jarabe artesanal', 'Harina local'],
            features: ['Disponible de lunes a domingo', 'Se puede pedir sin azúcar', 'Vegano sin crema batida'],
        },
        'brunch-condesa': {
            tag: 'Desayuno Completo',
            category: 'Desayunos & Brunch',
            title: 'Paquete Brunch Condesa',
            price: '$185',
            img: 'images/terraza_leones.jpg',
            desc: 'Platillo fuerte a elegir con frijoles refritos de olla, canasta de pan dulce y salado recién horneado, jugo de naranja natural recién exprimido y café americano o de olla ilimitado. El desayuno completo de Casa Condesa.',
            ingredients: ['Platillo fuerte a elegir', 'Pan dulce artesanal', 'Jugo de naranja', 'Café ilimitado', 'Frijoles refritos'],
            features: ['Incluye café y jugo natural', 'Opciones sin gluten disponibles', 'Menú infantil disponible'],
        },
        'cafe-olla': {
            tag: 'Especial de Café',
            category: 'Café & Bebidas',
            title: 'Café de Olla & Pan Dulce',
            price: '$68',
            img: 'images/salon_vintage.jpg',
            desc: 'Preparado en barro con piloncillo auténtico de Michoacán, canela en rama y mezcla de granos de altura seleccionados por nosotros. Acompañado de pan dulce recién horneado de temporada.',
            ingredients: ['Granos de altura', 'Piloncillo michoacano', 'Canela en rama', 'Barro artesanal'],
            features: ['Receta tradicional de la casa', 'Sin leche', 'Maridaje perfecto con pan dulce'],
        },
        'chocolate-latte': {
            tag: 'Especialidad',
            category: 'Café & Bebidas',
            title: 'Chocolate Caliente & Latte',
            price: '$75',
            img: 'images/lamparas_vitral.jpg',
            desc: 'Chocolate michoacano artesanal batido con molinillo tradicional de madera o latte cremoso con espresso doble de origen nacional. Disponible con leches vegetales de avena, almendra o soya.',
            ingredients: ['Cacao artesanal', 'Espresso doble', 'Leches vegetales', 'Cinnamon opcional'],
            features: ['Leches vegetales disponibles', 'Espresso de origen nacional', 'Cacao 100% artesanal'],
        },
        'chilaquiles': {
            tag: 'Hecho en Casa',
            category: 'Desayunos & Brunch',
            title: 'Chilaquiles & Omelettes',
            price: '$145',
            img: 'images/divan_verde.jpg',
            desc: 'Chilaquiles con salsas artesanales a elegir: verde de tomatillo, roja de guajillo o pasilla negro. Servidos con huevos al gusto, queso cotija de rancho michoacano, crema de rancho y aguacate fresco de temporada.',
            ingredients: ['Salsa artesanal', 'Queso cotija', 'Crema de rancho', 'Aguacate fresco', 'Huevos al gusto'],
            features: ['Salsa verde, roja o pasilla', 'Queso de rancho michoacano', 'Sin tortilla disponible'],
        },
    };

    // Mapeo de cada menu-card a su data-key
    function attachMenuCardKeys() {
        const cards = document.querySelectorAll('.menu-card:not(.hidden)');
        const keys = ['waffles-frutos', 'brunch-condesa', 'cafe-olla', 'chocolate-latte', 'chilaquiles'];
        cards.forEach((card, i) => {
            if (keys[i]) {
                card.dataset.menuKey = keys[i];
                // Añadir hint visual
                const hint = document.createElement('div');
                hint.className = 'menu-card-expand-hint';
                hint.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>`;
                // Insertar dentro de .menu-card-image
                const imgContainer = card.querySelector('.menu-card-image');
                if (imgContainer) imgContainer.appendChild(hint);

                card.addEventListener('click', () => openModal(keys[i]));
            }
        });
    }

    function openModal(key) {
        const data = MENU_DATA[key];
        if (!data) return;

        document.getElementById('modal-tag').textContent = data.tag;
        document.getElementById('modal-category').textContent = data.category;
        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-price').textContent = data.price;
        document.getElementById('modal-desc').textContent = data.desc;

        const img = document.getElementById('modal-img');
        img.src = data.img;
        img.alt = data.title;

        // Ingredients
        const ingContainer = document.getElementById('modal-ingredients');
        ingContainer.innerHTML = '';
        data.ingredients.forEach(ing => {
            const tag = document.createElement('span');
            tag.className = 'menu-modal-ingredient-tag';
            tag.textContent = ing;
            ingContainer.appendChild(tag);
        });

        // Features
        const featContainer = document.getElementById('modal-features');
        featContainer.innerHTML = '';
        data.features.forEach(feat => {
            const row = document.createElement('div');
            row.className = 'menu-modal-feature-row';
            row.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                ${feat}
            `;
            featContainer.appendChild(row);
        });

        const overlay = document.getElementById('menu-modal-overlay');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        const overlay = document.getElementById('menu-modal-overlay');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    function setupModal() {
        const overlay = document.getElementById('menu-modal-overlay');
        const closeBtn = document.getElementById('menu-modal-close');
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (overlay) {
            overlay.addEventListener('click', e => {
                if (e.target === overlay) closeModal();
            });
        }
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeModal();
        });
    }

    // ════════════════════════════════════════════════════════════
    // 5. PARALLAX EN EL HERO (mouse tracking)
    // ════════════════════════════════════════════════════════════
    function setupParallax() {
        const heroSection = document.querySelector('.hero-section');
        const heroCard = document.getElementById('hero-image-card');
        if (!heroSection || !heroCard) return;

        heroSection.addEventListener('mousemove', e => {
            const rect = heroSection.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / rect.width;   // -0.5 a 0.5
            const dy = (e.clientY - cy) / rect.height;

            heroCard.style.transform = `
                perspective(1000px)
                rotateY(${dx * 6}deg)
                rotateX(${-dy * 4}deg)
                translateZ(8px)
            `;

            // Mover ligeramente la imagen dentro de la card
            const img = heroCard.querySelector('img');
            if (img) {
                img.style.transform = `scale(1.04) translate(${dx * -8}px, ${dy * -6}px)`;
            }
        });

        heroSection.addEventListener('mouseleave', () => {
            heroCard.style.transform = '';
            const img = heroCard.querySelector('img');
            if (img) img.style.transform = '';
        });
    }

    // ════════════════════════════════════════════════════════════
    // 6. SCROLL REVEAL con IntersectionObserver
    // ════════════════════════════════════════════════════════════
    function setupScrollReveal() {
        const revealEls = document.querySelectorAll('.reveal');
        if (!('IntersectionObserver' in window)) {
            revealEls.forEach(el => el.classList.add('visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px',
        });

        revealEls.forEach(el => observer.observe(el));

        // Añadir clase reveal a secciones importantes
        document.querySelectorAll(
            '.menu-card, .gallery-item, .pillar-item, .branch-tab-btn, .section-header'
        ).forEach((el, i) => {
            el.classList.add('reveal');
            if (i % 4 === 1) el.classList.add('reveal-delay-1');
            if (i % 4 === 2) el.classList.add('reveal-delay-2');
            if (i % 4 === 3) el.classList.add('reveal-delay-3');
            observer.observe(el);
        });
    }

    // ════════════════════════════════════════════════════════════
    // INIT
    // ════════════════════════════════════════════════════════════
    function init() {
        updateStatusBadge();
        buildCarousel();
        buildTicker();
        attachMenuCardKeys();
        setupModal();
        setupParallax();
        setupScrollReveal();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
