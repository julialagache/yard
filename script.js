// ===================== STATE =====================
const state = {
    color: 'ff7f00',
    colorName: 'Orange Hockney',
    size: 'M',
    qty: 1,
    model: 'courte',
    cart: [],
    wishlist: false,
};

// ===================== NAVBAR =====================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    const sections = ['hero', 'concept', 'configurateur', 'galerie'];
    let current = 'hero';
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 150) current = id;
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
});

hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (mobileMenu.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
});

function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}

document.getElementById('nav-cta-btn').addEventListener('click', () => {
    document.getElementById('configurateur').scrollIntoView({ behavior: 'smooth' });
});

// ===================== COLOR LOGIC =====================
function updateVesteColor(hexColor) {
    // Always update SVG paths (visible only on "courte" model)
    document.querySelectorAll('#veste-complete path').forEach(path => {
        path.style.fill = '#' + hexColor;
    });
    state.color = hexColor;
}

// Called by jscolor as a string callback
function updateVeste(picker) {
    const hex = picker.toHEXString().replace('#', '');
    updateVesteColor(hex);
    state.colorName = 'Couleur personnalisée';
    document.getElementById('color-name-display').textContent = 'Couleur personnalisée';
    document.querySelectorAll('.preset-color').forEach(b => b.classList.remove('active'));
}

// Preset color buttons
document.querySelectorAll('.preset-color:not(.preset-custom)').forEach(btn => {
    btn.addEventListener('click', () => {
        const color = btn.dataset.color;
        const name  = btn.dataset.name;
        updateVesteColor(color);
        state.colorName = name;
        document.querySelectorAll('.preset-color').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('color-name-display').textContent = name;
        document.getElementById('custom-color-row').style.display = 'none';
    });
});

// Custom color picker toggle
document.getElementById('custom-color-btn').addEventListener('click', () => {
    const row = document.getElementById('custom-color-row');
    row.style.display = row.style.display === 'none' ? 'flex' : 'none';
    document.querySelectorAll('.preset-color').forEach(b => b.classList.remove('active'));
    document.getElementById('custom-color-btn').classList.add('active');
});

window.addEventListener('load', () => {
    const customInput = document.getElementById('custom-jscolor');
    if (customInput && window.jscolor) {
        new jscolor(customInput, { onFineChange: 'updateVeste(this)', value: 'ff7f00' });
    }
});

// ===================== MODEL SWITCHER =====================
const modelImages = {
    courte:     'Veste.jpg',
    sansmanche: 'veste-sansmanche.jpg',
    longue:     'veste-longue.jpg',
};
const modelLabels = {
    courte:     'Veste Courte',
    sansmanche: 'Sans Manches',
    longue:     'Veste Longue',
};
const modelRefs = {
    courte:     'YD-VH-001',
    sansmanche: 'YD-VH-002',
    longue:     'YD-VH-003',
};

function switchModel(modelKey) {
    state.model = modelKey;

    const bgImg = document.getElementById('background-image');
    const svg   = document.getElementById('product-svg');

    // Fade out → swap → fade in
    bgImg.style.transition = 'opacity 0.2s ease';
    bgImg.style.opacity = '0';

    setTimeout(() => {
        bgImg.src = modelImages[modelKey];
        // Show SVG overlay only for "courte" (paths calibrated on that silhouette)
        svg.style.opacity = modelKey === 'courte' ? '1' : '0';
        bgImg.onload = () => { bgImg.style.opacity = '1'; };
        if (bgImg.complete) bgImg.style.opacity = '1';
    }, 220);

    // Update text
    const titleEl     = document.getElementById('product-title');
    const refEl       = document.getElementById('product-ref');
    const modelNameEl = document.getElementById('model-name-display');
    if (titleEl)     titleEl.textContent     = `Veste YARD ${modelLabels[modelKey]} — Édition Hockney`;
    if (refEl)       refEl.textContent       = `Réf. ${modelRefs[modelKey]} · ${modelLabels[modelKey]} · Édition limitée`;
    if (modelNameEl) modelNameEl.textContent = modelLabels[modelKey];

    // Active button state
    document.querySelectorAll('.model-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.model === modelKey);
    });
}

document.querySelectorAll('.model-btn').forEach(btn => {
    btn.addEventListener('click', () => switchModel(btn.dataset.model));
});

// ===================== SIZE SELECTOR =====================
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.size = btn.dataset.size;
    });
});

// ===================== QUANTITY =====================
const qtyMinus = document.getElementById('qty-minus');
const qtyPlus  = document.getElementById('qty-plus');
const qtyValue = document.getElementById('qty-value');

qtyMinus.addEventListener('click', () => {
    if (state.qty > 1) { state.qty--; qtyValue.textContent = state.qty; animateQty(); }
});
qtyPlus.addEventListener('click', () => {
    if (state.qty < 10) { state.qty++; qtyValue.textContent = state.qty; animateQty(); }
});

function animateQty() {
    qtyValue.style.transform = 'scale(1.3)';
    qtyValue.style.color = 'var(--magenta)';
    setTimeout(() => { qtyValue.style.transform = ''; qtyValue.style.color = ''; }, 200);
}

// ===================== CART =====================
const cartBtn        = document.getElementById('cart-btn');
const cartDrawer     = document.getElementById('cart-drawer');
const cartOverlay    = document.getElementById('cart-overlay');
const cartCount      = document.getElementById('cart-count');
const cartItems      = document.getElementById('cart-items');
const cartEmpty      = document.getElementById('cart-empty');
const cartFooter     = document.getElementById('cart-footer');
const cartTotalPrice = document.getElementById('cart-total-price');

