import { makeBlocks, SYMBOL_PATHS } from "./trials.js?v=5";

const TIMING = { fixation: 500, item: 1200, delay: 2000, warning: 250, limit: 4000 };
const PRACTICE_FEEDBACK = 1200;
const PRACTICE_TRANSITION = 3000;
const SESSION_LIMIT = 10 * 60 * 1000;
const PROTOCOL_VERSION = 5;
const COLLECTOR_URL = "https://collecte-sternberg-hss.notablesloth16.chatgpt.site/api/results";
const LABELS = { digits: "Symboles familiers (chiffres)", symbols: "Symboles abstraits" };
const SVG = "http://www.w3.org/2000/svg";
const CSV_SEPARATOR = ";";
const COLUMNS = [
  "trial", "trial_phase", "set_size", "sequence", "probe", "target_present",
  "response", "correct", "rt_ms", "focus_lost", "response_input", "block",
  "stimulus_type", "session_id", "session_type", "protocol_version", "mode",
  "session_status", "session_duration_ms", "viewport_width", "viewport_height", "browser",
];

const intro = document.querySelector("#intro");
const testForm = document.querySelector("#test-form");
const testChoices = [...testForm.querySelectorAll("button")];
const participantFields = document.querySelector("#participant-fields");
const participantName = document.querySelector("#participant-name");
const participantEmail = document.querySelector("#participant-email");
const task = document.querySelector("#task");
const trialCounter = document.querySelector("#trial-counter");
const progress = document.querySelector("#progress");
const phase = document.querySelector("#phase");
const stimulus = document.querySelector("#stimulus");
const responseButtons = document.querySelector("#response-buttons");
const choices = [...responseButtons.querySelectorAll("button")];
const result = document.querySelector("#result");
const resultTitle = document.querySelector("#result-title");
const resultSummary = document.querySelector("#result-summary");
const downloadInstructions = document.querySelector("#download-instructions");
const download = document.querySelector("#download");
const restart = document.querySelector("#restart");
const saveStatus = document.querySelector("#save-status");
const retrySave = document.querySelector("#retry-save");

const localHosts = ["localhost", "127.0.0.1", "[::1]"];
const mode = localHosts.includes(window.location.hostname) ? "presentiel" : "distance";
const sessionType = new URLSearchParams(window.location.search).get("pilot") === "1" ? "pilot" : "study";
const invite = new URLSearchParams(window.location.hash.slice(1)).get("collecte") ?? "";
const automaticCollection = /^[A-Za-z0-9_-]{43}$/.test(invite);
let session = null;
let focusLost = false;

document.querySelector("#pilot-note").hidden = sessionType !== "pilot";
document.querySelector("#collection-note").hidden = !automaticCollection;
participantFields.hidden = participantFields.disabled = !automaticCollection;
if (automaticCollection) downloadInstructions.textContent = "Vous pouvez télécharger une copie du CSV.";

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

function elapsedTime() {
  return Math.max(performance.now() - session.startedAt, Date.now() - session.startedAtWall);
}

function checkDeadline() {
  if (session?.status === "running" && elapsedTime() >= SESSION_LIMIT) session.controller.abort();
}

async function waitFor(schedule, cancel, signal) {
  checkDeadline();
  signal.throwIfAborted();
  await new Promise((resolve, reject) => {
    const handle = schedule(() => {
      signal.removeEventListener("abort", abort);
      resolve();
    });
    function abort() {
      cancel(handle);
      reject(signal.reason);
    }
    signal.addEventListener("abort", abort, { once: true });
  });
  checkDeadline();
  signal.throwIfAborted();
}

async function showFor(label, item, duration, signal) {
  await waitFor(requestAnimationFrame, cancelAnimationFrame, signal);
  show(label, item);
  await waitFor(callback => setTimeout(callback, duration), clearTimeout, signal);
}

async function askForResponse(probe, signal) {
  await waitFor(requestAnimationFrame, cancelAnimationFrame, signal);
  show("Faisait-il partie de la série ?", probe);
  const onset = performance.now();

  return new Promise((resolve, reject) => {
    const listeners = new AbortController();
    const timeout = setTimeout(() => finish("timeout"), TIMING.limit);
    let pointerType = "";

    function cleanUp() {
      clearTimeout(timeout);
      signal.removeEventListener("abort", abort);
      listeners.abort();
      choices.forEach(button => { button.disabled = true; });
    }

    function abort() {
      cleanUp();
      reject(signal.reason);
    }

    function finish(response, rtMs = "", input = "") {
      checkDeadline();
      if (signal.aborted) return;
      cleanUp();
      resolve({ response, rtMs, input });
    }

    signal.addEventListener("abort", abort, { once: true });
    responseButtons.addEventListener("pointerdown", event => {
      pointerType = event.pointerType;
    }, { signal: listeners.signal });
    responseButtons.addEventListener("click", event => {
      const button = event.target.closest("button");
      if (!button || button.disabled) return;
      const rtMs = performance.now() - onset;
      if (rtMs >= TIMING.limit) {
        finish("timeout");
        return;
      }
      const input = event.detail === 0 ? "keyboard" : event.pointerType || pointerType || "unknown";
      finish(button.value, Number(rtMs.toFixed(1)), input);
    }, { signal: listeners.signal });
    choices.forEach(button => { button.disabled = false; });
  });
}

function recordFocusLoss() {
  if (session && !task.hidden) focusLost = true;
}

window.addEventListener("blur", recordFocusLoss);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) recordFocusLoss();
  checkDeadline();
});
window.addEventListener("pageshow", checkDeadline);

