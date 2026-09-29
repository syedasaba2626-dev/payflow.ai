/* PayFlow AI - Dedicated Conversational AI Agent Component */

function renderAIAgentPage() {
  const promptChips = [
    "Summarize our current accounts payable situation.",
    "Show me all overdue invoices.",
    "Which invoices are due this week?",
    "How much do we owe each vendor?",
    "Are there any duplicate invoices?",
    "Find unusual transactions.",
    "Which invoices should I prioritize?",
    "Show transactions above ₹1,00,000.",
    "Show me the payment history of ABC Technologies.",
    "Which vendor has the highest outstanding amount?",
    "Compare this month's payments with last month."
  ];

  return `
    <div class="page-header" style="margin-bottom:1rem;">
      <div class="page-title-group">
        <h1 style="display:flex; align-items:center; gap:0.6rem;">
          <i data-lucide="bot" style="color:var(--accent-ai); width:28px; height:28px;"></i>
          PayFlow AI Agent
        </h1>
        <div class="page-subtitle">Your intelligent Accounts Payable assistant</div>
      </div>
      <div style="display:flex; align-items:center; gap:0.5rem; background:rgba(139,92,246,0.15); border:1px solid rgba(139,92,246,0.3); padding:0.4rem 0.85rem; border-radius:var(--radius-full); font-size:0.8rem; color:#a78bfa;">
        <i data-lucide="database" style="width:14px; height:14px;"></i>
        <span>Connected to Live AP Ledger (84 Vendors, 32 Payables)</span>
      </div>
    </div>

    <div class="ai-chat-layout">
      <!-- Main Chat Area -->
      <div class="chat-container">
        <div class="chat-header-bar">
          <div class="chat-agent-info">
            <div class="chat-avatar"><i data-lucide="sparkles"></i></div>
            <div>
              <strong style="font-size:0.95rem; display:block;">PayFlow Reasoning Engine v3.6</strong>
              <span style="font-size:0.75rem; color:var(--text-muted);">Explainable AI • Retrieval Augmented Generation (RAG)</span>
            </div>
          </div>
          <button class="header-btn" style="padding:0.35rem 0.75rem; font-size:0.78rem;" onclick="window.clearChatHistory()">
            <i data-lucide="rotate-ccw" style="width:13px; height:13px;"></i> Clear Chat
          </button>
        </div>

        <div class="chat-messages" id="chat-messages-body">
          <!-- Initial Assistant Message -->
          <div class="chat-message assistant">
            <div class="chat-avatar" style="width:34px; height:34px; font-size:1rem;"><i data-lucide="bot"></i></div>
            <div class="message-bubble">
              Hello! I am your <strong>PayFlow AI Agent</strong>. I have analyzed your latest invoice records, vendor histories, and transaction ledgers.<br/><br/>
              ${window.apAIEngine.generateExecutiveSummary()}<br/><br/>
              How can I assist you with accounts payable analysis, anomaly detection, or payment scheduling today?
            </div>
          </div>
        </div>

        <!-- Prompt Chips -->
        <div class="chat-prompts-bar">
          ${promptChips.map(chip => `
            <button class="prompt-chip" onclick="window.sendChatPrompt('${chip.replace(/'/g, "\\'")}')">
              ${chip}
            </button>
          `).join('')}
        </div>

        <!-- Input Box -->
        <div class="chat-input-area">
          <input type="text" id="chat-user-input" placeholder="Ask PayFlow AI anything about invoices, vendors, anomalies, or payments..." onkeydown="if(event.key==='Enter') window.handleChatSubmit()">
          <button class="header-btn btn-primary" onclick="window.handleChatSubmit()">
            <i data-lucide="send"></i>
            <span>Send</span>
          </button>
        </div>
      </div>

      <!-- Right Agent Tools / Capability Summary Panel -->
      <div class="ai-sidebar-panel card" style="display:flex; flex-direction:column; gap:1.25rem;">
        <div>
          <h4 style="font-size:0.95rem; margin-bottom:0.75rem; color:var(--text-primary); display:flex; align-items:center; gap:0.5rem;">
            <i data-lucide="cpu" style="color:var(--accent-primary);"></i> Active AI Tools
          </h4>
          <div style="display:flex; flex-direction:column; gap:0.6rem; font-size:0.82rem;">
            <div style="padding:0.6rem; background:var(--bg-secondary); border-radius:6px; border-left:3px solid var(--accent-primary);">
              <strong>Invoice Analyzer</strong>
              <div style="color:var(--text-muted); font-size:0.75rem; margin-top:2px;">Extracts invoice #, PO, amount, tax & validates against vendor baseline.</div>
            </div>
            <div style="padding:0.6rem; background:var(--bg-secondary); border-radius:6px; border-left:3px solid var(--color-warning);">
              <strong>Duplicate Detector</strong>
              <div style="color:var(--text-muted); font-size:0.75rem; margin-top:2px;">Scans cross-invoice matching on PO, vendor & identical amount.</div>
            </div>
            <div style="padding:0.6rem; background:var(--bg-secondary); border-radius:6px; border-left:3px solid var(--color-danger);">
              <strong>Transaction Anomaly Detector</strong>
              <div style="color:var(--text-muted); font-size:0.75rem; margin-top:2px;">Detects sudden amount spikes (>25%) & unusual payment frequencies.</div>
            </div>
            <div style="padding:0.6rem; background:var(--bg-secondary); border-radius:6px; border-left:3px solid var(--color-success);">
              <strong>Payment Predictor</strong>
              <div style="color:var(--text-muted); font-size:0.75rem; margin-top:2px;">Classifies payables by priority, penalty risks & cashflow impact.</div>
            </div>
          </div>
        </div>

        <div style="margin-top:auto; padding:0.85rem; background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.3); border-radius:var(--radius-md); font-size:0.78rem;">
          <strong style="color:var(--accent-primary); display:block; margin-bottom:0.25rem;">Explainable AI Guarantee</strong>
          Every recommendation provides human-auditable mathematical & logical reasons. No unverified predictions.
        </div>
      </div>
    </div>
  `;
}

