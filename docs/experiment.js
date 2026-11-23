const TIMING = {
  fixation: 500,
  digit: 1200,
  delay: 2000,
  warning: 250,
  responseLimit: 4000,
};

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const SET_SIZES = [2, 4, 6];
const RESPONSE_KEYS = new Map([["f", "oui"], ["j", "non"]]);
const COLUMNS = [
  "session_id", "session_type", "mode", "trial", "set_size", "digits", "probe",
  "target_present", "response", "correct", "rt_ms", "focus_lost", "browser",
];

const intro = document.querySelector("#intro");
const form = document.querySelector("#session-form");
const start = form.querySelector("button");
const task = document.querySelector("#task");
const screen = document.querySelector("#screen");
const progress = document.querySelector("#progress");
const phase = document.querySelector("#phase");
const stimulus = document.querySelector("#stimulus");
const result = document.querySelector("#result");
const resultTitle = document.querySelector("#result-title");
const resultSummary = document.querySelector("#result-summary");

let session = null;
let trialHasLostFocus = false;

function shuffled(values) {
  const items = [...values];
  for (let index = items.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [items[index], items[other]] = [items[other], items[index]];
  }
  return items;
}

function makeDemoTrials() {
  const trials = [];
  for (const size of SET_SIZES) {
    for (const targetPresent of [true, false]) {
      const deck = shuffled(DIGITS);
      const digits = deck.slice(0, size);
      const probe = targetPresent ? digits[Math.floor(Math.random() * size)] : deck[size];
      trials.push({ digits, probe, targetPresent });
    }
  }
  return shuffled(trials);
}

function show(label, value) {
  phase.textContent = label;
  stimulus.textContent = value;
}

function showFor(label, value, duration) {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      show(label, value);
      setTimeout(resolve, duration);
    });
  });
}

function askForResponse(probe) {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      show("Ce chiffre était-il dans la série ?", probe);
      const onset = performance.now();
      const timeout = setTimeout(() => finish("timeout", ""), TIMING.responseLimit);

      function finish(response, rtMs) {
        clearTimeout(timeout);
        window.removeEventListener("keydown", readKey);
        resolve({ response, rtMs });
      }

      function readKey(event) {
        const response = RESPONSE_KEYS.get(event.key.toLowerCase());
        if (!response || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
        event.preventDefault();
        finish(response, Number((performance.now() - onset).toFixed(1)));
      }

      window.addEventListener("keydown", readKey);
    });
  });
}

async function runTrial(trial, index, total) {
  trialHasLostFocus = document.hidden || !document.hasFocus();
  progress.textContent = `Essai ${index + 1} sur ${total}`;
  await showFor("Fixation", "+", TIMING.fixation);
  for (const digit of trial.digits) {
    await showFor("Mémorisez", digit, TIMING.digit);
  }
  await showFor("", "", TIMING.delay);
  await showFor("", "●", TIMING.warning);
  const { response, rtMs } = await askForResponse(trial.probe);

  return {
    session_id: session.id,
    session_type: "demo",
    mode: session.mode,
    trial: index + 1,
    set_size: trial.digits.length,
    digits: trial.digits.join(" "),
    probe: trial.probe,
    target_present: trial.targetPresent,
    response,
    correct: response === (trial.targetPresent ? "oui" : "non"),
    rt_ms: rtMs,
    focus_lost: trialHasLostFocus,
    browser: navigator.userAgent,
  };
}

function recordFocusLoss() {
  if (session && !task.hidden) trialHasLostFocus = true;
}

window.addEventListener("blur", recordFocusLoss);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) recordFocusLoss();
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (session) return;

  const mode = new FormData(form).get("mode");
  session = { id: crypto.randomUUID(), mode, rows: [] };
  const trials = makeDemoTrials();
  intro.hidden = true;
  task.hidden = false;
  screen.focus();

  for (const [index, trial] of trials.entries()) {
    session.rows.push(await runTrial(trial, index, trials.length));
  }

  const correct = session.rows.filter(row => row.correct).length;
  resultSummary.textContent = `${correct} réponse(s) correcte(s) sur ${trials.length}.`;
  task.hidden = true;
  result.hidden = false;
  resultTitle.focus();
});

function csvCell(value) {
  const text = String(value);
  return /[,"\r\n]/.test(text) ? '"' + text.replaceAll('"', '""') + '"' : text;
}

document.querySelector("#download").addEventListener("click", () => {
  const rows = session.rows.map(row => COLUMNS.map(column => csvCell(row[column])).join(","));
  const csv = [COLUMNS.join(","), ...rows].join("\r\n") + "\r\n";
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `sternberg-demo-${session.mode}-${session.id}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

document.querySelector("#restart").addEventListener("click", () => {
  session = null;
  result.hidden = true;
  intro.hidden = false;
  start.focus();
});
