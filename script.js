/**
 * Smart Academic & Skill Management System
 * AI-driven prototype for students
 */

const STORAGE_KEYS = {
  marks: 'studysmart_marks',
  timetable: 'studysmart_timetable',
  timetableConfig: 'studysmart_timetable_config',
  assignments: 'studysmart_assignments',
  attendance: 'studysmart_attendance',
  chatHistory: 'studysmart_chat'
};

// ============================================================================
// Panel Navigation
// ============================================================================
function showPanel(panelId) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav__btn').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById(`panel-${panelId}`);
  const btn = document.querySelector(`[data-panel="${panelId}"]`);
  if (panel) panel.classList.add('active');
  if (btn) btn.classList.add('active');
  if (panelId === 'timetable') initTimetable();
  if (panelId === 'performance') renderCareerRecommendations();
}

document.querySelectorAll('.nav__btn').forEach(btn => {
  btn.addEventListener('click', () => showPanel(btn.dataset.panel));
});

// ============================================================================
// Subject Performance & Weak/Strong Bifurcation
// ============================================================================
let marksData = JSON.parse(localStorage.getItem(STORAGE_KEYS.marks) || '[]');

function saveMarks() {
  localStorage.setItem(STORAGE_KEYS.marks, JSON.stringify(marksData));
  renderPerformance();
}

function addMarks() {
  const subject = document.getElementById('subject-name').value.trim();
  const test = document.getElementById('test-name').value.trim();
  const obtained = parseFloat(document.getElementById('marks-obtained').value);
  const total = parseFloat(document.getElementById('marks-total').value);
  if (!subject || !test || isNaN(obtained) || isNaN(total) || total <= 0) return;
  marksData.push({ id: Date.now(), subject, test, obtained, total });
  document.getElementById('subject-name').value = '';
  document.getElementById('test-name').value = '';
  document.getElementById('marks-obtained').value = '';
  document.getElementById('marks-total').value = '';
  saveMarks();
}

function deleteMark(id) {
  marksData = marksData.filter(m => m.id !== id);
  saveMarks();
}

function getSubjectAverages() {
  const bySubject = {};
  marksData.forEach(m => {
    if (!bySubject[m.subject]) bySubject[m.subject] = { total: 0, count: 0, sum: 0 };
    bySubject[m.subject].sum += (m.obtained / m.total) * 100;
    bySubject[m.subject].count += 1;
  });
  return Object.entries(bySubject).map(([name, d]) => ({
    name,
    avg: Math.round((d.sum / d.count) * 10) / 10
  }));
}

