/* PayFlow AI - System Alerts Feed Component */

function renderAlertsPage() {
  const alerts = window.appState.data.alerts;

  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1>AI Alert Feed & Notifications</h1>
        <div class="page-subtitle">Real-time alerts for overdue payments, duplicate submissions & anomaly spikes</div>
      </div>
      <button class="header-btn" onclick="window.clearAllAlerts()">
        <i data-lucide="check-check"></i>
        <span>Mark All Resolved</span>
      </button>
    </div>

    <!-- Alerts Feed List -->
    <div style="display:flex; flex-direction:column; gap:1rem;">
      ${alerts.map(a => {
        let borderCol = '#ef4444';
        let bgCol = 'rgba(239,68,68,0.08)';
        let badgeStyle = 'background:rgba(239,68,68,0.2); color:#f87171;';

        if (a.severity === 'Medium') {
          borderCol = '#f59e0b';
          bgCol = 'rgba(245,158,11,0.08)';
          badgeStyle = 'background:rgba(245,158,11,0.2); color:#fbbf24;';
        } else if (a.severity === 'Low') {
          borderCol = '#3b82f6';
          bgCol = 'rgba(59,130,246,0.08)';
          badgeStyle = 'background:rgba(59,130,246,0.2); color:#60a5fa;';
        }

        return `
          <div class="card" style="background:${bgCol}; border-left:4px solid ${borderCol}; display:flex; justify-content:space-between; align-items:center; gap:1rem;">
            <div>
              <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.4rem;">
                <span class="badge" style="${badgeStyle}">${a.severity} Severity</span>
                <strong style="font-size:1.05rem; color:var(--text-primary);">${a.title}</strong>
                <span style="font-size:0.75rem; color:var(--text-muted); margin-left:auto;">${a.timestamp}</span>
              </div>

              <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:0.5rem; line-height:1.4;">
                ${a.explanation}
              </p>

              <div style="font-size:0.78rem; color:var(--text-muted);">
                Related Entity: <strong style="color:var(--accent-primary);">${a.relatedEntity}</strong>
              </div>
            </div>

            <div style="flex-shrink:0;">
              <button class="header-btn btn-primary" style="font-size:0.82rem;" onclick="window.navigateTo('${a.targetPage || 'invoices'}')">
                <span>${a.actionLabel || 'Take Action'}</span>
                <i data-lucide="arrow-right" style="width:14px;"></i>
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function clearAllAlerts() {
  window.appState.data.alerts = [];
  window.appState.saveState();
}
