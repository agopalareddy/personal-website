// Aura: Ambient Wellness Companion Frontend Controller

let sessionId = null;
let currentMood = 5;
let consecutiveMissed = 0;
let isPending = false;

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const resetBtn = document.getElementById('reset-session-btn');
const thinkingStages = document.getElementById('thinking-stages');
const moodVal = document.getElementById('mood-val');
const complianceVal = document.getElementById('compliance-val');

// Medication indicators
const statusCardiovascular = document.getElementById('status-cardiovascular');
const statusMultivitamin = document.getElementById('status-multivitamin');
const statusSleepAid = document.getElementById('status-sleep-aid');

// Initialize Session
async function initializeSession() {
  try {
    appendSystemMessage('Connecting to GCP agent node...');
    const response = await fetch('/apps/app/users/user/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to initialize session');

    const data = await response.json();
    sessionId = data.id;
    console.log('Initialized Session ID:', sessionId);

    appendSystemMessage('Aura Wellness Agent connected. Session: active.');
    updateMedicationUI('pending', 'pending', 'pending');
    updateDashboard(5, '--');
  } catch (err) {
    console.error(err);
    appendSystemMessage('Connection error: Unable to load agent session. Please try again.');
  }
}

// Form Submission
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text || isPending) return;

  chatInput.value = '';
  await sendMessageToAgent(text);
});

// Reset Session Button
resetBtn.addEventListener('click', () => {
  chatMessages.innerHTML = '';
  initializeSession();
});

// Appending Messages
function appendUserMessage(text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message user';
  msgDiv.innerHTML = `
        <div class="msg-bubble">${escapeHtml(text)}</div>
        <div class="msg-meta">Arthur • Just now</div>
    `;
  chatMessages.appendChild(msgDiv);
  scrollToBottom();
}

