/* ================================================================
   RHMS — Reusable Components: Navbar, Footer, Sidebar, Modals
   ================================================================ */

function renderNavbar() {
  const user = Store.currentUser();
  const cartCount = Store.cartCount();
  const currentPath = Router.currentPath();

  const navLink = (path, label) =>
    `<a href="#${path}" class="nav-link ${currentPath === path ? 'active' : ''}">${label}</a>`;

  return `
  <nav class="navbar">
    <div class="navbar-inner">
      <a href="#/" class="navbar-brand">
        <div class="brand-icon">🏨</div>
        <div style="line-height:1.2">
          <div style="font-family:var(--font-sans);font-size:0.75rem;font-weight:700;color:var(--primary);letter-spacing:0.08em;text-transform:uppercase">Restaurant & Hotel Management System</div>
        </div>
      </a>

      <div class="nav-links" id="navLinks">
        ${user && user.role === 'admin' ? '' : `
          ${navLink('/', 'Home')}
          ${navLink('/menu', 'Menu')}
          ${navLink('/rooms', 'Houses')}
          ${user ? navLink('/dashboard', 'Dashboard') : ''}
        `}
      </div>

      <div class="nav-actions">
        ${user ? renderUserActions(user, cartCount) : `
          <a href="#/login" class="btn btn-secondary btn-sm">Log In</a>
          <a href="#/signup" class="btn btn-primary btn-sm">Sign Up</a>
        `}
        <div class="nav-toggle" id="navToggle" onclick="toggleMobileNav()">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  </nav>`;
}

function renderUserActions(user, cartCount) {
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  const isAdmin = user.role === 'admin';
  
  return `
    ${!isAdmin ? `
      <a href="#/cart" class="nav-cart" title="Cart">
        🛒
        ${cartCount > 0 ? `<span class="cart-count">${cartCount}</span>` : ''}
      </a>
    ` : ''}
    <div style="position:relative">
      <div class="nav-avatar" id="avatarBtn" title="${user.name}">${initials}</div>
      <div class="nav-dropdown" id="avatarDropdown">
        <div class="nav-dropdown-item" style="pointer-events:none;opacity:0.7">
          <span>👤</span> ${user.name}
        </div>
        <div class="nav-dropdown-divider"></div>
        ${isAdmin ? `
          <button class="nav-dropdown-item" onclick="Router.navigate('/admin/settings')">
            <span>⚙️</span> System Settings
          </button>
        ` : `
          <button class="nav-dropdown-item" onclick="Router.navigate('/dashboard')">
            <span>📊</span> Dashboard
          </button>
          <button class="nav-dropdown-item" onclick="Router.navigate('/dashboard/profile')">
            <span>⚙️</span> Settings
          </button>
        `}
        <div class="nav-dropdown-divider"></div>
        <button class="nav-dropdown-item" onclick="handleLogout()" style="color:var(--danger)">
          <span>🚪</span> Logout
        </button>
      </div>
    </div>`;
}

function initNavbar() {
  const avatarBtn = document.getElementById('avatarBtn');
  const dropdown = document.getElementById('avatarDropdown');
  if (avatarBtn && dropdown) {
    avatarBtn.addEventListener('click', (e) => { e.stopPropagation(); dropdown.classList.toggle('show'); });
    document.addEventListener('click', () => dropdown.classList.remove('show'));
  }
}

function toggleMobileNav() {
  const links = document.getElementById('navLinks');
  if (links) links.classList.toggle('mobile-open');
}

function handleLogout() {
  Store.logout();
  showToast('Logged out successfully', 'success');
  if (Router.currentPath() === '/' || Router.currentPath() === '') {
    window.dispatchEvent(new Event('hashchange'));
  } else {
    Router.navigate('/');
  }
}

function renderFooter() {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">R<span>HMS</span></div>
          <p class="footer-desc">Premium dining and luxury house management in Meru. Experience world-class hospitality under the care of Joseph Rana.</p>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <a href="#/">Home</a>
          <a href="#/menu">Food Menu</a>
          <a href="#/rooms">Houses</a>
          <a href="#/login">Login</a>
        </div>
        <div class="footer-col">
          <h4>Cuisine</h4>
          <a href="#/menu">Appetizers</a>
          <a href="#/menu">Main Course</a>
          <a href="#/menu">Desserts</a>
          <a href="#/menu">Beverages</a>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <a href="#">📍 Meru, Kenya</a>
          <a href="#">📞 +254 712 345 678</a>
          <a href="#">✉️ joseph@rhms.com</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 RHMS. All rights reserved.</span>
      </div>
    </div>
  </footer>`;
}

function renderBookingModal(room) {
  const today = getMinDate();
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  return `
  <div class="modal-overlay" id="bookingModal" onclick="if(event.target===this)this.remove()">
    <div class="modal">
      <div class="modal-header">
        <h2>Book ${room.name}</h2>
        <button class="modal-close" onclick="document.getElementById('bookingModal').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-lg);padding:var(--space-md);background:var(--bg-secondary);border-radius:var(--radius-md);">
          <div style="width:60px;height:60px;border-radius:var(--radius-sm);background:url('${room.images && room.images.length ? room.images[0] : (room.img || '')}') center/cover no-repeat;flex-shrink:0"></div>
          <div>
            <div style="font-weight:600">${room.name}</div>
            <div style="font-size:0.85rem;color:var(--text-secondary)">${room.type} · Up to ${room.capacity} guests</div>
          </div>
          <div style="margin-left:auto;font-weight:700;color:var(--primary)">${formatCurrency(room.price)}/night</div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Check-in</label>
            <input type="date" class="form-input" id="bookCheckIn" value="${today}" min="${today}" onchange="calcBookingTotal('${room.id}')">
          </div>
          <div class="form-group">
            <label class="form-label">Check-out</label>
            <input type="date" class="form-input" id="bookCheckOut" value="${tomorrow}" min="${tomorrow}" onchange="calcBookingTotal('${room.id}')">
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Number of Guests</label>
            <select class="form-select" id="bookGuests">
              ${Array.from({ length: room.capacity }, (_, i) => `<option value="${i + 1}">${i + 1} Guest${i > 0 ? 's' : ''}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Allocate Room</label>
            <select class="form-select" id="bookAllocatedRoom">
              <option value="Room 101">Room 101</option>
              <option value="Room 102">Room 102</option>
              <option value="Room 103">Room 103</option>
              <option value="Room 104">Room 104</option>
              <option value="Room 105">Room 105</option>
            </select>
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;padding:var(--space-md);background:var(--bg-secondary);border-radius:var(--radius-md);font-weight:600;margin-bottom:var(--space-lg)">
          <span>Total</span>
          <span id="bookingTotal" style="color:var(--primary)">${formatCurrency(room.price)}</span>
        </div>
        <div class="form-group" style="border-top:1px solid var(--border);padding-top:var(--space-lg)">
          <label class="form-label">Payment Method: <strong>M-Pesa STK Push</strong></label>
          <div style="background:rgba(76, 175, 80, 0.05);padding:var(--space-md);border-radius:var(--radius-md);border:1px solid rgba(76, 175, 80, 0.1)">
            <div class="phone-input-group">
              <span class="phone-prefix">+254</span>
              <input type="tel" class="phone-input-field" id="mpesaPhone" placeholder="711112222" maxlength="9" oninput="this.value = this.value.replace(/^0/, '').replace(/\D/g, '')">
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="document.getElementById('bookingModal').remove()">Cancel</button>
        <button class="btn btn-primary" id="confirmBookingBtn" onclick="initiateMpesaPayment('${room.id}')">Pay & Confirm Booking</button>
      </div>
    </div>
  </div>`;
}

function calcBookingTotal(roomId) {
  const room = Store.get('rooms').find(r => r.id === roomId);
  const checkIn = document.getElementById('bookCheckIn').value;
  const checkOut = document.getElementById('bookCheckOut').value;
  if (room && checkIn && checkOut) {
    const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000));
    const roomTotal = room.price * nights;
    
    // Add cart items if any
    const cart = Store.get('cart');
    const food = Store.get('food');
    const cartTotal = cart.reduce((sum, c) => {
      const f = food.find(x => x.id === c.foodId);
      return sum + (f ? f.price * c.qty : 0);
    }, 0);
    
    const combined = roomTotal + cartTotal;
    
    // Show breakdown if there's food in cart
    if (cartTotal > 0) {
      document.getElementById('bookingTotal').innerHTML = `
        <div style="text-align:right;line-height:1.8">
          <div style="font-size:0.9rem;color:var(--text-secondary)">Building: ${formatCurrency(roomTotal)}</div>
          <div style="font-size:0.9rem;color:var(--text-secondary)">Food: ${formatCurrency(cartTotal)}</div>
          <div style="border-top:1px solid var(--border);margin-top:var(--space-sm);padding-top:var(--space-sm);font-weight:700">Total: ${formatCurrency(combined)}</div>
        </div>
      `;
    } else {
      document.getElementById('bookingTotal').textContent = formatCurrency(roomTotal);
    }
  }
}

function formatMpesaPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return null;
  
  // If user only entered 9 digits, prepend 254
  if (digits.length === 9) {
    return '254' + digits;
  }
  
  // Backwards compatibility/Fallback for 10 or 12 digits
  if (digits.length === 10 && (digits.startsWith('0'))) {
    return '254' + digits.slice(1);
  }
  if (digits.length === 12 && digits.startsWith('254')) {
    return digits;
  }
  
  return null;
}


function initiateMpesaPayment(roomId) {
  const rawPhone = document.getElementById('mpesaPhone').value.trim();
  const phone = formatMpesaPhone(rawPhone);
  const checkIn = document.getElementById('bookCheckIn').value;
  const checkOut = document.getElementById('bookCheckOut').value;
  const guests = document.getElementById('bookGuests').value;
  const allocatedRoom = document.getElementById('bookAllocatedRoom').value;
  
  // Calculate real total including cart items
  const room = Store.get('rooms').find(r => r.id === roomId);
  if (!room) { showToast('Room not found', 'error'); return; }
  
  const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000));
  const roomTotal = room.price * nights;
  
  // Add cart items if any
  const cart = Store.get('cart');
  const food = Store.get('food');
  const cartTotal = cart.reduce((sum, c) => {
    const f = food.find(x => x.id === c.foodId);
    return sum + (f ? f.price * c.qty : 0);
  }, 0);
  
  const amount = roomTotal + cartTotal;

  if (!phone) { showToast('Please enter a valid phone number', 'error'); return; }
  if (!checkIn || !checkOut) { showToast('Please select dates', 'error'); return; }
  if (isNaN(amount) || amount <= 0) { showToast('Payment amount is invalid', 'error'); return; }

  window._pendingBooking = { roomId, checkIn, checkOut, guests, allocatedRoom, amount, checkoutRequestID: null };

  document.getElementById('bookingModal').remove();
  document.body.insertAdjacentHTML('beforeend', renderPaymentLoaderModal(amount));

  // Always attempt real STK push first — backend falls back to simulation if API unreachable
  fetch('api/mpesa_stk.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, amount })
  })
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json();
  })
  .then(data => {
    console.log('STK Response:', data);
    const responseCode = String(data.ResponseCode || data.responseCode || '');
    const checkoutRequestID = data.CheckoutRequestID || data.checkoutRequestID;
    
    if (responseCode === '0' && checkoutRequestID) {
      window._pendingBooking.checkoutRequestID = checkoutRequestID;
      showToast('Payment request sent!', 'success');
      
      pollMpesaStatus(checkoutRequestID, () => {

        const { roomId, checkIn, checkOut, guests, allocatedRoom } = window._pendingBooking;
        const booking = Store.bookRoom(roomId, checkIn, checkOut, guests, allocatedRoom);
        if (booking) {
          if (document.getElementById('paymentLoaderModal')) document.getElementById('paymentLoaderModal').remove();
          showToast('Booking completed successfully!', 'success');
          Router.navigate('/dashboard');
        }
      }, (message) => {
        if (document.getElementById('paymentLoaderModal')) document.getElementById('paymentLoaderModal').remove();
        showToast(message || 'Payment failed', 'error');
      });
    } else {
      const modal = document.getElementById('paymentLoaderModal');
      const isLocalHost = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' || 
                          window.location.hostname.startsWith('192.168.');
      
      console.error('STK Error:', data);
      
      if (modal && isLocalHost && !data.simulated) {
          const body = modal.querySelector('.modal');
          body.innerHTML += `
            <div style="margin-top:var(--space-lg); padding:var(--space-md); background:rgba(217, 119, 6, 0.1); border-radius:var(--radius-md); border:1px solid rgba(217, 119, 6, 0.2)">
              <p style="font-size:0.85rem; color:#b45309; margin-bottom:var(--space-sm)">Real STK Push failed (${data.ResponseDescription || 'Connection issue'}). Test with simulation?</p>
              <button class="btn btn-primary btn-sm" style="width:100%; background:#d97706; border:none" onclick="document.getElementById('paymentLoaderModal').remove(); forceSimulateBooking('${roomId}')">Use Simulation Mode</button>
            </div>`;
          return;
      }
      
      if (modal) modal.remove();
      showToast(data.ResponseDescription || formatPaymentError(data), 'error');
    }
  })
  .catch(err => {
    console.error('STK Network Error:', err);
    const modal = document.getElementById('paymentLoaderModal');
    if (modal) modal.remove();
    showToast('Network error: ' + err.message, 'error');
  });
}

