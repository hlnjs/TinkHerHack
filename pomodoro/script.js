// ===== TIMER STATE WITH MODES =====
const MODES = {
  focus: 25,
  short: 5,
  long: 15,
  deep: 50
};

let currentMode = "focus";
let minutes = MODES[currentMode];
let seconds = 0;
let interval = null;
let isRunning = false;
let sessionsCompleted = 0; // for dots

// DOM elements (timer)
const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");

// Modes, dots, overlay
const modeButtons = document.querySelectorAll(".mode-btn");
const sessionDotsContainer = document.getElementById("session-dots");
const breakOverlay = document.getElementById("break-overlay");
const overlayCloseBtn = document.getElementById("overlay-close");

// ===== IDLE TRACKING (simple console nudge) =====
let lastActionTime = Date.now();

function touchAction() {
  lastActionTime = Date.now();
}

document.addEventListener("click", touchAction);
document.addEventListener("keydown", touchAction);

setInterval(() => {
  const minutesIdle = (Date.now() - lastActionTime) / 60000;
  if (!isRunning && minutesIdle >= 5) {
    console.log("Idle nudge");
    // later: show banner instead of console.log
  }
}, 60000);

// ===== HELPER FUNCTIONS =====
function formatTime(min, sec) {
  const m = min < 10 ? "0" + min : min;
  const s = sec < 10 ? "0" + sec : sec;
  return `${m}:${s}`;
}

// Update session dots UI
function renderSessionDots() {
  sessionDotsContainer.innerHTML = "";
  const maxDots = 4;
  const count = Math.min(sessionsCompleted, maxDots);

  for (let i = 0; i < maxDots; i++) {
    const dot = document.createElement("div");
    dot.className = "session-dot";
    if (i < count) {
      dot.classList.add("active");
    }
    sessionDotsContainer.appendChild(dot);
  }
}

// Break overlay
function showBreakOverlay() {
  breakOverlay.style.display = "flex";
}

function hideBreakOverlay() {
  breakOverlay.style.display = "none";
}

overlayCloseBtn.addEventListener("click", () => {
  hideBreakOverlay();
});

// ===== HABIT / XP / STREAK =====
let xp = 0;
let dayStreak = 0;
let sessionsToday = 0;

const xpSpan = document.getElementById("xp-value");
const streakSpan = document.getElementById("streak-value");
const sessionsTodaySpan = document.getElementById("sessions-today");

function updateHabitUI() {
  if (!xpSpan) return; // in case stats not present
  xpSpan.textContent = xp;
  streakSpan.textContent = dayStreak;
  sessionsTodaySpan.textContent = sessionsToday;
}

function saveHabitData() {
  const todayStr = new Date().toDateString();
  localStorage.setItem("habitData", JSON.stringify({
    xp,
    dayStreak,
    sessionsToday,
    lastDate: todayStr
  }));
}

function loadHabitData() {
  const saved = JSON.parse(localStorage.getItem("habitData") || "{}");
  const todayStr = new Date().toDateString();

  if (saved.lastDate === todayStr) {
    xp = saved.xp || 0;
    dayStreak = saved.dayStreak || 1;
    sessionsToday = saved.sessionsToday || 0;
  } else if (saved.lastDate) {
    const last = new Date(saved.lastDate);
    const diffDays = Math.round((new Date(todayStr) - last) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      dayStreak = (saved.dayStreak || 0) + 1;
    } else {
      dayStreak = 1;
    }
    xp = saved.xp || 0;
    sessionsToday = 0;
  } else {
    dayStreak = 1;
  }

  updateHabitUI();
}

function showCelebration() {
  alert("Nice work! 🎉 Focus block completed.");
}

function handleSessionComplete() {
  const isRealFocus = (currentMode === "focus" || currentMode === "deep");
  if (isRealFocus) {
    xp += 10;
    sessionsToday += 1;
  } else {
    xp += 4; // micro / short
  }
  updateHabitUI();
  saveHabitData();
  showCelebration();
}

// ===== PLAN / CURRENT BLOCK =====
let todaysPlan = [];
let currentPlanIndex = -1;

const availableMinInput = document.getElementById("available-min");
const planDayBtn = document.getElementById("plan-day-btn");
const planList = document.getElementById("plan-list");
const currentBlockText = document.getElementById("current-block-text");
const nextBlockBtn = document.getElementById("next-block-btn");

function renderPlanList() {
  if (!planList) return;
  planList.innerHTML = "";
  todaysPlan.forEach(block => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.className = "plan-block-title";
    if (block.done) span.classList.add("done");
    span.textContent = `${block.taskTitle} — ${block.duration} min`;
    li.appendChild(span);
    planList.appendChild(li);
  });
}

function finishCurrentBlock() {
  if (currentPlanIndex >= 0 && todaysPlan[currentPlanIndex]) {
    todaysPlan[currentPlanIndex].done = true;
    renderPlanList();
  }
}

if (planDayBtn) {
  planDayBtn.addEventListener("click", async () => {
    const availableMinutes = parseInt(availableMinInput.value || "0", 10);
    if (!availableMinutes || tasks.length === 0) return;

    const res = await fetch("/plan-day", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ availableMinutes, tasks })
    });
    const blocks = await res.json();

    todaysPlan = blocks.map((b, index) => ({
      id: index,
      taskTitle: b.taskTitle,
      duration: b.durationMinutes,
      done: false
    }));

    currentPlanIndex = -1;
    renderPlanList();
    currentBlockText.textContent = "Plan ready. Click 'Start next block'.";
  });
}

