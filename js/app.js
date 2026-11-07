// ================================
// ISI Game Switch - Main App JS
// Professional Edition
// ================================

let currentCart = JSON.parse(localStorage.getItem('switch_cart') || '[]');
let currentActiveGames = [];

function getActiveGamesDatabase() {
    if (currentActiveGames && currentActiveGames.length > 0) {
        return currentActiveGames;
    }
    const saved = localStorage.getItem('custom_games_database');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch(e) {
            return GAMES_DATABASE;
        }
    }
    return GAMES_DATABASE;
}

function getStoreSettings() {
    const defaultSettings = {
        waNumber: '6285155228041',
        waDisplay: '0851-5522-8041',
        instagram: 'isigameswitch',
        hours: '09.00 - 22.00 WIB',
        price1: '10.000',
        price5: '40.000',
        price10: '70.000',
        priceUnli: '150.000'
    };
    const saved = localStorage.getItem('switch_store_settings');
    if (saved) {
        try {
            return { ...defaultSettings, ...JSON.parse(saved) };
        } catch(e) {
            return defaultSettings;
        }
    }
    return defaultSettings;
}

function applyStoreSettings() {
    const s = getStoreSettings();
    const wa = s.waNumber.replace(/[^0-9]/g, '') || '6285155228041';

    // Update all WhatsApp links
    document.querySelectorAll('a[href*="wa.me/"]').forEach(a => {
        const href = a.getAttribute('href');
        const textParam = href.includes('text=') ? href.split('text=')[1] : '';
        if (textParam) {
            a.setAttribute('href', `https://wa.me/${wa}?text=${textParam}`);
        } else {
            a.setAttribute('href', `https://wa.me/${wa}`);
        }
    });

    // Username Instagram hanya boleh huruf, angka, titik, underscore
    const ig = String(s.instagram || '').replace(/[^A-Za-z0-9._]/g, '') || 'isigameswitch';

    // Update WhatsApp display text
    const contactItems = document.querySelectorAll('.contact-item');
    if (contactItems.length >= 3) {
        contactItems[0].innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            WhatsApp: ${escapeHtml(s.waDisplay || s.waNumber)}
        `;
        contactItems[1].innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            Instagram: @${escapeHtml(ig)}
        `;
        contactItems[2].innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Jam Operasional: ${escapeHtml(s.hours)}
        `;
    }

    // Update Instagram links
    document.querySelectorAll('a[href*="instagram.com/"]').forEach(a => {
        a.setAttribute('href', `https://instagram.com/${ig}`);
    });

    // Update package prices (textContent = aman dari HTML injection)
    const priceAmounts = document.querySelectorAll('.price-amount');
    if (priceAmounts.length >= 4) {
        if (s.price1) priceAmounts[0].textContent = s.price1;
        if (s.price5) priceAmounts[1].textContent = s.price5;
        if (s.price10) priceAmounts[2].textContent = s.price10;
        if (s.priceUnli) priceAmounts[3].textContent = s.priceUnli;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initGames();
    initSearch();
    initFilters();
    initSort();
    initBackToTop();
    initScrollAnimations();
    updateCartUI();
    applyStoreSettings();
});

// === Navbar ===
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const link = navLinks.querySelector(`a[href="#${sectionId}"]`);
            if (link) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLinks.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
}

// === Render Games ===
function initGames() {
    currentActiveGames = getActiveGamesDatabase();
    renderGames(currentActiveGames);

    // Hubungkan ke Firebase jika tersedia
    if (typeof initFirebaseApp === 'function' && initFirebaseApp()) {
        db.collection("games").orderBy("id", "asc").onSnapshot(snapshot => {
            if (!snapshot.empty) {
                const fbGames = [];
                snapshot.forEach(doc => {
                    fbGames.push({ docId: doc.id, ...doc.data() });
                });
                currentActiveGames = fbGames;
                filterGames();
                console.log("Realtime sync dari Firebase aktif:", fbGames.length, "game");
            }
        }, err => {
            console.warn("Firestore listener warning:", err);
        });

        // Sync settings toko
        db.collection("settings").doc("store").onSnapshot(doc => {
            if (doc.exists) {
                const s = doc.data();
                localStorage.setItem('switch_store_settings', JSON.stringify(s));
                applyStoreSettings();
            }
        });
    }
}

