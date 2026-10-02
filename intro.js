/**
 * intro.js — Selector de sucursal de pantalla completa
 * Casa Condesa · Swipe/scroll vertical entre slides
 */
(function () {
    'use strict';

    // ── Datos de cada sucursal ──────────────────────────────────────────────
    const BRANCHES = [
        {
            key: 'casa-condesa',
            num: '01',
            name: 'Casa Condesa',
            nameLong: 'Casa\nCondesa',
            zone: 'Chapultepec Norte',
            subtitle: 'Terrazas con leones de cantera, plantas y el patio más instagrameable de Morelia.',
            badge: 'Chapultepec Norte',
        },
        {
            key: 'casa-madre',
            num: '02',
            name: 'Casa Madre',
            nameLong: 'Casa\nMadre',
            zone: 'Centro Histórico · Isidro Huarte',
            subtitle: 'Salón vintage en pleno corazón colonial de Morelia con arquitectura que enamora.',
            badge: 'Centro Histórico',
        },
        {
            key: 'fonda-centro',
            num: '03',
            name: 'Casa Fonda Centro',
            nameLong: 'Casa\nFonda',
            zone: 'Centro · García Obeso',
            subtitle: 'El rincón más acogedor del centro histórico, con divanes verdes y arte local.',
            badge: 'García Obeso',
        },
        {
            key: 'crema-nata',
            num: '04',
            name: 'Crema y Nata',
            nameLong: 'Crema\ny Nata',
            zone: 'Av. Acueducto',
            subtitle: 'Luz de vitral, atmósfera íntima y los mejores lattes frente al acueducto.',
            badge: 'Av. Acueducto',
        },
    ];

    // ── Estado ──────────────────────────────────────────────────────────────
    let currentSlide = 0;   // 0 = general, 1-4 = sucursales
    let totalSlides = 5;    // general + 4 sucursales
    let isAnimating = false;
    let touchStartY = 0;
    let lastWheelTime = 0;
    let selectedBranch = null;

    // ── Construcción del DOM ────────────────────────────────────────────────
    function buildIntro() {
        const overlay = document.createElement('div');
        overlay.id = 'intro-overlay';

        // Slides container
        const slidesContainer = document.createElement('div');
        slidesContainer.className = 'intro-slides-container';

        // ── Slide 0: General ───────────────────────────────────────────────
        const generalSlide = document.createElement('div');
        generalSlide.className = 'intro-slide intro-slide-general active';
        generalSlide.dataset.slideIndex = '0';

        const generalBg = document.createElement('div');
        generalBg.className = 'intro-slide-bg';

        const generalContent = document.createElement('div');
        generalContent.className = 'intro-slide-content';
        generalContent.innerHTML = `
            <p class="intro-eyebrow">
                <span class="intro-eyebrow-dot"></span>
                Morelia, Michoacán · 4 Sucursales
            </p>
            <h1 class="intro-slide-title">Casa<br><em>Condesa</em></h1>
            <p class="intro-slide-subtitle">
                Cocina sincera, panadería artesanal y café de especialidad.<br>
                Desliza hacia arriba y elige tu sucursal favorita.
            </p>
            <div class="intro-branches-grid" id="intro-branches-grid"></div>
        `;

        generalSlide.appendChild(generalBg);
        generalSlide.appendChild(generalContent);
        slidesContainer.appendChild(generalSlide);

        // Llenar el grid de sucursales en el slide general
        const grid = generalContent.querySelector('#intro-branches-grid');
        BRANCHES.forEach((branch, i) => {
            const card = document.createElement('button');
            card.className = 'intro-branch-card';
            card.setAttribute('aria-label', `Ver ${branch.name}`);
            card.dataset.branchIdx = String(i + 1);
            card.innerHTML = `
                <span class="intro-branch-card-num">${branch.num}</span>
                <span class="intro-branch-card-name">${branch.name}</span>
                <span class="intro-branch-card-zone">${branch.zone}</span>
                <span class="intro-branch-card-arrow">→</span>
            `;
            card.addEventListener('click', () => goToSlide(i + 1));
            grid.appendChild(card);
        });

        // ── Slides 1-4: Sucursales ─────────────────────────────────────────
        BRANCHES.forEach((branch, i) => {
            const slide = document.createElement('div');
            slide.className = 'intro-slide below';
            slide.dataset.slideIndex = String(i + 1);
            slide.dataset.branch = branch.key;

            const bg = document.createElement('div');
            bg.className = 'intro-slide-bg';

            const content = document.createElement('div');
            content.className = 'intro-slide-content';
            content.innerHTML = `
                <span class="intro-branch-badge">
                    <span class="intro-eyebrow-dot"></span>
                    ${branch.badge}
                </span>
                <p class="intro-eyebrow">
                    <span class="intro-eyebrow-dot"></span>
                    Sucursal ${branch.num} de 04
                </p>
                <h2 class="intro-slide-title">${branch.nameLong.replace('\n', '<br>')}</h2>
                <p class="intro-slide-subtitle">${branch.subtitle}</p>
                <button class="intro-cta-btn" data-branch-key="${branch.key}">
                    Entrar a ${branch.name}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
            `;

            // CTA button: entra a la página con esa sucursal activa
            content.querySelector('.intro-cta-btn').addEventListener('click', () => {
                enterSite(branch.key);
            });

            slide.appendChild(bg);
            slide.appendChild(content);
            slidesContainer.appendChild(slide);
        });

        overlay.appendChild(slidesContainer);

        // ── UI fija: logo, skip, progress, hint, counter ───────────────────
        // Logo + Skip
        const logoBar = document.createElement('div');
        logoBar.className = 'intro-logo';
        logoBar.innerHTML = `
            <div class="intro-logo-brand">
                Casa Condesa
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22c4.97-4.97 4.97-10.61 0-14.58C7.03 11.39 7.03 17.03 12 22z"/>
                    <path d="M12 22c-4.97-4.97-4.97-10.61 0-14.58C16.97 11.39 16.97 17.03 12 22z"/>
                    <path d="M12 7.42V22"/>
                </svg>
            </div>
            <button class="intro-skip-btn" id="intro-skip-btn">Saltar intro</button>
        `;
        document.body.appendChild(logoBar);

        // Progress dots
        const progress = document.createElement('div');
        progress.className = 'intro-progress';
        progress.id = 'intro-progress';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'intro-progress-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Ir al slide ${i + 1}`);
            dot.dataset.dotIndex = String(i);
            dot.addEventListener('click', () => goToSlide(i));
            progress.appendChild(dot);
        }
        document.body.appendChild(progress);

        // Scroll hint
        const hint = document.createElement('div');
        hint.className = 'intro-scroll-hint';
        hint.id = 'intro-scroll-hint';
        hint.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="m6 9 6 6 6-6"/>
            </svg>
            Desliza
        `;
        document.body.appendChild(hint);

        // Counter
        const counter = document.createElement('div');
        counter.className = 'intro-slide-counter';
        counter.id = 'intro-slide-counter';
        counter.textContent = '01 / 05';
        document.body.appendChild(counter);

        // Append overlay
        document.body.prepend(overlay);

        // Bloquear scroll del body mientras el intro está activo
        document.body.style.overflow = 'hidden';

        // Skip button
        document.getElementById('intro-skip-btn').addEventListener('click', () => {
            enterSite(null);
        });

        // Eventos de scroll/touch/teclado
        attachEvents();
    }

    // ── Navegación entre slides ─────────────────────────────────────────────
    function goToSlide(index) {
        if (isAnimating || index === currentSlide) return;
        if (index < 0 || index >= totalSlides) return;

        isAnimating = true;
        const direction = index > currentSlide ? 1 : -1;
        const slides = document.querySelectorAll('.intro-slide');

        // Slide saliente
        slides[currentSlide].classList.remove('active');
        slides[currentSlide].classList.add(direction > 0 ? 'above' : 'below');

        // Slide entrante
        slides[index].classList.remove('above', 'below');
        slides[index].classList.add('active');

        currentSlide = index;
        updateUI();

        setTimeout(() => { isAnimating = false; }, 780);
    }

    function updateUI() {
        // Dots
        document.querySelectorAll('.intro-progress-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });

        // Counter
        const counter = document.getElementById('intro-slide-counter');
        if (counter) {
            const pad = n => String(n + 1).padStart(2, '0');
            counter.textContent = `${pad(currentSlide)} / ${pad(totalSlides - 1)}`;
        }

        // Scroll hint: ocultar cuando no es el primer slide
        const hint = document.getElementById('intro-scroll-hint');
        if (hint) {
            hint.classList.toggle('hide', currentSlide > 0);
        }
    }

    // ── Entrar al sitio ─────────────────────────────────────────────────────
    function enterSite(branchKey) {
        selectedBranch = branchKey;

        const overlay = document.getElementById('intro-overlay');
        const logoBar = document.querySelector('.intro-logo');
        const progress = document.getElementById('intro-progress');
        const hint = document.getElementById('intro-scroll-hint');
        const counter = document.getElementById('intro-slide-counter');

        // Animar salida
        if (overlay) overlay.classList.add('exit');

        // Restaurar scroll
        document.body.style.overflow = '';

        setTimeout(() => {
            // Eliminar elementos del intro
            if (overlay) overlay.remove();
            if (logoBar) logoBar.remove();
            if (progress) progress.remove();
            if (hint) hint.remove();
            if (counter) counter.remove();

            // Activar la sucursal seleccionada en la página principal
            if (branchKey && window.setBranch) {
                window.setBranch(branchKey);
                // Scroll suave a la sección de ubicaciones
                const ubSection = document.getElementById('ubicaciones');
                if (ubSection) {
                    ubSection.scrollIntoView({ behavior: 'smooth' });
                }
            }

            // Disparar evento por si el app.js lo necesita
            document.dispatchEvent(new CustomEvent('introComplete', {
                detail: { branch: branchKey }
            }));
        }, 680);
    }

    // ── Eventos de navegación ───────────────────────────────────────────────
    function attachEvents() {
        // Wheel / scroll
        window.addEventListener('wheel', onWheel, { passive: false });

        // Touch
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchend', onTouchEnd, { passive: true });

        // Teclado
        window.addEventListener('keydown', onKeyDown);
    }

    function onWheel(e) {
        const overlay = document.getElementById('intro-overlay');
        if (!overlay) return;
        e.preventDefault();

        const now = Date.now();
        if (now - lastWheelTime < 600) return;
        lastWheelTime = now;

        if (e.deltaY > 30) {
            goToSlide(currentSlide + 1);
        } else if (e.deltaY < -30) {
            goToSlide(currentSlide - 1);
        }
    }

    function onTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }

    function onTouchEnd(e) {
        const overlay = document.getElementById('intro-overlay');
        if (!overlay) return;

        const delta = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(delta) < 40) return;

        if (delta > 0) {
            goToSlide(currentSlide + 1);
        } else {
            goToSlide(currentSlide - 1);
        }
    }

    function onKeyDown(e) {
        const overlay = document.getElementById('intro-overlay');
        if (!overlay) return;

        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            goToSlide(currentSlide + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            goToSlide(currentSlide - 1);
        } else if (e.key === 'Escape') {
            enterSite(null);
        }
    }

    // ── Init ────────────────────────────────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildIntro);
    } else {
        buildIntro();
    }

})();
