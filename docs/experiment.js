import { makeBlocks } from "./trials.js";

const TIMING = {
  fixation: 500,
  item: 1200,
  delay: 2000,
  warning: 250,
  responseLimit: 4000,
};

const RESPONSE_KEYS = new Map([["f", "oui"], ["j", "non"]]);
const TYPE_LABELS = { digits: "Chiffres", letters: "Lettres" };
const COLUMNS = [
  "session_id", "session_type", "mode", "condition_order", "block", "phase", "stimulus_type",
  "trial", "set_size", "sequence", "probe", "target_present", "response", "correct", "rt_ms",
  "focus_lost", "recall_sequence", "recall_correct", "recall_positions_correct", "recall_focus_lost",
  "browser",
];

const intro = document.querySelector("#intro");
const form = document.querySelector("#session-form");
const start = form.querySelector("button");
const transition = document.querySelector("#transition");
const blockTitle = document.querySelector("#block-title");
const blockDescription = document.querySelector("#block-description");
const continueBlock = document.querySelector("#continue-block");
const task = document.querySelector("#task");
const screen = document.querySelector("#screen");
const progress = document.querySelector("#progress");
const phase = document.querySelector("#phase");
const stimulus = document.querySelector("#stimulus");
const decisionKeys = document.querySelector("#decision-keys");
const recallForm = document.querySelector("#recall-form");
const recallInput = document.querySelector("#recall-input");
const decisionFeedback = document.querySelector("#decision-feedback");
const result = document.querySelector("#result");
const resultTitle = document.querySelector("#result-title");
const resultSummary = document.querySelector("#result-summary");

let session = null;
let trialHasLostFocus = false;

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
      show("Ce symbole était-il dans la série ?", probe);
      decisionKeys.hidden = false;
      const onset = performance.now();
      const timeout = setTimeout(() => finish("timeout", ""), TIMING.responseLimit);

      function finish(response, rtMs) {
        clearTimeout(timeout);
        window.removeEventListener("keydown", readKey);
        decisionKeys.hidden = true;
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

function askForRecall(trial, type, response, correct) {
  screen.hidden = true;
  recallForm.hidden = false;
  recallInput.value = "";
  recallInput.setCustomValidity("");
  decisionFeedback.textContent = "Réponse incorrecte.";
  if (correct) decisionFeedback.textContent = "Réponse correcte.";
  if (response === "timeout") decisionFeedback.textContent = "Temps de réponse écoulé.";
  recallInput.focus();

  const allowed = type === "digits" ? /^[0-9?]*$/ : /^[A-Za-z?]*$/;
  return new Promise(resolve => {
    function submitRecall(event) {
      event.preventDefault();
      const entered = recallInput.value.replace(/\s/g, "");
      if (!allowed.test(entered) || entered.length > trial.sequence.length) {
        const items = type === "digits" ? "chiffres" : "lettres";
        recallInput.setCustomValidity(`Saisissez au maximum ${trial.sequence.length} ${items} ou « ? ».`);
        recallInput.reportValidity();
        return;
      }

      recallForm.removeEventListener("submit", submitRecall);
      recallForm.hidden = true;
      screen.hidden = false;
      screen.focus();
      resolve([...entered.toUpperCase()]);
    }
    recallForm.addEventListener("submit", submitRecall);
  });
}

recallInput.addEventListener("input", () => recallInput.setCustomValidity(""));
recallInput.addEventListener("keydown", event => {
  if (event.repeat) event.preventDefault();
});

async function runTrial(trial, block, blockNumber) {
  trialHasLostFocus = document.hidden || !document.hasFocus();
  await showFor("Fixation", "+", TIMING.fixation);
  for (const item of trial.sequence) {
    await showFor("Mémorisez", item, TIMING.item);
  }
  await showFor("", "", TIMING.delay);
  await showFor("", "●", TIMING.warning);
  const { response, rtMs } = await askForResponse(trial.probe);
  const decisionFocusLost = trialHasLostFocus;
  const correct = response === (trial.targetPresent ? "oui" : "non");
  trialHasLostFocus = document.hidden || !document.hasFocus();
  show("", "");
  const recalled = await askForRecall(trial, block.type, response, correct);
  const correctPositions = trial.sequence.filter((item, position) => item === recalled[position]).length;

  return {
    session_id: session.id,
    session_type: session.type,
    mode: session.mode,
    condition_order: session.order,
    block: blockNumber,
    phase: block.phase,
    stimulus_type: block.type,
    trial: session.rows.length + 1,
    set_size: trial.sequence.length,
    sequence: trial.sequence.join(" "),
    probe: trial.probe,
    target_present: trial.targetPresent,
    response,
    correct,
    rt_ms: rtMs,
    focus_lost: decisionFocusLost,
    recall_sequence: recalled.join(" "),
    recall_correct: correctPositions === trial.sequence.length,
    recall_positions_correct: correctPositions,
    recall_focus_lost: trialHasLostFocus,
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

async function runBlock(block, index, total) {
  const label = block.phase === "practice" ? "Entraînement" : "Bloc";
  blockTitle.textContent = `${label} ${index + 1} sur ${total} · ${TYPE_LABELS[block.type]}`;
  blockDescription.textContent = `${block.trials.length} essais. Reprenez quand vous êtes prêt.`;
  transition.hidden = false;
  continueBlock.focus();
  await new Promise(resolve => continueBlock.addEventListener("click", resolve, { once: true }));
  transition.hidden = true;
  progress.max = block.trials.length;
  progress.value = 0;
  task.hidden = false;
  screen.focus();

  for (const trial of block.trials) {
    session.rows.push(await runTrial(trial, block, index + 1));
    progress.value += 1;
  }
  task.hidden = true;
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (session) return;

  const fields = new FormData(form);
  const type = fields.get("session_type");
  const blocks = makeBlocks(type);
  const order = [...new Set(blocks.map(block => block.type))].join("-");
  session = { id: crypto.randomUUID(), mode: fields.get("mode"), type, order, rows: [] };
  intro.hidden = true;

  for (const [index, block] of blocks.entries()) {
    await runBlock(block, index, blocks.length);
  }

  const trials = session.rows.filter(row => row.phase === "test");
  const correct = trials.filter(row => row.correct).length;
  const recalled = trials.filter(row => row.recall_correct).length;
  resultSummary.textContent =
    `Décisions correctes ${correct}/${trials.length} · Séries rappelées dans l’ordre ${recalled}/${trials.length}`;
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
  link.download = `sternberg-${session.type}-${session.mode}-${session.id}.csv`;
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
