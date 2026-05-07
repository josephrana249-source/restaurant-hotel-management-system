/* ================================================================
   RHMS — Page Renderers: Home, Menu, Rooms, Cart, Auth, Dashboard, Admin
   ================================================================ */

/* ── Home Page ────────────────────────────────────────────── */
function renderHomePage() {
  const user = Store.currentUser();
  if (user && user.role === 'admin') { Router.navigate('/admin'); return; }

  const food = Store.get('food').filter(f => f.stock !== 0).slice(0, 4);
  const rooms = Store.get('rooms').filter(r => r.status === 'active').slice(0, 8);

  document.getElementById('app').innerHTML = renderNavbar() + `
  <main>
    <!-- Hero -->
    <section class="hero" style="padding-bottom: var(--space-3xl)">
      <div class="hero-bg"></div>
      <div class="container" style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:var(--space-2xl)">
        <div class="hero-content animate-in" style="text-align:center; max-width:900px; margin:0 auto">
          <h1 class="heading-xl">
            Restaurant & Hotel Management System 
          </h1>
          <p class="hero-desc" style="margin-left:auto; margin-right:auto">Experience world-class dining and luxurious stays under one roof.<br> Every dish tells a story, every building promises comfort beyond imagination.</p>
          <div class="hero-actions">
            <a href="#/menu" class="btn btn-primary btn-lg" style="box-shadow:0 0 20px var(--primary-glow)">Explore Menu</a>
            <a href="#/rooms" class="btn btn-secondary btn-lg">Book a House</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Food -->
    <section class="section" style="background:var(--bg-secondary)">
      <div class="container">
        <div class="section-header">
          <h2 class="heading-lg">Get our delicious meals served to you!</h2>
          <p class="body-lg">Handcrafted with passion by our award-winning chefs</p>
        </div>
        <div class="home-rooms-grid">
          ${food.map((f, i) => `
          <div class="card food-card animate-in animate-in-delay-${i + 1}">
            <div class="card-img" style="background:url('${f.img}') center/cover no-repeat"><span class="card-category">${f.category}</span><span class="card-price">${formatCurrency(f.price)}</span></div>
            <div class="card-body">
              <h3 class="card-title">${f.name}</h3>
              <p class="card-desc">${f.desc}</p>
              <div class="card-footer">
                <span class="body-sm">${f.category}</span>
                <button class="btn btn-primary btn-sm" onclick="${Store.isLoggedIn() ? `Store.addToCart('${f.id}');showToast('Added to cart','success');Router.navigate(Router.currentPath())` : `showToast('Please log in first','error');Router.navigate('/login')`}">Add to Cart</button>
              </div>
            </div>
          </div>`).join('')}
        </div>
        <div class="text-center mt-xl">
          <a href="#/menu" class="btn btn-outline">View Full Menu →</a>
        </div>
      </div>
    </section>

    <!-- Featured Houses -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="heading-lg">Just like your home!</h2>
          <p class="body-lg">Enjoy our experience</p>
        </div>
        <div class="home-rooms-grid">
          ${rooms.slice(0, 4).map((r, i) => {
            const images = r.images && r.images.length ? r.images : [r.img || ''];
            return `
            <div class="card room-card animate-in animate-in-delay-${i + 1}">
              <div class="card-img-container">
                <div class="card-img-track" id="track-${r.id}" onclick="openRoomDetailsModal('${r.id}')">
                  ${images.map(img => `<div class="card-img-slide" style="background-image:url('${img}')"></div>`).join('')}
                </div>
                <button class="carousel-btn prev" onclick="event.stopPropagation(); scrollCarousel('track-${r.id}', -1)">❮</button>
                <button class="carousel-btn next" onclick="event.stopPropagation(); scrollCarousel('track-${r.id}', 1)">❯</button>
                <div class="card-img-dots" id="dots-${r.id}">
                  ${images.map((_, idx) => `<span class="dot ${idx === 0 ? 'active' : ''}"></span>`).join('')}
                </div>
                <span class="card-price">${formatCurrency(r.price)}/night</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">${r.name}</h3>
                <div class="card-amenities">${r.amenities.slice(0, 3).map(a => `<span class="amenity-tag">${a}</span>`).join('')}</div>
                <div class="card-footer">
                  <span class="body-sm">${r.capacity} guests</span>
                  <button class="btn btn-primary btn-sm" onclick="openBookingModal('${r.id}')">Reserve Now</button>
                </div>
              </div>
            </div>`;
          }).join('')}
        </div>
        <div class="text-center mt-xl">
          <a href="#/rooms" class="btn btn-outline">View All Properties →</a>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="section" style="background:var(--bg-secondary)">
      <div class="container">
        <div class="section-header">
          <h2 class="heading-lg">What Our Guests Say</h2>
        </div>
        <div class="testimonials-grid">
          ${[
            { name: 'Sarah Mitchell', role: 'Food Critic', text: 'The finest dining experience I have had in years. Every dish is a masterpiece of flavor and presentation.', initials: 'SM' },
            { name: 'James Chen', role: 'Business Traveler', text: 'Impeccable houses with stunning views. The staff goes above and beyond to make every stay memorable.', initials: 'JC' },
            { name: 'Maria Rodriguez', role: 'Travel Blogger', text: 'From the gourmet breakfast to the luxurious spa, RHMS sets the gold standard for hospitality.', initials: 'MR' }
          ].map(t => `
          <div class="testimonial-card">
            <div class="stars">★★★★★</div>
            <blockquote>"${t.text}"</blockquote>
            <div class="author">
              <div class="author-avatar">${t.initials}</div>
              <div class="author-info"><h4>${t.name}</h4><p>${t.role}</p></div>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </section>
  </main>
  ${renderFooter()}`;
  initNavbar();
}

function openBookingModal(roomId) {
  if (!Store.isLoggedIn()) { showToast('Please log in to book a house', 'error'); Router.navigate('/login'); return; }
  const room = Store.get('rooms').find(r => r.id === roomId);
  if (!room) return;
  document.body.insertAdjacentHTML('beforeend', renderBookingModal(room));
}

window.openRoomDetailsModal = function(roomId) {
  const modalHTML = renderRoomDetailsModal(roomId);
  if (modalHTML) {
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    window.location.hash = `#/rooms/${roomId}`;
  }
};

