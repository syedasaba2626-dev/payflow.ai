/* PayFlow AI - Invoices Management & Processing Component */

let currentInvoiceFilter = 'All';

function renderInvoicesPage() {
  const invoices = window.appState.data.invoices;
  const vendors = window.appState.data.vendors;
  const formatINR = (val) => window.appState.formatINR(val);

  const filteredInvoices = invoices.filter(inv => {
    if (currentInvoiceFilter === 'All') return true;
    if (currentInvoiceFilter === 'Needs Review') return inv.status === 'Needs Review' || inv.status === 'Flagged';
    return inv.status === currentInvoiceFilter || inv.approvalStatus === currentInvoiceFilter;
  });

  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Invoice Management</h1>
        <div class="page-subtitle">AI-assisted invoice verification, duplicate detection & automated workflow</div>
      </div>
      <button class="header-btn btn-primary" onclick="window.openUploadModal()">
        <i data-lucide="upload-cloud"></i>
        <span>Upload New Invoice</span>
      </button>
    </div>

    <!-- Filter Bar & Tabs -->
    <div class="filter-bar">
      <div style="display:flex; gap:0.4rem; overflow-x:auto;">
        ${['All', 'Needs Review', 'Pending', 'Approved', 'Paid', 'Overdue', 'Rejected'].map(tab => `
          <button class="header-btn ${currentInvoiceFilter === tab ? 'btn-primary' : ''}" style="padding:0.4rem 0.85rem; font-size:0.82rem;" onclick="window.setInvoiceFilter('${tab}')">
            ${tab}
          </button>
        `).join('')}
      </div>

      <div style="margin-left:auto; display:flex; gap:0.75rem;">
        <select class="select-control" id="vendor-filter-select" onchange="window.handleInvoiceVendorFilter(this.value)">
          <option value="">All Vendors</option>
          ${vendors.map(v => `<option value="${v.name}">${v.name}</option>`).join('')}
        </select>
        <input type="text" class="input-control" placeholder="Filter by ID or PO..." oninput="window.handleInvoiceSearch(this.value)">
      </div>
    </div>

    <!-- Invoices Data Table -->
    <div class="card" style="padding:0; overflow:hidden;">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Vendor</th>
              <th>PO Number</th>
              <th>Invoice Date</th>
              <th>Due Date</th>
              <th>Amount (Total)</th>
              <th>AI Status</th>
              <th>Approval</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filteredInvoices.map(inv => {
              let badgeClass = 'badge-pending';
              if (inv.status === 'Paid') badgeClass = 'badge-paid';
              else if (inv.status === 'Overdue') badgeClass = 'badge-overdue';
              else if (inv.status === 'Flagged' || inv.status === 'Needs Review') badgeClass = 'badge-flagged';
              else if (inv.status === 'Approved') badgeClass = 'badge-approved';
              else if (inv.status === 'Rejected') badgeClass = 'badge-rejected';

              return `
                <tr>
                  <td>
                    <strong style="color:var(--accent-primary); cursor:pointer;" onclick="window.viewInvoiceDetail('${inv.id}')">${inv.id}</strong>
                  </td>
                  <td>
                    <div><strong>${inv.vendorName}</strong></div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${inv.category}</div>
                  </td>
                  <td><code style="background:var(--bg-tertiary); padding:2px 6px; border-radius:4px; font-size:0.8rem;">${inv.poNumber || 'N/A'}</code></td>
                  <td>${inv.invoiceDate}</td>
                  <td>
                    <span style="${inv.status === 'Overdue' ? 'color:#ef4444; font-weight:600;' : ''}">${inv.dueDate}</span>
                  </td>
                  <td><strong>${formatINR(inv.totalAmount)}</strong></td>
                  <td><span class="badge ${badgeClass}">${inv.status}</span></td>
                  <td>
                    <span class="badge ${inv.approvalStatus === 'Approved' ? 'badge-approved' : inv.approvalStatus === 'Rejected' ? 'badge-rejected' : 'badge-pending'}">
                      ${inv.approvalStatus || 'Pending'}
                    </span>
                  </td>
                  <td style="text-align:right;">
                    <div style="display:flex; justify-content:flex-end; gap:0.35rem;">
                      <button class="header-btn" style="padding:0.25rem 0.5rem; font-size:0.75rem;" title="View Details" onclick="window.viewInvoiceDetail('${inv.id}')">
                        <i data-lucide="eye" style="width:13px; height:13px;"></i>
                      </button>
                      ${inv.status !== 'Paid' && inv.status !== 'Rejected' ? `
                        <button class="header-btn btn-success" style="padding:0.25rem 0.5rem; font-size:0.75rem;" title="Approve" onclick="window.appState.approveInvoice('${inv.id}')">
                          <i data-lucide="check" style="width:13px; height:13px;"></i>
                        </button>
                        <button class="header-btn btn-danger" style="padding:0.25rem 0.5rem; font-size:0.75rem;" title="Reject" onclick="window.appState.rejectInvoice('${inv.id}')">
                          <i data-lucide="x" style="width:13px; height:13px;"></i>
                        </button>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function setInvoiceFilter(filter) {
  currentInvoiceFilter = filter;
  window.renderApp();
}

function renderInvoiceDetailModal(invId) {
  const inv = window.appState.data.invoices.find(i => i.id === invId);
  if (!inv) return '';
  const formatINR = (val) => window.appState.formatINR(val);
  const vendor = window.appState.data.vendors.find(v => v.id === inv.vendorId || v.name === inv.vendorName);

  return `
    <div class="modal-card">
      <div class="modal-header">
        <div>
          <div class="modal-title">Invoice Details: ${inv.id}</div>
          <div style="font-size:0.8rem; color:var(--text-muted);">${inv.vendorName} • PO: ${inv.poNumber}</div>
        </div>
        <button class="icon-btn" onclick="window.closeModal()"><i data-lucide="x"></i></button>
      </div>

      <div class="modal-body">
        <!-- Progress Timeline -->
        <div class="timeline">
          <div class="timeline-step active">
            <div class="step-node"><i data-lucide="file-check" style="width:14px;"></i></div>
            <div class="step-label">Received</div>
          </div>
          <div class="timeline-step active">
            <div class="step-node"><i data-lucide="cpu" style="width:14px;"></i></div>
            <div class="step-label">AI Processed</div>
          </div>
          <div class="timeline-step active">
            <div class="step-node"><i data-lucide="shield" style="width:14px;"></i></div>
            <div class="step-label">Validation</div>
          </div>
          <div class="timeline-step ${inv.approvalStatus === 'Approved' || inv.status === 'Paid' ? 'active' : ''}">
            <div class="step-node"><i data-lucide="user-check" style="width:14px;"></i></div>
            <div class="step-label">Approval</div>
          </div>
          <div class="timeline-step ${inv.status === 'Paid' ? 'active' : ''}">
            <div class="step-node"><i data-lucide="credit-card" style="width:14px;"></i></div>
            <div class="step-label">Payment</div>
          </div>
        </div>

        <!-- Metadata Grid -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.25rem;">
          <div style="background:var(--bg-primary); padding:0.85rem; border-radius:8px; border:1px solid var(--border-color);">
            <div style="font-size:0.75rem; color:var(--text-muted);">Invoice Date</div>
            <strong>${inv.invoiceDate}</strong>
          </div>
          <div style="background:var(--bg-primary); padding:0.85rem; border-radius:8px; border:1px solid var(--border-color);">
            <div style="font-size:0.75rem; color:var(--text-muted);">Due Date</div>
            <strong style="${inv.status==='Overdue'?'color:#ef4444;':''}">${inv.dueDate}</strong>
          </div>
          <div style="background:var(--bg-primary); padding:0.85rem; border-radius:8px; border:1px solid var(--border-color);">
            <div style="font-size:0.75rem; color:var(--text-muted);">Net Amount</div>
            <strong>${formatINR(inv.amount)}</strong>
          </div>
          <div style="background:var(--bg-primary); padding:0.85rem; border-radius:8px; border:1px solid var(--border-color);">
            <div style="font-size:0.75rem; color:var(--text-muted);">Total (incl GST)</div>
            <strong style="color:var(--accent-primary); font-size:1.1rem;">${formatINR(inv.totalAmount)}</strong>
          </div>
        </div>

        <!-- Vendor Baseline Comparison -->
        ${vendor ? `
          <div style="background:var(--bg-primary); padding:0.85rem; border-radius:8px; border:1px solid var(--border-color); margin-bottom:1.25rem;">
            <div style="font-size:0.8rem; font-weight:600; margin-bottom:0.35rem;">Historical Vendor Baseline Comparison</div>
            <div style="display:flex; justify-content:space-between; font-size:0.82rem;">
              <span>Vendor Average Invoice: <strong>${formatINR(vendor.avgInvoiceValue)}</strong></span>
              <span>Invoice Variance: <strong style="${inv.amount > vendor.avgInvoiceValue * 1.25 ? 'color:#ef4444;' : 'color:#10b981;'}">
                ${Math.round(((inv.amount - vendor.avgInvoiceValue)/vendor.avgInvoiceValue)*100)}%
              </strong></span>
            </div>
          </div>
        ` : ''}

        <!-- AI Reasoning & Risk Box -->
        <div style="background:rgba(99,102,241,0.1); border:1px solid var(--border-highlight); border-radius:8px; padding:1rem;">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem; color:var(--accent-ai); font-weight:600;">
            <i data-lucide="sparkles"></i> AI Assessment & Explanation
          </div>
          <p style="font-size:0.88rem; line-height:1.4; color:var(--text-primary); margin-bottom:0.75rem;">
            ${inv.aiExplanation || 'Verified against company AP rules.'}
          </p>
          ${inv.aiFlags ? inv.aiFlags.map(f => `
            <div style="font-size:0.8rem; color:var(--color-warning); display:flex; align-items:center; gap:0.4rem; margin-top:0.25rem;">
              <i data-lucide="alert-triangle" style="width:13px;"></i> ${f}
            </div>
          `).join('') : ''}
        </div>
      </div>

      <div class="modal-footer">
        <button class="header-btn" onclick="window.closeModal()">Close</button>
        ${inv.status !== 'Paid' && inv.status !== 'Rejected' ? `
          <button class="header-btn btn-danger" onclick="window.appState.rejectInvoice('${inv.id}'); window.closeModal();">Reject</button>
          <button class="header-btn btn-primary" onclick="window.appState.approveInvoice('${inv.id}'); window.closeModal();">Approve Invoice</button>
          <button class="header-btn btn-success" onclick="window.appState.markAsPaid('${inv.id}'); window.closeModal();">Mark Paid</button>
        ` : ''}
      </div>
    </div>
  `;
}

function renderUploadModal() {
  return `
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-title" style="display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="upload-cloud" style="color:var(--accent-primary);"></i>
          Upload Invoice & Run AI Analysis
        </div>
        <button class="icon-btn" onclick="window.closeModal()"><i data-lucide="x"></i></button>
      </div>

      <div class="modal-body">
        <!-- Preset Demo Selector -->
        <div style="background:var(--bg-primary); padding:0.85rem; border-radius:8px; border:1px solid var(--border-color); margin-bottom:1rem;">
          <strong style="font-size:0.82rem; color:var(--accent-primary); display:block; margin-bottom:0.5rem;">Or Choose a Demo Preset Sample Invoice:</strong>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="header-btn" style="font-size:0.75rem; padding:0.3rem 0.6rem;" onclick="window.loadUploadPreset('INV-1057')">⚡ Demo Scenario INV-1057 (Anomaly)</button>
            <button class="header-btn" style="font-size:0.75rem; padding:0.3rem 0.6rem;" onclick="window.loadUploadPreset('DUP-9901')">⚠️ Duplicate Invoice (PO-2026-88)</button>
            <button class="header-btn" style="font-size:0.75rem; padding:0.3rem 0.6rem;" onclick="window.loadUploadPreset('STD-5001')">✓ Standard Clean Invoice</button>
          </div>
        </div>

        <!-- Upload Drag Area -->
        <div style="border:2px dashed var(--border-highlight); border-radius:12px; padding:2rem; text-align:center; background:rgba(30,41,59,0.4); margin-bottom:1.25rem;">
          <i data-lucide="file-up" style="width:40px; height:40px; color:var(--accent-primary); margin-bottom:0.5rem;"></i>
          <h4 style="font-size:1rem; margin-bottom:0.25rem;">Drag & drop your invoice PDF, PNG, or JPG</h4>
          <p style="font-size:0.78rem; color:var(--text-muted);">OCR engine automatically extracts vendor, tax, PO and line items</p>
        </div>

        <!-- Extraction Preview Form -->
        <div id="upload-extraction-preview">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted);">Invoice ID</label>
              <input type="text" id="up-inv-id" class="input-control" style="width:100%;" value="INV-1057">
            </div>
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted);">Vendor Name</label>
              <input type="text" id="up-vendor" class="input-control" style="width:100%;" value="ABC Technologies">
            </div>
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted);">PO Number</label>
              <input type="text" id="up-po" class="input-control" style="width:100%;" value="PO-2026-99">
            </div>
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted);">Amount (₹)</label>
              <input type="number" id="up-amount" class="input-control" style="width:100%;" value="320000">
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="header-btn" onclick="window.closeModal()">Cancel</button>
        <button class="header-btn btn-primary" onclick="window.processUploadedInvoiceAction()">Run AI Verification & Save</button>
      </div>
    </div>
  `;
}

function loadUploadPreset(type) {
  if (type === 'INV-1057') {
    document.getElementById('up-inv-id').value = 'INV-1057';
    document.getElementById('up-vendor').value = 'ABC Technologies';
    document.getElementById('up-po').value = 'PO-2026-99';
    document.getElementById('up-amount').value = 320000;
  } else if (type === 'DUP-9901') {
    document.getElementById('up-inv-id').value = 'INV-1048-B';
    document.getElementById('up-vendor').value = 'ABC Technologies';
    document.getElementById('up-po').value = 'PO-2026-88';
    document.getElementById('up-amount').value = 245000;
  } else {
    document.getElementById('up-inv-id').value = `INV-${Math.floor(2000 + Math.random()*8000)}`;
    document.getElementById('up-vendor').value = 'Infosys Ltd';
    document.getElementById('up-po').value = 'PO-2026-102';
    document.getElementById('up-amount').value = 450000;
  }
}

function processUploadedInvoiceAction() {
  const invId = document.getElementById('up-inv-id').value;
  const vendorName = document.getElementById('up-vendor').value;
  const po = document.getElementById('up-po').value;
  const amount = parseFloat(document.getElementById('up-amount').value) || 100000;

  const rawObj = {
    id: invId,
    invoiceNumber: invId,
    vendorId: "VEND-001",
    vendorName: vendorName,
    poNumber: po,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 15*86400000).toISOString().split('T')[0],
    amount: amount,
    tax: Math.round(amount * 0.18),
    totalAmount: Math.round(amount * 1.18),
    category: "IT Hardware & Software",
    status: "Needs Review",
    approvalStatus: "Pending"
  };

  const aiResult = window.apAIEngine.analyzeInvoice(rawObj);
  rawObj.status = aiResult.riskLevel.includes('Risk') ? 'Needs Review' : 'Pending';
  rawObj.aiRiskScore = aiResult.riskLevel;
  rawObj.aiFlags = aiResult.flags;
  rawObj.aiExplanation = aiResult.explanation;

  window.appState.addUploadedInvoice(rawObj);
  window.closeModal();
}