// Career & skill recommendations based on strong subjects (exact keys only; "default" used for unmapped subjects)
const CAREER_MAP = {
  mathematics: {
    jobs: 'Data Scientist, Actuary, Quantitative Analyst, Software Engineer, Statistician, Financial Analyst, Research Scientist',
    skills: 'Practice problem-solving daily, take online courses (e.g. linear algebra, probability), contribute to open-source math libraries, participate in math competitions or hackathons.'
  },
  maths: {
    jobs: 'Data Scientist, Actuary, Quantitative Analyst, Software Engineer, Statistician, Financial Analyst, Research Scientist',
    skills: 'Practice problem-solving daily, take online courses (e.g. linear algebra, probability), contribute to open-source math libraries, participate in math competitions or hackathons.'
  },
  math: {
    jobs: 'Data Scientist, Actuary, Quantitative Analyst, Software Engineer, Statistician, Financial Analyst, Research Scientist',
    skills: 'Practice problem-solving daily, take online courses (e.g. linear algebra, probability), contribute to open-source math libraries, participate in math competitions or hackathons.'
  },
  physics: {
    jobs: 'Engineer (Mechanical/Electrical/Aerospace), Physicist, Data Scientist, Research Scientist, Patent Analyst, Technical Writer',
    skills: 'Build small projects (e.g. circuits, simulations), read research papers, use simulation software (e.g. MATLAB, Python), join physics clubs or Olympiads.'
  },
  chemistry: {
    jobs: 'Chemist, Pharmacist, Lab Analyst, Materials Scientist, Environmental Scientist, Quality Control Specialist, Research Scientist',
    skills: 'Hands-on lab practice, stay updated with journals, learn instrumentation and safety protocols, consider internships in labs or pharma.'
  },
  biology: {
    jobs: 'Biologist, Healthcare Professional, Biotech Researcher, Environmental Consultant, Science Writer, Lab Technician',
    skills: 'Practical lab work, stay current with biology research, volunteer in healthcare or conservation, consider certifications in lab techniques.'
  },
  computer: {
    jobs: 'Software Developer, DevOps Engineer, Data Engineer, Systems Analyst, IT Consultant, Cybersecurity Specialist',
    skills: 'Build projects, contribute to GitHub, learn new frameworks, practice algorithms (LeetCode, HackerRank), get certifications (AWS, etc.).'
  },
  'computer science': {
    jobs: 'Software Developer, DevOps Engineer, Data Engineer, Systems Analyst, IT Consultant, Cybersecurity Specialist',
    skills: 'Build projects, contribute to GitHub, learn new frameworks, practice algorithms (LeetCode, HackerRank), get certifications (AWS, etc.).'
  },
  programming: {
    jobs: 'Software Developer, DevOps Engineer, Data Engineer, Systems Analyst, IT Consultant, Cybersecurity Specialist',
    skills: 'Build projects, contribute to GitHub, learn new frameworks, practice algorithms (LeetCode, HackerRank), get certifications (AWS, etc.).'
  },
  english: {
    jobs: 'Content Writer, Editor, Copywriter, Communications Specialist, Teacher, Journalist, Technical Writer',
    skills: 'Write regularly, read widely, take writing courses, build a portfolio, practice grammar and style guides.'
  },
  economics: {
    jobs: 'Economist, Financial Analyst, Policy Analyst, Consultant, Banker, Data Analyst',
    skills: 'Follow economic news, use data tools (Excel, R, Python), do case studies, consider CFA or similar certifications.'
  },
  history: {
    jobs: 'Historian, Archivist, Museum Curator, Policy Researcher, Writer, Teacher',
    skills: 'Primary source analysis, writing and research, internships at museums or archives, learn digital humanities tools.'
  },
  default: {
    jobs: 'Analyst, Researcher, Consultant, Specialist in your field of interest',
    skills: 'Identify core competencies, take relevant courses, build a portfolio or projects, network and seek internships.'
  }
};

// Match subject name to career entry: exact match first, then subject contains key (longest first), then key contains subject
function getCareerForSubject(subjectName) {
  const key = subjectName.toLowerCase().trim();
  if (CAREER_MAP[key]) return CAREER_MAP[key];
  const mapKeys = Object.keys(CAREER_MAP).filter(k => k !== 'default');
  const bySubjectContains = mapKeys.filter(k => key.includes(k)).sort((a, b) => b.length - a.length);
  if (bySubjectContains.length) return CAREER_MAP[bySubjectContains[0]];
  const byKeyContains = mapKeys.find(k => k.includes(key));
  if (byKeyContains) return CAREER_MAP[byKeyContains];
  return CAREER_MAP.default;
}