function appendAgentMessage(text, isAlert = false) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message agent ${isAlert ? 'alert' : ''}`;

  let bubbleContent = '';
  if (isAlert) {
    bubbleContent = `
            <h4><i class="fa-solid fa-triangle-exclamation"></i> ESCALATION TRIGGERED</h4>
            <p>${escapeHtml(text)}</p>
        `;
  } else {
    bubbleContent = `<p>${escapeHtml(text)}</p>`;
  }

  msgDiv.innerHTML = `
        <div class="msg-bubble">${bubbleContent}</div>
        <div class="msg-meta">Aura • Just now</div>
    `;
  chatMessages.appendChild(msgDiv);
  scrollToBottom();
}

function appendSystemMessage(text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message system-msg';
  msgDiv.innerHTML = `<p>${escapeHtml(text)}</p>`;
  chatMessages.appendChild(msgDiv);
  scrollToBottom();
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Thinking Indicator Stages Control
function showThinking(stage) {
  thinkingStages.style.display = 'flex';
  document.querySelectorAll('.stage-item').forEach((item) => {
    item.classList.remove('active', 'completed');
  });

  if (stage === 'companion') {
    document.getElementById('stage-companion').classList.add('active');
  } else if (stage === 'anonymizer') {
    document.getElementById('stage-companion').classList.add('completed');
    document.getElementById('stage-anonymizer').classList.add('active');
  } else if (stage === 'escalation') {
    document.getElementById('stage-companion').classList.add('completed');
    document.getElementById('stage-anonymizer').classList.add('completed');
    document.getElementById('stage-escalation').classList.add('active');
  }
}

function hideThinking() {
  thinkingStages.style.display = 'none';
}

// UI State Updates
function updateDashboard(mood, complianceText) {
  moodVal.innerHTML = `${mood}<span class="small">/10</span>`;

  // Animate color based on score
  if (mood < 4) {
    moodVal.style.color = 'var(--danger)';
  } else if (mood < 7) {
    moodVal.style.color = 'var(--warning)';
  } else {
    moodVal.style.color = 'var(--success)';
  }

  complianceVal.textContent = complianceText;
  if (complianceText === 'Compliant') {
    complianceVal.style.color = 'var(--success)';
  } else if (complianceText === 'Missed') {
    complianceVal.style.color = 'var(--danger)';
  } else {
    complianceVal.style.color = 'var(--text-muted)';
  }
}

function updateMedicationUI(cardiovascular, multivitamin, sleepAid) {
  const items = [
    { el: statusCardiovascular, state: cardiovascular },
    { el: statusMultivitamin, state: multivitamin },
    { el: statusSleepAid, state: sleepAid },
  ];

  items.forEach((item) => {
    if (item.state === 'taken') {
      item.el.className = 'med-status taken';
      item.el.innerHTML = '<i class="fa-solid fa-check"></i> Taken';
      item.el.parentElement.className = 'med-item compliant';
    } else if (item.state === 'missed') {
      item.el.className = 'med-status not-taken';
      item.el.innerHTML = '<i class="fa-solid fa-xmark"></i> Missed';
      item.el.parentElement.className = 'med-item missed';
    } else {
      item.el.className = 'med-status pending';
      item.el.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Checking...';
      item.el.parentElement.className = 'med-item';
    }
  });
}

// API Communication with Agent (Readable Stream / SSE Parsing)
async function sendMessageToAgent(inputText) {
  if (!sessionId) {
    appendSystemMessage('Session not initialized. Reconnecting...');
    await initializeSession();
    if (!sessionId) return;
  }

  isPending = true;
  sendBtn.disabled = true;
  appendUserMessage(inputText);
  showThinking('companion');

  try {
    const response = await fetch('/run_sse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appName: 'app',
        userId: 'user',
        sessionId: sessionId,
        newMessage: {
          role: 'user',
          parts: [{ text: inputText }],
        },
        streaming: false,
        stateDelta: null,
      }),
    });

    if (!response.ok) throw new Error('Agent node error');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let finalResponseText = '';
    let isEscalated = false;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        const cleanLine = line.trim();
        if (cleanLine.startsWith('data: ')) {
          try {
            const eventData = JSON.parse(cleanLine.substring(6));
            console.log('Node Event:', eventData);

            if (eventData.errorCode) {
              throw new Error(eventData.errorMessage || 'Agent error');
            }

            // Track pipeline progress
            const nodePath = eventData.nodeInfo?.path || '';
            if (nodePath.includes('CompanionNode')) {
              showThinking('anonymizer');
            } else if (nodePath.includes('AnonymizerNode')) {
              showThinking('escalation');
            }

            // Extract state changes (state delta)
            const stateDelta = eventData.actions?.stateDelta || {};

            if (stateDelta.current_mood_score !== undefined) {
              currentMood = stateDelta.current_mood_score;
            }
            if (stateDelta.medication_compliance_flag !== undefined) {
              const isCompliant = stateDelta.medication_compliance_flag;
              updateDashboard(currentMood, isCompliant ? 'Compliant' : 'Missed');

              // Map compliance to the morning card for demo purposes
              updateMedicationUI(
                isCompliant ? 'taken' : 'missed',
                isCompliant ? 'taken' : 'pending',
                isCompliant ? 'taken' : 'pending'
              );
            }
            if (stateDelta.escalation_triggered !== undefined) {
              isEscalated = stateDelta.escalation_triggered;
            }

            // Extract output from leaf nodes
            if (
              nodePath.includes('alert_node') ||
              nodePath.includes('normal_end_node') ||
              nodePath.includes('escalation_node')
            ) {
              if (eventData.output) {
                finalResponseText = eventData.output;
              }
            }
          } catch (parseErr) {
            console.warn('Could not parse SSE event:', parseErr, cleanLine);
          }
        }
      }
    }

    hideThinking();
    if (finalResponseText) {
      appendAgentMessage(finalResponseText, isEscalated);
    } else {
      appendAgentMessage('I checked in and logged your telemetry to the dashboard.', isEscalated);
    }
  } catch (err) {
    console.error(err);
    hideThinking();
    appendSystemMessage(`Agent Error: ${err.message || 'Connection timeout.'}`);
  } finally {
    isPending = false;
    sendBtn.disabled = false;
  }
}

// Demo Presets Controllers
const presets = {
  healthy: 'Hi, I feel energetic and happy today. I took my morning pills right after breakfast.',
  missed:
    "Hello, my name is Arthur Pendelton. I live at 1428 Elm Street and my phone number is 555-0199. I'm feeling incredibly down today, and honestly, I completely skipped taking my morning cardiovascular support tablet because my stomach hurts.",
  depression:
    "I'm feeling really down and lonely today. The weather is gloomy and I didn't want to get out of bed. I took my pills but I just feel awful.",
};

document.querySelectorAll('.demo-btn').forEach((btn) => {
  btn.addEventListener('click', function () {
    const scenario = this.getAttribute('data-scenario');
    if (presets[scenario] && !isPending) {
      chatInput.value = presets[scenario];
      chatForm.dispatchEvent(new Event('submit'));
    }
  });
});

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Start
initializeSession();
