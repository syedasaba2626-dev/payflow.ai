/* PayFlow AI - Payments Scheduling & Management Component */

let currentPaymentTab = 'All';

function renderPaymentsPage() {
  const payments = window.appState.data.payments;
  const formatINR = (val) => window.appState.formatINR(val);

  const filteredPayments = payments.filter(p => {
    if (currentPaymentTab === 'All') return true;
    if (currentPaymentTab === 'Upcoming') return p.status === 'Pending' || p.status === 'Scheduled';
    return p.status === currentPaymentTab;
  });

  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Payment Queue & Execution</h1>
        <div class="page-subtitle">Prioritized payment scheduling, cashflow optimization & disbursement</div>
      </div>
      <button class="header-btn btn-primary" onclick="window.openSchedulePaymentModal()">
        <i data-lucide="calendar-plus"></i>
        <span>Schedule New Payment</span>
      </button>
    </div>

    <!-- Payment Tabs -->
    <div class="filter-bar">
      <div style="display:flex; gap:0.4rem;">
        ${['All', 'Upcoming', 'Pending', 'Scheduled', 'Paid', 'Overdue'].map(tab => `
          <button class="header-btn ${currentPaymentTab === tab ? 'btn-primary' : ''}" style="padding:0.4rem 0.85rem; font-size:0.82rem;" onclick="window.setPaymentTab('${tab}')">
            ${tab}
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Payments Data Table -->
    <div class="card" style="padding:0; overflow:hidden;">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Invoice ID</th>
              <th>Amount (₹)</th>
              <th>Due Date</th>
              <th>AI Priority Level & Reason</th>
              <th>Status</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filteredPayments.map(p => {
              let priorityClass = 'priority-medium';
              if (p.priority === 'High Priority') priorityClass = 'priority-high';
              else if (p.priority === 'Low Priority') priorityClass = 'priority-low';

              return `
                <tr>
                  <td><strong>${p.vendorName}</strong></td>
                  <td>
                    <a style="color:var(--accent-primary); cursor:pointer;" onclick="window.viewInvoiceDetail('${p.invoiceId}')">${p.invoiceId}</a>
                  </td>
                  <td><strong style="font-size:0.95rem;">${formatINR(p.amount)}</strong></td>
                  <td><span style="${p.status==='Overdue'?'color:#ef4444; font-weight:600;':''}">${p.dueDate}</span></td>
                  <td>
                    <div>
                      <span class="badge ${priorityClass}">${p.priority}</span>
                    </div>
                    <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">${p.priorityReason}</div>
                  </td>
                  <td>
                    <span class="badge ${p.status==='Paid'?'badge-paid':p.status==='Overdue'?'badge-overdue':p.status==='Scheduled'?'badge-approved':'badge-pending'}">
                      ${p.status}
                    </span>
                  </td>
                  <td style="text-align:right;">
                    <div style="display:flex; justify-content:flex-end; gap:0.35rem;">
                      ${p.status !== 'Paid' ? `
                        <button class="header-btn btn-primary" style="padding:0.25rem 0.55rem; font-size:0.75rem;" onclick="window.openSchedulePaymentModal('${p.invoiceId}')">
                          Schedule
                        </button>
                        <button class="header-btn btn-success" style="padding:0.25rem 0.55rem; font-size:0.75rem;" onclick="window.appState.markAsPaid('${p.invoiceId}')">
                          Mark Paid
                        </button>
                      ` : `
                        <span style="font-size:0.75rem; color:var(--color-success); font-weight:600;">Settled</span>
                      `}
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

function setPaymentTab(tab) {
  currentPaymentTab = tab;
  window.renderApp();
}

function renderSchedulePaymentModal(invId) {
  const invoices = window.appState.data.invoices.filter(i => i.status !== 'Paid' && i.status !== 'Rejected');
  const targetInv = invoices.find(i => i.id === invId) || invoices[0];
  const formatINR = (val) => window.appState.formatINR(val);

  return `
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-title" style="display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="calendar" style="color:var(--accent-primary);"></i>
          Schedule Payment Disbursement
        </div>
        <button class="icon-btn" onclick="window.closeModal()"><i data-lucide="x"></i></button>
      </div>

      <div class="modal-body">
        <div style="margin-bottom:1rem;">
          <label style="font-size:0.78rem; color:var(--text-muted); display:block; margin-bottom:0.3rem;">Select Pending Invoice</label>
          <select id="sch-invoice-id" class="select-control" style="width:100%; padding:0.6rem;">
            ${invoices.map(i => `<option value="${i.id}" ${targetInv && targetInv.id===i.id?'selected':''}>${i.id} — ${i.vendorName} (${formatINR(i.totalAmount)})</option>`).join('')}
          </select>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.85rem; margin-bottom:1rem;">
          <div>
            <label style="font-size:0.78rem; color:var(--text-muted); display:block; margin-bottom:0.3rem;">Disbursement Date</label>
            <input type="date" id="sch-date" class="input-control" style="width:100%;" value="${new Date().toISOString().split('T')[0]}">
          </div>
          <div>
            <label style="font-size:0.78rem; color:var(--text-muted); display:block; margin-bottom:0.3rem;">Payment Channel</label>
            <select id="sch-method" class="select-control" style="width:100%;">
              <option value="RTGS">RTGS (Real Time Gross Settlement)</option>
              <option value="NEFT">NEFT (National Electronic Fund)</option>
              <option value="UPI">Corporate UPI / Direct Transfer</option>
              <option value="Corporate Card">Corporate Credit Card</option>
            </select>
          </div>
        </div>

        <div style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); padding:0.75rem; border-radius:8px; font-size:0.8rem; color:var(--text-primary);">
          <i data-lucide="shield-check" style="color:var(--color-success);"></i> Automated banking integration will execute payout at 09:00 AM on scheduled date.
        </div>
      </div>

      <div class="modal-footer">
        <button class="header-btn" onclick="window.closeModal()">Cancel</button>
        <button class="header-btn btn-primary" onclick="window.confirmSchedulePaymentAction()">Confirm Schedule</button>
      </div>
    </div>
  `;
}

function confirmSchedulePaymentAction() {
  const invId = document.getElementById('sch-invoice-id').value;
  const date = document.getElementById('sch-date').value;
  const method = document.getElementById('sch-method').value;

  window.appState.schedulePayment(invId, date, method);
  window.closeModal();
}
