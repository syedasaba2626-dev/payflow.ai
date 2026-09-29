/* PayFlow AI - Vendors Directory & Analytics Component */

function renderVendorsPage() {
  const vendors = window.appState.data.vendors;
  const formatINR = (val) => window.appState.formatINR(val);

  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Vendor Directory & Risk Analytics</h1>
        <div class="page-subtitle">Vendor profiles, historical spending baselines & reliability scores</div>
      </div>
      <button class="header-btn btn-primary" onclick="window.showAddVendorPrompt()">
        <i data-lucide="plus-circle"></i>
        <span>Add New Vendor</span>
      </button>
    </div>

    <!-- Vendor Cards Grid -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.25rem;">
      ${vendors.map(v => `
        <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; cursor:pointer;" onclick="window.viewVendorAnalytics('${v.id}')">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
              <div>
                <h3 style="font-size:1.1rem; color:var(--text-primary); margin-bottom:0.2rem;">${v.name}</h3>
                <span style="font-size:0.78rem; color:var(--accent-primary);">${v.category}</span>
              </div>
              <span class="badge ${v.paymentReliability >= 95 ? 'badge-paid' : v.paymentReliability >= 90 ? 'badge-pending' : 'badge-overdue'}">
                ${v.paymentReliability}% Score
              </span>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; background:var(--bg-primary); padding:0.75rem; border-radius:8px; margin-bottom:0.85rem; font-size:0.82rem;">
              <div>
                <div style="color:var(--text-muted); font-size:0.72rem;">Total Spend</div>
                <strong>${formatINR(v.totalSpend)}</strong>
              </div>
              <div>
                <div style="color:var(--text-muted); font-size:0.72rem;">Outstanding</div>
                <strong style="${v.outstandingAmount > 0 ? 'color:var(--accent-primary);' : ''}">${formatINR(v.outstandingAmount)}</strong>
              </div>
              <div>
                <div style="color:var(--text-muted); font-size:0.72rem;">Average Invoice</div>
                <strong>${formatINR(v.avgInvoiceValue)}</strong>
              </div>
              <div>
                <div style="color:var(--text-muted); font-size:0.72rem;">Total Invoices</div>
                <strong>${v.invoiceCount} invoices</strong>
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:0.75rem; font-size:0.78rem; color:var(--text-muted);">
            <span>Last Paid: ${v.lastPaymentDate}</span>
            <span style="color:var(--accent-primary); font-weight:600; display:flex; align-items:center; gap:0.2rem;">
              View Analytics <i data-lucide="chevron-right" style="width:14px;"></i>
            </span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderVendorAnalyticsModal(vendorId) {
  const v = window.appState.data.vendors.find(x => x.id === vendorId);
  if (!v) return '';
  const formatINR = (val) => window.appState.formatINR(val);
  const vInvoices = window.appState.data.invoices.filter(i => i.vendorId === v.id || i.vendorName === v.name);

  return `
    <div class="modal-card" style="max-width:750px;">
      <div class="modal-header">
        <div>
          <div class="modal-title">${v.name} — Vendor Analytics</div>
          <div style="font-size:0.8rem; color:var(--text-muted);">${v.category} • GSTIN: ${v.gstin}</div>
        </div>
        <button class="icon-btn" onclick="window.closeModal()"><i data-lucide="x"></i></button>
      </div>

      <div class="modal-body">
        <!-- Stats Summary -->
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:0.75rem; margin-bottom:1.25rem;">
          <div style="background:var(--bg-primary); padding:0.75rem; border-radius:8px; border:1px solid var(--border-color);">
            <div style="font-size:0.72rem; color:var(--text-muted);">Total Paid</div>
            <strong style="font-size:1.1rem; color:var(--color-success);">${formatINR(v.totalSpend)}</strong>
          </div>
          <div style="background:var(--bg-primary); padding:0.75rem; border-radius:8px; border:1px solid var(--border-color);">
            <div style="font-size:0.72rem; color:var(--text-muted);">Outstanding</div>
            <strong style="font-size:1.1rem; color:var(--accent-primary);">${formatINR(v.outstandingAmount)}</strong>
          </div>
          <div style="background:var(--bg-primary); padding:0.75rem; border-radius:8px; border:1px solid var(--border-color);">
            <div style="font-size:0.72rem; color:var(--text-muted);">Avg Invoice</div>
            <strong style="font-size:1.1rem;">${formatINR(v.avgInvoiceValue)}</strong>
          </div>
          <div style="background:var(--bg-primary); padding:0.75rem; border-radius:8px; border:1px solid var(--border-color);">
            <div style="font-size:0.72rem; color:var(--text-muted);">Reliability Rating</div>
            <strong style="font-size:1.1rem; color:var(--color-info);">${v.paymentReliability}%</strong>
          </div>
        </div>

        <!-- Contact & Profile Details -->
        <div style="background:var(--bg-primary); padding:0.85rem; border-radius:8px; border:1px solid var(--border-color); margin-bottom:1.25rem; font-size:0.85rem;">
          <div style="font-weight:600; margin-bottom:0.35rem; color:var(--text-primary);">Contact Information</div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; color:var(--text-secondary);">
            <span>Person: <strong>${v.contactPerson}</strong></span>
            <span>Email: <strong>${v.email}</strong></span>
            <span>Phone: <strong>${v.phone}</strong></span>
            <span>Status: <strong style="color:var(--color-success);">${v.status}</strong></span>
          </div>
        </div>

        <!-- Invoices History -->
        <div>
          <h4 style="font-size:0.95rem; margin-bottom:0.5rem;">Associated Invoices (${vInvoices.length})</h4>
          <div style="max-height:200px; overflow-y:auto; border:1px solid var(--border-color); border-radius:8px;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${vInvoices.map(i => `
                  <tr>
                    <td><strong>${i.id}</strong></td>
                    <td>${i.invoiceDate}</td>
                    <td>${formatINR(i.totalAmount)}</td>
                    <td><span class="badge ${i.status==='Paid'?'badge-paid':i.status==='Overdue'?'badge-overdue':'badge-pending'}">${i.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="header-btn" onclick="window.closeModal()">Close</button>
      </div>
    </div>
  `;
}