cartBtn.addEventListener('click', openCart);

function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

document.getElementById('add-to-cart-btn').addEventListener('click', addToCart);

function addToCart() {
    const item = {
        id:         Date.now(),
        name:       `Veste YARD ${modelLabels[state.model]}`,
        color:      state.color,
        colorName:  state.colorName,
        size:       state.size,
        qty:        state.qty,
        price:      289,
        modelLabel: modelLabels[state.model],
        imgSrc:     modelImages[state.model],
        filter:     'none',
    };
    state.cart.push(item);
    updateCartUI();
    showToast(`${item.modelLabel} ${item.colorName} — Taille ${item.size} ajoutée !`);
    openCart();

    const btn = document.getElementById('add-to-cart-btn');
    btn.textContent = '✓ Ajouté !';
    btn.style.background = 'var(--green)';
    btn.style.borderColor = 'var(--green)';
    setTimeout(() => {
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> Ajouter au panier`;
        btn.style.background = '';
        btn.style.borderColor = '';
    }, 2000);
}

function removeFromCart(id) {
    state.cart = state.cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const total = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const count = state.cart.reduce((sum, item) => sum + item.qty, 0);

    cartCount.textContent = count;
    cartCount.classList.toggle('visible', count > 0);

    if (state.cart.length === 0) {
        cartEmpty.style.display = 'flex';
        cartFooter.style.display = 'none';
    } else {
        cartEmpty.style.display = 'none';
        cartFooter.style.display = 'block';
        cartTotalPrice.textContent = total.toFixed(2).replace('.', ',') + ' €';
    }

    cartItems.querySelectorAll('.cart-item').forEach(el => el.remove());

    state.cart.forEach(item => {
        const el = document.createElement('div');
        el.className = 'cart-item';
        const filterAttr = item.filter && item.filter !== 'none' ? `style="filter:${item.filter}"` : '';
        el.innerHTML = `
            <img src="${item.imgSrc || 'Veste.jpg'}" alt="${item.name}" class="cart-item-img" ${filterAttr}>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-details">
                    <span class="cart-item-color-swatch" style="background:#${item.color}"></span>
                    ${item.colorName} · Taille ${item.size} · Qté ${item.qty}
                </div>
                <div class="cart-item-price">${(item.price * item.qty).toFixed(2).replace('.', ',')} €</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
        `;
        cartItems.appendChild(el);
    });
}

// ===================== WISHLIST =====================
document.getElementById('wishlist-add-btn').addEventListener('click', () => {
    state.wishlist = !state.wishlist;
    document.getElementById('wishlist-add-btn').classList.toggle('active', state.wishlist);
    if (state.wishlist) showToast('Ajouté à vos favoris ♥');
});

// ===================== TOAST =====================
function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===================== BOUTIQUE CARDS =====================
document.querySelectorAll('.boutique-card').forEach(card => {
    card.querySelectorAll('.bsize-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            card.querySelectorAll('.bsize-btn').forEach(b => b.classList.remove('bsize-selected'));
            btn.classList.add('bsize-selected');
        });
    });

    const wl = card.querySelector('.boutique-wishlist');
    if (wl) {
        wl.addEventListener('click', () => {
            wl.classList.toggle('active');
            if (wl.classList.contains('active')) showToast('Ajouté à vos favoris ♥');
        });
    }

    const addBtn = card.querySelector('.boutique-add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const colorName    = card.dataset.colorName;
            const colorHex     = card.dataset.colorHex;
            const selectedSize = card.querySelector('.bsize-selected')?.dataset.size || 'M';
            const item = {
                id:         Date.now(),
                name:       'Veste YARD',
                color:      colorHex,
                colorName:  colorName,
                size:       selectedSize,
                qty:        1,
                price:      289,
                modelLabel: 'Veste Courte',
                imgSrc:     'Veste.jpg',
                filter:     card.dataset.filter || 'none',
            };
            state.cart.push(item);
            updateCartUI();
            showToast(`${colorName} — Taille ${selectedSize} ajoutée !`);
            openCart();

            addBtn.classList.add('added');
            addBtn.textContent = '✓ Ajouté !';
            setTimeout(() => {
                addBtn.classList.remove('added');
                addBtn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> Ajouter au panier`;
            }, 2000);
        });
    }
});

// ===================== PALETTE SWATCHES → CONFIG =====================
document.querySelectorAll('.palette-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
        const hexMatch = swatch.style.background.match(/#([a-fA-F0-9]{3,6})/);
        if (!hexMatch) return;
        const hex = hexMatch[1];
        updateVesteColor(hex);
        const preset = document.querySelector(`.preset-color[data-color="${hex.toLowerCase()}"]`);
        if (preset) {
            document.querySelectorAll('.preset-color').forEach(b => b.classList.remove('active'));
            preset.classList.add('active');
            state.colorName = preset.dataset.name;
            document.getElementById('color-name-display').textContent = preset.dataset.name;
        }
        document.getElementById('configurateur').scrollIntoView({ behavior: 'smooth' });
    });
});

// ===================== SCROLL ANIMATIONS =====================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll(
    '.concept-text, .concept-visual, .config-header, .product-controls, .boutique-card, .footer-brand, .footer-col'
).forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.7s ease ${i * 0.08}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s`;
    observer.observe(el);
});

// ===================== INIT =====================
updateVesteColor(state.color);
updateCartUI();