window.openRoomEditModal = async function(roomId) {
  try {
    // Load fresh room data from Store (which should be synced with API)
    const room = Store.get('rooms').find(r => r.id === roomId);
    if (!room) {
      showToast('Building not found', 'error');
      return;
    }
    // Ensure images are array
    if (!room.images) room.images = [];
    if (!Array.isArray(room.images)) room.images = [];
    // Ensure amenities are array
    if (!room.amenities) room.amenities = [];
    if (!Array.isArray(room.amenities)) room.amenities = [];
    document.body.insertAdjacentHTML('beforeend', renderRoomModal(room));
  } catch (err) {
    console.error('Error opening edit modal:', err);
    showToast('Error loading building', 'error');
  }
};

window.forceSimulateBooking = function(roomId) {
  const phone = formatMpesaPhone(window._pendingBooking.phone || '0700000000');
  const amount = window._pendingBooking.amount;
  
  showToast('Switching to simulation...', 'info');
  document.body.insertAdjacentHTML('beforeend', renderPaymentLoaderModal(amount));

  fetch('api/mpesa_stk.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, amount, simulate: true })
  })
  .then(res => res.json())
  .then(data => {
    const checkoutRequestID = data.CheckoutRequestID || data.checkoutRequestID;
    if (checkoutRequestID) {
      window._pendingBooking.checkoutRequestID = checkoutRequestID;
      pollMpesaStatus(checkoutRequestID, () => {
        const { roomId, checkIn, checkOut, guests, allocatedRoom } = window._pendingBooking;
        const booking = Store.bookRoom(roomId, checkIn, checkOut, guests, allocatedRoom);
        if (booking) {
          if (document.getElementById('paymentLoaderModal')) document.getElementById('paymentLoaderModal').remove();
          showToast('Booking completed (Simulated)', 'success');
          Router.navigate('/dashboard');
        }
      }, (msg) => {
        if (document.getElementById('paymentLoaderModal')) document.getElementById('paymentLoaderModal').remove();
        showToast(msg, 'error');
      });
    }
  });
}


function renderPaymentLoaderModal(amount) {
    return `
    <div class="modal-overlay" id="paymentLoaderModal" style="z-index:2000; background:rgba(0,0,0,0.85); backdrop-filter:blur(10px)">
      <div class="modal payment-modal-white" style="max-width:400px; text-align:center; padding:var(--space-2xl); border-radius:var(--radius-xl)">
        <div class="mpesa-loader" id="mpesaSpinner"></div>

        <h2 id="mpesaStatusTitle" style="margin-top:var(--space-xl); font-family:var(--font-serif)">Awaiting Payment</h2>
        <p id="mpesaStatusMessage" style="color:var(--text-secondary); margin:var(--space-md) 0; line-height:1.6">
          Please check your phone for an <span class="mpesa-brand-text">M-PESA</span> prompt and enter your PIN to authorize <strong>${formatCurrency(amount)}</strong>.
        </p>
        <div id="mpesaStatusHint" style="font-size:0.85rem; padding:var(--space-md); background:rgba(76, 175, 80, 0.1); border-radius:var(--radius-md); color:#2E7D32; border:1px solid rgba(76, 175, 80, 0.2); margin-bottom:var(--space-lg)">
          ⏱️ Checking payment status in real-time...
        </div>
        <div style="display:flex; flex-direction:column; gap:var(--space-sm)">
          <button class="btn btn-cancel-mpesa btn-sm" onclick="cancelMpesaPoll()">Cancel & Go Back</button>
        </div>
      </div>
    </div>`;
}



window.simulateMpesaSuccess = function() {
  const checkoutRequestID = window._pendingBooking ? window._pendingBooking.checkoutRequestID : 
                           (window._pendingFoodOrder ? window._pendingFoodOrder.checkoutRequestID : null);
  
  if (!checkoutRequestID) return;
  
  showToast('Simulating callback success...', 'info');
  
  const mockCallback = {
    Body: {
      stkCallback: {
        CheckoutRequestID: checkoutRequestID,
        ResultCode: 0,
        ResultDesc: "The service request is processed successfully."
      }
    }
  };

  fetch('api/mpesa_callback.php', {
    method: 'POST',
    body: JSON.stringify(mockCallback)
  }).then(() => {
    showToast('Simulation confirmed!', 'success');
  });
};

window.cancelMpesaPoll = function() {
  if (window._mpesaPollInterval) {
    clearInterval(window._mpesaPollInterval);
    window._mpesaPollInterval = null;
  }
  const modal = document.getElementById('paymentLoaderModal');
  if (modal) {
    modal.remove();
    showToast('Payment process cancelled', 'info');
  }
}

