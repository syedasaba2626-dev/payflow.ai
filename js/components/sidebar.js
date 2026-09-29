/* PayFlow AI - Sidebar Navigation Component */

function renderSidebar(activePage) {
  const pages = [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
    { id: 'ai-agent', label: 'AI Agent', icon: 'bot', badge: 'AI' },
    { id: 'invoices', label: 'Invoices', icon: 'file-text', badgeCount: () => window.appState.getKPIs().pendingInvoices },
    { id: 'transactions', label: 'Transactions', icon: 'receipt' },
    { id: 'vendors', label: 'Vendors', icon: 'users' },
    { id: 'payments', label: 'Payments', icon: 'credit-card', badgeCount: () => window.appState.getKPIs().overdueCount, badgeDanger: true },
    { id: 'analytics', label: 'Analytics', icon: 'line-chart' },
    { id: 'alerts', label: 'Alerts', icon: 'bell', badgeCount: () => window.appState.data.alerts.length },
    { id: 'audit', label: 'Audit Log', icon: 'shield-check' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  return `
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="brand-logo">PF</div>
        <div>
          <div class="brand-title">PayFlow AI</div>
          <div class="brand-subtitle">AP Intelligence</div>
        </div>
      </div>

      <div class="sidebar-nav">
        ${pages.map(p => {
          const isActive = p.id === activePage;
          let badgeHtml = '';
          if (p.badge) {
            badgeHtml = `<span class="badge" style="background:var(--accent-ai); color:white; font-size:0.68rem;">${p.badge}</span>`;
          } else if (p.badgeCount && p.badgeCount() > 0) {
            const bgClass = p.badgeDanger ? 'background:rgba(239,68,68,0.2); color:#f87171;' : 'background:rgba(99,102,241,0.2); color:#818cf8;';
            badgeHtml = `<span class="badge" style="${bgClass} font-size:0.72rem;">${p.badgeCount()}</span>`;
          }

          return `
            <a class="nav-item ${isActive ? 'active' : ''}" onclick="window.navigateTo('${p.id}')">
              <i data-lucide="${p.icon}"></i>
              <span>${p.label}</span>
              ${badgeHtml}
            </a>
          `;
        }).join('')}
      </div>

      <div class="sidebar-footer">
        <div class="ai-status-pill">
          <div class="pulse-dot"></div>
          <span>AI Engine Active</span>
        </div>
      </div>
    </div>
  `;
}
