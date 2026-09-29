/* PayFlow AI - Top Header Component */

function renderHeader() {
  const company = window.appState.data.company;
  const alertsCount = window.appState.data.alerts.length;

  return `
    <header class="top-header">
      <div class="header-left">
        <div class="search-box">
          <i data-lucide="search"></i>
          <input type="text" id="global-search-input" placeholder="Search invoices, vendors, transactions..." oninput="window.handleGlobalSearch(this.value)">
        </div>
        <div class="demo-badge">
          <i data-lucide="sparkles" style="width:14px; height:14px;"></i>
          <span>Demo Mode</span>
        </div>
        <button class="header-btn" style="background:rgba(245,158,11,0.15); color:#fbbf24; border:1px solid rgba(245,158,11,0.3);" onclick="window.triggerDemoScenarioAction()">
          <i data-lucide="zap" style="width:15px; height:15px;"></i>
          <span>Run Demo Scenario (INV-1057)</span>
        </button>
      </div>

      <div class="header-right">
        <button class="icon-btn" title="Toggle Theme" onclick="window.toggleTheme()">
          <i data-lucide="sun" id="theme-icon"></i>
        </button>

        <div style="position:relative;">
          <button class="icon-btn" title="Notifications" onclick="window.toggleNotificationsDropdown()">
            <i data-lucide="bell"></i>
            ${alertsCount > 0 ? '<span class="notification-dot"></span>' : ''}
          </button>
          
          <div id="notifications-dropdown" class="card" style="display:none; position:absolute; right:0; top:48px; width:340px; z-index:100; padding:1rem; box-shadow:var(--shadow-lg);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; border-bottom:1px solid var(--border-color); padding-bottom:0.5rem;">
              <strong style="font-size:0.9rem;">Active Alerts (${alertsCount})</strong>
              <a style="font-size:0.78rem; color:var(--accent-primary); cursor:pointer;" onclick="window.navigateTo('alerts')">View All</a>
            </div>
            <div style="display:flex; flex-direction:column; gap:0.5rem; max-height:260px; overflow-y:auto;">
              ${window.appState.data.alerts.slice(0,4).map(a => `
                <div style="padding:0.5rem; background:var(--bg-secondary); border-radius:6px; border-left:3px solid ${a.severity==='Critical'||a.severity==='High'?'#ef4444':'#f59e0b'}; font-size:0.8rem;">
                  <strong style="color:var(--text-primary); display:block;">${a.title}</strong>
                  <span style="color:var(--text-secondary); font-size:0.75rem;">${a.explanation.slice(0, 80)}...</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="user-profile">
          <div class="avatar">S</div>
          <div class="user-info">
            <span class="user-name">Saba AP Manager</span>
            <span class="user-role">${company.name}</span>
          </div>
        </div>
      </div>
    </header>
  `;
}
