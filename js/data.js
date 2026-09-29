/* PayFlow AI - Comprehensive AP Historical & Operating Dataset */

const INITIAL_DATA = {
  company: {
    name: "Nexus Technologies Pvt Ltd",
    currency: "INR",
    currencySymbol: "₹",
    financialYear: "2026-2027",
    role: "AP Executive / Manager"
  },
  
  vendors: [
    {
      id: "VEND-001",
      name: "ABC Technologies",
      category: "IT Hardware & Software",
      gstin: "36AAACA123411Z8",
      contactPerson: "Rajesh Sharma",
      email: "accounts@abctechnologies.com",
      phone: "+91 98765 43210",
      avgInvoiceValue: 185000,
      totalSpend: 2450000,
      outstandingAmount: 565000,
      invoiceCount: 18,
      overdueCount: 1,
      paymentReliability: 96,
      lastPaymentDate: "2026-09-15",
      status: "Active"
    },
    {
      id: "VEND-002",
      name: "Infosys Ltd",
      category: "Software Consulting",
      gstin: "29AAACI088711Z6",
      contactPerson: "Priya Nair",
      email: "ap-billing@infosys.com",
      phone: "+91 98450 12345",
      avgInvoiceValue: 450000,
      totalSpend: 5400000,
      outstandingAmount: 450000,
      invoiceCount: 14,
      overdueCount: 0,
      paymentReliability: 99,
      lastPaymentDate: "2026-09-20",
      status: "Active"
    },
    {
      id: "VEND-003",
      name: "TCS (Tata Consultancy Services)",
      category: "Cloud Infrastructure",
      gstin: "27AAACT282811Z1",
      contactPerson: "Amitabh Sen",
      email: "vendorpay@tcs.com",
      phone: "+91 99200 98765",
      avgInvoiceValue: 620000,
      totalSpend: 7440000,
      outstandingAmount: 620000,
      invoiceCount: 12,
      overdueCount: 0,
      paymentReliability: 98,
      lastPaymentDate: "2026-09-10",
      status: "Active"
    },
    {
      id: "VEND-004",
      name: "CloudNova Solutions",
      category: "Cloud Hosting & SaaS",
      gstin: "36AABCC998811Z2",
      contactPerson: "Siddharth Rao",
      email: "billing@cloudnova.io",
      phone: "+91 91000 55443",
      avgInvoiceValue: 210000,
      totalSpend: 1890000,
      outstandingAmount: 540000,
      invoiceCount: 10,
      overdueCount: 1,
      paymentReliability: 88,
      lastPaymentDate: "2026-08-28",
      status: "Active"
    },
    {
      id: "VEND-005",
      name: "Hyderabad Office Supplies",
      category: "Facilities & Office Supplies",
      gstin: "36AAAFH129911Z4",
      contactPerson: "Venkat Reddy",
      email: "sales@hydoffice.in",
      phone: "+91 94400 11223",
      avgInvoiceValue: 45000,
      totalSpend: 360000,
      outstandingAmount: 38000,
      invoiceCount: 9,
      overdueCount: 1,
      paymentReliability: 92,
      lastPaymentDate: "2026-09-02",
      status: "Active"
    },
    {
      id: "VEND-006",
      name: "Prime Logistics India",
      category: "Freight & Supply Chain",
      gstin: "27AAAFP554411Z9",
      contactPerson: "Vikram Malhotra",
      email: "invoices@primelogistics.co.in",
      phone: "+91 98210 66778",
      avgInvoiceValue: 115000,
      totalSpend: 1380000,
      outstandingAmount: 95000,
      invoiceCount: 15,
      overdueCount: 1,
      paymentReliability: 90,
      lastPaymentDate: "2026-08-14",
      status: "Active"
    },
    {
      id: "VEND-007",
      name: "SecureNet Systems",
      category: "Cybersecurity & Firewalls",
      gstin: "36AAAFS887711Z3",
      contactPerson: "Kavita Roy",
      email: "finance@securenetsystems.com",
      phone: "+91 97000 33445",
      avgInvoiceValue: 160000,
      totalSpend: 1440000,
      outstandingAmount: 160000,
      invoiceCount: 9,
      overdueCount: 0,
      paymentReliability: 95,
      lastPaymentDate: "2026-09-18",
      status: "Active"
    },
    {
      id: "VEND-008",
      name: "DigitalWorks India",
      category: "Digital Marketing & Media",
      gstin: "07AAAFD332211Z5",
      contactPerson: "Ananya Mehta",
      email: "billing@digitalworks.in",
      phone: "+91 98111 22334",
      avgInvoiceValue: 95000,
      totalSpend: 855000,
      outstandingAmount: 120000,
      invoiceCount: 11,
      overdueCount: 1,
      paymentReliability: 85,
      lastPaymentDate: "2026-08-05",
      status: "Active"
    }
  ],

  invoices: [
    {
      id: "INV-1052",
      invoiceNumber: "INV-1052",
      vendorId: "VEND-001",
      vendorName: "ABC Technologies",
      poNumber: "PO-2026-92",
      invoiceDate: "2026-09-25",
      dueDate: "2026-10-15",
      amount: 245000,
      tax: 44100,
      totalAmount: 289100,
      status: "Needs Review",
      approvalStatus: "Pending",
      category: "IT Hardware & Software",
      aiRiskScore: "Medium Risk",
      aiFlags: [
        "Amount is 32% higher than vendor 6-month average (₹1,85,000)",
        "Vendor recognized and PO matched"
      ],
      aiExplanation: "Flagged because the invoice amount (₹2,45,000) exceeds ABC Technologies' historical average of ₹1,85,000 by 32%. PO number matches active order PO-2026-92."
    },
    {
      id: "INV-1048",
      invoiceNumber: "INV-1048",
      vendorId: "VEND-001",
      vendorName: "ABC Technologies",
      poNumber: "PO-2026-88",
      invoiceDate: "2026-09-03",
      dueDate: "2026-10-03",
      amount: 245000,
      tax: 44100,
      totalAmount: 289100,
      status: "Flagged",
      approvalStatus: "Pending",
      category: "IT Hardware & Software",
      aiRiskScore: "High Risk",
      aiFlags: [
        "Potential Duplicate Detected: Matches INV-1012 in amount (₹2,45,000) and PO PO-2026-88",
        "Recent duplicate submission window (within 30 days)"
      ],
      aiExplanation: "Possible duplicate invoice detected. Matches previously paid invoice INV-1012 for ABC Technologies in amount (₹2,45,000) and PO number."
    },
    {
      id: "INV-1051",
      invoiceNumber: "INV-1051",
      vendorId: "VEND-004",
      vendorName: "CloudNova Solutions",
      poNumber: "PO-2026-91",
      invoiceDate: "2026-09-20",
      dueDate: "2026-10-01",
      amount: 480000,
      tax: 86400,
      totalAmount: 566400,
      status: "Flagged",
      approvalStatus: "Pending",
      category: "Cloud Hosting & SaaS",
      aiRiskScore: "High Risk",
      aiFlags: [
        "Unusual transaction pattern: Amount is 128% higher than 6-month vendor average (₹2,10,000)",
        "Sudden increase in recurring subscription cost"
      ],
      aiExplanation: "Invoice flagged for review because its amount (₹4,80,000) is 128% higher than CloudNova Solutions' 6-month average of ₹2,10,000. Verification with IT team required."
    },
    {
      id: "INV-1039",
      invoiceNumber: "INV-1039",
      vendorId: "VEND-006",
      vendorName: "Prime Logistics India",
      poNumber: "PO-2026-75",
      invoiceDate: "2026-08-15",
      dueDate: "2026-09-17",
      amount: 95000,
      tax: 17100,
      totalAmount: 112100,
      status: "Overdue",
      approvalStatus: "Approved",
      category: "Freight & Supply Chain",
      aiRiskScore: "High Priority",
      aiFlags: [
        "Payment is 12 days overdue",
        "Vendor reliability rating may drop if delayed further"
      ],
      aiExplanation: "Invoice is 12 days past due date (17 Sep 2026). Late payment fee of 2% may apply after 15 days."
    },
    {
      id: "INV-1035",
      invoiceNumber: "INV-1035",
      vendorId: "VEND-005",
      vendorName: "Hyderabad Office Supplies",
      poNumber: "PO-2026-71",
      invoiceDate: "2026-08-10",
      dueDate: "2026-09-11",
      amount: 38000,
      tax: 6840,
      totalAmount: 44840,
      status: "Overdue",
      approvalStatus: "Approved",
      category: "Facilities & Office Supplies",
      aiRiskScore: "High Priority",
      aiFlags: [
        "Payment is 18 days overdue"
      ],
      aiExplanation: "Invoice is 18 days overdue. Vendor has requested immediate settlement."
    },
    {
      id: "INV-1028",
      invoiceNumber: "INV-1028",
      vendorId: "VEND-008",
      vendorName: "DigitalWorks India",
      poNumber: "PO-2026-64",
      invoiceDate: "2026-08-01",
      dueDate: "2026-09-05",
      amount: 120000,
      tax: 21600,
      totalAmount: 141600,
      status: "Overdue",
      approvalStatus: "Approved",
      category: "Digital Marketing & Media",
      aiRiskScore: "High Priority",
      aiFlags: [
        "Payment is 24 days overdue"
      ],
      aiExplanation: "Invoice is 24 days past due date. Requires immediate disbursement."
    },
    {
      id: "INV-1053",
      invoiceNumber: "INV-1053",
      vendorId: "VEND-002",
      vendorName: "Infosys Ltd",
      poNumber: "PO-2026-93",
      invoiceDate: "2026-09-22",
      dueDate: "2026-10-22",
      amount: 450000,
      tax: 81000,
      totalAmount: 531000,
      status: "Pending",
      approvalStatus: "Pending",
      category: "Software Consulting",
      aiRiskScore: "Low Risk",
      aiFlags: [
        "Amount matches contract agreement exactly",
        "Verified milestone completion"
      ],
      aiExplanation: "Standard monthly consulting invoice matching contract terms."
    },
    {
      id: "INV-1054",
      invoiceNumber: "INV-1054",
      vendorId: "VEND-003",
      vendorName: "TCS (Tata Consultancy Services)",
      poNumber: "PO-2026-94",
      invoiceDate: "2026-09-18",
      dueDate: "2026-10-18",
      amount: 620000,
      tax: 111600,
      totalAmount: 731600,
      status: "Approved",
      approvalStatus: "Approved",
      category: "Cloud Infrastructure",
      aiRiskScore: "Low Risk",
      aiFlags: [
        "Approved by VP IT",
        "Due in 19 days"
      ],
      aiExplanation: "Routine infrastructure retainer invoice. Clean history."
    },
    {
      id: "INV-1055",
      invoiceNumber: "INV-1055",
      vendorId: "VEND-007",
      vendorName: "SecureNet Systems",
      poNumber: "PO-2026-95",
      invoiceDate: "2026-09-21",
      dueDate: "2026-10-06",
      amount: 160000,
      tax: 28800,
      totalAmount: 188800,
      status: "Pending",
      approvalStatus: "Pending",
      category: "Cybersecurity & Firewalls",
      aiRiskScore: "Low Risk",
      aiFlags: [
        "Annual security renewal",
        "Due in 7 days"
      ],
      aiExplanation: "Q3 firewall license renewal. Validated against rate card."
    },
    {
      id: "INV-1012",
      invoiceNumber: "INV-1012",
      vendorId: "VEND-001",
      vendorName: "ABC Technologies",
      poNumber: "PO-2026-88",
      invoiceDate: "2026-07-15",
      dueDate: "2026-08-15",
      amount: 245000,
      tax: 44100,
      totalAmount: 289100,
      status: "Paid",
      approvalStatus: "Approved",
      category: "IT Hardware & Software",
      aiRiskScore: "Clear",
      aiFlags: [
        "Paid on 14 Aug 2026 via RTGS"
      ],
      aiExplanation: "Historical reference invoice paid successfully."
    }
  ],

  transactions: [
    { id: "TXN-9012", date: "2026-09-20", vendor: "Infosys Ltd", invoiceId: "INV-1045", amount: 450000, category: "Software Consulting", method: "RTGS", status: "Completed" },
    { id: "TXN-9011", date: "2026-09-18", vendor: "SecureNet Systems", invoiceId: "INV-1042", amount: 160000, category: "Cybersecurity", method: "NEFT", status: "Completed" },
    { id: "TXN-9010", date: "2026-09-15", vendor: "ABC Technologies", invoiceId: "INV-1040", amount: 185000, category: "IT Hardware", method: "RTGS", status: "Completed" },
    { id: "TXN-9009", date: "2026-09-10", vendor: "TCS", invoiceId: "INV-1038", amount: 620000, category: "Cloud Infrastructure", method: "RTGS", status: "Completed" },
    { id: "TXN-9008", date: "2026-09-02", vendor: "Hyderabad Office Supplies", invoiceId: "INV-1031", amount: 42000, category: "Facilities", method: "UPI", status: "Completed" },
    { id: "TXN-9007", date: "2026-08-28", vendor: "CloudNova Solutions", invoiceId: "INV-1025", amount: 210000, category: "Cloud SaaS", method: "Corporate Card", status: "Completed" },
    { id: "TXN-9006", date: "2026-08-20", vendor: "Infosys Ltd", invoiceId: "INV-1022", amount: 450000, category: "Software Consulting", method: "RTGS", status: "Completed" },
    { id: "TXN-9005", date: "2026-08-14", vendor: "Prime Logistics India", invoiceId: "INV-1018", amount: 115000, category: "Logistics", method: "NEFT", status: "Completed" },
    { id: "TXN-9004", date: "2026-08-10", vendor: "TCS", invoiceId: "INV-1016", amount: 620000, category: "Cloud Infrastructure", method: "RTGS", status: "Completed" },
    { id: "TXN-9003", date: "2026-08-05", vendor: "DigitalWorks India", invoiceId: "INV-1014", amount: 95000, category: "Digital Marketing", method: "NEFT", status: "Completed" },
    { id: "TXN-9002", date: "2026-07-25", vendor: "SecureNet Systems", invoiceId: "INV-1010", amount: 160000, category: "Cybersecurity", method: "NEFT", status: "Completed" },
    { id: "TXN-9001", date: "2026-07-14", vendor: "ABC Technologies", invoiceId: "INV-1012", amount: 245000, category: "IT Hardware", method: "RTGS", status: "Completed" }
  ],

  payments: [
    { id: "PAY-101", invoiceId: "INV-1039", vendorName: "Prime Logistics India", amount: 95000, dueDate: "2026-09-17", priority: "High Priority", priorityReason: "Overdue by 12 days. Carrier penalty warning.", status: "Overdue" },
    { id: "PAY-102", invoiceId: "INV-1035", vendorName: "Hyderabad Office Supplies", amount: 38000, dueDate: "2026-09-11", priority: "High Priority", priorityReason: "Overdue by 18 days. Account on hold.", status: "Overdue" },
    { id: "PAY-103", invoiceId: "INV-1028", vendorName: "DigitalWorks India", amount: 120000, dueDate: "2026-09-05", priority: "High Priority", priorityReason: "Overdue by 24 days. Critical media campaign vendor.", status: "Overdue" },
    { id: "PAY-104", invoiceId: "INV-1051", vendorName: "CloudNova Solutions", amount: 480000, dueDate: "2026-10-01", priority: "High Priority", priorityReason: "Due in 2 days. AI Flagged: 128% over average.", status: "Pending" },
    { id: "PAY-105", invoiceId: "INV-1055", vendorName: "SecureNet Systems", amount: 160000, dueDate: "2026-10-06", priority: "Medium Priority", priorityReason: "Due in 7 days. Early payment eligible for 2% discount.", status: "Pending" },
    { id: "PAY-106", invoiceId: "INV-1052", vendorName: "ABC Technologies", amount: 245000, dueDate: "2026-10-15", priority: "Medium Priority", priorityReason: "Due in 16 days. Pending approval review.", status: "Pending" },
    { id: "PAY-107", invoiceId: "INV-1054", vendorName: "TCS", amount: 620000, dueDate: "2026-10-18", priority: "Low Priority", priorityReason: "Approved. Scheduled for standard payment cycle.", status: "Scheduled" },
    { id: "PAY-108", invoiceId: "INV-1053", vendorName: "Infosys Ltd", amount: 450000, dueDate: "2026-10-22", priority: "Low Priority", priorityReason: "Due in 23 days. Milestone verification in progress.", status: "Pending" }
  ],

  alerts: [
    {
      id: "ALT-201",
      severity: "Critical",
      title: "Overdue Payments Require Immediate Attention",
      relatedEntity: "INV-1039, INV-1035, INV-1028",
      timestamp: "2026-09-29 09:15 AM",
      explanation: "7 invoices totaling ₹7,53,000 are currently past due date. Vendor deliveries for office supplies & logistics are temporarily paused.",
      actionLabel: "View Overdue Payments",
      targetPage: "payments"
    },
    {
      id: "ALT-202",
      severity: "High",
      title: "Potential Duplicate Invoice Detected",
      relatedEntity: "INV-1048",
      timestamp: "2026-09-29 08:30 AM",
      explanation: "Invoice INV-1048 (₹2,45,000) from ABC Technologies shares identical PO PO-2026-88 and amount with previously paid INV-1012.",
      actionLabel: "Review Duplicate",
      targetPage: "invoices"
    },
    {
      id: "ALT-203",
      severity: "High",
      title: "Unusual Transaction Amount Flagged",
      relatedEntity: "INV-1051",
      timestamp: "2026-09-28 04:45 PM",
      explanation: "Invoice INV-1051 from CloudNova Solutions (₹4,80,000) is 128% higher than historical vendor average of ₹2,10,000.",
      actionLabel: "Inspect Anomaly",
      targetPage: "invoices"
    },
    {
      id: "ALT-204",
      severity: "Medium",
      title: "Vendor Spending Spike: ABC Technologies",
      relatedEntity: "VEND-001",
      timestamp: "2026-09-27 11:20 AM",
      explanation: "ABC Technologies total monthly billing has increased by 42% over Q2 baseline.",
      actionLabel: "View Vendor Analytics",
      targetPage: "vendors"
    }
  ],

  auditLogs: [
    {
      id: "AUD-801",
      timestamp: "2026-09-29 10:42 AM",
      performedBy: "AI Agent",
      action: "Duplicate Detected",
      entityId: "INV-1048",
      description: "Potential duplicate invoice detected based on vendor (ABC Technologies), amount (₹2,45,000) and PO similarity."
    },
    {
      id: "AUD-802",
      timestamp: "2026-09-29 10:15 AM",
      performedBy: "AI Agent",
      action: "Anomaly Flagged",
      entityId: "INV-1051",
      description: "Flagged invoice INV-1051 (CloudNova Solutions): Amount ₹4,80,000 is 128% higher than vendor 6-month average."
    },
    {
      id: "AUD-803",
      timestamp: "2026-09-28 03:20 PM",
      performedBy: "Saba (AP Manager)",
      action: "Payment Scheduled",
      entityId: "INV-1054",
      description: "Scheduled RTGS payment of ₹6,20,000 for TCS for due date 18 Oct 2026."
    },
    {
      id: "AUD-804",
      timestamp: "2026-09-27 01:10 PM",
      performedBy: "Saba (AP Manager)",
      action: "Invoice Approved",
      entityId: "INV-1054",
      description: "Approved invoice INV-1054 following budget verification."
    },
    {
      id: "AUD-805",
      timestamp: "2026-09-25 11:00 AM",
      performedBy: "AI Agent",
      action: "Invoice Processed",
      entityId: "INV-1052",
      description: "Processed OCR document INV-1052 for ABC Technologies. Vendor recognized, PO-2026-92 verified."
    }
  ],

  policies: {
    anomalyThresholdPercent: 25,
    duplicateMatchingSensitivity: "High",
    cfoApprovalThreshold: 200000,
    defaultPaymentTermsDays: 30,
    autoFlagAnomalies: true
  }
};
