document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Datos y Lógica del Mapa y Sucursales
    const branches = {
        'casa-condesa': {
            name: 'Casa Condesa',
            badge: 'Chapultepec Norte',
            address: 'Gral. Mariano Monterde 175, Chapultepec Nte., 58260 Morelia, Mich.',
            hours: 'Lunes a Viernes 8:00 – 17:00 · Sábados y Domingos 9:00 – 16:30',
            phone: '443 128 0465',
            callPhone: '+524431280465'
        },
        'casa-madre': {
            name: 'Casa Madre Condesa',
            badge: 'Centro Histórico (Isidro Huarte)',
            address: 'C. Isidro Huarte 87, CENTRO, 58000 Morelia, Mich.',
            hours: 'Lunes a Viernes 8:00 – 17:00 · Sábados y Domingos 9:00 – 16:30',
            phone: '443 128 0465',
            callPhone: '+524431280465'
        },
        'fonda-centro': {
            name: 'Casa Fonda Centro',
            badge: 'Centro Histórico (García Obeso)',
            address: 'García Obeso 169, Centro histórico de Morelia, 58000 Morelia, Mich.',
            hours: 'Lunes a Viernes 8:00 – 17:00 · Sábados y Domingos 9:00 – 16:30',
            phone: '443 128 0465',
            callPhone: '+524431280465'
        },
        'crema-nata': {
            name: 'Condesa "Crema y nata"',
            badge: 'Av. Acueducto',
            address: 'Av Acueducto 1254, Chapultepec Nte., 58260 Morelia, Mich.',
            hours: 'Lunes a Viernes 8:00 – 17:00 · Sábados y Domingos 9:00 – 16:30',
            phone: '443 128 0465',
            callPhone: '+524431280465'
        }
    };

    const branchTabButtons = document.querySelectorAll('.branch-tab-btn');
    const branchBadgeEl = document.getElementById('branch-badge');
    const branchNameEl = document.getElementById('branch-name');
    const branchAddressEl = document.getElementById('branch-address');
    const branchHoursEl = document.getElementById('branch-hours');
    const branchPhoneEl = document.getElementById('branch-phone');
    const branchDirectionsEl = document.getElementById('branch-directions');
    const branchCallEl = document.getElementById('branch-call');

    function setBranch(branchKey) {
        const data = branches[branchKey];
        if (!data) return;

        // Actualizar pestañas activas
        branchTabButtons.forEach(b => {
            b.setAttribute('aria-selected', b.dataset.branch === branchKey ? 'true' : 'false');
        });

        // Actualizar textos e información
        if (branchBadgeEl) branchBadgeEl.textContent = data.badge;
        if (branchNameEl) branchNameEl.textContent = data.name;
        if (branchAddressEl) branchAddressEl.textContent = data.address;
        if (branchHoursEl) branchHoursEl.textContent = data.hours;
        if (branchPhoneEl) branchPhoneEl.textContent = data.phone;
        if (branchCallEl) branchCallEl.href = 'tel:' + data.callPhone;
        
        if (branchDirectionsEl) {
            branchDirectionsEl.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(data.address);
        }

        // Alternar iframe del mapa sin destruir la URL 
        document.querySelectorAll('.map-iframe').forEach(iframe => {
            iframe.classList.remove('active');
        });
        
        const activeMap = document.getElementById('map-' + branchKey);
        if (activeMap) {
            activeMap.classList.add('active');
        }
    }

    branchTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setBranch(btn.dataset.branch);
        });
    });

    document.querySelectorAll('[data-select-branch]').forEach(link => {
        link.addEventListener('click', () => {
            setBranch(link.dataset.selectBranch);
        });
    });

    // 2. Toggle del Menú Móvil
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        mobileMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 3. Sistema de Filtros del Menú
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card:not(.hidden)'); 

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            const filter = btn.dataset.filter;

            menuCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

});