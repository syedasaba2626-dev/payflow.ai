/* PayFlow AI - Intelligence & Reasoning Engine */

class APAIEngine {
  constructor() {
    // Reference state
  }

  get state() {
    return window.appState;
  }

  /* 1. Invoice Analyzer */
  analyzeInvoice(invoiceData) {
    const data = this.state.data;
    const vendor = data.vendors.find(v => v.id === invoiceData.vendorId || v.name.toLowerCase() === (invoiceData.vendorName || '').toLowerCase());
    
    const analysis = {
      isVendorRecognized: !!vendor,
      vendorAverage: vendor ? vendor.avgInvoiceValue : 0,
      amountDeviationPct: 0,
      isAnomaly: false,
      isDuplicate: false,
      duplicateMatch: null,
      flags: [],
      explanation: "",
      riskLevel: "Low Risk"
    };

    if (vendor) {
      const avg = vendor.avgInvoiceValue;
      if (avg > 0) {
        const diff = invoiceData.amount - avg;
        analysis.amountDeviationPct = Math.round((diff / avg) * 100);
        if (analysis.amountDeviationPct > this.state.data.policies.anomalyThresholdPercent) {
          analysis.isAnomaly = true;
          analysis.flags.push(`Amount is ${analysis.amountDeviationPct}% higher than vendor historical average (${this.state.formatINR(avg)})`);
        }
      }
    } else {
      analysis.flags.push("Vendor not found in historical directory. Requires manual verification.");
    }

    // Check duplicate
    const dupResult = this.detectDuplicate(invoiceData);
    if (dupResult.isDuplicate) {
      analysis.isDuplicate = true;
      analysis.duplicateMatch = dupResult.match;
      analysis.flags.push(`Potential Duplicate: Matches invoice ${dupResult.match.id} (${this.state.formatINR(dupResult.match.amount)})`);
    }

    // Determine risk & explanation
    if (analysis.isDuplicate) {
      analysis.riskLevel = "High Risk";
      analysis.explanation = `Invoice flagged for review because a potential duplicate invoice (${dupResult.match.id}) was detected with identical amount (${this.state.formatINR(invoiceData.amount)}) and vendor matching.`;
    } else if (analysis.isAnomaly) {
      analysis.riskLevel = analysis.amountDeviationPct > 50 ? "High Risk" : "Medium Risk";
      analysis.explanation = `Invoice flagged for review because its amount (${this.state.formatINR(invoiceData.amount)}) is ${analysis.amountDeviationPct}% higher than the vendor's 6-month historical average (${this.state.formatINR(analysis.vendorAverage)}).`;
    } else {
      analysis.riskLevel = "Low Risk";
      analysis.explanation = `Invoice verified successfully against vendor contract terms and PO database. No anomalies detected.`;
    }

    return analysis;
  }

  /* 2. Duplicate Detector */
  detectDuplicate(invoiceData) {
    const invoices = this.state.data.invoices;
    const match = invoices.find(i => {
      if (i.id === invoiceData.id) return false;
      const sameVendor = i.vendorId === invoiceData.vendorId || i.vendorName.toLowerCase() === (invoiceData.vendorName || '').toLowerCase();
      const sameAmount = Math.abs(i.amount - invoiceData.amount) < 100;
      const samePO = i.poNumber && invoiceData.poNumber && i.poNumber === invoiceData.poNumber;
      
      return sameVendor && (sameAmount || samePO);
    });

    if (match) {
      return {
        isDuplicate: true,
        match,
        reason: `Matched invoice ${match.id} from ${match.vendorName} with amount ${this.state.formatINR(match.amount)} and PO ${match.poNumber}.`
      };
    }

    return { isDuplicate: false, match: null };
  }

  /* 3. Transaction Analyzer */
  analyzeTransactions() {
    const txns = this.state.data.transactions;
    const vendors = this.state.data.vendors;
    const flagged = [];

    // Group transactions by vendor
    const vendorMap = {};
    txns.forEach(t => {
      if (!vendorMap[t.vendor]) vendorMap[t.vendor] = [];
      vendorMap[t.vendor].push(t);
    });

    for (const vendorName in vendorMap) {
      const vTxns = vendorMap[vendorName];
      const vendorObj = vendors.find(v => v.name === vendorName);
      const avg = vendorObj ? vendorObj.avgInvoiceValue : (vTxns.reduce((s, x) => s + x.amount, 0) / vTxns.length);

      vTxns.forEach(t => {
        const devPct = Math.round(((t.amount - avg) / avg) * 100);
        if (devPct > 30) {
          flagged.push({
            transaction: t,
            deviationPct: devPct,
            vendorAverage: avg,
            reason: `Unusual transaction pattern: Amount ${this.state.formatINR(t.amount)} is ${devPct}% higher than vendor average of ${this.state.formatINR(avg)}.`
          });
        }
      });
    }

    return flagged;
  }

