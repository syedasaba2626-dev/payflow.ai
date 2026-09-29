/* PayFlow AI - Settings & Policy Management Component */

function renderSettingsPage() {
  const policies = window.appState.data.policies;

  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1>AI System Settings & AP Policies</h1>
        <div class="page-subtitle">Configure AI anomaly sensitivity, approval hierarchies & demo dataset state</div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;">
      <!-- AI Engine Parameters -->
      <div class="card">
        <h3 style="font-size:1.1rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="sliders" style="color:var(--accent-primary);"></i> AI Reasoning Parameters
        </h3>

        <div style="margin-bottom:1.25rem;">
          <label style="font-size:0.85rem; display:block; margin-bottom:0.4rem;">
            Anomaly Threshold Variance: <strong>${policies.anomalyThresholdPercent}%</strong>
          </label>
          <input type="range" min="10" max="100" value="${policies.anomalyThresholdPercent}" style="width:100%;" onchange="window.updatePolicySetting('anomalyThresholdPercent', parseInt(this.value))">
          <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">Invoices exceeding vendor 6-month baseline by this percentage will be flagged for review.</p>
        </div>

        <div style="margin-bottom:1.25rem;">
          <label style="font-size:0.85rem; display:block; margin-bottom:0.4rem;">Duplicate Detection Matching</label>
          <select class="select-control" style="width:100%;" onchange="window.updatePolicySetting('duplicateMatchingSensitivity', this.value)">
            <option value="High" ${policies.duplicateMatchingSensitivity==='High'?'selected':''}>High (Exact PO, Vendor & Amount Matching)</option>
            <option value="Medium" ${policies.duplicateMatchingSensitivity==='Medium'?'selected':''}>Medium (Fuzzy Date & Similar Amount)</option>
          </select>
        </div>

        <div>
          <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer; font-size:0.88rem;">
            <input type="checkbox" ${policies.autoFlagAnomalies ? 'checked' : ''} onchange="window.updatePolicySetting('autoFlagAnomalies', this.checked)">
            Automatically Flag High-Risk Invoices on Upload
          </label>
        </div>
      </div>

      <!-- AP Approval Hierarchies -->
      <div class="card">
        <h3 style="font-size:1.1rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="shield" style="color:var(--color-success);"></i> Approval Hierarchy Limits
        </h3>

        <div style="margin-bottom:1.25rem;">
          <label style="font-size:0.85rem; display:block; margin-bottom:0.4rem;">
            CFO Approval Limit: <strong>${window.appState.formatINR(policies.cfoApprovalThreshold)}</strong>
          </label>
          <input type="number" class="input-control" style="width:100%;" value="${policies.cfoApprovalThreshold}" onchange="window.updatePolicySetting('cfoApprovalThreshold', parseInt(this.value))">
          <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">Invoices exceeding this amount require double signoff from VP Finance.</p>
        </div>

        <div>
          <label style="font-size:0.85rem; display:block; margin-bottom:0.4rem;">Default Payment Terms</label>
          <select class="select-control" style="width:100%;" onchange="window.updatePolicySetting('defaultPaymentTermsDays', parseInt(this.value))">
            <option value="15" ${policies.defaultPaymentTermsDays===15?'selected':''}>Net 15 Days</option>
            <option value="30" ${policies.defaultPaymentTermsDays===30?'selected':''}>Net 30 Days (Standard)</option>
            <option value="60" ${policies.defaultPaymentTermsDays===60?'selected':''}>Net 60 Days</option>
          </select>
        </div>
      </div>

      <!-- Data Management & Demo Controls -->
      <div class="card col-12">
        <h3 style="font-size:1.1rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="database" style="color:var(--color-warning);"></i> Data Layer & Demo Controls
        </h3>

        <div style="display:flex; gap:1rem; flex-wrap:wrap;">
          <button class="header-btn btn-primary" onclick="window.triggerDemoScenarioAction()">
            <i data-lucide="zap"></i>
            <span>Trigger Demo Scenario (INV-1057 Anomaly)</span>
          </button>
          <button class="header-btn btn-danger" onclick="if(confirm('Reset all demo data to default baseline?')) window.appState.resetDemoData()">
            <i data-lucide="rotate-ccw"></i>
            <span>Reset Demo Data Baseline</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function updatePolicySetting(key, val) {
  window.appState.data.policies[key] = val;
  window.appState.saveState();
}
