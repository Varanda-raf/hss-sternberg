import { makeBlocks, SYMBOL_PATHS } from "./trials.js?v=2";

const TIMING = { fixation: 500, item: 1200, delay: 2000, warning: 250, limit: 4000 };
const LABELS = { digits: "Chiffres", symbols: "Symboles abstraits" };
const SVG = "http://www.w3.org/2000/svg";
const COLUMNS = [
  "session_id", "session_type", "protocol_version", "mode", "stimulus_type", "trial",
  "set_size", "sequence", "probe", "target_present", "response", "correct", "rt_ms",
  "response_input", "focus_lost", "viewport_width", "viewport_height", "browser",
];

const intro = document.querySelector("#intro");
const testForm = document.querySelector("#test-form");
const task = document.querySelector("#task");
const progress = document.querySelector("#progress");
const phase = document.querySelector("#phase");
const stimulus = document.querySelector("#stimulus");
const responseButtons = document.querySelector("#response-buttons");
const choices = [...responseButtons.querySelectorAll("button")];
const result = document.querySelector("#result");
const resultTitle = document.querySelector("#result-title");
const resultSummary = document.querySelector("#result-summary");

const localHosts = ["localhost", "127.0.0.1", "[::1]"];
const mode = localHosts.includes(window.location.hostname) ? "presentiel" : "distance";
let session = null;
let focusLost = false;

function show(label, item) {
  phase.textContent = label;
  const drawing = SYMBOL_PATHS[item];
  if (!drawing) {
    stimulus.removeAttribute("aria-label");
    stimulus.textContent = item;
    return;
  }

  stimulus.setAttribute("aria-label", "Symbole abstrait " + Number(item.slice(1)));
  const svg = document.createElementNS(SVG, "svg");
  svg.setAttribute("viewBox", "0 0 32 32");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(SVG, "path");
  path.setAttribute("d", drawing);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "2.4");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.append(path);
  stimulus.replaceChildren(svg);
}

function showFor(label, item, duration) {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      show(label, item);
      setTimeout(resolve, duration);
    });
  });
}

function askForResponse(probe) {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      show("Était-il dans la série ?", probe);
      const onset = performance.now();
      const listeners = new AbortController();
      let pointerType = "";

      function finish(response, rtMs = "", input = "") {
        clearTimeout(timeout);
        listeners.abort();
        choices.forEach(button => { button.disabled = true; });
        resolve({ response, rtMs, input });
      }

      const timeout = setTimeout(() => finish("timeout"), TIMING.limit);
      responseButtons.addEventListener("pointerdown", event => {
        pointerType = event.pointerType;
      }, { signal: listeners.signal });
      responseButtons.addEventListener("click", event => {
        const button = event.target.closest("button");
        if (!button || button.disabled) return;
        const input = event.detail === 0 ? "keyboard" : event.pointerType || pointerType || "unknown";
        finish(button.value, Number((performance.now() - onset).toFixed(1)), input);
      }, { signal: listeners.signal });
      choices.forEach(button => { button.disabled = false; });
    });
  });
}

function recordFocusLoss() {
  if (session && !task.hidden) focusLost = true;
}

window.addEventListener("blur", recordFocusLoss);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) recordFocusLoss();
});

async function runTrial(trial) {
  focusLost = document.hidden || !document.hasFocus();
  await showFor("Fixez la croix", "+", TIMING.fixation);
  for (const item of trial.sequence) await showFor("Mémorisez", item, TIMING.item);
  await showFor("", "", TIMING.delay);
  await showFor("", "●", TIMING.warning);
  const { response, rtMs, input } = await askForResponse(trial.probe);
  return {
    session_id: session.id,
    session_type: "demo",
    protocol_version: 4,
    mode,
    stimulus_type: session.type,
    trial: session.rows.length + 1,
    set_size: trial.sequence.length,
    sequence: trial.sequence.join(" "),
    probe: trial.probe,
    target_present: trial.targetPresent,
    response,
    correct: response === (trial.targetPresent ? "oui" : "non"),
    rt_ms: rtMs,
    response_input: input,
    focus_lost: focusLost,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    browser: navigator.userAgent,
  };
}

testForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (session || !event.submitter) return;

  const type = event.submitter.value;
  const [{ trials }] = makeBlocks("demo", type);
  session = { id: crypto.randomUUID(), type, rows: [] };
  intro.hidden = true;
  progress.max = trials.length;
  progress.value = 0;
  task.hidden = false;
  task.focus();

  for (const trial of trials) {
    session.rows.push(await runTrial(trial));
    progress.value = session.rows.length;
  }

  const correct = session.rows.filter(row => row.correct).length;
  resultSummary.textContent = LABELS[type] + " · " + correct + " bonnes réponses sur " + trials.length + ".";
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
  link.download = ["sternberg", "demo", mode, session.type, session.id].join("-") + ".csv";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

document.querySelector("#restart").addEventListener("click", () => {
  session = null;
  result.hidden = true;
  intro.hidden = false;
  testForm.querySelector("button").focus();
});