window.openRoomGallery = function(roomId) {
  const room = Store.get('rooms').find(r => r.id === roomId);
  if (!room) return;
  const images = room.images && room.images.length ? room.images : [room.img || ''];
  const galleryHtml = `
    <div class="modal-overlay" id="roomGalleryModal" onclick="if(event.target===this) this.remove();">
      <div class="modal room-gallery-modal">
        <button class="rdm-close" onclick="document.getElementById('roomGalleryModal').remove()">✕</button>
        <div class="gallery-grid">
          ${images.map(img => `
            <div class="gallery-image-container" style="background-image:url('${img}')"></div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', galleryHtml);
};

window.setRoomGalleryMainImage = function(roomId, imageUrl) {
  const main = document.getElementById(`rdm-gallery-main-${roomId}`);
  if (!main || !imageUrl) return;
  main.style.backgroundImage = `url('${imageUrl}')`;
};

/* ── Menu Page ────────────────────────────────────────────── */
function renderMenuPage() {
  const user = Store.currentUser();
  if (user && user.role === 'admin') { Router.navigate('/admin'); return; }

  const allFood = Store.get('food').filter(f => f.stock !== 0);
  const categories = ['All', ...new Set(allFood.map(f => f.category))];

  document.getElementById('app').innerHTML = renderNavbar() + `
  <main class="section" style="padding-top:100px;min-height:100vh">
    <div class="container">
      <div class="section-header" style="text-align:left; display:flex; align-items:flex-end; justify-content:space-between; flex-wrap:wrap; gap:var(--space-md)">
        <div>
          <p class="heading-sm">Our Menu</p>
          <h1 class="heading-lg" style="margin-bottom:0">Delicious Food & Drinks</h1>
        </div>
        <button class="filter-trigger-btn" onclick="toggleFilterDrawer('menuDrawer')">
          <span class="filter-icon">🎛️</span> Filters
        </button>
      </div>
      <div class="items-grid" id="menuGrid">
        ${renderFoodCards(allFood)}
      </div>
    </div>
  </main>
  <!-- Filter Drawer Overlay -->
  <div class="filter-drawer-backdrop" id="menuDrawerBackdrop" onclick="toggleFilterDrawer('menuDrawer')"></div>
  <aside class="filter-drawer" id="menuDrawer">
    <div class="filter-drawer-header">
      <span class="filter-drawer-title">🎛️ Filters</span>
      <button class="filter-drawer-close" onclick="toggleFilterDrawer('menuDrawer')">✕</button>
    </div>
    <div class="filter-section">
      <div class="filter-section-title">Category</div>
      <div class="filter-pill-group" id="menuFilters">
        ${categories.map(c => `<button class="filter-pill ${c === 'All' ? 'active' : ''}" onclick="filterMenu('${c}')"><span class="filter-pill-dot"></span>${c}</button>`).join('')}
      </div>
    </div>
    <div class="filter-section">
      <div class="filter-section-title">Search</div>
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" id="menuSearch" placeholder="Search dishes..." oninput="filterMenu()">
      </div>
    </div>
    <div class="filter-section">
      <div class="filter-section-title">Price Range</div>
      <select id="menuPriceRange" class="filter-select" onchange="filterMenu()">
        <option value="all">Any Price</option>
        <option value="low">Under KSh 500</option>
        <option value="mid">KSh 500 - 1,000</option>
        <option value="high">Over KSh 1,000</option>
      </select>
    </div>
    <div class="filter-section">
      <div class="filter-section-title">Sort By</div>
      <select id="menuSort" class="filter-select" onchange="filterMenu()">
        <option value="recommended">Recommended</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
    <div class="filter-drawer-footer">
      <button class="btn btn-outline" onclick="resetMenuFilters()">Reset All</button>
    </div>
  </aside>
  ${renderFooter()}`;
  initNavbar();
}

function renderFoodCards(items) {
  if (!items.length) return `
    <div class="empty-state">
      <div class="empty-icon">🍽️</div>
      <h3>No dishes found</h3>
      <p>Try a different filter or search term</p>
    </div>`;
  return items.map(f => `
    <div class="card food-card">
      <div class="card-img" style="background:url('${f.img || ''}') center/cover no-repeat"><span class="card-category">${f.category}</span><span class="card-price">${formatCurrency(f.price)}</span></div>
      <div class="card-body">
        <h3 class="card-title">${f.name}</h3>
        <p class="card-desc">${f.desc}</p>
        <div class="card-footer">
          <span class="body-sm">${f.category}</span>
          <button class="btn btn-primary btn-sm" onclick="${Store.isLoggedIn() ? `Store.addToCart('${f.id}');showToast('${f.name} added to cart','success');refreshCartCount()` : `showToast('Please log in first','error');Router.navigate('/login')`}">Add to Cart</button>
        </div>
      </div>
    </div>`).join('');
}