function sendChatPrompt(promptText) {
  const inputEl = document.getElementById('chat-user-input');
  if (inputEl) {
    inputEl.value = promptText;
    handleChatSubmit();
  }
}

function handleChatSubmit() {
  const inputEl = document.getElementById('chat-user-input');
  const bodyEl = document.getElementById('chat-messages-body');
  if (!inputEl || !bodyEl) return;

  const query = inputEl.value.trim();
  if (!query) return;

  // Append user message
  const userMsgHtml = `
    <div class="chat-message user">
      <div class="message-bubble">${query}</div>
    </div>
  `;
  bodyEl.insertAdjacentHTML('beforeend', userMsgHtml);
  inputEl.value = '';
  bodyEl.scrollTop = bodyEl.scrollHeight;

  // Append typing indicator
  const typingId = `typing-${Date.now()}`;
  const typingHtml = `
    <div class="chat-message assistant" id="${typingId}">
      <div class="chat-avatar" style="width:34px; height:34px; font-size:1rem;"><i data-lucide="bot"></i></div>
      <div class="message-bubble" style="display:flex; align-items:center; gap:0.5rem; color:var(--text-muted);">
        <i data-lucide="loader-2" class="spin"></i> AI is querying ledger & cross-analyzing records...
      </div>
    </div>
  `;
  bodyEl.insertAdjacentHTML('beforeend', typingHtml);
  bodyEl.scrollTop = bodyEl.scrollHeight;
  if (window.lucide) lucide.createIcons();

  // Process query via AI Engine
  setTimeout(() => {
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();

    const response = window.apAIEngine.processUserQuery(query);
    
    // Log interaction to Audit Log
    window.appState.addAuditLog('AI Chat Query', 'AI Agent', `User asked: "${query}". AI responded with ledger analysis.`, 'AI Agent');

    let actionsHtml = '';
    if (response.recommendedActions && response.recommendedActions.length > 0) {
      actionsHtml = `
        <div style="margin-top:0.75rem; display:flex; gap:0.5rem; flex-wrap:wrap;">
          ${response.recommendedActions.map(act => `
            <button class="header-btn" style="font-size:0.75rem; padding:0.25rem 0.65rem;" onclick="window.handleAIAction('${act}')">
              <i data-lucide="arrow-right" style="width:12px; height:12px;"></i> ${act}
            </button>
          `).join('')}
        </div>
      `;
    }

    const assistantMsgHtml = `
      <div class="chat-message assistant">
        <div class="chat-avatar" style="width:34px; height:34px; font-size:1rem;"><i data-lucide="bot"></i></div>
        <div class="message-bubble">
          ${marked(response.text)}
          ${response.htmlCard || ''}
          ${actionsHtml}
        </div>
      </div>
    `;
    bodyEl.insertAdjacentHTML('beforeend', assistantMsgHtml);
    bodyEl.scrollTop = bodyEl.scrollHeight;
    if (window.lucide) lucide.createIcons();
  }, 400);
}

function clearChatHistory() {
  const bodyEl = document.getElementById('chat-messages-body');
  if (bodyEl) {
    bodyEl.innerHTML = `
      <div class="chat-message assistant">
        <div class="chat-avatar" style="width:34px; height:34px; font-size:1rem;"><i data-lucide="bot"></i></div>
        <div class="message-bubble">
          Chat history cleared. How can I help you analyze accounts payable data today?
        </div>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
  }
}

// Simple inline markdown converter fallback if library missing
function marked(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}
