/* PayFlow AI - Comprehensive Audit Trail Component */

function renderAuditPage() {
  const logs = window.appState.data.auditLogs;

  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Audit Trail & Security Log</h1>
        <div class="page-subtitle">Immutable audit history for invoice approvals, AI detections & payment disbursements</div>
      </div>
      <button class="header-btn" onclick="window.exportAuditLogsJSON()">
        <i data-lucide="file-json"></i>
        <span>Export Log (JSON)</span>
      </button>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <input type="text" class="input-control" placeholder="Search audit logs..." style="width:300px;" oninput="window.handleAuditSearch(this.value)">
    </div>

    <!-- Audit Log Table -->
    <div class="card" style="padding:0; overflow:hidden;">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Performed By</th>
              <th>Target Entity</th>
              <th>Description & Audit Evidence</th>
            </tr>
          </thead>
          <tbody>
            ${logs.map(l => `
              <tr>
                <td style="font-size:0.8rem; color:var(--text-muted); white-space:nowrap;">${l.timestamp}</td>
                <td>
                  <span class="badge" style="background:rgba(99,102,241,0.15); color:var(--accent-primary);">
                    ${l.action}
                  </span>
                </td>
                <td>
                  <strong style="${l.performedBy.includes('AI') ? 'color:var(--accent-ai);' : ''}">${l.performedBy}</strong>
                </td>
                <td><code style="background:var(--bg-tertiary); padding:2px 6px; border-radius:4px; font-weight:600;">${l.entityId}</code></td>
                <td style="font-size:0.85rem; color:var(--text-secondary);">${l.description}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function exportAuditLogsJSON() {
  const jsonStr = JSON.stringify(window.appState.data.auditLogs, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PayFlow_AI_Audit_Log_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
}