function filterMenu(category) {
  if (category) {
    window.currentMenuCategory = category;
    document.querySelectorAll('#menuFilters .filter-pill').forEach(t => t.classList.toggle('active', t.textContent === category));
  }
  const activeCategory = window.currentMenuCategory || 'All';
  const menuSearchElem = document.getElementById('menuSearch');
  const search = ((menuSearchElem && menuSearchElem.value) || '').toLowerCase();
  const menuPriceElem = document.getElementById('menuPriceRange');
  const priceRange = (menuPriceElem && menuPriceElem.value) || 'all';
  const menuSortElem = document.getElementById('menuSort');
  const sort = (menuSortElem && menuSortElem.value) || 'recommended';

  let food = Store.get('food').filter(f => f.stock !== 0);
  if (activeCategory !== 'All') food = food.filter(f => f.category === activeCategory);
  if (search) food = food.filter(f => f.name.toLowerCase().includes(search) || f.desc.toLowerCase().includes(search));
  if (priceRange === 'low') food = food.filter(f => f.price < 500);
  else if (priceRange === 'mid') food = food.filter(f => f.price >= 500 && f.price <= 1000);
  else if (priceRange === 'high') food = food.filter(f => f.price > 1000);
  if (sort === 'price-asc') food.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') food.sort((a, b) => b.price - a.price);
  document.getElementById('menuGrid').innerHTML = renderFoodCards(food);
}

function resetMenuFilters() {
  window.currentMenuCategory = 'All';
  const search = document.getElementById('menuSearch');
  const price = document.getElementById('menuPriceRange');
  const sort = document.getElementById('menuSort');
  if (search) search.value = '';
  if (price) price.value = 'all';
  if (sort) sort.value = 'recommended';
  document.querySelectorAll('#menuFilters .filter-pill').forEach(t => t.classList.toggle('active', t.textContent === 'All'));
  document.getElementById('menuGrid').innerHTML = renderFoodCards(Store.get('food'));
  toggleFilterDrawer('menuDrawer');
}

function refreshCartCount() {
  const badge = document.querySelector('.cart-count');
  const count = Store.cartCount();
  if (badge) badge.textContent = count;
  else if (count > 0) {
    const cart = document.querySelector('.nav-cart');
    if (cart && !cart.querySelector('.cart-count')) cart.insertAdjacentHTML('beforeend', `<span class="cart-count">${count}</span>`);
  }
}

/* ── Houses Page ─────────────────────────────────────────── */
function renderRoomsPage() {
  const user = Store.currentUser();
  if (user && user.role === 'admin') { Router.navigate('/admin'); return; }

  const allRooms = Store.get('rooms').filter(r => r.status === 'active');
  const types = ['All', ...new Set(allRooms.map(r => r.name))];

  document.getElementById('app').innerHTML = renderNavbar() + `
  <main class="section" style="padding-top:100px;min-height:100vh">
    <div class="container">
      <div class="section-header" style="text-align:left; display:flex; align-items:flex-end; justify-content:space-between; flex-wrap:wrap; gap:var(--space-md)">
        <div>
          <p class="heading-sm">Estates</p>
          <h1 class="heading-lg" style="margin-bottom:0">Featured Houses</h1>
        </div>
        <button class="filter-trigger-btn" onclick="toggleFilterDrawer('roomDrawer')">
          <span class="filter-icon">🎛️</span> Filters
        </button>
      </div>
      <div class="items-grid" id="roomGrid">
        ${renderRoomCards(allRooms)}
      </div>
    </div>
  </main>
  <!-- Filter Drawer Overlay -->
  <div class="filter-drawer-backdrop" id="roomDrawerBackdrop" onclick="toggleFilterDrawer('roomDrawer')"></div>
  <aside class="filter-drawer" id="roomDrawer">
    <div class="filter-drawer-header">
      <span class="filter-drawer-title">🎛️ Filters</span>
      <button class="filter-drawer-close" onclick="toggleFilterDrawer('roomDrawer')">✕</button>
    </div>
    <div class="filter-section">
      <div class="filter-section-title">Houses</div>
      <div class="filter-pill-group" id="roomFilters">
        ${types.map(t => `<button class="filter-pill ${t === 'All' ? 'active' : ''}" onclick="filterRooms('${t}')"><span class="filter-pill-dot"></span>${t}</button>`).join('')}
      </div>
    </div>
    <div class="filter-section">
      <div class="filter-section-title">Search</div>
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" id="roomSearch" placeholder="Search houses..." oninput="filterRooms()">
      </div>
    </div>
    <div class="filter-section">
      <div class="filter-section-title">Price Range</div>
      <select id="roomPriceRange" class="filter-select" onchange="filterRooms()">
        <option value="all">Any Price</option>
        <option value="budget">Under KSh 10,000</option>
        <option value="mid">KSh 10,000 - 20,000</option>
        <option value="luxury">Over KSh 20,000</option>
      </select>
    </div>
    <div class="filter-section">
      <div class="filter-section-title">Sort By</div>
      <select id="roomSort" class="filter-select" onchange="filterRooms()">
        <option value="recommended">Recommended</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
    <div class="filter-drawer-footer">
      <button class="btn btn-outline" onclick="resetRoomFilters()">Reset All</button>
    </div>
  </aside>
  ${renderFooter()}`;
  initNavbar();

  const pathParts = window.location.hash.split('/');
  if (pathParts[1] === 'rooms' && pathParts[2]) {
    const roomId = pathParts[2];
    setTimeout(() => {
      if (!document.getElementById('roomDetailsModal')) {
        const modalHTML = renderRoomDetailsModal(roomId);
        if (modalHTML) document.body.insertAdjacentHTML('beforeend', modalHTML);
      }
    }, 100);
  }
}