function updatePaymentModal(state) {
  const title = document.getElementById('mpesaStatusTitle');
  const message = document.getElementById('mpesaStatusMessage');
  const hint = document.getElementById('mpesaStatusHint');
  const spinner = document.getElementById('mpesaSpinner');
  if (!title || !message || !hint || !spinner) return;

  switch(state) {
    case 'success':
      spinner.style.borderColor = '#4CAF50';
      spinner.style.borderTopColor = '#4CAF50';
      spinner.style.animation = 'none';
      spinner.innerHTML = '✓';
      spinner.style.display = 'flex';
      spinner.style.alignItems = 'center';
      spinner.style.justifyContent = 'center';
      spinner.style.fontSize = '2rem';
      spinner.style.color = '#4CAF50';
      title.textContent = 'Payment Verified!';
      title.style.color = '#4CAF50';
      message.innerHTML = 'Transaction successful. Finalizing your order...';
      hint.style.background = 'rgba(76, 175, 80, 0.1)';
      hint.style.color = '#2E7D32';
      hint.style.borderColor = 'rgba(76, 175, 80, 0.3)';
      hint.textContent = '✅ Payment confirmed by M-Pesa';
      break;

    case 'cancelled':
      spinner.style.borderColor = '#f59e0b';
      spinner.style.borderTopColor = '#f59e0b';
      spinner.style.animation = 'none';
      spinner.innerHTML = '✕';
      spinner.style.display = 'flex';
      spinner.style.alignItems = 'center';
      spinner.style.justifyContent = 'center';
      spinner.style.fontSize = '2rem';
      spinner.style.color = '#f59e0b';
      title.textContent = 'Payment Cancelled';
      title.style.color = '#f59e0b';
      message.innerHTML = 'You cancelled the M-Pesa payment request on your phone.';
      hint.style.background = 'rgba(245, 158, 11, 0.1)';
      hint.style.color = '#b45309';
      hint.style.borderColor = 'rgba(245, 158, 11, 0.3)';
      hint.textContent = '⚠️ Transaction was cancelled';
      break;

    case 'failed':
      spinner.style.borderColor = '#ef4444';
      spinner.style.borderTopColor = '#ef4444';
      spinner.style.animation = 'none';
      spinner.innerHTML = '✕';
      spinner.style.display = 'flex';
      spinner.style.alignItems = 'center';
      spinner.style.justifyContent = 'center';
      spinner.style.fontSize = '2rem';
      spinner.style.color = '#ef4444';
      title.textContent = 'Payment Failed';
      title.style.color = '#ef4444';
      hint.style.background = 'rgba(239, 68, 68, 0.1)';
      hint.style.color = '#dc2626';
      hint.style.borderColor = 'rgba(239, 68, 68, 0.3)';
      break;

    case 'timeout':
      spinner.style.borderColor = '#6b7280';
      spinner.style.borderTopColor = '#6b7280';
      spinner.style.animation = 'none';
      spinner.innerHTML = '⏰';
      spinner.style.display = 'flex';
      spinner.style.alignItems = 'center';
      spinner.style.justifyContent = 'center';
      spinner.style.fontSize = '2rem';
      title.textContent = 'Request Timed Out';
      title.style.color = '#6b7280';
      message.innerHTML = 'You did not respond to the M-Pesa prompt in time.';
      hint.style.background = 'rgba(107, 114, 128, 0.1)';
      hint.style.color = '#4b5563';
      hint.style.borderColor = 'rgba(107, 114, 128, 0.3)';
      hint.textContent = '⏰ The prompt expired on your phone';
      break;
  }
}

function pollMpesaStatus(checkoutRequestID, onSuccess, onError, timeoutMs = 120000) {

  let elapsed = 0;
  if (window._mpesaPollInterval) { clearInterval(window._mpesaPollInterval); }

  window._mpesaPollInterval = setInterval(async () => {
    const loader = document.getElementById('paymentLoaderModal');
    if (!loader) {
      clearInterval(window._mpesaPollInterval);
      return;
    }

    try {
      const response = await fetch(`api/mpesa_status.php?checkoutRequestID=${encodeURIComponent(checkoutRequestID)}`);
      if (!response.ok) throw new Error('Status endpoint error');
      const data = await response.json();

      if (data.status === 'Pending' || data.status === 'NotFound') {
        elapsed += 5000;
        // Update hint with live elapsed time
        const hint = document.getElementById('mpesaStatusHint');
        if (hint) {
          const secs = Math.round(elapsed / 1000);
          hint.textContent = `⏱️ Checking payment status... (${secs}s)`;
        }
        if (elapsed >= timeoutMs) {
          clearInterval(window._mpesaPollInterval);
          window._mpesaPollInterval = null;
          updatePaymentModal('timeout');
          setTimeout(() => {
            if (document.getElementById('paymentLoaderModal')) document.getElementById('paymentLoaderModal').remove();
            showToast('Payment verification timed out. Please check your phone.', 'error');
          }, 3000);
        }
        return;
      }

      clearInterval(window._mpesaPollInterval);
      window._mpesaPollInterval = null;

      if (data.status === 'Success') {
        updatePaymentModal('success');
        if (typeof onSuccess === 'function') {
          setTimeout(() => onSuccess(data), 2000);
        }
      } else if (data.status === 'Cancelled') {
        updatePaymentModal('cancelled');
        const message = data.resultDesc || 'Payment was cancelled by user';
        setTimeout(() => {
          if (document.getElementById('paymentLoaderModal')) document.getElementById('paymentLoaderModal').remove();
          if (typeof onError === 'function') {
            onError(message);
          } else {
            showToast(message, 'error');
          }
        }, 3000);
      } else {
        // Failed — wrong PIN, insufficient funds, timeout, etc.
        updatePaymentModal('failed');
        const msg = document.getElementById('mpesaStatusMessage');
        const hint = document.getElementById('mpesaStatusHint');
        const resultDesc = data.resultDesc || 'Payment was not approved';
        
        // Show specific error messages
        if (data.resultCode === 2001) {
          if (msg) msg.innerHTML = 'The M-Pesa PIN you entered was <strong>incorrect</strong>. Please try again.';
          if (hint) hint.textContent = '🔐 Wrong PIN entered';
        } else if (data.resultCode === 1) {
          if (msg) msg.innerHTML = 'Your M-Pesa account has <strong>insufficient funds</strong> for this transaction.';
          if (hint) hint.textContent = '💰 Insufficient balance';
        } else if (data.resultCode === 1037) {
          updatePaymentModal('timeout');
        } else {
          if (msg) msg.innerHTML = resultDesc;
          if (hint) hint.textContent = '❌ Transaction failed';
        }
        
        setTimeout(() => {
          if (document.getElementById('paymentLoaderModal')) document.getElementById('paymentLoaderModal').remove();
          if (typeof onError === 'function') {
            onError(resultDesc);
          } else {
            showToast(resultDesc, 'error');
          }
        }, 3500);
      }
    } catch (error) {
      console.error(error);
      elapsed += 5000;
      if (elapsed >= timeoutMs) {
        clearInterval(window._mpesaPollInterval);
        window._mpesaPollInterval = null;
        if (document.getElementById('paymentLoaderModal')) document.getElementById('paymentLoaderModal').remove();
        showToast('Payment verification failed. Please try again later.', 'error');
      }
    }
  }, 5000);
}



