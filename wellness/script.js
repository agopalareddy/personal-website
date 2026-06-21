// Aura: Ambient Wellness Companion Frontend Controller

let sessionId = null;
let currentPatientId = 'arthur';
let patientData = null;
let isPending = false;

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const resetBtn = document.getElementById('reset-session-btn');
const thinkingStages = document.getElementById('thinking-stages');
const patientSelector = document.getElementById('patient-selector');

// Dynamic Profile Elements
const avatarInitials = document.getElementById('avatar-initials');
const patientName = document.getElementById('patient-name');
const patientIdDisplay = document.getElementById('patient-id-display');
const patientAddress = document.getElementById('patient-address');
const patientPhone = document.getElementById('patient-phone');
const medicationListContainer = document.getElementById('medication-list-container');
const moodVal = document.getElementById('mood-val');
const complianceVal = document.getElementById('compliance-val');

// Load Patient Data from Backend API
async function loadPatientProfile(patientId) {
  try {
    const response = await fetch(`/api/patient/${patientId}`);
    if (!response.ok) throw new Error('Failed to load patient data');
    const data = await response.json();

    if (data.error) {
      console.error(data.error);
      return;
    }

    patientData = data;
    currentPatientId = patientId;

    // Update Profile UI
    patientName.textContent = data.name;
    patientIdDisplay.textContent = `Patient ID: #PT-${patientId.toUpperCase()}`;
    patientAddress.textContent = data.address;
    patientPhone.textContent = data.phone;

    // Calculate Avatar Initials
    const names = data.name.split(' ');
    const initials = names
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    avatarInitials.textContent = initials;

    // Render Medication List dynamically
    renderMedications(data.medications);

    // Load historical scores
    const lastMood =
      data.mood_history && data.mood_history.length > 0
        ? data.mood_history[data.mood_history.length - 1]
        : 5;
    const lastCompliance =
      data.compliance_history && data.compliance_history.length > 0
        ? data.compliance_history[data.compliance_history.length - 1]
          ? 'Compliant'
          : 'Missed'
        : '--';

    updateDashboard(lastMood, lastCompliance);
  } catch (err) {
    console.error('Error fetching patient profile:', err);
  }
}

// Render Medications schedule list
function renderMedications(medications) {
  medicationListContainer.innerHTML = '';

  if (!medications || Object.keys(medications).length === 0) {
    medicationListContainer.innerHTML = '<div class="no-meds">No medications scheduled.</div>';
    return;
  }

  for (const [medId, med] of Object.entries(medications)) {
    const medItem = document.createElement('div');

    let statusClass = 'pending';
    let statusText = '<i class="fa-solid fa-circle-notch fa-spin"></i> Checking...';

    if (med.status === 'taken') {
      statusClass = 'taken';
      statusText = '<i class="fa-solid fa-check"></i> Taken';
      medItem.className = 'med-item compliant';
    } else if (med.status === 'missed') {
      statusClass = 'not-taken';
      statusText = '<i class="fa-solid fa-xmark"></i> Missed';
      medItem.className = 'med-item missed';
    } else {
      medItem.className = 'med-item';
    }

    medItem.innerHTML = `
            <div class="med-info">
                <span class="med-time">${escapeHtml(med.time)}</span>
                <span class="med-name">${escapeHtml(med.name)}</span>
            </div>
            <span class="med-status ${statusClass}" id="status-${medId}">${statusText}</span>
        `;
    medicationListContainer.appendChild(medItem);
  }
}

// Initialize Session for Patient
async function initializeSession() {
  try {
    appendSystemMessage(
      `Connecting to GCP agent node for ${patientData ? patientData.name : 'patient'}...`
    );
    const response = await fetch(`/apps/app/users/${currentPatientId}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to initialize session');

    const data = await response.json();
    sessionId = data.id;
    console.log('Active Session ID:', sessionId);

    chatMessages.innerHTML = '';
    appendSystemMessage(
      `Aura Wellness Agent initialized. Ready to begin empathetic check-in with ${patientData.name}.`
    );
  } catch (err) {
    console.error(err);
    appendSystemMessage('Connection error: Unable to load agent session. Please try again.');
  }
}

// Patient Selector Dropdown Change Handler
patientSelector.addEventListener('change', async function () {
  const newPatient = this.value;
  appendSystemMessage(`Switching account profile to ${this.options[this.selectedIndex].text}...`);
  await loadPatientProfile(newPatient);
  await initializeSession();
});

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
  initializeSession();
});

// Messaging UI helpers
function appendUserMessage(text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message user';
  msgDiv.innerHTML = `
        <div class="msg-bubble">${escapeHtml(text)}</div>
        <div class="msg-meta">${escapeHtml(patientData ? patientData.name.split(' ')[0] : 'Arthur')} • Just now</div>
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

// Thinking Indicator stages
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

// Dashboard Score animation
function updateDashboard(mood, complianceText) {
  moodVal.innerHTML = `${mood}<span class="small">/10</span>`;

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

// API Communication and stream parsing
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
        userId: currentPatientId,
        sessionId: sessionId,
        newMessage: {
          role: 'user',
          parts: [{ text: inputText }],
        },
        streaming: false,
        stateDelta: null,
      }),
    });

    if (!response.ok) throw new Error('Agent node communication failure.');

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

            if (eventData.errorCode) {
              throw new Error(eventData.errorMessage || 'Agent error');
            }

            // Track active execution node progress
            const nodePath = eventData.nodeInfo?.path || '';
            if (nodePath.includes('CompanionNode')) {
              showThinking('anonymizer');
            } else if (nodePath.includes('AnonymizerNode')) {
              showThinking('escalation');
            }

            const stateDelta = eventData.actions?.stateDelta || {};
            if (stateDelta.escalation_triggered !== undefined) {
              isEscalated = stateDelta.escalation_triggered;
            }

            // Extract output from final nodes
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
            console.warn('Could not parse SSE line:', parseErr);
          }
        }
      }
    }

    hideThinking();
    if (finalResponseText) {
      appendAgentMessage(finalResponseText, isEscalated);
    } else {
      appendAgentMessage('Logs and compliance telemetry updated successfully.', isEscalated);
    }

    // Fetch fresh database record to reload medications, compliance, and score history
    await loadPatientProfile(currentPatientId);
  } catch (err) {
    console.error(err);
    hideThinking();
    appendSystemMessage(`Agent Error: ${err.message || 'Connection timeout.'}`);
  } finally {
    isPending = false;
    sendBtn.disabled = false;
  }
}

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

// Startup Initialization
async function start() {
  await loadPatientProfile('arthur');
  await initializeSession();
}

start();
