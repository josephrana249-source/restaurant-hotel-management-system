/* ================================================================
   RHMS — Utilities: Toast, Router, Helpers
   ================================================================ */

/* ── Toast Notifications ──────────────────────────────────── */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(30px)'; setTimeout(() => toast.remove(), 300); }, 3000);
}

/* ── Simple Router ────────────────────────────────────────── */
const Router = {
  routes: {},
  register(path, handler) { this.routes[path] = handler; },

  navigate(path) {
    window.location.hash = path;
  },

  currentPath() {
    return window.location.hash.slice(1) || '/';
  },

  start() {
    const render = () => {
      const path = this.currentPath();
      console.log('[ROUTER] Rendering path:', path);
      let handler = this.routes[path];
      
      // Dynamic route matching (e.g. /rooms/123 matches /rooms)
      if (!handler) {
        const base = Object.keys(this.routes).find(r => r !== '/' && path.startsWith(r + '/'));
        if (base) handler = this.routes[base];
      }

      handler = handler || this.routes['/'];
      if (!handler) return;

      try {
        handler();
      } catch (error) {
        console.error('Router render failed:', error);
        const app = document.getElementById('app');
        if (app) {
          app.innerHTML = `
            <main class="error-page">
              <div class="container" style="padding:5rem 1rem; text-align:center;">
                <h1>Something went wrong</h1>
                <p>We could not render the page. Please open the browser console to see the error.</p>
                <pre style="margin-top:2rem; color:#b91c1c; text-align:left; white-space:pre-wrap; word-break:break-word;">${error.message || 'Unknown error'}</pre>
                <button class="btn btn-primary btn-lg" onclick="window.location.reload()">Reload</button>
              </div>
            </main>`;
        }
      }
    };
    window.addEventListener('hashchange', render);
    render();
  }
};

/* ── Helpers ──────────────────────────────────────────────── */
function $(selector) { return document.querySelector(selector); }
function $$(selector) { return document.querySelectorAll(selector); }

function formatCurrency(amount) {
  return 'Ksh ' + Math.round(Number(amount)).toLocaleString();
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatPaymentError(payload) {
  if (!payload) return 'Payment failed to initiate';
  const message = payload.message || payload.ResponseDescription || payload.responseDescription || payload.errorMessage || payload.ErrorMessage || payload.status || 'Payment failed to initiate';
  const callbackInfo = payload.callbackUrl ? ` Callback URL: ${payload.callbackUrl}` : '';
  const details = payload.details ? ` Details: ${payload.details}` : '';
  return `${message}${callbackInfo}${details}`;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function statusBadge(status) {
  const map = { 'Pending': 'warning', 'Preparing': 'info', 'Delivered': 'success', 'Cancelled': 'danger', 'Confirmed': 'success', 'Checked In': 'info', 'Checked Out': 'success', 'Completed': 'success' };
  return `<span class="badge badge-${map[status] || 'info'}">${status}</span>`;
}

function getMinDate() {
  return new Date().toISOString().split('T')[0];
}

/* ── Filter Drawer Toggle ─────────────────────────────────── */
function toggleFilterDrawer(drawerId) {
  const drawer = document.getElementById(drawerId);
  const backdrop = document.getElementById(drawerId + 'Backdrop');
  if (!drawer) return;
  const isOpen = drawer.classList.contains('open');
  if (isOpen) {
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  } else {
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

/* ── Carousel Logic ────────────────────────────────────────── */
function scrollCarousel(trackId, direction) {
  const track = document.getElementById(trackId);
  if (!track) return;
  const width = track.offsetWidth;
  track.scrollBy({ left: width * direction, behavior: 'smooth' });
}

// Update dots on scroll
function initCarousels() {
  document.querySelectorAll('.card-img-track').forEach(track => {
    track.addEventListener('scroll', () => {
      const index = Math.round(track.scrollLeft / track.offsetWidth);
      const dotsId = track.id.replace('track', 'dots');
      const dotsContainer = document.getElementById(dotsId);
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
        });
      }
    });
  });
}
window.addEventListener('DOMContentLoaded', initCarousels);
// Also re-init when router finishes (mutation observer or manual call)
window.addEventListener('hashchange', () => setTimeout(initCarousels, 100));

/* ── Password Toggle ───────────────────────────────────────── */
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
  }
}