if (nextBlockBtn) {
  nextBlockBtn.addEventListener("click", () => {
    if (!todaysPlan.length) return;

    let nextIndex = todaysPlan.findIndex((b, idx) => idx > currentPlanIndex && !b.done);
    if (nextIndex === -1) nextIndex = todaysPlan.findIndex(b => !b.done);
    if (nextIndex === -1) {
      currentBlockText.textContent = "All blocks done 🎉";
      return;
    }

    currentPlanIndex = nextIndex;
    const block = todaysPlan[currentPlanIndex];
    currentBlockText.textContent = `${block.taskTitle} — ${block.duration} min`;

    minutes = block.duration;
    seconds = 0;
    timeDisplay.textContent = formatTime(minutes, seconds);

    if (!isRunning) {
      isRunning = true;
      interval = setInterval(tick, 1000);
    }
  });
}

// ===== MICRO SESSION =====
const microBtn = document.getElementById("micro-session-btn");

// tasks is declared later; we guard in case microBtn doesn't exist
if (microBtn) {
  microBtn.addEventListener("click", () => {
    const nextTask = tasks.find(t => !t.completed) || { text: "Any pending work" };
    if (currentBlockText) {
      currentBlockText.textContent = `Micro: ${nextTask.text} — 5 min`;
    }

    minutes = 5;
    seconds = 0;
    timeDisplay.textContent = formatTime(minutes, seconds);
    currentMode = "micro";
    if (!isRunning) {
      isRunning = true;
      interval = setInterval(tick, 1000);
    }
  });
}

// ===== TIMER TICK =====
function tick() {
  if (seconds === 0) {
    if (minutes === 0) {
      clearInterval(interval);
      isRunning = false;
      sessionsCompleted++;
      renderSessionDots();
      showBreakOverlay();
      handleSessionComplete();
      finishCurrentBlock();
      return;
    }
    minutes--;
    seconds = 59;
  } else {
    seconds--;
  }
  timeDisplay.textContent = formatTime(minutes, seconds);
}

// ===== TIMER CONTROLS =====
startBtn.addEventListener("click", () => {
  if (!isRunning) {
    isRunning = true;
    interval = setInterval(tick, 1000);
  }
});

pauseBtn.addEventListener("click", () => {
  if (isRunning) {
    clearInterval(interval);
    isRunning = false;
  }
});

resetBtn.addEventListener("click", () => {
  clearInterval(interval);
  isRunning = false;
  minutes = MODES[currentMode];
  seconds = 0;
  timeDisplay.textContent = formatTime(minutes, seconds);
});

// Switch modes when clicking buttons
modeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const mode = btn.getAttribute("data-mode");
    if (mode === currentMode) return;

    clearInterval(interval);
    isRunning = false;

    currentMode = mode;
    minutes = MODES[currentMode];
    seconds = 0;
    timeDisplay.textContent = formatTime(minutes, seconds);

    modeButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// ===== TASK LIST (simple, text-only) =====
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

let tasks = [];

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
    tasks.forEach(addTaskToDOM);
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTaskToDOM(task) {
  const li = document.createElement("li");

  const label = document.createElement("label");
  label.className = "task-label";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed || false;

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = task.text;
  if (task.completed) {
    span.classList.add("completed");
  }

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    if (task.completed) {
      span.classList.add("completed");
    } else {
      span.classList.remove("completed");
    }
    saveTasks();
  });

  label.appendChild(checkbox);
  label.appendChild(span);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", () => {
    tasks = tasks.filter(t => t !== task);
    taskList.removeChild(li);
    saveTasks();
  });

  li.appendChild(label);
  li.appendChild(deleteBtn);

  taskList.appendChild(li);
}

function handleAddTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = { text, completed: false };
  tasks.push(newTask);
  addTaskToDOM(newTask);
  saveTasks();

  taskInput.value = "";
  taskInput.focus();
}

if (addTaskBtn) {
  addTaskBtn.addEventListener("click", handleAddTask);
}
if (taskInput) {
  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  });
}
const aiInput = document.getElementById("ai-input");
const aiSendBtn = document.getElementById("ai-send-btn");
const aiChatWindow = document.getElementById("ai-chat-window");

function appendAiMessage(text, who) {
  const div = document.createElement("div");
  div.className = `ai-message ${who}`;
  div.textContent = text;
  aiChatWindow.appendChild(div);
  aiChatWindow.scrollTop = aiChatWindow.scrollHeight;
}

if (aiSendBtn) {
  aiSendBtn.addEventListener("click", async () => {
    const question = aiInput.value.trim();
    if (!question) return;
    appendAiMessage(question, "user");
    aiInput.value = "";

    // MOCK RESPONSE FOR NOW
    appendAiMessage("Thinking...", "bot");

    // later: replace with real fetch to your AI backend
    setTimeout(() => {
      aiChatWindow.lastChild.textContent =
        "This is where the AI’s concise explanation or summary will appear.";
    }, 800);
  });
}

if (aiInput) {
  aiInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") aiSendBtn.click();
  });
}
const roomCodeInput = document.getElementById("room-code-input");
const joinRoomBtn = document.getElementById("join-room-btn");
const roomStatusText = document.getElementById("room-status-text");
const roomMembersList = document.getElementById("room-members");

let currentRoom = null;
let myName = "You"; // later allow user to change

if (joinRoomBtn) {
  joinRoomBtn.addEventListener("click", () => {
    const code = roomCodeInput.value.trim();
    if (!code) return;
    currentRoom = code;
    roomStatusText.textContent = `In room: ${code}`;
    roomMembersList.innerHTML = "";
    const li = document.createElement("li");
    li.textContent = `${myName} — Focusing / Break / Idle`;
    roomMembersList.appendChild(li);
  });
}


// ===== INITIALIZATION =====
timeDisplay.textContent = formatTime(minutes, seconds);
renderSessionDots();
hideBreakOverlay();
loadTasks();
loadHabitData();
