/* ================================================================
   RHMS — Main App: Admin Panel + Router Init
   ================================================================ */

/* ── Admin Panel ──────────────────────────────────────────── */
function renderAdminPage(tab) {
  if (!Store.isAdmin()) { Router.navigate('/login'); return; }
  const activeTab = tab || 'dashboard';
  const user = Store.currentUser();
  const orders = Store.get('orders');
  const bookings = Store.get('bookings');
  const food = Store.get('food');
  const rooms = Store.get('rooms');
  const users = Store.get('users');

  const tabs = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'inventory', icon: '📋', label: 'Inventory' },
    { id: 'food', icon: '🍕', label: 'Manage Food' },
    { id: 'rooms', icon: '🏨', label: 'Manage Rooms' },
    { id: 'orders', icon: '📦', label: 'Orders' },
    { id: 'bookings', icon: '📅', label: 'Bookings' },
    { id: 'users', icon: '👥', label: 'Users' },
    { id: 'notifications', icon: '🔔', label: 'System Alerts' },
    { id: 'settings', icon: '⚙️', label: 'Settings' }
  ];

  let content = '';

  if (activeTab === 'dashboard') {
    const totalRevenue = orders.reduce((s, o) => s + o.total, 0) + bookings.reduce((s, b) => s + b.totalPrice, 0);
    const today = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(today.getFullYear(), today.getMonth() - 5 + i, 1);
      return {
        label: date.toLocaleString('default', { month: 'short' }),
        key: `${date.getFullYear()}-${date.getMonth() + 1}`
      };
    });
    const revenueByMonth = months.reduce((acc, m) => {
      acc[m.key] = 0;
      return acc;
    }, {});
    [...orders, ...bookings].forEach(tx => {
      const txDate = new Date(tx.date);
      if (!isNaN(txDate)) {
        const key = `${txDate.getFullYear()}-${txDate.getMonth() + 1}`;
        if (key in revenueByMonth) {
          revenueByMonth[key] += (tx.total || tx.totalPrice || 0);
        }
      }
    });
    const maxRev = Math.max(totalRevenue, 1);
    const recentActivity = [...orders, ...bookings]
      .sort((a,b) => new Date(b.date || b.checkIn) - new Date(a.date || a.checkIn))
      .slice(0, 5);

    content = `
      <div class="stats-grid">
        <div class="stat-card animate-in-delay-1">
          <div class="stat-icon" style="color:#10b981">💰</div>
          <div class="stat-value">${formatCurrency(totalRevenue)}</div>
          <div class="stat-label">Total Revenue</div>
        </div>
        <div class="stat-card animate-in-delay-2">
          <div class="stat-icon" style="color:var(--primary-light)">📦</div>
          <div class="stat-value">${orders.length}</div>
          <div class="stat-label">Total Orders</div>
        </div>
        <div class="stat-card animate-in-delay-3">
          <div class="stat-icon" style="color:#60a5fa">🏨</div>
          <div class="stat-value">${bookings.length}</div>
          <div class="stat-label">Total Bookings</div>
        </div>
        <div class="stat-card animate-in-delay-4">
          <div class="stat-icon" style="color:#f59e0b">👥</div>
          <div class="stat-value">${users.length}</div>
          <div class="stat-label">Total Users</div>
        </div>
        <div class="stat-card animate-in-delay-5">
          <div class="stat-icon" style="color:#a855f7">🏛️</div>
          <div class="stat-value">${rooms.length}</div>
          <div class="stat-label">Total Houses</div>
        </div>
        <div class="stat-card animate-in-delay-6">
          <div class="stat-icon" style="color:#ef4444">🍕</div>
          <div class="stat-value">${food.length}</div>
          <div class="stat-label">Menu Items</div>
        </div>
      </div>
      <div class="dashboard-main-grid">
        <div class="chart-container animate-in-delay-2">
          <h3>📊 Revenue Performance</h3>
          <div class="bar-chart">
            ${months.map((m) => {
              const val = revenueByMonth[m.key] || 0;
              const pct = (val / maxRev) * 100;
              return `<div class="bar"><div class="bar-value">${formatCurrency(val)}</div><div class="bar-fill" style="height:${pct}%"></div><div class="bar-label">${m.label}</div></div>`;
            }).join('')}
          </div>
        </div>
        <div class="chart-container animate-in-delay-3">
          <h3>🚀 Quick Insights</h3>
          <div class="settings-stats-list" style="margin-top:var(--space-md)">
            <div class="settings-stat-row">
              <div class="settings-stat-icon-sm" style="background:rgba(139,92,246,0.1);color:var(--primary-light)">🍕</div>
              <div class="settings-stat-info">
                <span class="settings-stat-name">Menu Food Items</span>
                <span class="settings-stat-val">${food.length} items</span>
              </div>
            </div>
            <div class="settings-stat-row">
              <div class="settings-stat-icon-sm" style="background:rgba(59,130,246,0.1);color:#60a5fa">🛏️</div>
              <div class="settings-stat-info">
                <span class="settings-stat-name">Total Rooms</span>
                <span class="settings-stat-val">${rooms.length} units</span>
              </div>
            </div>
            <div class="settings-stat-row">
              <div class="settings-stat-icon-sm" style="background:rgba(245,158,11,0.1);color:#f59e0b">⏳</div>
              <div class="settings-stat-info">
                <span class="settings-stat-name">Pending Fulfillment</span>
                <span class="settings-stat-val" style="color:#f59e0b">${orders.filter(o => o.status === 'Pending').length} orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  } else if (activeTab === 'food') {
    content = `
      <div class="admin-toolbar animate-in">
        <span class="body-sm" style="color:var(--text-muted)">Total Inventory: <strong>${food.length} items</strong></span>
        <button class="btn btn-primary" onclick="document.body.insertAdjacentHTML('beforeend', renderFoodModal())">+ Create New Item</button>
      </div>
      <div class="table-wrapper animate-in-delay-1"><table class="table"><thead><tr><th>Display</th><th>Item Details</th><th>Category</th><th>Price</th><th>Actions</th></tr></thead><tbody>
        ${food.map(f => `<tr>
          <td>
            <div style="width:50px;height:50px;border-radius:var(--radius-md);background:url('${f.img || ''}') center/cover no-repeat;margin:0 auto;border:1px solid var(--border)"></div>
          </td>
          <td><strong style="color:var(--text-primary)">${f.name}</strong></td>
          <td><span class="badge badge-pending">${f.category}</span></td>
          <td style="font-weight:700;color:var(--primary)">${formatCurrency(f.price)}</td>
          <td>
            <div style="display:flex;gap:var(--space-xs)">
              <button class="btn btn-secondary btn-sm" onclick="document.body.insertAdjacentHTML('beforeend', renderFoodModal(Store.get('food').find(x=>x.id==='${f.id}')))">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="if(confirm('Delete ${f.name}?')){Store.deleteFood('${f.id}');showToast('Deleted','info');renderAdminPage('food')}">Delete</button>
            </div>
          </td>
        </tr>`).join('')}
      </tbody></table></div>`;
  } else if (activeTab === 'inventory') {
    content = `
      <div class="admin-toolbar animate-in">
        <span class="body-sm" style="color:var(--text-muted)">Tracking <strong>${food.length} items</strong> in stock</span>
        <button class="btn btn-primary" onclick="generateInventoryPDF()">📥 Download PDF Report</button>
      </div>
      <div class="table-wrapper animate-in-delay-1">
        <div id="inventoryReportArea" style="background:var(--bg-card); padding:2px">
          <div style="margin-bottom:var(--space-md); padding:var(--space-md); border-bottom:1px solid var(--border); display:none" id="pdfReportHeader">
            <h2 style="margin-bottom:8px">RHMS Food Inventory Report</h2>
            <p style="color:var(--text-secondary); font-size:0.9rem">Generated on: ${new Date().toLocaleString()}</p>
          </div>
          <table class="table"><thead><tr><th>Display</th><th>Item Name</th><th>Category</th><th>Price</th><th>Stock Status</th><th>Stock Level</th><th class="no-print">Actions</th></tr></thead><tbody>
          ${food.map(f => {
            let stock = f.stock !== undefined ? f.stock : 50;
            let stockColor = stock <= 10 ? 'var(--danger)' : (stock <= 25 ? '#f59e0b' : 'var(--success)');
            let statusLabel = stock <= 10 ? 'Critical' : (stock <= 25 ? 'Low' : 'Healthy');
            return `<tr>
            <td><div style="width:40px;height:40px;border-radius:var(--radius-sm);background:url('${f.img || ''}') center/cover no-repeat;border:1px solid var(--border)"></div></td>
            <td><strong style="color:var(--text-primary)">${f.name}</strong></td>
            <td><span class="badge" style="background:rgba(255,255,255,0.05);color:var(--text-secondary)">${f.category}</span></td>
            <td style="font-family:monospace">${formatCurrency(f.price)}</td>
            <td><span class="badge" style="background:${stockColor}22;color:${stockColor};border:1px solid ${stockColor}44">${statusLabel}</span></td>
            <td style="font-weight:700;font-size:1.1rem;color:${stockColor}">${stock} units</td>
            <td class="no-print">
              <button class="btn btn-secondary btn-sm" onclick="document.body.insertAdjacentHTML('beforeend', renderFoodModal(Store.get('food').find(x=>x.id==='${f.id}')))">Update Stock</button>
            </td>
          </tr>`;
          }).join('')}
        </tbody></table>
        </div>
      </div>`;
  } else if (activeTab === 'rooms') {
    content = `
      <div class="admin-toolbar animate-in">
        <span class="body-sm" style="color:var(--text-muted)">Total Suites: <strong>${rooms.length} units</strong></span>
        <button class="btn btn-primary" onclick="document.body.insertAdjacentHTML('beforeend', renderRoomModal())">+ Add New Room</button>
      </div>
      <div class="table-wrapper animate-in-delay-1"><table class="table"><thead><tr><th>Display</th><th>Room Name</th><th>Type</th><th>Status</th><th>Price</th><th>Actions</th></tr></thead><tbody>
        ${rooms.map(r => `<tr>
          <td>
            <div style="width:50px;height:50px;border-radius:var(--radius-md);background:url('${r.images && r.images.length ? r.images[0] : (r.img || '')}') center/cover no-repeat;margin:0 auto;border:1px solid var(--border)"></div>
          </td>
          <td><strong style="color:var(--text-primary)">${r.name}</strong></td>
          <td style="font-size:0.9rem">${r.type}</td>
          <td><span class="badge ${r.status === 'active' ? 'badge-preparing' : 'badge-pending'}" style="text-transform:capitalize">${r.status || 'Active'}</span></td>
          <td style="font-weight:700;color:var(--primary)">${formatCurrency(r.price)}</td>
          <td>
            <div style="display:flex;gap:var(--space-xs)">
              <button class="btn btn-secondary btn-sm" onclick="openRoomEditModal('${r.id}')">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="if(confirm('Delete ${r.name}?')){Store.deleteRoom('${r.id}');showToast('Deleted','info');renderAdminPage('rooms')}">Delete</button>
            </div>
          </td>
        </tr>`).join('')}
      </tbody></table></div>`;
  } else if (activeTab === 'orders') {
    const statuses = ['Pending', 'Preparing', 'Delivered', 'Cancelled'];
    content = orders.length ? `
      <div class="table-wrapper animate-in"><table class="table"><thead><tr><th>ID</th><th>Customer</th><th>Items Summary</th><th>Total Amount</th><th>Fulfillment</th><th>Date</th></tr></thead><tbody>
        ${orders.map(o => `<tr>
          <td style="font-family:monospace;color:var(--text-muted)">#${o.id.substring(0,6)}</td>
          <td><strong style="color:var(--text-primary)">${o.userName}</strong></td>
          <td>${o.items.map(i => `<span style="color:var(--text-secondary)">${i.name}</span> ×${i.qty}`).join(', ')}</td>
          <td style="font-weight:700;color:var(--primary)">${formatCurrency(o.total)}</td>
          <td><select class="form-select status-select-${o.status.toLowerCase()}" style="width:auto;font-size:0.8rem;font-weight:600" onchange="Store.updateOrderStatus('${o.id}',this.value);showToast('Status Updated','success');renderAdminPage('orders')">
            ${statuses.map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select></td>
          <td style="color:var(--text-muted);font-size:0.85rem">${formatDate(o.date)}</td>
        </tr>`).join('')}
      </tbody></table></div>` : `
      <div class="empty-state animate-in">
        <div class="empty-icon">🍕</div>
        <h3>No Active Orders</h3>
        <p>Dining requests and room service orders will populate this section as they are received.</p>
      </div>`;
  } else if (activeTab === 'bookings') {
    const statuses = ['Confirmed', 'Checked In', 'Checked Out', 'Cancelled'];
    content = bookings.length ? `
      <div class="table-wrapper animate-in"><table class="table"><thead><tr><th>ID</th><th>Guest</th><th>Suite</th><th>Check In</th><th>Check Out</th><th>Price</th><th>Stay Status</th></tr></thead><tbody>
        ${bookings.map(b => `<tr>
          <td style="font-family:monospace;color:var(--text-muted)">#${b.id.substring(0,6)}</td>
          <td><strong style="color:var(--text-primary)">${b.userName}</strong></td>
          <td>${b.roomName}</td>
          <td>${formatDate(b.checkIn)}</td>
          <td>${formatDate(b.checkOut)}</td>
          <td style="font-weight:700;color:var(--primary)">${formatCurrency(b.totalPrice)}</td>
          <td><select class="form-select" style="width:auto;font-size:0.8rem;font-weight:600" onchange="Store.updateBookingStatus('${b.id}',this.value);showToast('Booking status updated','success');renderAdminPage('bookings')">
            ${statuses.map(s => `<option value="${s}" ${b.status === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select></td>
        </tr>`).join('')}
      </tbody></table></div>` : `
      <div class="empty-state animate-in">
        <div class="empty-icon">📅</div>
        <h3>No Reservations Yet</h3>
        <p>When guests book their stays, you'll see detailed itineraries and schedules right here.</p>
      </div>`;
  } else if (activeTab === 'users') {
    content = `
      <div class="admin-toolbar animate-in">
        <span class="body-sm" style="color:var(--text-muted)">Total Base: <strong>${users.length} users</strong></span>
        <button class="btn btn-primary" onclick="document.body.insertAdjacentHTML('beforeend', renderUserModal())">+ Add System User</button>
      </div>
      <div class="table-wrapper animate-in"><table class="table"><thead><tr><th>Full Name</th><th>Email Address</th><th>Status</th><th>Access Level</th><th>Actions</th></tr></thead><tbody>
        ${users.map(u => `<tr>
          <td><div style="display:flex;align-items:center;gap:var(--space-sm)"><div class="avatar-sm" style="background:var(--primary)">${u.name.charAt(0)}</div><strong>${u.name}</strong></div></td>
          <td style="color:var(--text-secondary)">${u.email}</td>
          <td><span class="badge ${u.status === 'suspended' ? 'badge-cancelled' : 'badge-preparing'}">${u.status || 'Active'}</span></td>
          <td><span class="badge ${u.role === 'admin' ? 'badge-preparing' : 'badge-pending'}" style="text-transform:capitalize">${u.role === 'admin' ? 'Administrator' : 'Customer'}</span></td>
          <td>
            <div style="display:flex;gap:var(--space-xs)">
              ${u.role !== 'admin' ? `
                <button class="btn btn-secondary btn-sm" onclick="Store.updateUserStatus('${u.id}', '${u.status === 'suspended' ? 'active' : 'suspended'}'); renderAdminPage('users')">${u.status === 'suspended' ? 'Activate' : 'Suspend'}</button>
                <button class="btn btn-danger btn-sm" onclick="if(confirm('Delete user ${u.name}?')){Store.deleteUser('${u.id}'); renderAdminPage('users')}">Delete</button>
              ` : '<span style="font-size:0.75rem; color:var(--text-muted)">Protected</span>'}
            </div>
          </td>
        </tr>`).join('')}
      </tbody></table></div>`;
  } else if (activeTab === 'settings') {
    content = `
      <div class="animate-in">
        <div class="grid grid-2 gap-lg">
          <div class="card card-body settings-card">
            <h3 style="margin-bottom:var(--space-md)">System Configuration</h3>
            <div class="form-group">
              <label class="form-label">Restaurant Status</label>
              <select class="form-select"><option>Operational</option><option>Reduced Service</option><option>Offline</option></select>
            </div>
            <div class="form-group">
              <label class="form-label">Auto-Confirm Bookings</label>
              <select class="form-select"><option>Enabled</option><option>Disabled (Manual Review)</option></select>
            </div>
          </div>
          <div class="card card-body settings-card">
            <h3 style="margin-bottom:var(--space-md)">Admin Preferences</h3>
            <div class="form-group">
              <label class="form-label">Interface Theme</label>
              <select class="form-select"><option>Deep Forest Green (Active)</option><option>Classic Dark</option><option>System Default</option></select>
            </div>
            <div class="form-group">
              <label class="form-label">Notification Sensitivity</label>
              <select class="form-select"><option>High (All Events)</option><option>Medium</option><option>Critical Only</option></select>
            </div>
          </div>
        </div>
      </div>`;
  } else if (activeTab === 'notifications') {
    const notifications = [];
    
    // 1. Global Bookings
    bookings.slice(-10).forEach(b => {
      notifications.push({
        id: `adm-b-${b.id}`,
        type: 'payment',
        title: 'New Booking Milestone',
        message: `<strong>${b.userName}</strong> booked <strong>${b.roomName}</strong> for <strong>${formatCurrency(b.totalPrice)}</strong>.`,
        time: formatDate(b.date || new Date().toISOString()),
        icon: '💰'
      });
    });

    // 2. New User Signups
    users.slice(-5).forEach(u => {
      notifications.push({
        id: `adm-u-${u.id}`,
        type: 'booking',
        title: 'User Onboarding',
        message: `New platform user <strong>${u.name}</strong> has successfully registered.`,
        time: formatDate(u.joined || new Date().toISOString()),
        icon: '👥'
      });
    });

    // Sort by id/time
    notifications.sort((a, b) => b.id.localeCompare(a.id));

    content = `
    <div class="animate-in">
      <div class="notification-list">
        ${notifications.length ? notifications.map(n => `
          <div class="notification-item payment-alert">
            <div class="notification-icon-container notification-type-payment">
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
        `).join('') : '<div class="empty-state"><h3>All quiet on the executive front</h3><p>No system alerts at this time.</p></div>'}
      </div>
    </div>`;
  }

  document.getElementById('app').innerHTML = renderNavbar() + `
  <div class="dashboard">
    <aside class="sidebar">
      <div class="sidebar-menu">
        <div class="sidebar-label">Management Overview</div>
        ${tabs.map(t => {
          return `
            <button class="sidebar-link ${activeTab === t.id ? 'active' : ''}" onclick="Router.navigate('/admin/${t.id}')">
              <span style="display:flex; align-items:center; gap:var(--space-sm)">
                <span>${t.icon}</span> ${t.label}
              </span>
            </button>`;
        }).join('')}
      </div>
      <div class="sidebar-section" style="margin-top:var(--space-2xl)">
        <button class="sidebar-link" style="color:var(--primary-light); background:rgba(139,92,246,0.1);" onclick="document.body.insertAdjacentHTML('beforeend', renderUserModal())"><span>➕</span> Create Account</button>
        <button class="sidebar-link" style="color:var(--danger)" onclick="Store.logout();Router.navigate('/')"><span>🚪</span> Sign Out</button>
      </div>
    </aside>
    <div class="dashboard-content">
      <div class="dashboard-header">
        <div>
          <h1>${tabs.find(t => t.id === activeTab).label}</h1>
          <p>Real-time analytics & management command center</p>
        </div>
        <div class="dashboard-header-actions">
          ${activeTab !== 'inventory' ? '<button class="btn btn-primary" onclick="generateDashboardPDF()">📥 Generate Report</button>' : ''}
        </div>
      </div>
      ${content}
    </div>
  </div>`;
  initNavbar();
}

/* ── Router Setup ─────────────────────────────────────────── */
Router.register('/', renderHomePage);
Router.register('/menu', renderMenuPage);
Router.register('/rooms', renderRoomsPage);
Router.register('/cart', renderCartPage);
Router.register('/checkout', renderCheckoutPage);
Router.register('/login', renderLoginPage);
Router.register('/signup', renderSignupPage);
Router.register('/verify', () => renderVerificationPage());

Router.register('/dashboard', () => renderDashboardPage('overview'));
['overview', 'orders', 'bookings', 'notifications', 'profile'].forEach(t => Router.register('/dashboard/' + t, () => renderDashboardPage(t)));

Router.register('/admin', () => renderAdminPage('dashboard'));
['dashboard', 'food', 'inventory', 'rooms', 'orders', 'bookings', 'users', 'notifications', 'settings'].forEach(t => Router.register('/admin/' + t, () => renderAdminPage(t)));

window.generateInventoryPDF = function() {
  if (typeof html2pdf === 'undefined') {
    showToast('PDF generation library is loading, please try again in a few seconds.', 'warning');
    return;
  }
  
  const element = document.getElementById('inventoryReportArea');
  const clone = element.cloneNode(true);
  clone.querySelector('#pdfReportHeader').style.display = 'block';
  
  // Clean up table for PDF rendering
  clone.style.background = '#fff';
  const table = clone.querySelector('table');
  table.style.color = '#000';
  clone.querySelectorAll('strong').forEach(el => el.style.color = '#000');
  clone.querySelectorAll('td').forEach(el => el.style.borderBottom = '1px solid #ddd');
  clone.querySelectorAll('th').forEach(el => { el.style.color = '#000'; el.style.borderBottom = '2px solid #000'; });
  clone.querySelectorAll('#pdfReportHeader h2, #pdfReportHeader p').forEach(el => el.style.color = '#000');

  // Remove elements with class 'no-print'
  clone.querySelectorAll('.no-print').forEach(n => n.remove());
  
  const opt = {
    margin:       0.5,
    filename:     'RHMS_Inventory_Report.pdf',
    image:        { type: 'jpeg', quality: 1 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(clone).save().then(() => {
    showToast('PDF Report downloaded successfully!', 'success');
  }).catch(err => {
    console.error(err);
    showToast('Failed to generate PDF', 'error');
  });
};

window.generateDashboardPDF = function() {
  if (typeof html2pdf === 'undefined') {
    showToast('PDF generation library is loading...', 'warning');
    return;
  }
  const element = document.querySelector('.dashboard-content');
  if(!element) {
      showToast('Error: Dashboard content container not found.', 'error');
      return;
  }
  const clone = element.cloneNode(true);
  
  clone.querySelectorAll('button, .no-print').forEach(n => n.remove());
  clone.style.width = '1200px'; 
  clone.style.background = '#f8fafc';
  clone.style.padding = '40px';
  clone.style.boxSizing = 'border-box';

  const opt = {
    margin:       0.5,
    filename:     'RHMS_Dashboard_Report.pdf',
    image:        { type: 'jpeg', quality: 1 },
    html2canvas:  { scale: 2, windowWidth: 1200, logging: false },
    jsPDF:        { unit: 'in', format: 'tabloid', orientation: 'landscape' }
  };
  
  html2pdf().set(opt).from(clone).save().then(() => {
    showToast('Dashboard Report downloaded successfully!', 'success');
  }).catch(err => {
    console.error(err);
    showToast('Failed to generate PDF', 'error');
  });
};

// Start
Router.start();
