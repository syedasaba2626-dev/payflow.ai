/* PayFlow AI - Global Reactive State Store */

class AppState {
  constructor() {
    this.listeners = [];
    this.loadState();
  }

  loadState() {
    const saved = localStorage.getItem('payflow_ai_state');
    if (saved) {
      try {
        this.data = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved state, resetting...", e);
        this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
      }
    } else {
      this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    }
  }

  saveState() {
    localStorage.setItem('payflow_ai_state', JSON.stringify(this.data));
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l(this.data));
  }

  /* Calculations & Helpers */
  formatINR(val) {
    if (val === undefined || val === null) return "₹0";
    return "₹" + Number(val).toLocaleString('en-IN');
  }

  formatLakh(val) {
    if (val >= 100000) {
      const lakhs = (val / 100000).toFixed(2);
      return `₹${lakhs} Lakh`;
    }
    return this.formatINR(val);
  }

  getKPIs() {
    const totalPayables = this.data.invoices
      .filter(i => i.status !== 'Paid' && i.status !== 'Rejected')
      .reduce((sum, i) => sum + i.totalAmount, 0);

    const pendingInvoices = this.data.invoices
      .filter(i => i.status === 'Pending' || i.status === 'Needs Review' || i.status === 'Flagged').length;

    const overdueCount = this.data.invoices
      .filter(i => i.status === 'Overdue').length;

    const paidThisMonth = this.data.invoices
      .filter(i => i.status === 'Paid')
      .reduce((sum, i) => sum + i.totalAmount, 0);

    const upcomingPayments = this.data.payments
      .filter(p => p.status === 'Pending' || p.status === 'Scheduled')
      .reduce((sum, p) => sum + p.amount, 0);

    const vendorCount = this.data.vendors.length;

    return {
      totalPayables,
      pendingInvoices,
      overdueCount,
      paidThisMonth,
      upcomingPayments,
      vendorCount
    };
  }

  /* Actions */
  approveInvoice(invoiceId) {
    const inv = this.data.invoices.find(i => i.id === invoiceId || i.invoiceNumber === invoiceId);
    if (inv) {
      inv.status = 'Approved';
      inv.approvalStatus = 'Approved';
      this.addAuditLog('Invoice Approved', inv.id, `User approved invoice ${inv.id} (${inv.vendorName}, ${this.formatINR(inv.totalAmount)})`);
      this.saveState();
    }
  }

  rejectInvoice(invoiceId, reason = "Rejected by user") {
    const inv = this.data.invoices.find(i => i.id === invoiceId || i.invoiceNumber === invoiceId);
    if (inv) {
      inv.status = 'Rejected';
      inv.approvalStatus = 'Rejected';
      this.addAuditLog('Invoice Rejected', inv.id, `User rejected invoice ${inv.id}: ${reason}`);
      this.saveState();
    }
  }

  markInvoiceForReview(invoiceId) {
    const inv = this.data.invoices.find(i => i.id === invoiceId || i.invoiceNumber === invoiceId);
    if (inv) {
      inv.status = 'Needs Review';
      this.addAuditLog('Marked for Review', inv.id, `Invoice ${inv.id} flagged for manual review.`);
      this.saveState();
    }
  }

  markAsPaid(invoiceOrPaymentId) {
    const inv = this.data.invoices.find(i => i.id === invoiceOrPaymentId || i.invoiceNumber === invoiceOrPaymentId);
    if (inv) {
      inv.status = 'Paid';
      inv.approvalStatus = 'Approved';
      
      // Update payment item
      const pay = this.data.payments.find(p => p.invoiceId === inv.id);
      if (pay) pay.status = 'Paid';

      // Update vendor stats
      const vend = this.data.vendors.find(v => v.id === inv.vendorId || v.name === inv.vendorName);
      if (vend) {
        vend.outstandingAmount = Math.max(0, vend.outstandingAmount - inv.totalAmount);
        vend.totalSpend += inv.totalAmount;
        vend.lastPaymentDate = new Date().toISOString().split('T')[0];
      }

      // Add to transaction log
      this.data.transactions.unshift({
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        vendor: inv.vendorName,
        invoiceId: inv.id,
        amount: inv.totalAmount,
        category: inv.category,
        method: "RTGS",
        status: "Completed"
      });

      this.addAuditLog('Payment Processed', inv.id, `Payment of ${this.formatINR(inv.totalAmount)} completed for ${inv.vendorName} (${inv.id}).`);
      this.saveState();
    }
  }

  schedulePayment(invoiceId, date, method = "RTGS") {
    const inv = this.data.invoices.find(i => i.id === invoiceId);
    if (inv) {
      const existingPay = this.data.payments.find(p => p.invoiceId === inv.id);
      if (existingPay) {
        existingPay.status = 'Scheduled';
        existingPay.dueDate = date;
      } else {
        this.data.payments.push({
          id: `PAY-${Math.floor(100 + Math.random() * 900)}`,
          invoiceId: inv.id,
          vendorName: inv.vendorName,
          amount: inv.totalAmount,
          dueDate: date,
          priority: inv.totalAmount > 200000 ? "High Priority" : "Medium Priority",
          priorityReason: `Scheduled for ${date} via ${method}`,
          status: "Scheduled"
        });
      }
      this.addAuditLog('Payment Scheduled', inv.id, `Payment of ${this.formatINR(inv.totalAmount)} scheduled for ${date} via ${method}.`);
      this.saveState();
    }
  }

  addUploadedInvoice(newInv) {
    this.data.invoices.unshift(newInv);
    
    // Add payment entry if not paid
    if (newInv.status !== 'Paid') {
      this.data.payments.unshift({
        id: `PAY-${Math.floor(100 + Math.random() * 900)}`,
        invoiceId: newInv.id,
        vendorName: newInv.vendorName,
        amount: newInv.totalAmount,
        dueDate: newInv.dueDate,
        priority: newInv.status === 'Needs Review' || newInv.status === 'Flagged' ? "High Priority" : "Medium Priority",
        priorityReason: newInv.aiExplanation || "New invoice uploaded",
        status: "Pending"
      });
    }

    if (newInv.aiFlags && newInv.aiFlags.length > 0) {
      this.data.alerts.unshift({
        id: `ALT-${Math.floor(100 + Math.random() * 900)}`,
        severity: newInv.aiRiskScore.includes('High') ? "High" : "Medium",
        title: `AI Flagged New Invoice: ${newInv.id}`,
        relatedEntity: newInv.id,
        timestamp: new Date().toLocaleString(),
        explanation: newInv.aiExplanation,
        actionLabel: "Review Invoice",
        targetPage: "invoices"
      });
    }

    this.addAuditLog('Invoice Uploaded', newInv.id, `Processed invoice ${newInv.id} from ${newInv.vendorName} (${this.formatINR(newInv.totalAmount)}). AI Status: ${newInv.status}`);
    this.saveState();
  }

  addAuditLog(action, entityId, description, performedBy = 'User / AP Manager') {
    const timestamp = new Date().toLocaleString('en-US', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });

    this.data.auditLogs.unshift({
      id: `AUD-${Math.floor(100 + Math.random() * 900)}`,
      timestamp,
      performedBy,
      action,
      entityId,
      description
    });
  }

  triggerDemoScenario() {
    // Check if INV-1057 already exists
    let inv = this.data.invoices.find(i => i.id === 'INV-1057');
    if (!inv) {
      const demoInvoice = {
        id: "INV-1057",
        invoiceNumber: "INV-1057",
        vendorId: "VEND-001",
        vendorName: "ABC Technologies",
        poNumber: "PO-2026-99",
        invoiceDate: "2026-09-29",
        dueDate: "2026-10-02",
        amount: 320000,
        tax: 57600,
        totalAmount: 377600,
        status: "Flagged",
        approvalStatus: "Pending",
        category: "IT Hardware & Software",
        aiRiskScore: "High Risk",
        aiFlags: [
          "Amount is 73% higher than ABC Technologies' 6-month average (₹1,85,000)",
          "Similar PO structure detected for Q3 hardware renewals",
          "Due within 3 days - expedited review recommended"
        ],
        aiExplanation: "This invoice requires manual review because the amount (₹3,20,000) is 73% higher than the vendor's historical average of ₹1,85,000 and a similar invoice exists for Q3 hardware."
      };
      
      this.addUploadedInvoice(demoInvoice);
    }
    return 'INV-1057';
  }

  resetDemoData() {
    localStorage.removeItem('payflow_ai_state');
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.notify();
  }
}

window.appState = new AppState();