function renderCareerRecommendations() {
  const section = document.getElementById('career-section');
  const cardsEl = document.getElementById('career-cards');
  if (!section || !cardsEl) return;

  const averages = getSubjectAverages();
  const strong = averages.filter(s => s.avg >= 60).sort((a, b) => b.avg - a.avg);

  section.style.display = 'block';

  if (strong.length === 0) {
    cardsEl.innerHTML = '<p class="career-section__empty">Add test marks above and score <strong>60% or above</strong> in a subject to see career and skill recommendations here.</p>';
    return;
  }

  cardsEl.innerHTML = strong.map(s => {
    const career = getCareerForSubject(s.name);
    const jobs = (career && career.jobs) ? String(career.jobs) : 'Analyst, Researcher, Specialist in your field.';
    const skills = (career && career.skills) ? String(career.skills) : 'Take relevant courses, build a portfolio, network and seek internships.';
    return `
      <div class="career-card">
        <div class="career-card__subject">${escapeHtml(s.name)} (${s.avg}%)</div>
        <div class="career-card__jobs"><strong>Suggested careers</strong> ${escapeHtml(jobs)}</div>
        <div class="career-card__skills"><strong>How to sharpen skills</strong> ${escapeHtml(skills)}</div>
      </div>`;
  }).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderPerformance() {
  const averages = getSubjectAverages();
  const weak = averages.filter(s => s.avg < 60).sort((a, b) => a.avg - b.avg);
  const strong = averages.filter(s => s.avg >= 60).sort((a, b) => b.avg - a.avg);

  const weakEl = document.getElementById('weak-subjects');
  const strongEl = document.getElementById('strong-subjects');
  weakEl.innerHTML = weak.length
    ? weak.map(s => `<div class="subject-item"><span class="subject-item__name">${s.name}</span><span class="subject-item__pct">${s.avg}%</span></div>`).join('')
    : '<p class="subject-item" style="color: var(--color-text-muted);">No weak subjects yet. Add marks to analyze.</p>';
  strongEl.innerHTML = strong.length
    ? strong.map(s => `<div class="subject-item"><span class="subject-item__name">${s.name}</span><span class="subject-item__pct">${s.avg}%</span></div>`).join('')
    : '<p class="subject-item" style="color: var(--color-text-muted);">No strong subjects yet. Add marks to analyze.</p>';

  const tbody = document.getElementById('marks-body');
  tbody.innerHTML = marksData.map(m => {
    const pct = Math.round((m.obtained / m.total) * 1000) / 10;
    return `<tr>
      <td>${m.subject}</td>
      <td>${m.test}</td>
      <td>${m.obtained}/${m.total}</td>
      <td>${pct}%</td>
      <td><button class="btn btn--danger" onclick="deleteMark(${m.id})">Delete</button></td>
    </tr>`;
  }).join('');
}

document.getElementById('add-marks-btn')?.addEventListener('click', addMarks);

// ============================================================================
// Editable Timetable
// ============================================================================
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
let timetableData = JSON.parse(localStorage.getItem(STORAGE_KEYS.timetable) || '{}');
let timetableConfig = JSON.parse(localStorage.getItem(STORAGE_KEYS.timetableConfig) || '{"start":"08:00","end":"17:00","interval":60}');

function getTimeSlots() {
  const [sh, sm] = timetableConfig.start.split(':').map(Number);
  const [eh, em] = timetableConfig.end.split(':').map(Number);
  const startMins = sh * 60 + sm;
  const endMins = eh * 60 + em;
  const slots = [];
  for (let m = startMins; m < endMins; m += timetableConfig.interval || 60) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
  }
  return slots;
}

function initTimetable() {
  document.getElementById('timetable-start').value = timetableConfig.start;
  document.getElementById('timetable-end').value = timetableConfig.end;
  const slots = getTimeSlots();
  const tbody = document.getElementById('timetable-body');
  tbody.innerHTML = slots.map((time, i) => {
    const nextTime = slots[i + 1] || time;
    const rowId = time;
    const cells = DAYS.map(day => {
      const key = `${day}-${time}`;
      const val = timetableData[key] || '';
      return `<td contenteditable="true" data-key="${key}">${val}</td>`;
    }).join('');
    return `<tr><th>${time} - ${nextTime}</th>${cells}</tr>`;
  }).join('');

  tbody.querySelectorAll('td[contenteditable]').forEach(cell => {
    cell.addEventListener('blur', () => {
      timetableData[cell.dataset.key] = cell.textContent.trim();
      localStorage.setItem(STORAGE_KEYS.timetable, JSON.stringify(timetableData));
    });
  });
}

document.getElementById('apply-time-btn')?.addEventListener('click', () => {
  timetableConfig = {
    start: document.getElementById('timetable-start').value,
    end: document.getElementById('timetable-end').value,
    interval: 60
  };
  localStorage.setItem(STORAGE_KEYS.timetableConfig, JSON.stringify(timetableConfig));
  initTimetable();
});