async function runTrial(trial, block, signal) {
  focusLost = document.hidden || !document.hasFocus();
  await showFor("Fixez la croix", "+", TIMING.fixation, signal);
  for (const item of trial.sequence) await showFor("Mémorisez", item, TIMING.item, signal);
  await showFor("", "", TIMING.delay, signal);
  await showFor("", "●", TIMING.warning, signal);
  const { response, rtMs, input } = await askForResponse(trial.probe, signal);
  return {
    trial_phase: block.phase,
    block: block.number,
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

async function runBlocks(blocks, signal) {
  let completed = 0;
  for (const block of blocks) {
    for (const [index, trial] of block.trials.entries()) {
      const practice = block.phase === "practice";
      trialCounter.textContent = practice
        ? `Entraînement ${index + 1} / ${block.trials.length}`
        : `Test ${completed + 1} / ${progress.max}`;
      const row = await runTrial(trial, block, signal);
      session.rows.push(row);
      if (practice) {
        let feedback = row.correct ? "Bonne réponse." : "Réponse incorrecte.";
        if (row.response === "timeout") feedback = "Temps de réponse écoulé.";
        const answer = row.target_present ? "Il fallait répondre « Oui »." : "Il fallait répondre « Non ».";
        await showFor(`${feedback} ${answer}`, "", PRACTICE_FEEDBACK, signal);
      } else {
        completed += 1;
        progress.value = completed;
      }
    }
    if (block.phase === "practice") {
      await showFor("L’entraînement est terminé. Le test va commencer.", "", PRACTICE_TRANSITION, signal);
    }
  }
}

function showResult() {
  const completed = session.rows.filter(row => row.trial_phase === "test").length;
  resultTitle.textContent = session.status === "complete" ? "Test terminé" : "Limite de 10 minutes atteinte";
  resultSummary.textContent = `${LABELS[session.type]} · ${completed} / ${progress.max} essais de test effectués.`;
  download.hidden = downloadInstructions.hidden = session.rows.length === 0;
  saveStatus.hidden = retrySave.hidden = true;
  task.hidden = true;
  result.hidden = false;
  resultTitle.focus();
  if (automaticCollection && session.file) saveResult();
}

testForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (session || !event.submitter) return;

  const type = event.submitter.value;
  const blocks = makeBlocks(type);
  const controller = new AbortController();
  session = {
    id: crypto.randomUUID(), type, rows: [], status: "running", controller,
    identity: automaticCollection ? { name: participantName.value.trim().replace(/\s+/g, " "), email: participantEmail.value.trim() } : null,
    startedAt: performance.now(), startedAtWall: Date.now(),
  };
  const deadlineTimer = setTimeout(() => controller.abort(), SESSION_LIMIT);
  intro.hidden = true;
  progress.max = blocks.slice(1).reduce((total, block) => total + block.trials.length, 0);
  progress.value = 0;
  task.hidden = false;
  task.focus();

  try {
    await runBlocks(blocks, controller.signal);
    session.status = "complete";
  } catch (error) {
    if (error !== controller.signal.reason) throw error;
    session.status = "time_limit";
  } finally {
    clearTimeout(deadlineTimer);
  }
  session.duration = Math.round(Math.min(elapsedTime(), SESSION_LIMIT));
  session.file = session.rows.length ? createSessionFile() : null;
  showResult();
});

function csvCell(value) {
  if (typeof value === "number") return String(value).replace(".", ",");
  const text = String(value);
  return /[;"\r\n]/.test(text) ? '"' + text.replaceAll('"', '""') + '"' : text;
}

function createSessionFile() {
  const metadata = {
    session_id: session.id,
    session_type: sessionType,
    protocol_version: PROTOCOL_VERSION,
    mode,
    stimulus_type: session.type,
    session_status: session.status,
    session_duration_ms: session.duration,
  };
  const rows = session.rows.map(trial => {
    const row = { ...metadata, ...trial };
    return COLUMNS.map(column => csvCell(row[column])).join(CSV_SEPARATOR);
  });
  const csv = "\uFEFF" + [COLUMNS.join(CSV_SEPARATOR), ...rows].join("\r\n") + "\r\n";
  const name = ["sternberg", sessionType, mode, session.type, session.id].join("-") + ".csv";
  return { csv, name };
}

async function saveResult() {
  retrySave.hidden = true;
  restart.disabled = true;
  saveStatus.hidden = false;
  saveStatus.textContent = "Enregistrement des résultats…";
  try {
    const response = await fetch(COLLECTOR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Collector-Key": invite },
      body: JSON.stringify({ sessionId: session.id, csv: session.file.csv, identity: session.identity }),
      keepalive: true,
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok || (await response.json()).saved !== true) throw new Error("Result not saved");
    saveStatus.textContent = "Vos résultats ont été enregistrés.";
  } catch {
    saveStatus.textContent = "L’envoi a échoué. Réessayez ou téléchargez le CSV pour le remettre à la personne qui vous a invité.";
    retrySave.hidden = false;
  } finally {
    restart.disabled = false;
  }
}

retrySave.addEventListener("click", saveResult);
window.addEventListener("online", () => {
  if (!result.hidden && !retrySave.hidden) saveResult();
});

download.addEventListener("click", () => {
  const { csv, name } = session.file;
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

restart.addEventListener("click", () => {
  session = null;
  testForm.reset();
  result.hidden = true;
  intro.hidden = false;
  testChoices[0].focus();
});

testChoices.forEach(button => { button.disabled = false; });