function renderGames(games) {
    const grid = document.getElementById('gameGrid');
    const noResults = document.getElementById('noResults');
    const resultCount = document.getElementById('resultCount');

    resultCount.innerHTML = `Menampilkan <strong>${games.length}</strong> game`;

    if (games.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    grid.innerHTML = games.map((game, index) => {
        const id = toSafeId(game.id);
        const genre = safeGenre(game.genre);
        const image = safeImageUrl(game.image);
        const badge = safeBadge(game.badge);
        const isSelected = currentCart.includes(id);
        const coverHtml = image
            ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(game.title)}" class="game-cover-img" loading="lazy" data-title="${escapeHtml(game.title)}" data-genre="${genre}" onerror="handleCoverError(this)">`
            : getAutoCoverHtml(game.title, genre);

        return `
            <div class="game-card ${isSelected ? 'in-cart' : ''}" onclick="handleCardClick(event, ${id})" style="animation-delay: ${Math.min(index * 0.02, 0.4)}s" title="${escapeHtml(game.title)}">
                <div class="game-card-image">
                    ${coverHtml}
                    <div class="game-card-select ${isSelected ? 'selected' : ''}" onclick="toggleCart(event, ${id})" title="${isSelected ? 'Hapus dari pilihan' : 'Pilih game'}">
                        ${isSelected ? '&#10003;' : '+'}
                    </div>
                    ${badge ? `<span class="game-card-badge badge-${badge}">${getBadgeText(badge)}</span>` : ''}
                </div>
                <div class="game-card-info">
                    <div class="game-card-title">${escapeHtml(game.title)}</div>
                    <div class="game-card-meta">
                        <span class="game-card-genre">${escapeHtml(capitalizeFirst(genre))}</span>
                        <span class="game-card-size">${escapeHtml(game.size)}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Ganti gambar yang gagal dimuat dengan cover gradient otomatis
function handleCoverError(img) {
    img.onerror = null;
    img.outerHTML = getAutoCoverHtml(img.dataset.title || '', safeGenre(img.dataset.genre));
}

function getAutoCoverHtml(title, genre) {
    return `
        <div class="game-cover-auto genre-${safeGenre(genre)}">
            <span class="game-cover-title">${escapeHtml(title)}</span>
        </div>
    `;
}

function getBadgeText(badge) {
    const badges = {
        new: 'NEW',
        popular: 'HOT',
        dlc: '+DLC'
    };
    return badges[badge] || '';
}

function capitalizeFirst(str) {
    str = String(str || '');
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ------------------------------------------
// Helper keamanan (mencegah XSS dari data database)
// ------------------------------------------

// Escape semua karakter spesial HTML, termasuk tanda kutip (aman untuk atribut)
function escapeHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

const ALLOWED_GENRES = ['action', 'adventure', 'rpg', 'racing', 'sport', 'puzzle', 'fighting', 'simulation', 'platformer'];

function safeGenre(genre) {
    return ALLOWED_GENRES.includes(genre) ? genre : 'action';
}

function safeBadge(badge) {
    return ['new', 'popular', 'dlc'].includes(badge) ? badge : null;
}

function toSafeId(id) {
    const n = Number(id);
    return Number.isFinite(n) ? n : 0;
}

// Hanya izinkan URL https:// atau path lokal (mis. covers/zelda.jpg),
// tanpa spasi, kutip, kurung, atau backslash yang bisa dipakai untuk injeksi
function safeImageUrl(url) {
    url = String(url || '').trim();
    if (!url) return '';
    if (!/^[^\s"'()<>\\`]+$/.test(url)) return '';
    if (/^https:\/\//i.test(url)) return url;
    if (/^[a-z]+:/i.test(url) || url.startsWith('//')) return ''; // blok javascript:, data:, http:, dll
    return url; // path relatif
}

// === Search ===
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    let debounceTimer;

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            filterGames();
        }, 200);
    });
}

// === Filters ===
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterGames();
        });
    });
}

// === Sort ===
function initSort() {
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', () => {
        filterGames();
    });
}

function filterGames() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    const sortValue = document.getElementById('sortSelect').value;

    let filtered = [...getActiveGamesDatabase()];

    // Filter by genre
    if (activeFilter !== 'all') {
        filtered = filtered.filter(game => game.genre === activeFilter);
    }

    // Filter by search
    if (searchQuery) {
        filtered = filtered.filter(game =>
            String(game.title || '').toLowerCase().includes(searchQuery) ||
            String(game.genre || '').toLowerCase().includes(searchQuery) ||
            String(game.description || '').toLowerCase().includes(searchQuery)
        );
    }

    // Sort
    switch (sortValue) {
        case 'name-asc':
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-desc':
            filtered.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'size-asc':
            filtered.sort((a, b) => parseSize(a.size) - parseSize(b.size));
            break;
        case 'size-desc':
            filtered.sort((a, b) => parseSize(b.size) - parseSize(a.size));
            break;
        default:
            break;
    }

    renderGames(filtered);
}

function parseSize(sizeStr) {
    sizeStr = String(sizeStr || '0');
    const num = parseFloat(sizeStr) || 0;
    if (sizeStr.includes('GB')) return num * 1024;
    return num;
}

// === Card Click (Modal vs Select) ===
function handleCardClick(event, gameId) {
    if (event.target.closest('.game-card-select')) {
        return;
    }
    openModal(gameId);
}

// === Cart Management ===
function toggleCart(event, gameId) {
    event.stopPropagation();
    const index = currentCart.indexOf(gameId);

    const db = getActiveGamesDatabase();
    if (index > -1) {
        currentCart.splice(index, 1);
        const game = db.find(g => g.id === gameId);
        showToast(`Dihapus: ${game ? game.title : ''}`);
    } else {
        currentCart.push(gameId);
        const game = db.find(g => g.id === gameId);
        showToast(`Ditambahkan: ${game ? game.title : ''}`);
    }

    localStorage.setItem('switch_cart', JSON.stringify(currentCart));
    updateCartUI();
    filterGames();
}