// ============================================================================
// Assignments (editable)
// ============================================================================
let assignmentsData = JSON.parse(localStorage.getItem(STORAGE_KEYS.assignments) || '[]');
let editingAssignmentId = null;

function saveAssignments() {
  localStorage.setItem(STORAGE_KEYS.assignments, JSON.stringify(assignmentsData));
  renderAssignments();
}

function addAssignment() {
  const title = document.getElementById('assignment-title').value.trim();
  const subject = document.getElementById('assignment-subject').value.trim();
  const due = document.getElementById('assignment-due').value;
  const priority = document.getElementById('assignment-priority').value;
  if (!title) return;

  if (editingAssignmentId !== null) {
    const a = assignmentsData.find(x => x.id === editingAssignmentId);
    if (a) {
      a.title = title;
      a.subject = subject;
      a.due = due;
      a.priority = priority;
    }
    cancelEditAssignment();
  } else {
    assignmentsData.push({ id: Date.now(), title, subject, due, priority, done: false });
  }

  document.getElementById('assignment-title').value = '';
  document.getElementById('assignment-subject').value = '';
  document.getElementById('assignment-due').value = '';
  document.getElementById('assignment-priority').value = 'medium';
  saveAssignments();
}

function editAssignment(id) {
  const a = assignmentsData.find(x => x.id === id);
  if (!a) return;
  editingAssignmentId = id;
  document.getElementById('assignment-title').value = a.title;
  document.getElementById('assignment-subject').value = a.subject || '';
  document.getElementById('assignment-due').value = a.due || '';
  document.getElementById('assignment-priority').value = a.priority || 'medium';
  document.getElementById('assignment-form-title').textContent = 'Edit Assignment';
  document.getElementById('add-assignment-btn').textContent = 'Update';
  document.getElementById('cancel-edit-assignment-btn').style.display = 'inline-block';
}

function cancelEditAssignment() {
  editingAssignmentId = null;
  document.getElementById('assignment-title').value = '';
  document.getElementById('assignment-subject').value = '';
  document.getElementById('assignment-due').value = '';
  document.getElementById('assignment-priority').value = 'medium';
  document.getElementById('assignment-form-title').textContent = 'Add Assignment';
  document.getElementById('add-assignment-btn').textContent = 'Add';
  document.getElementById('cancel-edit-assignment-btn').style.display = 'none';
}

function toggleAssignment(id) {
  const a = assignmentsData.find(x => x.id === id);
  if (a) a.done = !a.done;
  saveAssignments();
}

function deleteAssignment(id) {
  assignmentsData = assignmentsData.filter(a => a.id !== id);
  if (editingAssignmentId === id) cancelEditAssignment();
  saveAssignments();
}

function renderAssignments() {
  const list = document.getElementById('assignments-list');
  list.innerHTML = assignmentsData.length
    ? assignmentsData.map(a => `
        <div class="assignment-card ${a.done ? 'assignment-card--done' : ''}">
          <div class="assignment-info">
            <div class="assignment-title">${a.title}</div>
            <div class="assignment-meta">${a.subject || '—'} • Due: ${a.due || '—'} <span class="priority-badge priority-${a.priority}">${a.priority}</span></div>
          </div>
          <div class="assignment-actions">
            <input type="checkbox" ${a.done ? 'checked' : ''} onchange="toggleAssignment(${a.id})" title="Mark done" />
            <button class="btn btn--secondary btn--small" onclick="editAssignment(${a.id})">Edit</button>
            <button class="btn btn--danger btn--small" onclick="deleteAssignment(${a.id})">Delete</button>
          </div>
        </div>
      `).join('')
    : '<p style="color: var(--color-text-muted);">No assignments yet. Add one above.</p>';
}

document.getElementById('add-assignment-btn')?.addEventListener('click', addAssignment);
document.getElementById('cancel-edit-assignment-btn')?.addEventListener('click', cancelEditAssignment);

// ============================================================================
// Attendance Tracker & AI Insights
// ============================================================================
let attendanceData = JSON.parse(localStorage.getItem(STORAGE_KEYS.attendance) || '[]');

