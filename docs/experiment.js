import { makeBlocks, shuffled, STIMULI, SYMBOL_PATHS } from "./trials.js?v=2";

const TIMING = {
  fixation: 500,
  item: 1200,
  delay: 2000,
  warning: 250,
  responseLimit: 4000,
};

const RESPONSE_KEYS = new Map([["f", "oui"], ["j", "non"]]);
const TYPE_LABELS = { digits: "Chiffres", symbols: "Symboles abstraits" };
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const COLUMNS = [
  "session_id", "session_type", "mode", "block", "phase", "stimulus_type",
  "trial", "set_size", "sequence", "probe", "target_present", "response", "correct", "rt_ms",
  "focus_lost", "recall_sequence", "recall_correct", "recall_positions_correct", "recall_focus_lost",
  "browser",
];

const intro = document.querySelector("#intro");
const form = document.querySelector("#session-form");
const testChoice = form.querySelector('[name="stimulus_type"]');
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
const recallTitle = document.querySelector("#recall-title");
const recallOptions = document.querySelector("#recall-options");
const recallSequence = document.querySelector("#recall-sequence");
const undoRecall = document.querySelector("#undo-recall");
const validateRecall = recallForm.querySelector('[type="submit"]');
const decisionFeedback = document.querySelector("#decision-feedback");
const result = document.querySelector("#result");
const resultTitle = document.querySelector("#result-title");
const resultSummary = document.querySelector("#result-summary");

let session = null;
let trialHasLostFocus = false;

function itemLabel(item) {
  if (item === "?") return "Élément oublié";
  return SYMBOL_PATHS[item] ? `Symbole abstrait ${Number(item.slice(1))}` : item;
}

function renderItem(element, item) {
  const drawing = SYMBOL_PATHS[item];
  if (!drawing) {
    element.textContent = item;
    return;
  }
  const svg = document.createElementNS(SVG_NAMESPACE, "svg");
  svg.classList.add("glyph");
  svg.setAttribute("viewBox", "0 0 32 32");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(SVG_NAMESPACE, "path");
  path.setAttribute("d", drawing);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "2.4");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.append(path);
  element.replaceChildren(svg);
}

function show(label, value) {
  phase.textContent = label;
  stimulus.setAttribute("aria-label", itemLabel(value));
  renderItem(stimulus, value);
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
      show("Cet élément était-il dans la série ?", probe);
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
  const recalled = [];
  const choices = shuffled(STIMULI[type]).map(item => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "secondary recall-item";
    button.dataset.item = item;
    button.setAttribute("aria-label", itemLabel(item));
    renderItem(button, item);
    return button;
  });
  recallOptions.replaceChildren(...choices);
  const itemButtons = recallForm.querySelectorAll("[data-item]");

  function updateRecall() {
    recallSequence.replaceChildren(...recalled.map(item => {
      const entry = document.createElement("li");
      entry.setAttribute("aria-label", itemLabel(item));
      renderItem(entry, item);
      return entry;
    }));
    for (const button of itemButtons) button.disabled = recalled.length >= trial.sequence.length;
    undoRecall.disabled = recalled.length === 0;
  }

  updateRecall();
  screen.hidden = true;
  recallForm.hidden = false;
  decisionFeedback.textContent = "Réponse incorrecte.";
  if (correct) decisionFeedback.textContent = "Réponse correcte.";
  if (response === "timeout") decisionFeedback.textContent = "Temps de réponse écoulé.";
  recallTitle.focus();

  return new Promise(resolve => {
    const listeners = new AbortController();
    recallForm.addEventListener("click", event => {
      const button = event.target.closest("button");
      if (button === undoRecall) {
        recalled.pop();
        updateRecall();
        if (!recalled.length) choices[0].focus();
      }
      if (button?.dataset.item && recalled.length < trial.sequence.length) {
        recalled.push(button.dataset.item);
        updateRecall();
        if (recalled.length === trial.sequence.length) validateRecall.focus();
      }
    }, { signal: listeners.signal });
    recallForm.addEventListener("submit", event => {
      event.preventDefault();
      listeners.abort();
      recallForm.hidden = true;
      screen.hidden = false;
      screen.focus();
      resolve(recalled);
    }, { signal: listeners.signal });
  });
}

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
  const stimulusType = fields.get("stimulus_type");
  const blocks = makeBlocks(type, stimulusType);
  session = { id: crypto.randomUUID(), mode: fields.get("mode"), type, stimulusType, rows: [] };
  intro.hidden = true;

  for (const [index, block] of blocks.entries()) {
    await runBlock(block, index, blocks.length);
  }

  const trials = session.rows.filter(row => row.phase === "test");
  const correct = trials.filter(row => row.correct).length;
  const recalled = trials.filter(row => row.recall_correct).length;
  resultSummary.textContent =
    `${TYPE_LABELS[stimulusType]} · Décisions correctes ${correct}/${trials.length} · Séries rappelées dans l’ordre ${recalled}/${trials.length}`;
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
  link.download = `sternberg-${session.type}-${session.mode}-${session.stimulusType}-${session.id}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

document.querySelector("#restart").addEventListener("click", () => {
  session = null;
  form.reset();
  result.hidden = true;
  intro.hidden = false;
  testChoice.focus();
});