function clearCart() {
    currentCart = [];
    localStorage.removeItem('switch_cart');
    updateCartUI();
    filterGames();
    showToast('Pilihan game telah dikosongkan');
}

function updateCartUI() {
    const cartBar = document.getElementById('cartBar');
    const cartCount = document.getElementById('cartCount');
    const cartLabel = document.getElementById('cartLabel');

    const total = currentCart.length;
    cartCount.textContent = total;

    if (total > 0) {
        const db = getActiveGamesDatabase();
        let totalSize = 0;
        currentCart.forEach(id => {
            const game = db.find(g => g.id === id);
            if (game) totalSize += parseSize(game.size);
        });

        const sizeFormatted = totalSize >= 1024
            ? (totalSize / 1024).toFixed(1) + ' GB'
            : totalSize.toFixed(0) + ' MB';

        cartLabel.textContent = `${total} game dipilih (est. ${sizeFormatted})`;
        cartBar.classList.add('visible');
    } else {
        cartBar.classList.remove('visible');
    }
}

function orderCart() {
    if (currentCart.length === 0) return;

    const db = getActiveGamesDatabase();
    const selectedGames = currentCart
        .map(id => db.find(g => g.id === id))
        .filter(Boolean);

    let message = `Halo, saya mau order isi game Switch:\n\n`;

    selectedGames.forEach((game, index) => {
        message += `${index + 1}. ${game.title} (${game.size})\n`;
    });

    let totalSize = 0;
    selectedGames.forEach(g => {
        totalSize += parseSize(g.size);
    });

    const sizeFormatted = totalSize >= 1024
        ? (totalSize / 1024).toFixed(1) + ' GB'
        : totalSize.toFixed(0) + ' MB';

    message += `\nTotal: ${selectedGames.length} game (est. ${sizeFormatted})\n`;
    message += `\nMohon info total harga dan cara prosesnya ya. Terima kasih!`;

    const wa = getStoreSettings().waNumber.replace(/[^0-9]/g, '') || '6285155228041';
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${wa}?text=${encoded}`, '_blank');
}

// === Toast ===
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// === Modal ===
function openModal(gameId) {
    const game = getActiveGamesDatabase().find(g => g.id === gameId);
    if (!game) return;

    const modal = document.getElementById('gameModal');
    const modalBody = document.getElementById('modalBody');
    const isSelected = currentCart.includes(game.id);
    const wa = getStoreSettings().waNumber.replace(/[^0-9]/g, '') || '6285155228041';

    const genre = safeGenre(game.genre);
    const image = safeImageUrl(game.image);
    const waMessage = encodeURIComponent(`Halo, saya mau order game:\n\n*${game.title}*\nGenre: ${capitalizeFirst(genre)}\nUkuran: ${game.size}\nVersi: ${game.version}\n\nMohon info lebih lanjut ya!`);

    const imageHtml = image
        ? `<div class="modal-image">
               <div class="modal-image-backdrop" style="background-image: url('${escapeHtml(image)}')"></div>
               <img src="${escapeHtml(image)}" alt="${escapeHtml(game.title)}" class="modal-cover-main">
           </div>`
        : `<div class="modal-image genre-${genre}"><span class="modal-image-title">${escapeHtml(game.title)}</span></div>`;

    modalBody.innerHTML = `
        ${imageHtml}
        <div class="modal-info">
            <h2 class="modal-title">${escapeHtml(game.title)}</h2>
            <div class="modal-details">
                <span class="modal-detail-tag">Genre: ${escapeHtml(capitalizeFirst(genre))}</span>
                <span class="modal-detail-tag">Ukuran: ${escapeHtml(game.size)}</span>
                <span class="modal-detail-tag">Pemain: ${escapeHtml(game.players)}</span>
                <span class="modal-detail-tag">Versi: ${escapeHtml(game.version)}</span>
                ${game.dlc ? '<span class="modal-detail-tag">Include DLC</span>' : ''}
            </div>
            <p class="modal-description">${escapeHtml(game.description)}</p>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn btn-outline" style="flex: 1;" onclick="toggleCartFromModal(${toSafeId(game.id)})">
                    ${isSelected ? 'Hapus dari Pilihan' : '+ Pilih Game Ini'}
                </button>
                <a href="https://wa.me/${wa}?text=${waMessage}" target="_blank" class="btn btn-whatsapp" style="flex: 1;">
                    Order Langsung
                </a>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function toggleCartFromModal(gameId) {
    toggleCart(new Event('click'), gameId);
    closeModal();
}

function closeModal() {
    const modal = document.getElementById('gameModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('gameModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// === FAQ ===
function toggleFaq(btn) {
    const faqItem = btn.parentElement;
    const isActive = faqItem.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// === Back to Top ===
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 400);
    });
}

// === Scroll Animations ===
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.section-header, .feature-card, .pricing-card, .step-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}