function renderRoomDetailsModal(roomId) {
  const room = Store.get('rooms').find(r => r.id === roomId);
  const user = Store.currentUser();
  if (!room) return '';
  const images = room.images && room.images.length ? room.images : [room.img || ''];
  const address = 'Meru, Kenya';
  const bedrooms = room.bedrooms || 1;
  const beds = room.beds || 1;
  const baths = room.baths || 1;
  const hostName = 'Joseph Rana';
  const hostImg = 'https://i.pravatar.cc/150?u=joseph_rana';

  const html = `
  <div class="modal-overlay" id="roomDetailsModal" onclick="if(event.target===this){this.remove();window.location.hash='#/rooms';}">
    <div class="modal room-details-modal">
      <button class="rdm-close" onclick="document.getElementById('roomDetailsModal').remove();window.location.hash='#/rooms';">✕</button>

      <div class="rdm-gallery">
        <div class="rdm-gallery-main" id="rdm-gallery-main-${room.id}" style="background-image:url('${images[0]}')"></div>
        <div class="rdm-gallery-grid">
          <div class="rdm-gallery-thumb" data-src="${images[1] || images[0]}" onclick="setRoomGalleryMainImage('${room.id}', this.dataset.src)" style="background-image:url('${images[1] || images[0]}')"></div>
          <div class="rdm-gallery-thumb" data-src="${images[2] || images[0]}" onclick="setRoomGalleryMainImage('${room.id}', this.dataset.src)" style="background-image:url('${images[2] || images[0]}')"></div>
          <div class="rdm-gallery-thumb" data-src="${images[3] || images[0]}" onclick="setRoomGalleryMainImage('${room.id}', this.dataset.src)" style="background-image:url('${images[3] || images[0]}')"></div>
          <div class="rdm-gallery-thumb rdm-gallery-last" data-src="${images[4] || images[0]}" onclick="openRoomGallery('${room.id}')" style="background-image:url('${images[4] || images[0]}')">
            ${images.length > 5 ? `<div class="rdm-gallery-overlay"><span>📷</span> +${images.length - 5} Photo${images.length - 5 > 1 ? 's' : ''}</div>` : ''}
          </div>
        </div>
      </div>

      <div class="rdm-content">
        <div class="rdm-layout">
          <div class="rdm-main">
            <header class="rdm-header">
              <h1 class="rdm-title" style="font-family:var(--font-serif);font-size:2rem">${room.name}</h1>
              <div class="rdm-meta">
                <span class="rdm-rating-inline">★ ${room.rating || 'New'}</span>
                <span class="rdm-dot">·</span>
                <span class="rdm-reviews-link">${room.reviewCount || 0} reviews</span>
                <span class="rdm-dot">·</span>
                <span>📍 ${address}</span>
              </div>
            </header>



            <section class="rdm-section">
              <p class="rdm-desc" style="font-size:1rem;line-height:1.7">${room.desc}</p>
            </section>
          </div>

          <div class="rdm-sidebar">
            <div class="rdm-booking-card">
              <div class="rdm-booking-card-header-split">
                <div class="rdm-booking-header-left">
                  <div class="rdm-booking-price-big">
                    <span class="rdm-price-amount">${formatCurrency(room.price)}</span>
                    <span class="rdm-price-unit">/ night</span>
                  </div>
                  <div class="rdm-booking-rating-inline">
                    ★ ${room.rating || 'New'} · <span style="text-decoration:underline">${room.reviewCount || 0} reviews</span>
                  </div>
                </div>
                
                <div class="rdm-booking-header-right">
                  <div class="rdm-host-stat-item-vertical">
                    <div class="rdm-host-stat-number">${room.capacity}</div>
                    <div class="rdm-host-stat-label-text">Guests</div>
                  </div>
                  <div class="rdm-host-stat-divider-lite" style="width:20px"></div>
                  <div class="rdm-host-stat-item-vertical">
                    <div class="rdm-host-stat-number">${room.bedrooms || 1}</div>
                    <div class="rdm-host-stat-label-text">Rooms</div>
                  </div>
                </div>
              </div>

              <div class="rdm-booking-dates">
                <div class="rdm-date-box" style="border-right:1px solid var(--border)">
                  <label>CHECK-IN</label>
                  <div>${new Date().toLocaleDateString()}</div>
                </div>
                <div class="rdm-date-box">
                  <label>CHECKOUT</label>
                  <div>Add date</div>
                </div>
              </div>
              
              <button class="btn btn-primary btn-lg rdm-book-btn" onclick="document.getElementById('roomDetailsModal').remove(); setTimeout(()=>openBookingModal('${room.id}'), 50)">
                Reserve Building
              </button>
              <p class="rdm-no-charge">Quick & Secure M-Pesa Booking</p>
            </div>
          </div>
        </div>
      </div>

      <div class="rdm-full-width-content">
        <div class="rdm-container">
          <section class="rdm-section rdm-border-top" style="margin-top:0">
            <h2 class="rdm-section-title">${room.reviewCount || 0} reviews</h2>
            <div class="rdm-reviews-grid">
              ${(room.reviews || []).map(rev => `
                <div class="rdm-review-card-modern">
                  <div class="rdm-review-user-info">
                    <img src="${rev.userAvatar || 'https://i.pravatar.cc/150?u=' + rev.userName}" class="rdm-reviewer-avatar">
                    <div class="rdm-reviewer-details">
                      <div class="rdm-reviewer-name-bold">${rev.userName}</div>
                      <div class="rdm-reviewer-location-muted">${rev.location || 'Meru, Kenya'}</div>
                    </div>
                  </div>
                  <div class="rdm-review-meta-row">
                    <div class="rdm-review-stars-modern">${'★'.repeat(rev.rating)}${'☆'.repeat(5-rev.rating)}</div>
                    <span class="rdm-dot">·</span>
                    <span class="rdm-review-date-modern">${rev.date}</span>
                    <span class="rdm-dot">·</span>
                    <span class="rdm-review-stay-type">${rev.stayType || 'Verified Stay'}</span>
                  </div>
                  <p class="rdm-review-comment-modern">${rev.comment}</p>
                  <button class="rdm-link-show-more" onclick="showToast('Showing full review', 'info')">Show more</button>
                </div>
              `).join('')}
              ${!(room.reviews && room.reviews.length) ? '<p style="color:var(--text-muted)">No reviews yet. Be the first to leave one!</p>' : ''}
            </div>

            <div class="rdm-add-review-box">
              <h3 class="rdm-add-review-title">Leave a review</h3>
              ${Store.isLoggedIn() ? `
                <div class="rdm-review-form-modern">
                  <div class="rdm-rating-select-wrap">
                    <label>How was your stay?</label>
                    <div class="rdm-stars-input" id="newReviewRating">
                      <span data-val="1">★</span><span data-val="2">★</span><span data-val="3">★</span><span data-val="4">★</span><span data-val="5" class="active">★</span>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Stay Details (e.g. Group trip, Stayed with kids)</label>
                    <input type="text" class="form-input" id="newReviewStayType" placeholder="Mention who you stayed with...">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Review Comment</label>
                    <textarea class="form-input" id="newReviewComment" rows="4" placeholder="Tell us about your experience..."></textarea>
                  </div>
                  <button class="btn btn-primary" style="padding:12px 24px; font-weight:700" onclick="submitReview('${room.id}')">Submit Review</button>
                </div>
              ` : `
                <div class="rdm-login-prompt">
                  <p>Please <a href="#/login">login</a> to leave a review and share your experience with other guests.</p>
                </div>
              `}
            </div>
          </section>

          <section class="rdm-section rdm-border-top">
            <h2 class="rdm-section-title">Meet your Host</h2>
            <div class="rdm-host-flex-layout">
              <div class="rdm-host-profile-card">
                <div class="rdm-host-card-col-left">
                  <div class="rdm-host-avatar-main-wrap">
                    <img src="${hostImg}" alt="${hostName}">
                    <div class="rdm-host-badge-verified">
                      <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>
                    </div>
                  </div>
                  <div class="rdm-host-identity">
                    <h3 class="rdm-host-name-bold">${hostName}</h3>
                  </div>
                </div>
                
                <div class="rdm-host-card-col-right">
                  <div class="rdm-host-stat-item-vertical">
                    <div class="rdm-host-stat-number">${room.reviewCount || 0}</div>
                    <div class="rdm-host-stat-label-text">Reviews</div>
                  </div>
                  <div class="rdm-host-stat-divider-lite"></div>
                  <div class="rdm-host-stat-item-vertical">
                    <div class="rdm-host-stat-number">${room.rating || '5.0'}★</div>
                    <div class="rdm-host-stat-label-text">Rating</div>
                  </div>
                  <div class="rdm-host-stat-divider-lite"></div>
                  <div class="rdm-host-stat-item-vertical">
                    <div class="rdm-host-stat-number">9</div>
                    <div class="rdm-host-stat-label-text">Years hosting</div>
                  </div>
                </div>
              </div>

              <div class="rdm-host-info-side">
                <h3 class="rdm-info-side-title">Host details</h3>
                <div class="rdm-info-side-stats">
                  <p>Response rate: 100%</p>
                  <p>Responds within an hour</p>
                </div>
                
                <button class="rdm-btn-message-host" onclick="showToast('Messaging service optimized', 'info')">Message host</button>
              </div>
            </div>
          </section>
        </div>

        <section class="rdm-section-map rdm-border-top" style="padding-bottom: 0;">
          <div class="rdm-container">
            <h2 class="rdm-section-title">Location in Meru</h2>
            <div class="rdm-location-info" style="margin-bottom:var(--space-lg)">
              <span class="rdm-location-icon">📍</span>
              <span class="rdm-location-text">${address}</span>
            </div>
          </div>
          <div class="rdm-map-container-full">
            <iframe 
              width="100%" height="450" frameborder="0" scrolling="no" 
              src="https://www.openstreetmap.org/export/embed.html?bbox=${37.6456-0.03}%2C${0.0515-0.02}%2C${37.6456+0.03}%2C${0.0515+0.02}&layer=mapnik&marker=${0.0515}%2C${37.6456}"
              style="width:100%; border:none">
            </iframe>
          </div>
        </section>
      </div>
    </div>
  </div>`;

  setTimeout(() => {
    const stars = document.querySelectorAll('.rdm-stars-input span');
    stars.forEach(s => {
      s.onclick = () => {
        stars.forEach(x => x.classList.remove('active'));
        s.classList.add('active');
        let prev = s.previousElementSibling;
        while(prev) { prev.classList.add('active'); prev = prev.previousElementSibling; }
      }
    });
  }, 100);

  return html;
}