function renderRoomCards(items) {
  if (!items.length) return `
    <div class="empty-state">
      <div class="empty-icon">🏛️</div>
      <h3>No properties found</h3>
      <p>Try a different filter</p>
    </div>`;
  return items.map(r => {
    const images = (r.images || []).filter(img => img && img.trim()).length ? r.images.filter(img => img && img.trim()) : [r.img || ''].filter(img => img && img.trim());
    return `
    <div class="card room-card">
      <div class="card-img-container">
        <div class="card-img-track" id="track-p-${r.id}" onclick="openRoomDetailsModal('${r.id}')">
          ${images.map(img => `<div class="card-img-slide" style="background-image:url('${img}')"></div>`).join('')}
        </div>
        <button class="carousel-btn prev" onclick="event.stopPropagation(); scrollCarousel('track-p-${r.id}', -1)">❮</button>
        <button class="carousel-btn next" onclick="event.stopPropagation(); scrollCarousel('track-p-${r.id}', 1)">❯</button>
        <div class="card-img-dots" id="dots-p-${r.id}">
          ${images.map((_, idx) => `<span class="dot ${idx === 0 ? 'active' : ''}"></span>`).join('')}
        </div>
        <span class="card-price">${formatCurrency(r.price)}/night</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${r.name}</h3>
        <div class="card-amenities">${r.amenities.slice(0, 3).map(a => `<span class="amenity-tag">${a}</span>`).join('')}</div>
        <div class="card-footer">
          <span class="body-sm">${r.capacity} guests</span>
          <button class="btn btn-primary btn-sm" onclick="openBookingModal('${r.id}')">Reserve</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function filterRooms(type) {
  if (type) {
    window.currentRoomType = type;
    document.querySelectorAll('#roomFilters .filter-pill').forEach(t => t.classList.toggle('active', t.textContent === type));
  }
  const activeType = window.currentRoomType || 'All';
  const roomSearchElem = document.getElementById('roomSearch');
  const search = ((roomSearchElem && roomSearchElem.value) || '').toLowerCase();
  const roomPriceElem = document.getElementById('roomPriceRange');
  const priceRange = (roomPriceElem && roomPriceElem.value) || 'all';
  const roomSortElem = document.getElementById('roomSort');
  const sort = (roomSortElem && roomSortElem.value) || 'recommended';

  let rooms = Store.get('rooms').filter(r => r.status === 'active');
  if (activeType !== 'All') rooms = rooms.filter(r => r.name === activeType);
  if (search) rooms = rooms.filter(r => r.name.toLowerCase().includes(search) || r.desc.toLowerCase().includes(search));
  if (priceRange === 'budget') rooms = rooms.filter(r => r.price < 10000);
  else if (priceRange === 'mid') rooms = rooms.filter(r => r.price >= 10000 && r.price <= 20000);
  else if (priceRange === 'luxury') rooms = rooms.filter(r => r.price > 20000);
  if (sort === 'price-asc') rooms.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') rooms.sort((a, b) => b.price - a.price);
  document.getElementById('roomGrid').innerHTML = renderRoomCards(rooms);
}

function resetRoomFilters() {
  window.currentRoomType = 'All';
  const search = document.getElementById('roomSearch');
  const price = document.getElementById('roomPriceRange');
  const sort = document.getElementById('roomSort');
  if (search) search.value = '';
  if (price) price.value = 'all';
  if (sort) sort.value = 'recommended';
  document.querySelectorAll('#roomFilters .filter-pill').forEach(t => t.classList.toggle('active', t.textContent === 'All'));
  document.getElementById('roomGrid').innerHTML = renderRoomCards(Store.get('rooms').filter(r => r.status === 'active'));
  toggleFilterDrawer('roomDrawer');
}

/* ── Cart Page ────────────────────────────────────────────── */
function renderCartPage() {
  const user = Store.currentUser();
  if (user && user.role === 'admin') { Router.navigate('/admin'); return; }

  const cart = Store.get('cart');
  const food = Store.get('food');
  const items = cart.map(c => { const f = food.find(x => x.id === c.foodId); return f ? { ...f, qty: c.qty, subtotal: f.price * c.qty } : null; }).filter(Boolean);
  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  document.getElementById('app').innerHTML = renderNavbar() + `
  <main class="cart-page">
    <div class="container">
      <h1 class="heading-lg" style="margin-bottom:var(--space-xl)">Your Cart</h1>
      ${items.length ? `
      <div class="cart-layout">
        <div>
          ${items.map(i => `
          <div class="cart-item">
            <div class="cart-item-img" style="background:url('${i.img || ''}') center/cover no-repeat"></div>
            <div class="cart-item-info">
              <h3>${i.name}</h3>
              <p>${i.category} · ${formatCurrency(i.price)} each</p>
              <div class="cart-item-actions">
                <div class="qty-control">
                  <button onclick="Store.updateCartQty('${i.id}',${i.qty - 1});renderCartPage()">−</button>
                  <span>${i.qty}</span>
                  <button onclick="Store.updateCartQty('${i.id}',${i.qty + 1});renderCartPage()">+</button>
                </div>
                <button class="btn btn-sm" style="color:var(--danger)" onclick="Store.removeFromCart('${i.id}');showToast('Removed from cart','info');renderCartPage()">Remove</button>
                <span class="cart-item-price">${formatCurrency(i.subtotal)}</span>
              </div>
            </div>
          </div>`).join('')}
        </div>
        <div class="cart-summary">
          <h2>Order Summary</h2>
          <div class="summary-row"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
          <div class="summary-row"><span>Tax (10%)</span><span>${formatCurrency(tax)}</span></div>
          <div class="summary-row total"><span>Total</span><span>${formatCurrency(total)}</span></div>
          <button class="btn btn-primary btn-lg" style="width:100%; margin-top:var(--space-lg)" onclick="goToCheckout()">Continue to Checkout</button>
        </div>
      </div>` : `
      <div class="empty-state">
        <div class="empty-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Browse our menu and add items to get started</p>
        <a href="#/menu" class="btn btn-primary">Browse Menu</a>
      </div>`}
    </div>
  </main>
  ${renderFooter()}`;
  initNavbar();
}

function goToCheckout() {
  const cart = Store.get('cart');
  if (!cart.length) {
    showToast('Your cart is empty', 'error');
    Router.navigate('/cart');
    return;
  }

  const food = Store.get('food');
  const items = cart.map(c => {
    const f = food.find(x => x.id === c.foodId);
    return f ? { ...f, qty: c.qty, subtotal: f.price * c.qty } : null;
  }).filter(Boolean);

  if (!items.length) {
    showToast('Your cart is empty', 'error');
    return;
  }

  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  window._checkoutState = {
    step: 1,
    items,
    subtotal,
    tax,
    total,
    address: '',
    phone: ''
  };
  Router.navigate('/checkout');
}

function checkoutContinue() {
  const addressElem = document.getElementById('orderAddress');
  const phoneElem = document.getElementById('orderPhone');
  const address = addressElem ? addressElem.value.trim() : '';
  const phone = phoneElem ? phoneElem.value.trim() : '';
  if (!address) { showToast('Please enter a delivery address', 'error'); return; }
  if (!phone) { showToast('Please enter a phone number', 'error'); return; }

  if (!window._checkoutState) return;
  window._checkoutState.address = address;
  window._checkoutState.phone = phone;
  window._checkoutState.step = 2;
  renderCheckoutPage();
}

function checkoutBack() {
  if (!window._checkoutState) return;
  window._checkoutState.step = Math.max(1, window._checkoutState.step - 1);
  renderCheckoutPage();
}

function renderCheckoutPage() {
  const state = window._checkoutState;
  if (!state || !(state.items && state.items.length)) {
    Router.navigate('/cart');
    return;
  }

  const activeStep = state.step || 1;
  document.getElementById('app').innerHTML = renderNavbar() + `
  <main class="checkout-page">
    <div class="container" style="max-width:600px; margin:0 auto;">
      <div class="checkout-card checkout-card-lg">
        <div class="checkout-stepper">
          <div class="step-item ${activeStep === 1 ? 'active' : activeStep > 1 ? 'completed' : ''}">
            <span>1</span>
            <p>Delivery</p>
          </div>
          <div class="step-connector"></div>
          <div class="step-item ${activeStep === 2 ? 'active' : activeStep > 2 ? 'completed' : ''}">
            <span>2</span>
            <p>Payment</p>
          </div>
          <div class="step-connector"></div>
          <div class="step-item ${activeStep === 3 ? 'active' : ''}">
            <span>3</span>
            <p>Complete</p>
          </div>
        </div>

        ${activeStep === 1 ? `
        <div class="checkout-panel">
          <div class="form-group mt-lg">
            <label class="form-label">Delivery Address</label>
            <input type="text" class="form-input" id="orderAddress" placeholder="e.g. Ruwenzori Hostel, Room 4B" value="${state.address}">
          </div>
          <div class="form-group mt-lg">
            <label class="form-label">Mobile Wallet Phone (for M-Pesa STK)</label>
            <div class="phone-input-group">
              <span class="phone-prefix">+254</span>
              <input type="tel" class="phone-input-field" id="orderPhone" placeholder="711112222" maxlength="9" value="${state.phone || ''}" oninput="this.value = this.value.replace(/^0/, '').replace(/\D/g, '')">
            </div>
          </div>

          <div class="checkout-actions">
            <button class="btn btn-primary btn-lg" onclick="checkoutContinue()">Continue to Payment</button>
          </div>
        </div>` : activeStep === 2 ? `
        <div class="checkout-panel">
          <p class="checkout-note">An STK Push request will be sent to <strong>${formatMpesaPhone(state.phone) || state.phone}</strong>.</p>
          <div class="payment-card">
            <div class="payment-header">
              <span class="payment-icon">💳</span>
              <div>
                <h3>M-PESA</h3>
                <p>Safaricom Mobile Payment</p>
              </div>
            </div>
          </div>
          <div class="summary-row summary-row-compact"><span>Order Total</span><span>${formatCurrency(state.total)}</span></div>
          <div class="checkout-actions">
            <button class="btn btn-primary btn-lg" onclick="startCartPayment()">Pay ${formatCurrency(state.total)}</button>
          </div>
        </div>` : `
        <div class="checkout-panel">
          <h2>Order Confirmed</h2>
          <p class="checkout-note">Your payment is complete and your order has been placed successfully.</p>
          <div class="checkout-actions">

            <button class="btn btn-secondary btn-lg" onclick="Router.navigate('/dashboard/orders')">View Orders</button>
            <button class="btn btn-primary btn-lg" onclick="Router.navigate('/')">Back to Home</button>
          </div>
        </div>`}
      </div>
    </div>
  </main>
  ${renderFooter()}`;
  initNavbar();
}

function placeOrder(address) {
  const order = Store.placeOrder(address, 'M-Pesa');
  if (order) {
    if (document.getElementById('paymentLoaderModal')) document.getElementById('paymentLoaderModal').remove();
    window._checkoutState = window._checkoutState || {};
    window._checkoutState.order = order;
    window._checkoutState.step = 3;
    showToast('Order placed successfully!', 'success');
    renderCheckoutPage();
  }
}

function startCartPayment() {
  const state = window._checkoutState || {};
  const address = state.address ? state.address.trim() : '';
  const phoneRaw = state.phone ? state.phone.trim() : '';
  const phone = typeof formatMpesaPhone === 'function' ? formatMpesaPhone(phoneRaw) : null;
  const cart = Store.get('cart');
  if (!address) { showToast('Please enter a delivery address', 'error'); return; }
  if (!phone) { showToast('Please enter a valid phone number', 'error'); return; }
  if (!cart.length) { showToast('Your cart is empty', 'error'); return; }

  const total = state.total || 0;
  
  window._pendingFoodOrder = { address, phone, total };
  document.body.insertAdjacentHTML('beforeend', renderPaymentLoaderModal(total));

  // Always attempt real STK push first — backend falls back to simulation if API unreachable
  fetch('api/mpesa_stk.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, amount: total })
  })
  .then(res => res.json())
  .then(data => {
    const responseCode = data.ResponseCode || data.responseCode;
    const checkoutRequestID = data.CheckoutRequestID || data.checkoutRequestID;
    
    if (responseCode === '0' && checkoutRequestID) {
      window._pendingFoodOrder.checkoutRequestID = checkoutRequestID;
      showToast('Payment request sent!', 'success');
      
      if (typeof pollMpesaStatus === 'function') {

        pollMpesaStatus(checkoutRequestID, () => placeOrder(address), (message) => {
          if (document.getElementById('paymentLoaderModal')) document.getElementById('paymentLoaderModal').remove();
          showToast(message || 'Payment failed', 'error');
        });
      }
    } else {
      const modal = document.getElementById('paymentLoaderModal');
      const isLocalHost = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' || 
                          window.location.hostname.startsWith('192.168.');
      
      if (modal && isLocalHost && !data.simulated) {
          const body = modal.querySelector('.modal');
          body.innerHTML += `
            <div style="margin-top:var(--space-lg); padding:var(--space-md); background:rgba(217, 119, 6, 0.1); border-radius:var(--radius-md); border:1px solid rgba(217, 119, 6, 0.2)">
              <p style="font-size:0.85rem; color:#b45309; margin-bottom:var(--space-sm)">Real STK Push failed (Connection issue). Test with simulation?</p>
              <button class="btn btn-primary btn-sm" style="width:100%; background:#d97706; border:none" onclick="document.getElementById('paymentLoaderModal').remove(); forceSimulateOrder()">Use Simulation Mode</button>
            </div>`;
          return;
      }
      
      if (modal) modal.remove();
      showToast(formatPaymentError(data), 'error');
    }
  })
  .catch(err => {
    console.error(err);
    const modal = document.getElementById('paymentLoaderModal');
    if (modal) modal.remove();
    showToast('Network error triggering payment', 'error');
  });
}

window.forceSimulateOrder = function() {
  const { address, phone, total } = window._pendingFoodOrder;
  showToast('Switching to simulation...', 'info');
  document.body.insertAdjacentHTML('beforeend', renderPaymentLoaderModal(total));

  fetch('api/mpesa_stk.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, amount: total, simulate: true })
  })
  .then(res => res.json())
  .then(data => {
    const checkoutRequestID = data.CheckoutRequestID || data.checkoutRequestID;
    if (checkoutRequestID) {
      window._pendingFoodOrder.checkoutRequestID = checkoutRequestID;
      pollMpesaStatus(checkoutRequestID, () => placeOrder(address), (msg) => {
        if (document.getElementById('paymentLoaderModal')) document.getElementById('paymentLoaderModal').remove();
        showToast(msg, 'error');
      });
    }
  });
}



/* ── Auth Pages ───────────────────────────────────────────── */
function renderLoginPage() {
  const user = Store.currentUser();
  if (user) {
    if (user.role === 'admin') Router.navigate('/admin');
    else Router.navigate('/');
    return;
  }
  document.getElementById('app').innerHTML = `
  <div class="auth-page">
    <div class="hero-bg"></div>
    <div class="auth-card animate-in">
      <div class="auth-header">
        <div class="logo">R<span>HMS</span></div>
        <p>Sign in to manage your bookings and orders</p>
      </div>
      <form onsubmit="handleLoginAsync(event)" autocomplete="off">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" class="form-input" id="loginEmail" placeholder="johndoe@gmail.com" required autocomplete="off">
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <div class="password-group">
            <input type="password" class="form-input" id="loginPassword" placeholder="••••••••" required autocomplete="new-password">
            <button type="button" class="password-toggle" onclick="togglePassword('loginPassword', this)">👁️</button>
          </div>
        </div>
        <button type="submit" class="btn btn-primary btn-lg" style="width:100%">Sign In</button>
      </form>
      <div class="auth-footer">Don't have an account? <a href="#/signup">Sign up</a></div>
    </div>
  </div>`;

  if (window._signupEmail || window._signupPassword) {
    setTimeout(() => {
      if (window._signupEmail) document.getElementById('loginEmail').value = window._signupEmail;
      if (window._signupPassword) document.getElementById('loginPassword').value = window._signupPassword;
      window._signupEmail = null;
      window._signupPassword = null;
    }, 0);
  }
}




async function handleLoginAsync(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const result = await Store.login(email, password);
  if (result && !result.error) { 
    showToast(`Welcome back, ${result.name}!`, 'success'); 
    if (result.role === 'admin') Router.navigate('/admin');
    else Router.navigate('/');
  } else {
    showToast('Invalid email or password', 'error');
  }
}

function renderSignupPage() {
  document.getElementById('app').innerHTML = `
  <div class="auth-page">
    <div class="hero-bg"></div>
    <div class="auth-card animate-in">
      <div class="auth-header">
        <div class="logo">R<span>HMS</span></div>
        <p>Create an account to start booking</p>
      </div>
      <form onsubmit="handleSignupAsync(event)" autocomplete="off">
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" class="form-input" id="signName" required autocomplete="off">
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" class="form-input" id="signEmail" required autocomplete="off">
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <div class="password-group">
            <input type="password" class="form-input" id="signPass" required minlength="8" placeholder="At least 8 characters with uppercase, lowercase, numbers & special chars" autocomplete="new-password">
            <button type="button" class="password-toggle" onclick="togglePassword('signPass', this)">👁️</button>
          </div>
          <small style="color:var(--text-secondary);font-size:0.8rem;margin-top:0.25rem;display:block">Must contain uppercase, lowercase, numbers, and special characters</small>
        </div>
        <button type="submit" class="btn btn-primary btn-lg" style="width:100%">Create Account</button>
      </form>
      <div class="auth-footer">Already have an account? <a href="#/login">Sign in</a></div>
    </div>
  </div>`;
}

async function handleSignupAsync(e) {
  e.preventDefault();
  const name = document.getElementById('signName').value.trim();
  const email = document.getElementById('signEmail').value.trim();
  const password = document.getElementById('signPass').value;
  const user = await Store.signup({ name, email, password });
  
  if (user && !user.error) { 
    showToast('Account created successfully! Please sign in.', 'success'); 
    window._signupEmail = email;
    window._signupPassword = password;
    Router.navigate('/login'); 
  } else if (user && user.error) {
    showToast(user.error, 'error');
  } else {
    showToast('Email already exists', 'error');
  }
}

function renderVerificationPage() {
  const email = window._verifyEmail || '';
  if (!email) {
    Router.navigate('/login');
    return;
  }

  document.getElementById('app').innerHTML = `
  <div class="auth-page">
    <div class="hero-bg"></div>
    <div class="auth-card animate-in">
      <div class="auth-header">
        <div class="logo">R<span>HMS</span></div>
        <h2>Verify your Gmail</h2>
        <p>Enter the 6-digit code sent to<br><strong>${email}</strong></p>
      </div>
      <form onsubmit="handleVerification(event, '${email}')">
        <div class="form-group">
          <label class="form-label" style="text-align:center">Verification Code</label>
          <input type="text" class="form-input" id="verCode" maxlength="6" 
                 placeholder="000000" style="text-align:center; font-size:1.5rem; letter-spacing:0.5em; font-weight:700" required>
        </div>
        <button type="submit" class="btn btn-primary btn-lg" style="width:100%">Verify Account</button>
      </form>
      <div style="text-align:center; margin-top:var(--space-md)">
        <p class="body-sm">Didn't receive the code?</p>
        <button class="btn btn-secondary btn-sm" style="margin-top:var(--space-xs)" onclick="resendVerCode('${email}')">Resend Code</button>
      </div>
      <div class="auth-footer"><a href="#/login">Back to Sign In</a></div>
    </div>
  </div>`;
}

function handleVerification(e, email) {
  e.preventDefault();
  const code = document.getElementById('verCode').value.trim();
  const result = Store.verifyUser(email, code);
  
  if (result.success) {
    showToast('Email verified successfully! You can now log in.', 'success');
    Router.navigate('/login');
  } else {
    showToast(result.error || 'Invalid code', 'error');
  }
}

function resendVerCode(email) {
  const newCode = Store.resendVerificationCode(email);
  if (newCode) {
    showToast('Sending new verification code...', 'info');
    
    // Call the PHP API to send the email
    fetch('api/send_verify_email.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, name: 'User', code: newCode })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showToast('New verification code sent!', 'success');
        if (data.simulated) console.log(`[LOCAL DEV] Mail function unavailable. Code is: ${newCode}`);
      } else {
        showToast('Failed to send email...', 'warning');
      }
    })
    .catch(err => console.error(err));

  } else {
    showToast('Unexpected error resending code', 'error');
  }
}

/* ── User Dashboard ───────────────────────────────────────── */
function renderDashboardPage(tab) {
  if (!Store.isLoggedIn()) { Router.navigate('/login'); return; }
  const user = Store.currentUser();
  const activeTab = tab || 'overview';
  const orders = Store.get('orders').filter(o => o.userId === user.id);
  const bookings = Store.get('bookings').filter(b => b.userId === user.id);
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  const tabs = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'orders', icon: '🛒', label: 'My Orders' },
    { id: 'bookings', icon: '🏨', label: 'My Bookings' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
    { id: 'profile', icon: '⚙️', label: 'Settings' }
  ];

  let content = '';
  if (activeTab === 'overview') {
    const totalSpent = orders.reduce((s, o) => s + o.total, 0) + bookings.reduce((s, b) => s + b.totalPrice, 0);
    content = `
      <div class="profile-hero">
        <div class="profile-hero-banner"></div>
        <div class="profile-hero-body">
          <div class="profile-hero-avatar">${initials}</div>
          <div class="profile-hero-info">
            <h2 class="profile-hero-name">${user.name}</h2>
            <p class="profile-hero-email">${user.email}</p>
          </div>
          <button class="btn btn-outline btn-sm btn-compact" onclick="Router.navigate('/dashboard/profile')" style="margin-left:auto">Settings</button>
        </div>
      </div>
      <div class="profile-stats">
        <div class="profile-stat-card">
          <div class="profile-stat-value">${orders.length}</div>
          <div class="profile-stat-label">Total Orders</div>
        </div>
        <div class="profile-stat-card">
          <div class="profile-stat-value">${bookings.length}</div>
          <div class="profile-stat-label">Total Bookings</div>
        </div>
        <div class="profile-stat-card">
          <div class="profile-stat-value">${formatCurrency(totalSpent)}</div>
          <div class="profile-stat-label">Total Spent</div>
        </div>
      </div>`;
  } else if (activeTab === 'orders') {
    content = orders.length ? `
      <div class="table-wrapper"><table class="table">
        <thead><tr><th>Order ID</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>${orders.map(o => `<tr>
          <td style="font-family:monospace">#${o.id.substring(0,6)}</td>
          <td style="font-weight:700">${formatCurrency(o.total)}</td>
          <td>${statusBadge(o.status)}</td>
          <td>${formatDate(o.date)}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="document.body.insertAdjacentHTML('beforeend', renderOrderTrackingModal('${o.id}'))">Track Order</button>
          </td>
        </tr>`).join('')}</tbody>
      </table></div>` : `

      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <h3>No orders yet</h3>
        <p>Your hungry moments will appear here once you place an order.</p>
        <a href="#/menu" class="btn btn-primary btn-sm" style="margin-top:var(--space-md)">Browse Menu</a>
      </div>`;
  } else if (activeTab === 'bookings') {
    content = bookings.length ? `
      <div class="table-wrapper"><table class="table">
        <thead><tr><th>Booking ID</th><th>Building</th><th>Room</th><th>Stay Dates</th><th>Status</th></tr></thead>
        <tbody>${bookings.map(b => `<tr><td>${b.id}</td><td>${b.roomName}</td><td><strong>${b.allocatedRoom || 'TBA'}</strong></td><td>${formatDate(b.checkIn)} - ${formatDate(b.checkOut)}</td><td>${statusBadge(b.status)}</td></tr>`).join('')}</tbody>
      </table></div>` : `
      <div class="empty-state">
        <div class="empty-icon">🏨</div>
        <h3>No bookings yet</h3>
        <p>Your luxury stays will be listed here after your first reservation.</p>
        <a href="#/rooms" class="btn btn-primary btn-sm" style="margin-top:var(--space-md)">Book a House</a>
      </div>`;
  } else if (activeTab === 'profile') {
    content = `
      <div class="settings-layout">
        <div class="settings-card">
          <div class="settings-card-header"><h3>Profile Settings</h3></div>
          <div class="settings-card-body">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-input" id="profName" value="${user.name}">
            </div>
            <button class="btn btn-primary" onclick="updateProfile()">Save Changes</button>
          </div>
        </div>
      </div>`;
  } else if (activeTab === 'notifications') {
    const notifications = [];
    
    // 1. Order Updates
    orders.forEach(o => {
      notifications.push({
        id: `ord-${o.id}`,
        type: 'payment',
        title: 'Order status update',
        message: `Your food order <strong>#${o.id.substring(0,6)}</strong> is currently <strong>${o.status}</strong>.`,
        time: formatDate(o.date),
        icon: '🍕'
      });
    });

    // 2. Booking Updates
    bookings.forEach(b => {
      notifications.push({
        id: `bk-${b.id}`,
        type: 'booking',
        title: 'Stay confirmed',
        message: `Your reservation at <strong>${b.roomName}</strong> is <strong>${b.status}</strong> for ${formatDate(b.checkIn)}.`,
        time: formatDate(b.date || b.checkIn),
        icon: '🏨'
      });
    });

    // 3. Welcome Notification
    notifications.push({
      id: 'welcome',
      type: 'booking',
      title: 'Welcome to RHMS!',
      message: `Welcome <strong>${user.name}</strong>! We are thrilled to have you here. Explore our menu or book a luxury stay to get started.`,
      time: formatDate(user.joined || new Date()),
      icon: '✨'
    });

    // Sort by id/time (newest first)
    notifications.sort((a,b) => b.id.localeCompare(a.id));

    content = `
    <div class="animate-in">
      <div class="notification-list">
        ${notifications.length ? notifications.map(n => `
          <div class="notification-item ${n.type === 'booking' ? 'booking-alert' : 'payment-alert'}">
            <div class="notification-icon-container ${n.type === 'booking' ? 'notification-type-booking' : 'notification-type-payment'}">
              ${n.icon}
            </div>
            <div class="notification-content">
              <div class="notification-header">
                <span class="notification-title">${n.title}</span>
                <span class="notification-time">${n.time}</span>
              </div>
              <p class="notification-message">${n.message}</p>
            </div>
          </div>
        `).join('') : '<div class="empty-state"><h3>No new notifications</h3><p>We\'ll alert you here when your orders or bookings update.</p></div>'}
      </div>
    </div>`;
  }

  document.getElementById('app').innerHTML = renderNavbar() + `
  <div class="dashboard">
    <aside class="sidebar">
      <div class="sidebar-section">
        <div class="sidebar-label">Guest Portal</div>
        ${tabs.map(t => `<button class="sidebar-link ${activeTab === t.id ? 'active' : ''}" onclick="Router.navigate('/dashboard/${t.id}')"><span>${t.icon}</span> ${t.label}</button>`).join('')}
      </div>
      <div class="sidebar-section" style="margin-top:var(--space-lg)">
        <button class="sidebar-link sidebar-link-compact" onclick="handleLogout()" style="color:var(--danger)"><span>🚪</span> Logout</button>
      </div>
    </aside>
    <div class="dashboard-content">
      <div class="dashboard-header"><h1>${tabs.find(t => t.id === activeTab).label}</h1></div>
      ${content}
    </div>
  </div>`;
  initNavbar();
}

function updateProfile() {
  const name = document.getElementById('profName').value.trim();
  if (!name) return;
  const users = Store.get('users');
  const user = Store.currentUser();
  const u = users.find(x => x.id === user.id);
  if (u) { u.name = name; Store.set('users', users); Store.set('currentUser', { ...u }); showToast('Profile updated', 'success'); renderDashboardPage('profile'); }
}