function saveAttendance() {
  localStorage.setItem(STORAGE_KEYS.attendance, JSON.stringify(attendanceData));
  renderAttendance();
  updateAttendanceInsight();
}

function addAttendance() {
  const date = document.getElementById('attendance-date').value;
  const status = document.getElementById('attendance-status').value;
  const note = document.getElementById('attendance-note').value.trim();
  if (!date) return;
  const existing = attendanceData.find(a => a.date === date);
  if (existing) {
    existing.status = status;
    existing.note = note;
  } else {
    attendanceData.push({ id: Date.now(), date, status, note });
  }
  attendanceData.sort((a, b) => a.date.localeCompare(b.date));
  document.getElementById('attendance-date').value = '';
  document.getElementById('attendance-note').value = '';
  saveAttendance();
}

function deleteAttendanceById(id) {
  if (String(id).startsWith('legacy-')) {
    const idx = parseInt(String(id).replace('legacy-', ''), 10);
    attendanceData.splice(idx, 1);
  } else {
    attendanceData = attendanceData.filter(a => a.id !== parseInt(id, 10));
  }
  saveAttendance();
}

function getAttendanceStats() {
  const present = attendanceData.filter(a => a.status === 'present').length;
  const absent = attendanceData.filter(a => a.status === 'absent').length;
  const holiday = attendanceData.filter(a => a.status === 'holiday').length;
  const totalWorking = present + absent;
  const pct = totalWorking > 0 ? Math.round((present / totalWorking) * 100) : 0;
  return { present, absent, holiday, totalWorking, pct };
}

function updateAttendanceInsight() {
  const { present, absent, holiday, totalWorking, pct } = getAttendanceStats();
  const el = document.getElementById('attendance-insight');
  const textEl = document.getElementById('attendance-insight-text');

  let msg = '';
  let type = 'info';

  if (totalWorking === 0) {
    msg = 'Add attendance data to get AI insights. Log your present, absent, and holiday days to see personalized recommendations.';
  } else {
    if (pct < 75) {
      type = 'danger';
      msg = `⚠️ Your attendance is ${pct}%, which is below the typical 75% requirement.`;
      if (holiday > 0) {
        msg += ` You've marked ${holiday} holiday(s). If you take more holidays, your attendance may drop further. Consider attending more regularly to stay above the threshold.`;
      } else {
        msg += ' Focus on attending regularly to improve your percentage.';
      }
    } else if (holiday > present * 0.2) {
      type = 'warning';
      msg = `You have ${holiday} holiday(s) logged. Holidays don't count toward your total working days. Taking too many holidays can lower your effective attendance. Currently at ${pct}% — stay consistent to maintain it.`;
    } else if (pct >= 90) {
      msg = `Great! Your attendance is ${pct}%. Keep it up. You're well above the typical requirement.`;
    } else {
      msg = `Your attendance is ${pct}%. You're above 75%. If you plan more holidays, keep an eye on your percentage — each absent day will reduce it.`;
    }
  }

  el.className = `ai-insight ai-insight--${type}`;
  textEl.textContent = msg;
}

function renderAttendance() {
  const { present, absent, pct } = getAttendanceStats();
  document.getElementById('stat-present').textContent = present;
  document.getElementById('stat-absent').textContent = absent;
  document.getElementById('stat-percentage').textContent = pct + '%';

  const tbody = document.getElementById('attendance-body');
  tbody.innerHTML = [...attendanceData].reverse().map((a, i) => {
    const origIdx = attendanceData.length - 1 - i;
    const delId = a.id ?? 'legacy-' + origIdx;
    const statusLabel = a.status === 'present' ? 'Present' : a.status === 'absent' ? 'Absent' : 'Holiday';
    const statusClass = a.status === 'present' ? 'color: var(--color-accent)' : a.status === 'absent' ? 'color: var(--color-weak)' : 'color: var(--color-warning)';
    return `<tr>
      <td>${a.date}</td>
      <td style="${statusClass}">${statusLabel}</td>
      <td>${a.note || '—'}</td>
      <td><button class="btn btn--danger btn--small" onclick="deleteAttendanceById('${delId}')">Delete</button></td>
    </tr>`;
  }).join('');
}