function submitReview(roomId) {
  const comment = document.getElementById('newReviewComment').value.trim();
  const stayType = document.getElementById('newReviewStayType').value.trim();
  const activeStar = document.querySelector('.rdm-stars-input span.active:last-of-type') || document.querySelector('.rdm-stars-input span.active');
  const rating = activeStar ? activeStar.dataset.val : 5;

  if (!comment) { showToast('Please enter a comment', 'error'); return; }

  const review = Store.addReview(roomId, { rating, comment, stayType });
  if (review) {
    showToast('Thank you for your review!', 'success');
    document.getElementById('roomDetailsModal').remove();
    setTimeout(() => {
      const modalHtml = renderRoomDetailsModal(roomId);
      document.body.insertAdjacentHTML('beforeend', modalHtml);
    }, 100);
  }
}

function renderFoodModal(food = null) {
  const isEdit = !!food;
  const categories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Drinks'];
  return `
  <div class="modal-overlay" id="foodModal" onclick="if(event.target===this)this.remove()">
    <div class="modal">
      <div class="modal-header">
        <h2>${isEdit ? 'Edit' : 'Add'} Food Item</h2>
        <button class="modal-close" onclick="document.getElementById('foodModal').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" class="form-input" id="foodName" value="${food ? food.name : ''}">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Category</label>
            <select class="form-select" id="foodCategory">
              ${categories.map(c => `<option value="${c}" ${food && food.category === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Price (KSh)</label>
            <input type="number" step="0.01" class="form-input" id="foodPrice" value="${food ? food.price : ''}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Stock Units</label>
          <input type="number" step="1" class="form-input" id="foodStock" value="${food && food.stock !== undefined ? food.stock : 50}">
        </div>
        <div class="form-group">
          <label class="form-label">Item Photo</label>
          <div class="photo-grid-input" style="grid-template-columns: 100px;">
            <div class="photo-slot" id="foodSlot-0">
              ${food && food.img ? `<img src="${food.img}">` : `<div class="plus-icon">+</div><span>📸</span>`}
              <input type="file" id="foodFile" onchange="handleSlotPreview(this, 'foodSlot-0')" accept="image/*">
            </div>
            <input type="hidden" id="foodImgUrl" value="${food ? food.img || '' : ''}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-input" id="foodDesc" rows="3">${food ? food.desc : ''}</textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="document.getElementById('foodModal').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="saveFood('${food ? food.id : ''}')">${isEdit ? 'Update' : 'Add'} Item</button>
      </div>
    </div>
  </div>`;
}

async function saveFood(id) {
  const name = document.getElementById('foodName').value.trim();
  const category = document.getElementById('foodCategory').value;
  const price = parseFloat(document.getElementById('foodPrice').value);
  const stock = parseInt(document.getElementById('foodStock').value) || 0;
  const desc = document.getElementById('foodDesc').value.trim();
  let img = document.getElementById('foodImgUrl').value.trim();
  
  const fileInput = document.getElementById('foodFile');
  if (fileInput.files.length > 0) {
    showToast('Uploading photo...', 'info');
    const result = await uploadFiles(fileInput.files, 'food');
    if (result && result.files && result.files.length > 0) {
      img = result.files[0];
    } else {
      showToast('Upload failed', 'error');
      return;
    }
  }

  if (!name || !price) { showToast('Name and price are required', 'error'); return; }
  const data = { name, category, price, stock, img, desc };
  
  try {
    if (id) { 
      await Store.updateFood(id, data); 
    } else { 
      await Store.addFood(data); 
    }
    document.getElementById('foodModal').remove();
    showToast(id ? 'Item updated' : 'Item added', 'success');
    const activeTab = window.location.hash.split('/').pop();
    renderAdminPage(activeTab && activeTab !== 'admin' ? activeTab : 'food');
  } catch (error) {
    console.error('Error saving food item:', error);
    showToast('Error saving food item', 'error');
  }
}

async function uploadFiles(files, type) {
  const formData = new FormData();
  formData.append('type', type);
  for (let i = 0; i < files.length; i++) {
    formData.append('files[]', files[i]);
  }

  try {
    const res = await fetch('api/upload.php', {
      method: 'POST',
      body: formData
    });
    return await res.json();
  } catch (err) {
    console.error('Upload Error:', err);
    return null;
  }
}

function handleFilePreview(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (!input || !preview) return;

  input.onchange = () => {
    preview.innerHTML = '';
    Array.from(input.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.innerHTML += `
          <div class="preview-item">
            <img src="${e.target.result}">
          </div>`;
      };
      reader.readAsDataURL(file);
    });
  };
}

function renderRoomModal(room = null) {
  const isEdit = !!room;
  const types = ['Building', 'Villa', 'Complex', 'Estate'];
  return `
  <div class="modal-overlay" id="roomModal" onclick="if(event.target===this)this.remove()">
    <div class="modal" style="max-width:700px">
      <div class="modal-header">
        <h2>${isEdit ? 'Edit' : 'Update'} Building</h2>
        <button class="modal-close" onclick="document.getElementById('roomModal').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Building Name (e.g. Nyati House)</label>
          <input type="text" class="form-input" id="roomName" value="${room ? room.name : ''}" placeholder="e.g. Salute House">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Property Type</label>
            <select class="form-select" id="roomType">
              ${types.map(t => `<option value="${t}" ${room && room.type === t ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Price/Night (KSh)</label>
            <input type="number" class="form-input" id="roomPrice" value="${room ? room.price : ''}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Max Guest Capacity</label>
            <input type="number" class="form-input" id="roomCapacity" value="${room ? room.capacity : 8}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Building Photos (Recommended: 5+ photos)</label>
          <div class="photo-grid-input">
            ${[0,1,2,3,4].map(idx => {
              const existing = room && room.images && room.images[idx] ? room.images[idx] : null;
              return `
              <div class="photo-slot" id="slot-${idx}">
                ${existing ? `<img src="${existing}">` : `<div class="plus-icon">+</div><span>📸</span>`}
                <input type="file" onchange="handleSlotPreview(this, 'slot-${idx}')" accept="image/*">
                <input type="hidden" class="slot-path" value="${existing || ''}">
              </div>`;
            }).join('')}
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Amenities (WiFi, TV, Gym etc)</label>
          <input type="text" class="form-input" id="roomAmenities" value="${room ? room.amenities.join(', ') : ''}">
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-input" id="roomDesc" rows="3">${room ? room.desc : ''}</textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="document.getElementById('roomModal').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="saveRoom('${room ? room.id : ''}')">${isEdit ? 'Save Changes' : 'Add Property'}</button>
      </div>
    </div>
  </div>`;
}

async function saveRoom(id) {
  const name = document.getElementById('roomName').value.trim();
  const type = document.getElementById('roomType').value;
  const price = parseFloat(document.getElementById('roomPrice').value);
  const capacity = parseInt(document.getElementById('roomCapacity').value);
  const amenities = document.getElementById('roomAmenities').value.split(',').map(a => a.trim()).filter(Boolean);
  const desc = document.getElementById('roomDesc').value.trim();
  
  const images = [];
  const slots = document.querySelectorAll('.photo-slot');
  let hasNewImages = false;
  
  showToast('Saving property...', 'info');
  
  // Collect images from form slots
  for (const slot of slots) {
    const fileInput = slot.querySelector('input[type="file"]');
    const existingPath = slot.querySelector('.slot-path').value;
    
    if (fileInput.files.length > 0) {
      hasNewImages = true;
      const result = await uploadFiles(fileInput.files, 'houses');
      if (result && result.files) images.push(result.files[0]);
    } else if (existingPath && existingPath.trim()) {
      images.push(existingPath);
    }
  }
  
  // If user didn't upload new images but form is empty, preserve originals
  if (!hasNewImages && images.length === 0 && id) {
    const originalRoom = Store.get('rooms').find(r => r.id === id);
    if (originalRoom && originalRoom.images && originalRoom.images.length > 0) {
      images.push(...originalRoom.images);
      console.log('Preserved original images:', images);
    }
  }
  
  if (!name || !price) { showToast('Title and price are required', 'error'); return; }
  if (images.length === 0) { showToast('At least one photo is required', 'error'); return; }
  
  const data = { name, type, price, capacity, amenities, images, desc };
  
  try {
    if (id) { 
      await Store.updateRoom(id, data); 
    } else { 
      await Store.addRoom(data); 
    }
    document.getElementById('roomModal').remove();
    showToast(id ? 'Building updated' : 'Building added', 'success');
    renderAdminPage('rooms');
  } catch (error) {
    console.error('Error saving room:', error);
    showToast('Error saving building', 'error');
  }
}

function handleSlotPreview(input, slotId) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const slot = document.getElementById(slotId);
      let img = slot.querySelector('img');
      if (!img) {
        img = document.createElement('img');
        slot.prepend(img);
        // Remove icon/span
        slot.querySelectorAll('.plus-icon, span').forEach(el => el.remove());
      }
      img.src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function renderUserModal() {
  return `
  <div class="modal-overlay" id="userModal" onclick="if(event.target===this)this.remove()">
    <div class="modal" style="max-width:500px">
      <div class="modal-header">
        <h2>Provision New Account</h2>
        <button class="modal-close" onclick="document.getElementById('userModal').remove()">✕</button>
      </div>
      <div class="modal-body">
        <form onsubmit="submitAdminCreateUser(event)">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-input" id="adminUserName" required>
          </div>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-input" id="adminUserEmail" required>
          </div>
          <div class="form-group">
            <label class="form-label">Assigned Role</label>
            <select class="form-select" id="adminUserRole" required>
              <option value="user">Customer</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="password-group">
              <input type="password" class="form-input" id="adminUserPass" placeholder="••••••••" required>
              <button type="button" class="password-toggle" onclick="togglePassword('adminUserPass', this)">👁️</button>
            </div>
          </div>
          <div style="margin-top:var(--space-xl)">
            <button type="submit" class="btn btn-primary" style="width:100%">Create Account</button>
          </div>
        </form>
      </div>
    </div>
  </div>`;
}

window.submitAdminCreateUser = function(e) {
  e.preventDefault();
  const name = document.getElementById('adminUserName').value.trim();
  const email = document.getElementById('adminUserEmail').value.trim();
  const role = document.getElementById('adminUserRole').value;
  const password = document.getElementById('adminUserPass').value;

  const newUser = Store.addUser({ name, email, password, role });

  if (newUser) {
    showToast(`Account for ${name} created!`, 'success');
    document.getElementById('userModal').remove();
    renderAdminPage('users');
  }
}

/* ── Order Tracking Components ─────────────────────────────── */
function renderTrackingStepper(status) {
  const steps = [
    { label: 'Order Placed', statuses: ['Pending', 'Preparing', 'Delivered'] },
    { label: 'Preparing', statuses: ['Preparing', 'Delivered'] },
    { label: 'Out for Delivery', statuses: ['Delivered'] }, // For demo, Delivered implies it was out
    { label: 'Delivered', statuses: ['Delivered'] }
  ];

  let currentStepIdx = -1;
  if (status === 'Pending') currentStepIdx = 0;
  else if (status === 'Preparing') currentStepIdx = 1;
  else if (status === 'Delivered') currentStepIdx = 3; // Jump to end for demo or add more states later

  const progressPct = (currentStepIdx / (steps.length - 1)) * 100;

  return `
    <div class="tracking-container">
      <div class="stepper">
        <div class="stepper-progress" style="width: ${progressPct}%"></div>
        ${steps.map((step, i) => {
          let stateClass = '';
          if (i < currentStepIdx) stateClass = 'completed';
          else if (i === currentStepIdx) stateClass = 'active';
          
          let icon = i < currentStepIdx ? '✓' : (i + 1);
          if (i === 1 && stateClass === 'active') icon = '🍳';
          if (i === 2 && stateClass === 'active') icon = '🛵';
          if (i === 3 && stateClass === 'active') icon = '🏠';

          return `
            <div class="step ${stateClass}">
              <div class="step-circle">${icon}</div>
              <div class="step-label">${step.label}</div>
            </div>`;
        }).join('')}
      </div>
      <div class="tracking-info-card">
        <div class="tracking-status-desc">
          ${status === 'Pending' ? '<span>⌛</span> Awaiting kitchen confirmation...' : ''}
          ${status === 'Preparing' ? '<span>👨‍🍳</span> Our chef is currently preparing your meal with care.' : ''}
          ${status === 'Delivered' ? '<span>✅</span> Order has been successfully delivered. Enjoy!' : ''}
          ${status === 'Cancelled' ? '<span>❌</span> This order was cancelled.' : ''}
        </div>
        <div class="tracking-time">Updated: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    </div>`;
}

function renderOrderTrackingModal(orderId) {
  const order = Store.get('orders').find(o => o.id === orderId);
  if (!order) return '';

  return `
  <div class="modal-overlay" id="trackingModal" onclick="if(event.target===this)this.remove()">
    <div class="modal animate-in" style="max-width:600px">
      <div class="modal-header">
        <div>
          <h2 style="font-family:var(--font-serif)">Order Receipt #${order.id.substring(0,6)}</h2>
          <p style="font-size:0.85rem; color:var(--text-muted)">Order placed on ${formatDate(order.date)}</p>
        </div>
        <button class="modal-close" onclick="document.getElementById('trackingModal').remove()">✕</button>
      </div>
      <div class="modal-body" style="padding-top:0">
        ${renderTrackingStepper(order.status)}
        
        <div style="margin-top:var(--space-xl); border-top:1px solid var(--border); padding-top:var(--space-lg)">
          <h4 style="margin-bottom:var(--space-md); font-weight:700">Order Items</h4>
          <div style="display:flex; flex-direction:column; gap:var(--space-md)">
            ${order.items.map(item => `
              <div style="display:flex; gap:var(--space-md); padding:var(--space-md); background:var(--bg-secondary); border-radius:var(--radius-md); align-items:flex-start">
                <div style="width:80px; height:80px; border-radius:var(--radius-md); background:url('${item.img || ''}') center/cover no-repeat; flex-shrink:0; border:1px solid var(--border); box-shadow:0 2px 8px rgba(0,0,0,0.1)"></div>
                <div style="flex:1">
                  <div style="font-weight:700; margin-bottom:4px; font-size:0.95rem">${item.name}</div>
                  <div style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:8px">${item.category || 'Item'}</div>
                  <div style="display:flex; justify-content:space-between; align-items:center">
                    <span style="color:var(--text-secondary)">${item.qty}× ${formatCurrency(item.price)}</span>
                    <span style="font-weight:700; color:var(--primary)">${formatCurrency(item.price * item.qty)}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="margin-top:var(--space-lg); padding:var(--space-md); background:rgba(16,185,129,0.05); border-radius:var(--radius-md); border:1px solid rgba(16,185,129,0.1)">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.9rem">
              <span>Subtotal</span>
              <span style="color:var(--text-secondary)">${formatCurrency(order.subtotal)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.9rem">
              <span>Tax (10%)</span>
              <span style="color:var(--text-secondary)">${formatCurrency(order.tax)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-weight:700; border-top:1px solid rgba(16,185,129,0.2); padding-top:8px">
              <span>Total Paid</span>
              <span style="color:var(--primary); font-size:1.1rem">${formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="document.getElementById('trackingModal').remove()">Close Receipt</button>
        <button class="btn btn-primary" onclick="window.print()">🖨️ Print Receipt</button>
      </div>
    </div>
  </div>`;
}

