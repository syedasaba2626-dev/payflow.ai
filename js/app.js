/* PayFlow AI - Main Application Router & Entry Point */

window.currentPage = 'dashboard';
window.currentTheme = localStorage.getItem('payflow_theme') || 'dark';

document.documentElement.setAttribute('data-theme', window.currentTheme);

function renderApp() {
  const root = document.getElementById('app-root');
  if (!root) return;

  root.innerHTML = `
    ${renderSidebar(window.currentPage)}
    <div class="main-wrapper">
      ${renderHeader()}
      <main class="content-container">
        ${renderCurrentPageContent()}
      </main>
    </div>
    <div id="modal-mount"></div>
    <div class="toast-container" id="toast-container"></div>
  `;

  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Initialize Chart.js charts if on Dashboard or Analytics
  setTimeout(() => {
    if (window.currentPage === 'dashboard' && typeof initDashboardCharts === 'function') {
      initDashboardCharts();
    } else if (window.currentPage === 'analytics' && typeof initAnalyticsCharts === 'function') {
      initAnalyticsCharts();
    }
  }, 50);
}

function renderCurrentPageContent() {
  switch (window.currentPage) {
    case 'dashboard': return renderDashboardPage();
    case 'ai-agent': return renderAIAgentPage();
    case 'invoices': return renderInvoicesPage();
    case 'transactions': return renderTransactionsPage();
    case 'vendors': return renderVendorsPage();
    case 'payments': return renderPaymentsPage();
    case 'analytics': return renderAnalyticsPage();
    case 'alerts': return renderAlertsPage();
    case 'audit': return renderAuditPage();
    case 'settings': return renderSettingsPage();
    default: return renderDashboardPage();
  }
}

window.navigateTo = function(pageId) {
  window.currentPage = pageId;
  renderApp();
  window.scrollTo(0, 0);
};

window.toggleTheme = function() {
  window.currentTheme = window.currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', window.currentTheme);
  localStorage.setItem('payflow_theme', window.currentTheme);
  renderApp();
};

window.toggleNotificationsDropdown = function() {
  const dd = document.getElementById('notifications-dropdown');
  if (dd) {
    dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
  }
};

window.handleGlobalSearch = function(query) {
  if (!query || query.trim().length < 2) return;
  // If user hits enter or searches, redirect to invoices or transactions filter
  if (query.toUpperCase().startsWith('INV-')) {
    window.navigateTo('invoices');
    setTimeout(() => {
      window.handleInvoiceSearch(query);
    }, 100);
  }
};

/* Modal Handlers */
window.closeModal = function() {
  const mount = document.getElementById('modal-mount');
  if (mount) mount.innerHTML = '';
};

window.viewInvoiceDetail = function(invId) {
  const mount = document.getElementById('modal-mount');
  if (mount) {
    mount.innerHTML = `<div class="modal-overlay active">${renderInvoiceDetailModal(invId)}</div>`;
    if (window.lucide) lucide.createIcons();
  }
};

window.openUploadModal = function() {
  const mount = document.getElementById('modal-mount');
  if (mount) {
    mount.innerHTML = `<div class="modal-overlay active">${renderUploadModal()}</div>`;
    if (window.lucide) lucide.createIcons();
  }
};

window.openSchedulePaymentModal = function(invId) {
  const mount = document.getElementById('modal-mount');
  if (mount) {
    mount.innerHTML = `<div class="modal-overlay active">${renderSchedulePaymentModal(invId)}</div>`;
    if (window.lucide) lucide.createIcons();
  }
};

window.runTransactionAIAnalysisModal = function() {
  const mount = document.getElementById('modal-mount');
  if (mount) {
    mount.innerHTML = `<div class="modal-overlay active">${renderTransactionAIModal()}</div>`;
    if (window.lucide) lucide.createIcons();
  }
};

window.viewVendorAnalytics = function(vendorId) {
  const mount = document.getElementById('modal-mount');
  if (mount) {
    mount.innerHTML = `<div class="modal-overlay active">${renderVendorAnalyticsModal(vendorId)}</div>`;
    if (window.lucide) lucide.createIcons();
  }
};

window.triggerDemoScenarioAction = function() {
  const invId = window.appState.triggerDemoScenario();
  window.showToast("⚡ Demo Anomaly Scenario Triggered! INV-1057 created.");
  window.navigateTo('invoices');
  setTimeout(() => {
    window.viewInvoiceDetail(invId);
  }, 200);
};

window.showToast = function(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i data-lucide="sparkles" style="color:var(--accent-primary);"></i> <span>${message}</span>`;
  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();
  setTimeout(() => toast.remove(), 4000);
};

window.handleAIAction = function(actionText) {
  if (actionText.includes("Overdue")) {
    window.navigateTo('payments');
  } else if (actionText.includes("Duplicate") || actionText.includes("Review")) {
    window.navigateTo('invoices');
  } else if (actionText.includes("Vendor")) {
    window.navigateTo('vendors');
  } else if (actionText.includes("Analytics")) {
    window.navigateTo('analytics');
  } else {
    window.showToast(`Executing action: ${actionText}`);
  }
};

// Subscribe renderApp to state changes
window.appState.subscribe(() => renderApp());

// Initial App Boot
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
});
