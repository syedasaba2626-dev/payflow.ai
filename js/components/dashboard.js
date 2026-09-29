/* PayFlow AI - Dashboard View Component */

function renderDashboardPage() {
  const kpis = window.appState.getKPIs();
  const formatINR = (val) => window.appState.formatINR(val);

  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Accounts Payable Dashboard</h1>
        <div class="page-subtitle">Real-time payables metrics, payment tracking & AI insights</div>
      </div>
      <div style="display:flex; gap:0.75rem;">
        <button class="header-btn btn-primary" onclick="window.openUploadModal()">
          <i data-lucide="upload-cloud"></i>
          <span>Upload Invoice</span>
        </button>
        <button class="header-btn" onclick="window.navigateTo('ai-agent')">
          <i data-lucide="bot"></i>
          <span>Ask AI Agent</span>
        </button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-header">
          <span>Total Payables</span>
          <div class="kpi-icon"><i data-lucide="wallet"></i></div>
        </div>
        <div class="kpi-value">${formatINR(kpis.totalPayables)}</div>
        <div class="kpi-footer">
          <span class="trend-up"><i data-lucide="trending-up"></i> +4.2%</span> vs last month
        </div>
      </div>

      <div class="kpi-card warning">
        <div class="kpi-header">
          <span>Pending Invoices</span>
          <div class="kpi-icon" style="color:var(--color-warning);"><i data-lucide="clock"></i></div>
        </div>
        <div class="kpi-value">${kpis.pendingInvoices}</div>
        <div class="kpi-footer">
          <span>Requires approval & review</span>
        </div>
      </div>

      <div class="kpi-card danger">
        <div class="kpi-header">
          <span>Overdue Payments</span>
          <div class="kpi-icon" style="color:var(--color-danger);"><i data-lucide="alert-triangle"></i></div>
        </div>
        <div class="kpi-value">${kpis.overdueCount}</div>
        <div class="kpi-footer trend-down">
          <span>Urgent action needed</span>
        </div>
      </div>

      <div class="kpi-card success">
        <div class="kpi-header">
          <span>Paid This Month</span>
          <div class="kpi-icon" style="color:var(--color-success);"><i data-lucide="check-circle-2"></i></div>
        </div>
        <div class="kpi-value">${formatINR(kpis.paidThisMonth)}</div>
        <div class="kpi-footer">
          <span class="trend-up"><i data-lucide="arrow-up-right"></i> 12 settled</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span>Upcoming Payments</span>
          <div class="kpi-icon" style="color:var(--color-info);"><i data-lucide="calendar"></i></div>
        </div>
        <div class="kpi-value">${formatINR(kpis.upcomingPayments)}</div>
        <div class="kpi-footer">
          <span>Due within 30 days</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span>Active Vendors</span>
          <div class="kpi-icon"><i data-lucide="building-2"></i></div>
        </div>
        <div class="kpi-value">${kpis.vendorCount}</div>
        <div class="kpi-footer">
          <span>100% verified GSTIN</span>
        </div>
      </div>
    </div>

    <!-- AI Insights Section -->
    <div class="ai-insights-card">
      <div class="ai-insights-header">
        <div class="ai-sparkle-icon"><i data-lucide="sparkles"></i></div>
        <div>
          <h3 style="font-size:1.1rem; color:white;">AI Agent Insights & Recommendations</h3>
          <p style="font-size:0.8rem; color:#a5b4fc;">Autonomous cross-referencing of invoices, POs and vendor history</p>
        </div>
      </div>
      <div class="insights-list">
        <div class="insight-item danger">
          <i data-lucide="alert-circle" style="color:var(--color-danger); flex-shrink:0;"></i>
          <div>
            <strong>Unusual Amount Anomaly:</strong> AI detected 3 invoices with unusually high amounts compared with vendor previous transaction averages (e.g. INV-1051 is 128% over average).
          </div>
          <button class="header-btn" style="padding:0.25rem 0.6rem; font-size:0.75rem; margin-left:auto;" onclick="window.navigateTo('invoices')">Inspect</button>
        </div>

        <div class="insight-item warning">
          <i data-lucide="shield-alert" style="color:var(--color-warning); flex-shrink:0;"></i>
          <div>
            <strong>Potential Duplicate:</strong> Invoice <strong>INV-1048</strong> (₹2,45,000) appears identical in PO & amount to previously paid invoice <strong>INV-1012</strong>.
          </div>
          <button class="header-btn" style="padding:0.25rem 0.6rem; font-size:0.75rem; margin-left:auto;" onclick="window.navigateTo('invoices')">Review Duplicate</button>
        </div>

        <div class="insight-item">
          <i data-lucide="clock" style="color:var(--accent-primary); flex-shrink:0;"></i>
          <div>
            <strong>Upcoming Due Dates:</strong> 5 payments totaling ₹7,25,000 are due within the next 7 days. Early payment discount available for SecureNet Systems.
          </div>
          <button class="header-btn" style="padding:0.25rem 0.6rem; font-size:0.75rem; margin-left:auto;" onclick="window.navigateTo('payments')">Schedule Now</button>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-grid">
      <div class="card col-8">
        <div class="chart-header">
          <div class="chart-title">Monthly AP Payments Trend</div>
          <span style="font-size:0.8rem; color:var(--text-muted);">Paid vs Pending (6 Months)</span>
        </div>
        <div class="chart-container">
          <canvas id="chart-monthly-payments"></canvas>
        </div>
      </div>

      <div class="card col-4">
        <div class="chart-header">
          <div class="chart-title">Invoice Status Distribution</div>
        </div>
        <div class="chart-container">
          <canvas id="chart-status-dist"></canvas>
        </div>
      </div>

      <div class="card col-6">
        <div class="chart-header">
          <div class="chart-title">Top Payables by Vendor</div>
        </div>
        <div class="chart-container">
          <canvas id="chart-payables-vendor"></canvas>
        </div>
      </div>

      <div class="card col-6">
        <div class="chart-header">
          <div class="chart-title">Overdue Invoices Aging Breakdown</div>
        </div>
        <div class="chart-container">
          <canvas id="chart-overdue-aging"></canvas>
        </div>
      </div>
    </div>
  `;
}

function initDashboardCharts() {
  if (typeof Chart === 'undefined') return;

  // 1. Monthly Payments Chart
  const ctxMonthly = document.getElementById('chart-monthly-payments');
  if (ctxMonthly) {
    new Chart(ctxMonthly, {
      type: 'bar',
      data: {
        labels: ['Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026'],
        datasets: [
          {
            label: 'Paid (₹)',
            data: [1420000, 1650000, 1580000, 1720000, 1560000, 1840000],
            backgroundColor: '#10b981',
            borderRadius: 6
          },
          {
            label: 'Pending (₹)',
            data: [450000, 320000, 510000, 640000, 580000, 725000],
            backgroundColor: '#6366f1',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }

  // 2. Invoice Status Distribution
  const ctxStatus = document.getElementById('chart-status-dist');
  if (ctxStatus) {
    new Chart(ctxStatus, {
      type: 'doughnut',
      data: {
        labels: ['Paid', 'Pending', 'Overdue', 'Needs Review'],
        datasets: [{
          data: [12, 14, 7, 3],
          backgroundColor: ['#10b981', '#3b82f6', '#ef4444', '#f59e0b'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }
      }
    });
  }

  // 3. Top Payables by Vendor
  const ctxVendor = document.getElementById('chart-payables-vendor');
  if (ctxVendor) {
    new Chart(ctxVendor, {
      type: 'bar',
      indexAxis: 'y',
      data: {
        labels: ['TCS', 'ABC Tech', 'CloudNova', 'Infosys', 'SecureNet'],
        datasets: [{
          label: 'Payable (₹)',
          data: [620000, 565000, 540000, 450000, 160000],
          backgroundColor: '#8b5cf6',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#94a3b8' }, grid: { display: false } }
        }
      }
    });
  }

  // 4. Overdue Aging Chart
  const ctxAging = document.getElementById('chart-overdue-aging');
  if (ctxAging) {
    new Chart(ctxAging, {
      type: 'bar',
      data: {
        labels: ['1-7 Days', '8-15 Days', '16-30 Days', '30+ Days'],
        datasets: [{
          label: 'Amount (₹)',
          data: [210000, 245000, 158000, 140000],
          backgroundColor: ['#f59e0b', '#fb923c', '#ef4444', '#b91c1c'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }
}