document.getElementById('add-attendance-btn')?.addEventListener('click', addAttendance);

// ============================================================================
// AI Assistant (Simulated)
// ============================================================================
let chatHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.chatHistory) || '[]');

const AI_RESPONSES = {
  default: "I'm a prototype AI assistant. In a full version, I'd connect to an AI API to help with your doubts. For now, here are some tips: review your weak subjects from the Performance section, break study sessions into 25–30 min blocks, and practice past papers for better retention.",
  math: "For mathematics: practice regularly, start with simpler problems, and always show your working. Use the Performance section to identify weak topics and focus there first.",
  physics: "For physics: draw diagrams, write down known and unknown quantities, and check units. Conceptual understanding matters more than memorizing formulas.",
  chemistry: "For chemistry: understand periodic trends, practice balancing equations, and link concepts to real-world examples.",
  attendance: "To improve attendance: set morning alarms, prepare your bag the night before, and track your attendance in this app. The AI insight will warn you if holidays might affect your percentage.",
  timetable: "Create a realistic timetable with breaks. Slot your weak subjects when you're most alert. Use the Timetable section to edit and stick to a routine."
};

function getAIResponse(userMsg) {
  const lower = userMsg.toLowerCase();
  if (lower.includes('math') || lower.includes('calculus') || lower.includes('algebra')) return AI_RESPONSES.math;
  if (lower.includes('physics') || lower.includes('force') || lower.includes('motion')) return AI_RESPONSES.physics;
  if (lower.includes('chem') || lower.includes('equation')) return AI_RESPONSES.chemistry;
  if (lower.includes('attendance') || lower.includes('holiday') || lower.includes('absent')) return AI_RESPONSES.attendance;
  if (lower.includes('timetable') || lower.includes('schedule') || lower.includes('routine')) return AI_RESPONSES.timetable;
  return AI_RESPONSES.default;
}

function sendChat() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;

  const userMsg = { role: 'user', content: msg };
  chatHistory.push(userMsg);
  input.value = '';

  const messagesEl = document.getElementById('chat-messages');
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-msg chat-msg--user';
  userBubble.innerHTML = `<span class="chat-msg__avatar">👤</span><div class="chat-msg__bubble"><p>${msg}</p></div>`;
  messagesEl.appendChild(userBubble);

  const botResponse = getAIResponse(msg);
  chatHistory.push({ role: 'bot', content: botResponse });

  const botBubble = document.createElement('div');
  botBubble.className = 'chat-msg chat-msg--bot';
  botBubble.innerHTML = `<span class="chat-msg__avatar">🤖</span><div class="chat-msg__bubble"><p>${botResponse}</p></div>`;
  messagesEl.appendChild(botBubble);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  localStorage.setItem(STORAGE_KEYS.chatHistory, JSON.stringify(chatHistory));
}

document.getElementById('chat-send-btn')?.addEventListener('click', sendChat);
document.getElementById('chat-input')?.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChat();
  }
});

// Restore chat history on load
function loadChatHistory() {
  if (chatHistory.length <= 1) return; // Skip default welcome
  const messagesEl = document.getElementById('chat-messages');
  chatHistory.slice(1).forEach(m => {
    const div = document.createElement('div');
    div.className = m.role === 'user' ? 'chat-msg chat-msg--user' : 'chat-msg chat-msg--bot';
    const avatar = m.role === 'user' ? '👤' : '🤖';
    div.innerHTML = `<span class="chat-msg__avatar">${avatar}</span><div class="chat-msg__bubble"><p>${m.content}</p></div>`;
    messagesEl.appendChild(div);
  });
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// ============================================================================
// Initialize
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  renderPerformance();
  renderAssignments();
  renderAttendance();
  updateAttendanceInsight();
  initTimetable();
  loadChatHistory();

  // Set default date for attendance
  document.getElementById('attendance-date').valueAsDate = new Date();
});