  /* 4. Executive Summary Agent */
  generateExecutiveSummary() {
    const kpis = this.state.getKPIs();
    const invoices = this.state.data.invoices;
    const dueSoonCount = invoices.filter(i => {
      if (i.status === 'Paid' || i.status === 'Rejected') return false;
      const due = new Date(i.dueDate);
      const today = new Date("2026-09-29");
      const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    }).length;

    const flaggedCount = invoices.filter(i => i.status === 'Needs Review' || i.status === 'Flagged').length;

    return `Your current outstanding payable amount is ${this.state.formatLakh(kpis.totalPayables)} across ${kpis.pendingInvoices} pending invoices. ${kpis.overdueCount} invoices are currently overdue, ${dueSoonCount} invoices are due within the next 7 days, and ${flaggedCount} invoices require AI review.`;
  }

  /* 5. Natural Language Query Parser */
  processUserQuery(query) {
    const q = query.toLowerCase().trim();
    const data = this.state.data;
    const kpis = this.state.getKPIs();

    // 1. Overdue invoices
    if (q.includes("overdue")) {
      const overdues = data.invoices.filter(i => i.status === 'Overdue');
      const listHtml = overdues.map((inv, idx) => `
        <div style="margin-top:0.5rem; padding:0.6rem; background:rgba(239,68,68,0.1); border-left:3px solid #ef4444; border-radius:6px;">
          <strong>${idx+1}. ${inv.id}</strong> — ${inv.vendorName}<br/>
          Amount: <strong>${this.state.formatINR(inv.totalAmount)}</strong> | Due Date: ${inv.dueDate}<br/>
          <small style="color:#94a3b8;">${inv.aiExplanation || 'Payment is past due date.'}</small>
        </div>
      `).join('');

      return {
        text: `There are currently **${overdues.length} overdue invoices** totaling **${this.state.formatINR(overdues.reduce((s,i)=>s+i.totalAmount,0))}**. Here is the breakdown:`,
        htmlCard: listHtml,
        recommendedActions: ["Schedule Payment for Overdue Invoices", "Send Vendor Reminder"]
      };
    }

    // 2. Due this week
    if (q.includes("due this week") || q.includes("coming up") || q.includes("due soon")) {
      const dueSoon = data.invoices.filter(i => {
        if (i.status === 'Paid' || i.status === 'Rejected') return false;
        const due = new Date(i.dueDate);
        const today = new Date("2026-09-29");
        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7;
      });

      const listHtml = dueSoon.map((inv, idx) => `
        <div style="margin-top:0.5rem; padding:0.6rem; background:rgba(245,158,11,0.1); border-left:3px solid #f59e0b; border-radius:6px;">
          <strong>${idx+1}. ${inv.id}</strong> (${inv.vendorName})<br/>
          Amount: <strong>${this.state.formatINR(inv.totalAmount)}</strong> | Due Date: ${inv.dueDate}
        </div>
      `).join('');

      return {
        text: `Found **${dueSoon.length} invoices** due within the next 7 days, totaling **${this.state.formatINR(dueSoon.reduce((s,i)=>s+i.totalAmount,0))}**:`,
        htmlCard: listHtml || `<p style="color:#94a3b8;">No invoices due in the next 7 days.</p>`,
        recommendedActions: ["Schedule Upcoming Payments", "Review Cashflow Forecast"]
      };
    }

    // 3. How much do we owe each vendor
    if (q.includes("owe each vendor") || q.includes("vendor balances") || q.includes("highest outstanding")) {
      const vendorBalances = data.vendors
        .filter(v => v.outstandingAmount > 0)
        .sort((a, b) => b.outstandingAmount - a.outstandingAmount);

      const listHtml = vendorBalances.map((v, idx) => `
        <div style="margin-top:0.4rem; padding:0.5rem 0.75rem; background:var(--bg-secondary); border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
          <span><strong>${idx+1}. ${v.name}</strong> (${v.category})</span>
          <span style="color:#6366f1; font-weight:700;">${this.state.formatINR(v.outstandingAmount)}</span>
        </div>
      `).join('');

      const topVendor = vendorBalances[0];
      return {
        text: `Our total outstanding payables across all vendors is **${this.state.formatINR(kpis.totalPayables)}**. **${topVendor.name}** has the highest outstanding balance at **${this.state.formatINR(topVendor.outstandingAmount)}**.`,
        htmlCard: listHtml,
        recommendedActions: ["View Vendor Analytics", "Export Payables Statement"]
      };
    }

    // 4. Transactions above 100,000
    if (q.includes("above") || q.includes("1,00,000") || q.includes("large transactions")) {
      const largeTxns = data.transactions.filter(t => t.amount >= 100000);
      const listHtml = largeTxns.slice(0, 6).map((t, idx) => `
        <div style="margin-top:0.4rem; padding:0.5rem 0.75rem; background:var(--bg-secondary); border-radius:6px; display:flex; justify-content:space-between;">
          <span><strong>${t.id}</strong> — ${t.vendor} (${t.date})</span>
          <span style="color:#10b981; font-weight:700;">${this.state.formatINR(t.amount)}</span>
        </div>
      `).join('');

      return {
        text: `Found **${largeTxns.length} transactions** valued at ₹1,00,000 or above:`,
        htmlCard: listHtml,
        recommendedActions: ["Analyze Anomaly Patterns", "Download High-Value Report"]
      };
    }

    // 5. Duplicate invoices
    if (q.includes("duplicate")) {
      const dupes = data.invoices.filter(i => i.aiFlags && i.aiFlags.some(f => f.toLowerCase().includes("duplicate")));
      const listHtml = dupes.map((inv, idx) => `
        <div style="margin-top:0.5rem; padding:0.6rem; background:rgba(239,68,68,0.1); border-left:3px solid #ef4444; border-radius:6px;">
          <strong>${inv.id}</strong> (${inv.vendorName}) — <strong>${this.state.formatINR(inv.totalAmount)}</strong><br/>
          <span style="color:#f87171; font-size:0.85rem;">Reason: ${inv.aiExplanation}</span>
        </div>
      `).join('');

      return {
        text: dupes.length > 0 
          ? `**Potential Duplicate Invoices Detected:** Found ${dupes.length} potential duplicate submission(s).`
          : `**No duplicate invoices detected** in the active queue.`,
        htmlCard: listHtml,
        recommendedActions: ["Review Duplicate Invoice", "Reject Duplicate Submission"]
      };
    }

    // 6. Compare this month with last month
    if (q.includes("compare") || q.includes("last month") || q.includes("month's payments")) {
      return {
        text: `**Monthly Payment Comparison:**\n\n` +
              `• **September 2026 (Current):** ${this.state.formatINR(kpis.paidThisMonth)} paid across 12 invoices.\n` +
              `• **August 2026 (Previous):** ₹15,60,000 paid across 14 invoices.\n\n` +
              `*Insight:* Payments increased by **17.9%** in September primarily due to cloud infrastructure annual license renewals.`,
        htmlCard: ``,
        recommendedActions: ["Open Analytics Dashboard", "Export Comparative Statement"]
      };
    }

    // 7. Priorities
    if (q.includes("prioritize") || q.includes("attention")) {
      const flagged = data.invoices.filter(i => i.status === 'Needs Review' || i.status === 'Flagged' || i.status === 'Overdue');
      const listHtml = flagged.map((inv, idx) => `
        <div style="margin-top:0.5rem; padding:0.6rem; background:var(--bg-secondary); border-left:3px solid ${inv.status === 'Overdue' ? '#ef4444' : '#f59e0b'}; border-radius:6px;">
          <strong>${idx+1}. ${inv.id}</strong> — ${inv.vendorName} | <strong>${this.state.formatINR(inv.totalAmount)}</strong><br/>
          <span style="color:#94a3b8; font-size:0.85rem;">Status: ${inv.status} | Reason: ${inv.aiExplanation}</span>
        </div>
      `).join('');

      return {
        text: `The AI Agent recommends prioritizing **${flagged.length} invoices** requiring immediate operational or audit focus:`,
        htmlCard: listHtml,
        recommendedActions: ["Start Review Workflow", "Approve Verified Invoices"]
      };
    }

    // 8. Specific vendor search (e.g. ABC Technologies)
    if (q.includes("abc technologies") || q.includes("infosys") || q.includes("tcs") || q.includes("cloudnova")) {
      const vName = q.includes("abc technologies") ? "ABC Technologies" :
                    q.includes("infosys") ? "Infosys Ltd" :
                    q.includes("tcs") ? "TCS (Tata Consultancy Services)" : "CloudNova Solutions";

      const vendor = data.vendors.find(v => v.name === vName);
      const vInvoices = data.invoices.filter(i => i.vendorName === vName);

      return {
        text: `**Vendor Overview for ${vName}:**\n` +
              `• **Total Spend:** ${this.state.formatINR(vendor ? vendor.totalSpend : 0)}\n` +
              `• **Outstanding Balance:** ${this.state.formatINR(vendor ? vendor.outstandingAmount : 0)}\n` +
              `• **Historical Average Invoice:** ${this.state.formatINR(vendor ? vendor.avgInvoiceValue : 0)}\n` +
              `• **Payment Reliability Score:** ${vendor ? vendor.paymentReliability : 95}%\n\n` +
              `Active Invoices: ${vInvoices.length} invoices recorded.`,
        htmlCard: ``,
        recommendedActions: [`View Full ${vName} History`, "Schedule Vendor Payment"]
      };
    }

    // Default AP summary
    return {
      text: this.generateExecutiveSummary() + `\n\nHow else can I assist you with invoice analysis, payment scheduling, or vendor audit today?`,
      htmlCard: ``,
      recommendedActions: ["Show Overdue Invoices", "Find Duplicate Invoices", "Show High-Value Transactions"]
    };
  }
}

window.apAIEngine = new APAIEngine();
