/* PayFlow AI - Advanced Analytics & Reporting Component */

function renderAnalyticsPage() {
  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Accounts Payable Analytics</h1>
        <div class="page-subtitle">Historical spending intelligence, cashflow velocity & vendor distribution</div>
      </div>
      <button class="header-btn" onclick="window.exportAnalyticsReport()">
        <i data-lucide="download"></i>
        <span>Export Statement (PDF/CSV)</span>
      </button>
    </div>

    <!-- AI Insights Box -->
    <div class="ai-insights-card" style="margin-bottom:1.5rem;">
      <div class="ai-insights-header">
        <div class="ai-sparkle-icon"><i data-lucide="line-chart"></i></div>
        <div>
          <h3 style="font-size:1.1rem; color:white;">AI Macro Intelligence Findings</h3>
          <p style="font-size:0.8rem; color:#a5b4fc;">Automated pattern analysis over 6-month historical dataset</p>
        </div>
      </div>
      <div class="insights-list">
        <div class="insight-item">
          <i data-lucide="trending-up" style="color:var(--accent-primary); flex-shrink:0;"></i>
          <div>
            <strong>Vendor Spend Velocity:</strong> Total vendor spending increased by <strong>18%</strong> compared with the previous quarter due to Q3 software & cloud renewals.
          </div>
        </div>
        <div class="insight-item warning">
          <i data-lucide="pie-chart" style="color:var(--color-warning); flex-shrink:0;"></i>
          <div>
            <strong>Concentration Risk:</strong> <strong>CloudNova Solutions & TCS</strong> represent 48% of current outstanding payables (₹11.60 Lakh).
          </div>
        </div>
        <div class="insight-item danger">
          <i data-lucide="alert-circle" style="color:var(--color-danger); flex-shrink:0;"></i>
          <div>
            <strong>Overdue Impact:</strong> Overdue invoices currently account for <strong>12%</strong> of total outstanding payables, putting vendor delivery SLA at risk.
          </div>
        </div>
      </div>
    </div>

    <!-- Analytics Charts Grid -->
    <div class="charts-grid">
      <div class="card col-6">
        <div class="chart-header">
          <div class="chart-title">Monthly AP Spending Trend (INR)</div>
        </div>
        <div class="chart-container">
          <canvas id="an-chart-monthly"></canvas>
        </div>
      </div>

      <div class="card col-6">
        <div class="chart-header">
          <div class="chart-title">Vendor Spend Share Distribution</div>
        </div>
        <div class="chart-container">
          <canvas id="an-chart-vendor-share"></canvas>
        </div>
      </div>

      <div class="card col-6">
        <div class="chart-header">
          <div class="chart-title">Outstanding Payable Trend Line</div>
        </div>
        <div class="chart-container">
          <canvas id="an-chart-payable-trend"></canvas>
        </div>
      </div>

      <div class="card col-6">
        <div class="chart-header">
          <div class="chart-title">Average Invoice Amount by Category</div>
        </div>
        <div class="chart-container">
          <canvas id="an-chart-cat-avg"></canvas>
        </div>
      </div>
    </div>
  `;
}

function initAnalyticsCharts() {
  if (typeof Chart === 'undefined') return;

  // 1. Monthly Spending
  const ctxM = document.getElementById('an-chart-monthly');
  if (ctxM) {
    new Chart(ctxM, {
      type: 'line',
      data: {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [{
          label: 'Total Spend (₹)',
          data: [1870000, 1970000, 2090000, 2360000, 2140000, 2565000],
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,0.15)',
          fill: true,
          tension: 0.35
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

  // 2. Vendor Share
  const ctxV = document.getElementById('an-chart-vendor-share');
  if (ctxV) {
    new Chart(ctxV, {
      type: 'pie',
      data: {
        labels: ['TCS', 'Infosys', 'ABC Tech', 'CloudNova', 'SecureNet', 'Others'],
        datasets: [{
          data: [74.4, 54.0, 24.5, 18.9, 14.4, 25.9],
          backgroundColor: ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#64748b'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'right', labels: { color: '#94a3b8' } } }
      }
    });
  }

  // 3. Payable Trend Line
  const ctxP = document.getElementById('an-chart-payable-trend');
  if (ctxP) {
    new Chart(ctxP, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Outstanding Payables (₹)',
          data: [2890000, 2650000, 2510000, 2485000],
          borderColor: '#10b981',
          borderWidth: 3,
          tension: 0.2
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

  // 4. Category Average
  const ctxC = document.getElementById('an-chart-cat-avg');
  if (ctxC) {
    new Chart(ctxC, {
      type: 'bar',
      data: {
        labels: ['Cloud Infra', 'Consulting', 'SaaS', 'IT Hardware', 'Cybersecurity', 'Logistics'],
        datasets: [{
          label: 'Avg Invoice (₹)',
          data: [620000, 450000, 210000, 185000, 160000, 115000],
          backgroundColor: '#3b82f6',
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

function exportAnalyticsReport() {
  const jsonStr = JSON.stringify(window.appState.data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PayFlow_AI_AP_Report_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
}
