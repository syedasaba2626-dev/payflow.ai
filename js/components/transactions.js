/* PayFlow AI - Transactions View Component */

let transactionVendorFilter = '';

function renderTransactionsPage() {
  const txns = window.appState.data.transactions;
  const vendors = window.appState.data.vendors;
  const formatINR = (val) => window.appState.formatINR(val);

  const filteredTxns = txns.filter(t => {
    if (transactionVendorFilter && t.vendor !== transactionVendorFilter) return false;
    return true;
  });

  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Historical Transactions Ledger</h1>
        <div class="page-subtitle">Comprehensive financial ledger, audit trails & anomaly detection</div>
      </div>
      <button class="header-btn btn-primary" onclick="window.runTransactionAIAnalysisModal()">
        <i data-lucide="sparkles"></i>
        <span>Analyze with AI</span>
      </button>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <select class="select-control" onchange="window.handleTxnVendorFilter(this.value)">
        <option value="">All Vendors</option>
        ${vendors.map(v => `<option value="${v.name}" ${transactionVendorFilter===v.name?'selected':''}>${v.name}</option>`).join('')}
      </select>

      <select class="select-control" onchange="window.handleTxnCategoryFilter(this.value)">
        <option value="">All Categories</option>
        <option value="IT Hardware">IT Hardware & Software</option>
        <option value="Software Consulting">Software Consulting</option>
        <option value="Cloud Infrastructure">Cloud Infrastructure</option>
        <option value="Facilities">Facilities & Office Supplies</option>
        <option value="Logistics">Logistics & Freight</option>
      </select>

      <div style="margin-left:auto;">
        <input type="text" class="input-control" placeholder="Search transaction ID..." oninput="window.handleTxnSearch(this.value)">
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="card" style="padding:0; overflow:hidden;">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Vendor</th>
              <th>Invoice ID</th>
              <th>Amount (₹)</th>
              <th>Category</th>
              <th>Payment Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredTxns.map(t => `
              <tr>
                <td><code style="background:var(--bg-tertiary); padding:2px 6px; border-radius:4px; font-weight:600;">${t.id}</code></td>
                <td>${t.date}</td>
                <td><strong>${t.vendor}</strong></td>
                <td><a style="color:var(--accent-primary); cursor:pointer;" onclick="window.viewInvoiceDetail('${t.invoiceId}')">${t.invoiceId}</a></td>
                <td><strong style="color:var(--text-primary);">${formatINR(t.amount)}</strong></td>
                <td><span style="font-size:0.8rem; color:var(--text-muted);">${t.category}</span></td>
                <td><span class="badge" style="background:var(--bg-tertiary); color:var(--text-secondary);">${t.method}</span></td>
                <td><span class="badge badge-paid">${t.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function handleTxnVendorFilter(val) {
  transactionVendorFilter = val;
  window.renderApp();
}

function renderTransactionAIModal() {
  const anomalies = window.apAIEngine.analyzeTransactions();
  const formatINR = (val) => window.appState.formatINR(val);

  return `
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-title" style="display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="sparkles" style="color:var(--accent-ai);"></i>
          AI Transaction Pattern & Anomaly Audit
        </div>
        <button class="icon-btn" onclick="window.closeModal()"><i data-lucide="x"></i></button>
      </div>

      <div class="modal-body">
        <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:1rem;">
          The Transaction Analyzer scanned ${window.appState.data.transactions.length} historical payments using moving window baseline averages:
        </p>

        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          ${anomalies.length > 0 ? anomalies.map(a => `
            <div style="padding:0.85rem; background:rgba(239,68,68,0.1); border-left:4px solid #ef4444; border-radius:8px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
                <strong>${a.transaction.id} — ${a.transaction.vendor}</strong>
                <strong style="color:#ef4444;">${formatINR(a.transaction.amount)}</strong>
              </div>
              <p style="font-size:0.82rem; color:var(--text-primary);">${a.reason}</p>
              <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.35rem;">
                Historical Average: ${formatINR(a.vendorAverage)} | Date: ${a.transaction.date}
              </div>
            </div>
          `).join('') : `
            <div style="padding:1rem; background:rgba(16,185,129,0.1); border-left:4px solid #10b981; border-radius:8px;">
              ✓ All historical transactions fall within normal standard deviation boundaries.
            </div>
          `}
        </div>
      </div>

      <div class="modal-footer">
        <button class="header-btn btn-primary" onclick="window.closeModal()">Acknowledge Audit</button>
      </div>
    </div>
  `;
}
