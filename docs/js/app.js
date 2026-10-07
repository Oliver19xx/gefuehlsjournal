// Gefühls-Journal – App. Komplett gebaut von einem Grok-Bot-Team, ohne menschliche Hand.
import { VERSION } from "./version.js";
import { CORES, CORE, UNNAMED, MAX_FEELINGS, PROMPTS, SAVE_THANKS } from "./data.js";
import * as vault from "./vault.js";
import { h, s, toast, fmt, dayKey, uid } from "./ui.js";

const REPO_URL = "https://github.com/Oliver19xx/gefuehlsjournal";
const LOCK_AFTER_MS = 60 * 1000;
const MAX_TRIES = 5;

const state = { lock: null, entries: [], wheelAsList: localStorage.getItem("gj-list") === "1", installEvt: null };
const app = document.getElementById("app");
let current = null; // aktueller Screen (Funktion + Argumente), für "Zurück" aus der Hilfe

// ---------- Infrastruktur ----------
function show(fn, ...args) {
  current = { fn, args };
  const nodes = fn(...args);
  app.replaceChildren(...[].concat(nodes).filter(Boolean));
  const first = app.querySelector("h1");
  if (first) { first.setAttribute("tabindex", "-1"); first.focus({ preventScroll: true }); }
  app.querySelector(".screen")?.scrollTo(0, 0);
}
const screen = (cls, ...kids) => h("main", { class: "screen " + (cls || "") }, ...kids);
const nav = (active) => h("nav", { class: "nav", "aria-label": "Hauptnavigation" },
  [["Heute", "◐", () => show(today)], ["Einträge", "▦", () => show(entries, {})], ["Rückblick", "◔", () => show(review, 7)]]
    .map(([label, ic, fn]) => h("button", { onclick: fn, "aria-current": label === active ? "page" : null },
      h("span", { "aria-hidden": "true" }, ic), label)));
const back = (label, fn) => h("button", { class: "back", onclick: fn }, "‹ " + label);
const tagEl = (f, sm = true) => {
  const c = CORE[f.core];
  return h("span", { class: "tag" + (sm ? " sm" : ""), style: { background: c.c2 } }, feelingLabel(f));
};
const feelingLabel = (f) => [CORE[f.core].name, f.l3 || f.l2].filter(Boolean).join(" · ");
const isStandalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const sortEntries = () => state.entries.sort((a, b) => b.createdAt - a.createdAt);

// ---------- Gefühlsrad ----------
function arc(c, r0, r1, a0, a1) {
  const p = (r, a) => [c + r * Math.cos(a * Math.PI / 180), c + r * Math.sin(a * Math.PI / 180)];
  const [x0, y0] = p(r1, a0), [x1, y1] = p(r1, a1), [x2, y2] = p(r0, a1), [x3, y3] = p(r0, a0);
  return `M${x0.toFixed(1)},${y0.toFixed(1)} A${r1},${r1} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)} A${r0},${r0} 0 0 0 ${x3.toFixed(1)},${y3.toFixed(1)} Z`;
}
function wheel(onPick, centerText = "Tippen") {
  const size = 300, c = size / 2, R = c - 6, r0 = R * 0.34, seg = 60;
  const svg = s("svg", { viewBox: `-6 -6 ${size + 12} ${size + 12}`, role: "group", "aria-label": "Gefühlsrad mit sechs Grundgefühlen" });
  CORES.forEach((core, i) => {
    const a0 = -90 - seg / 2 + i * seg, a1 = a0 + seg, am = ((a0 + a1) / 2) * Math.PI / 180;
    const lx = c + (r0 + R) / 2 * Math.cos(am), ly = c + (r0 + R) / 2 * Math.sin(am);
    const g = s("g", { class: "seg", role: "button", tabindex: "0", "aria-label": core.name,
      onclick: () => onPick(core.id), onkeydown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(core.id); } } },
      s("path", { d: arc(c, r0, R, a0 + 0.01, a1 - 0.01), fill: core.color, stroke: "#FBF7F1", "stroke-width": "4", "stroke-linejoin": "round" }),
      s("text", { x: lx.toFixed(1), y: ly.toFixed(1), "text-anchor": "middle", "dominant-baseline": "central", "font-size": "15", "font-weight": "800", fill: "#3B3A45" }, core.name));
    svg.append(g);
  });
  svg.append(s("circle", { cx: c, cy: c, r: r0 - 6, fill: "#FFFDF8", "aria-hidden": "true" }),
    s("text", { x: c, y: c, "text-anchor": "middle", "dominant-baseline": "central", "font-size": "14", "font-weight": "700", fill: "#6F6B79", "aria-hidden": "true" }, centerText));
  return h("div", { class: "wheel" }, svg);
}
function coreList(onPick) {
  return h("div", { class: "corelist", role: "group", "aria-label": "Grundgefühle" },
    CORES.map((c) => h("button", { style: { background: c.color }, onclick: () => onPick(c.id) }, c.name)));
}
function wheelOrList(onPick) {
  const holder = h("div");
  const draw = () => {
    const toggle = h("button", { class: "aslist", onclick: () => {
      state.wheelAsList = !state.wheelAsList; localStorage.setItem("gj-list", state.wheelAsList ? "1" : "0"); draw();
    } }, state.wheelAsList ? "◔ Als Rad anzeigen" : "☰ Als Liste anzeigen");
    holder.replaceChildren(state.wheelAsList ? coreList(onPick) : wheel(onPick), toggle);
  };
  draw();
  return holder;
}

// ---------- Start ----------
async function boot() {
  try {
    await vault.open();
  } catch (e) {
    show(() => screen("", h("h1", null, "Speicher nicht verfügbar"),
      h("p", { class: "p" }, "Dein Browser erlaubt dieser Seite gerade keinen lokalen Speicher (z. B. im privaten Modus). Öffne das Journal bitte in einem normalen Fenster.")));
    return;
  }
  state.lock = await vault.lockInfo();
  if (!state.lock) return show(onboarding);
  if (state.lock.mode === "none") { await vault.unlockWithoutPin(); await afterUnlock(); return; }
  show(unlock);
}
async function afterUnlock() {
  state.entries = await vault.allEntries();
  show(today);
}

// 1. Erster Start
function onboarding() {
  return screen("", h("div", { class: "col center grow" },
    h("div", { class: "illu" }, h("img", { src: "icons/icon.svg", alt: "" })),
    h("h1", null, "Dein Raum.", h("br"), "Nur für dich."),
    h("p", { class: "p" }, "Alles, was du schreibst, bleibt nur auf deinem Gerät.", h("br"), "Kein Konto, keine Cloud, kein Server."),
    h("div", { class: "badge" }, h("span", { "aria-hidden": "true" }, "✦"), "Komplett gebaut von einem Grok-Bot-Team, ohne menschliche Hand.")),
    h("div", { class: "grow" }),
    h("button", { class: "btn", onclick: () => show(pinSetup, { first: true }) }, "Los geht's"),
    h("button", { class: "link", onclick: () => show(privacy, () => show(onboarding)) }, "Mehr zum Datenschutz"),
    h("div", { class: "ver" }, `Gefühls-Journal · Version ${VERSION}`));
}

// ---------- PIN ----------
function keypad(onDigit, onDelete) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];
  return h("div", { class: "keypad" }, keys.map((k) =>
    k === "" ? h("button", { class: "e", tabindex: "-1", "aria-hidden": "true" }) :
    k === "del" ? h("button", { class: "del", "aria-label": "Letzte Ziffer löschen", onclick: onDelete }, "⌫") :
    h("button", { onclick: () => onDigit(k) }, k)));
}
function pinDots(n, filled) {
  return h("div", { class: "pins", role: "img", "aria-label": `${filled} von ${n} Ziffern eingegeben` },
    Array.from({ length: n }, (_, i) => h("i", { class: i < filled ? "f" : "" })));
}

// 1b. PIN einrichten (auch: PIN ändern nach Prüfung der alten PIN)
function pinSetup(opts) {
  let pin = "", first = null, error = "";
  const root = screen("");
  const draw = () => {
    const confirming = first !== null;
    const max = confirming ? first.length : 6;
    const kids = [];
    if (!opts.first) kids.push(back("Einstellungen", () => show(settings)));
    kids.push(h("div", { class: "col center" },
      h("h1", { class: "mt" }, confirming ? "PIN wiederholen" : opts.first ? "Sichere dein Journal" : "Neue PIN"),
      h("p", { class: "p sm" }, confirming ? "Gib die PIN zur Bestätigung noch einmal ein." : "PIN mit 4 bis 6 Ziffern"),
      pinDots(max, pin.length),
      error ? h("div", { class: "err", role: "alert" }, error) : null,
      keypad((d) => { if (pin.length < max) { pin += d; error = ""; draw(); if (confirming && pin.length === max) finish(); } },
        () => { pin = pin.slice(0, -1); draw(); })));
    if (!confirming) kids.push(h("button", { class: "btn", disabled: pin.length < 4, onclick: () => { first = pin; pin = ""; draw(); } }, "Weiter"));
    kids.push(h("div", { class: "warn" }, h("b", null, "⚠ Wichtig"),
      "Wenn du die PIN vergisst, kann sie niemand zurücksetzen. Deine Einträge wären dann verloren."));
    if (opts.first && !confirming) kids.push(h("button", { class: "link", onclick: async () => {
      await vault.setupWithoutPin(); state.lock = await vault.lockInfo(); state.entries = []; show(installHint, true);
    } }, "Später einrichten"));
    if (confirming) kids.push(h("button", { class: "link", onclick: () => { first = null; pin = ""; draw(); } }, "Andere PIN wählen"));
    root.replaceChildren(...kids.filter(Boolean));
  };
  const finish = async () => {
    if (pin !== first) { error = "Die PINs stimmen nicht überein. Versuch es noch einmal."; first = null; pin = ""; draw(); return; }
    root.replaceChildren(h("div", { class: "col center grow" }, h("p", { class: "p" }, "Einen Moment, dein Journal wird gesichert …")));
    await vault.setPin(pin);
    state.lock = await vault.lockInfo();
    resetTries();
    if (opts.first) { state.entries = []; show(installHint, true); }
    else { show(settings); toast("Deine neue PIN ist gespeichert."); }
  };
  draw();
  return root;
}

// Fehlversuche
const tries = () => ({ fails: +localStorage.getItem("gj-fails") || 0, until: +localStorage.getItem("gj-until") || 0, rounds: +localStorage.getItem("gj-rounds") || 0 });
function resetTries() { ["gj-fails", "gj-until", "gj-rounds"].forEach((k) => localStorage.removeItem(k)); }
function registerFail() {
  const t = tries();
  t.fails++;
  if (t.fails >= MAX_TRIES) {
    const wait = 60000 * Math.pow(2, t.rounds); // 1, 2, 4, 8 … Minuten
    localStorage.setItem("gj-until", Date.now() + wait);
    localStorage.setItem("gj-rounds", t.rounds + 1);
    t.fails = 0;
  }
  localStorage.setItem("gj-fails", t.fails);
}
const minutes = (ms) => { const m = Math.ceil(ms / 60000); return m === 1 ? "1 Minute" : `${m} Minuten`; };

// 1c. Entsperren (auch zum Prüfen der alten PIN in den Einstellungen)
function unlock(verify) {
  const len = state.lock.len || 4;
  let pin = "", msg = "", busy = false, timer;
  const root = screen("");
  const draw = () => {
    const t = tries(), waitMs = t.until - Date.now();
    const locked = waitMs > 0;
    clearTimeout(timer);
    if (locked) timer = setTimeout(draw, Math.min(waitMs, 15000) + 50);
    const nextWait = minutes(60000 * Math.pow(2, t.rounds));
    let info = msg;
    if (locked) info = `Zu viele Versuche. Bitte warte noch ${minutes(waitMs)}.`;
    else if (msg) info = `${msg} Noch ${MAX_TRIES - t.fails} ${MAX_TRIES - t.fails === 1 ? "Versuch" : "Versuche"}, dann ${nextWait} Pause.`;
    root.replaceChildren(...[
      verify ? back(verify.backLabel, verify.onBack) : null,
      h("div", { class: "col center grow" },
        h("div", { class: "circle", style: { background: "#e1efe5" }, "aria-hidden": "true" }, "🔒"),
        h("h1", null, verify ? verify.title : "Willkommen zurück"),
        verify ? h("p", { class: "p sm" }, "Gib deine aktuelle PIN ein.") : null,
        pinDots(len, pin.length),
        info ? h("div", { class: "err", role: "alert" }, info) : busy ? h("p", { class: "p sm" }, "Prüfe …") : null,
        locked ? null : keypad((d) => { if (busy || pin.length >= len) return; pin += d; draw(); if (pin.length === len) check(); },
          () => { pin = pin.slice(0, -1); draw(); }),
        verify ? null : h("button", { class: "link", onclick: () => show(forgot) }, "PIN vergessen?"))].filter(Boolean));
  };
  const check = async () => {
    busy = true; draw();
    const ok = verify ? await vault.checkPin(pin) : await vault.unlockWithPin(pin);
    busy = false;
    if (ok) { resetTries(); clearTimeout(timer); verify ? verify.onOk() : afterUnlock(); return; }
    registerFail(); pin = ""; msg = "Falsche PIN."; draw();
    root.querySelector(".pins")?.classList.add("shake");
  };
  draw();
  return root;
}

// 10. PIN vergessen
function forgot() {
  return screen("", h("div", { class: "grow" }), h("div", { class: "col center" },
    h("div", { class: "circle", style: { background: "#e7e2f2", color: "#6c5a99" }, "aria-hidden": "true" }, "?"),
    h("h1", null, "PIN vergessen"),
    h("p", { class: "p" }, "Deine Einträge sind mit deiner PIN verschlüsselt. Ohne sie kann niemand sie öffnen, auch wir nicht."),
    h("div", { class: "hint", style: { background: "#dcece1", color: "#3f6b4b" } }, "Wenn du dich wieder erinnerst, kannst du es jederzeit erneut versuchen.")),
    h("div", { class: "grow" }),
    h("button", { class: "btn", onclick: () => show(unlock) }, "Nochmal versuchen"),
    h("button", { class: "btn danger", onclick: () => show(deleteAll, () => show(forgot)) }, "Journal zurücksetzen (alles löschen)"));
}

// 11. Alle Daten löschen
function deleteAll(onBack) {
  const btn = h("button", { class: "btn danger strong", disabled: true, onclick: async () => {
    btn.disabled = true; await vault.wipe(); location.reload();
  } }, "Endgültig löschen");
  const input = h("input", { class: "field", id: "confirm", autocomplete: "off", autocapitalize: "characters", spellcheck: "false",
    oninput: () => { btn.disabled = input.value.trim().toUpperCase() !== "LÖSCHEN"; } });
  return screen("", back("Zurück", onBack),
    h("h1", null, "Alle Daten löschen?"),
    h("p", { class: "p" }, "Alle Einträge, Gefühle, Entwürfe und deine PIN werden endgültig von diesem Gerät gelöscht. Das lässt sich nicht rückgängig machen."),
    h("label", { class: "sub", for: "confirm" }, "Tippe LÖSCHEN zur Bestätigung"), input,
    h("div", { class: "grow" }), btn,
    h("button", { class: "link", onclick: onBack }, "Abbrechen"));
}

// Hinweis: Zum Home-Bildschirm hinzufügen
function installHint(afterOnboarding) {
  const next = () => afterOnboarding ? show(today) : show(settings);
  if (afterOnboarding && isStandalone()) { queueMicrotask(next); return screen(""); }
  const kids = [];
  if (!afterOnboarding) kids.push(back("Einstellungen", next));
  kids.push(h("div", { class: "col center" },
    h("div", { class: "illu" }, h("img", { src: "icons/icon.svg", alt: "" })),
    h("h1", null, "Leg dein Journal auf den Home-Bildschirm"),
    h("p", { class: "p" }, "So öffnet es sich wie eine App, funktioniert offline, und dein Browser räumt deine Einträge nicht weg, wenn du ihn eine Weile nicht nutzt.")));
  if (isStandalone()) kids.push(h("div", { class: "okmsg" }, "Schon erledigt: Das Journal ist installiert."));
  else if (state.installEvt) kids.push(h("button", { class: "btn", onclick: async () => {
    state.installEvt.prompt(); await state.installEvt.userChoice; state.installEvt = null; next();
  } }, "Jetzt installieren"));
  else if (isIOS()) kids.push(h("ol", { class: "steps" }, h("li", null, "Öffne diese Seite in Safari."),
    h("li", null, "Tippe unten auf „Teilen“ (Quadrat mit Pfeil)."), h("li", null, "Wähle „Zum Home-Bildschirm“.")));
  else kids.push(h("ol", { class: "steps" }, h("li", null, "Öffne das Browser-Menü (⋮)."),
    h("li", null, "Wähle „App installieren“ oder „Zum Startbildschirm hinzufügen“.")));
  kids.push(h("div", { class: "grow" }), h("button", { class: afterOnboarding ? "btn ghost" : "link", onclick: next }, afterOnboarding ? "Später" : "Zurück"));
  return screen("", ...kids);
}

// ---------- 2. Heute ----------
function today() {
  const draftSlot = h("div");
  vault.getDraft().then((d) => {
    if (d && d.text && d.text.trim()) draftSlot.replaceChildren(h("button", { class: "draftcard", onclick: () => show(write, d) },
      h("span", { "aria-hidden": "true" }, "✎"), h("div", null, h("b", null, "Entwurf fortsetzen"), h("small", null, d.text.trim().slice(0, 60) + (d.text.length > 60 ? " …" : "")))));
  });
  return [screen("with-nav",
    h("div", { class: "row between" }, h("span", { class: "date" }, fmt.today(new Date())),
      h("button", { class: "iconbtn", "aria-label": "Einstellungen", onclick: () => show(settings) }, "⚙")),
    h("h1", { class: "h1" }, "Wie geht es dir gerade?"),
    draftSlot,
    wheelOrList((core) => show(refine, { core, mode: "new" })),
    h("p", { class: "p sm", style: { "text-align": "center" } }, "Tippe auf ein Gefühl. Danach kannst du genauer werden."),
    h("div", { class: "grow" }),
    h("button", { class: "btn ghost", onclick: () => show(write, { feelings: [] }) }, "✎ Lieber direkt schreiben")),
  nav("Heute")];
}

// ---------- 3. Genauer werden ----------
function feelingsFrom(core, sel2, sel3) {
  if (!sel2.length) return [{ core }];
  const out = [];
  for (const l2 of sel2) {
    const l3s = (CORE[core].l2[l2] || []).filter((x) => sel3.includes(x));
    if (l3s.length) l3s.forEach((l3) => out.push({ core, l2, l3 }));
    else out.push({ core, l2 });
  }
  return out;
}
function refine(ctx) {
  const core = CORE[ctx.core];
  const sel2 = [], sel3 = [];
  const root = screen("");
  const done = (feelings) => {
    if (ctx.mode === "new") show(write, { feelings });
    else saveFeelings(ctx.entryId, feelings, ctx.mode);
  };
  const draw = () => {
    const count = feelingsFrom(ctx.core, sel2, sel3).length;
    const full = sel2.length > 0 && count >= MAX_FEELINGS;
    const chip = (label, selected, color, onToggle, wouldAdd) => h("button", { class: "chip", "aria-pressed": selected ? "true" : "false",
      style: { "--c": color }, disabled: !selected && full && wouldAdd, onclick: onToggle }, label);
    const l2chips = Object.keys(core.l2).map((l2) => chip(l2, sel2.includes(l2), core.c2, () => {
      if (sel2.includes(l2)) { sel2.splice(sel2.indexOf(l2), 1); core.l2[l2].forEach((x) => { const i = sel3.indexOf(x); if (i >= 0) sel3.splice(i, 1); }); }
      else sel2.push(l2);
      draw();
    }, true));
    const l3blocks = sel2.map((l2) => {
      const already = core.l2[l2].some((x) => sel3.includes(x));
      return core.l2[l2].map((l3) => chip(l3, sel3.includes(l3), core.c3, () => {
        const i = sel3.indexOf(l3); if (i >= 0) sel3.splice(i, 1); else sel3.push(l3); draw();
      }, already));
    }).flat();
    const finalLabel = ctx.mode === "new" ? "Weiter zum Schreiben" : "Speichern";
    root.replaceChildren(...[
      back("Zurück", ctx.onBack || (() => show(today))),
      h("span", { class: "tag", style: { background: core.color } }, core.name),
      h("h1", { class: "mt" }, "Was trifft es eher?"),
      h("div", { class: "chips", role: "group", "aria-label": "Gefühle zu " + core.name }, l2chips),
      sel2.length ? h("div", null, h("div", { class: "sub" }, "Noch genauer ", h("span", null, "(optional)")),
        h("div", { class: "chips", role: "group", "aria-label": "Feinabstufungen" }, l3blocks)) : null,
      h("div", { class: "hint", style: { background: core.c3 } },
        full ? `Du hast ${MAX_FEELINGS} Gefühle gewählt, das ist das Maximum pro Eintrag.` : "Mehrere Antworten sind okay. Gefühle sind oft gemischt."),
      h("div", { class: "grow" }),
      h("button", { class: "btn mt", onclick: () => done(feelingsFrom(ctx.core, sel2, sel3)) }, finalLabel),
      h("button", { class: "link", onclick: () => done([{ core: ctx.core }]) }, sel2.length ? "Nur „" + core.name + "“ speichern" : "Überspringen")].filter(Boolean));
  };
  draw();
  return root;
}
async function saveFeelings(entryId, feelings, mode) {
  const e = state.entries.find((x) => x.id === entryId);
  if (!e) return show(entries, {});
  e.feelings = feelings; e.updatedAt = Date.now();
  await vault.putEntry(e);
  if (mode === "tag") { show(entries, {}); toast("Gefühl ergänzt."); }
  else { show(read, entryId); toast("Gefühle geändert."); }
}

// ---------- 4. Schreiben ----------
function pickPrompt(feelings, not) {
  const core = feelings[0]?.core;
  if (!core) return null;
  const list = PROMPTS[core].filter((p) => p !== not);
  return list[Math.floor(Math.random() * list.length)];
}
function write(ctx) {
  const draft = { id: ctx.id || uid(), feelings: ctx.feelings || [], prompt: ctx.prompt === undefined ? pickPrompt(ctx.feelings || []) : ctx.prompt, text: ctx.text || "", startedAt: ctx.startedAt || Date.now() };
  let saveTimer, menuOpen = false;
  const status = h("span", { class: "saved", "aria-live": "polite" }, draft.text ? "✓ Automatisch gespeichert" : "");
  const done = h("button", { class: "btn sm", disabled: !draft.text.trim(), onclick: () => finish() }, "Fertig");
  const ta = h("textarea", { class: "write", "aria-label": "Dein Eintrag", placeholder: draft.prompt ? "Schreib einfach los …" : "Was ist gerade in dir los? Schreib einfach los …",
    oninput: () => {
      draft.text = ta.value; done.disabled = !draft.text.trim();
      status.textContent = "…";
      clearTimeout(saveTimer);
      saveTimer = setTimeout(async () => { await vault.saveDraft(draft); status.textContent = "✓ Automatisch gespeichert"; }, 500);
    } });
  ta.value = draft.text;
  const promptBox = h("div");
  const drawPrompt = () => {
    if (!draft.prompt) { promptBox.replaceChildren(); return; }
    const c = CORE[draft.feelings[0].core];
    promptBox.replaceChildren(h("div", { class: "prompt", style: { background: c.c3 } },
      h("div", null, draft.prompt),
      h("div", { class: "pa" },
        h("button", { onclick: () => { draft.prompt = pickPrompt(draft.feelings, draft.prompt); drawPrompt(); vault.saveDraft(draft); } }, "↻ Anderer Impuls"),
        h("button", { onclick: () => { draft.prompt = null; drawPrompt(); vault.saveDraft(draft); ta.placeholder = "Schreib einfach los …"; } }, "Ohne Impuls schreiben"))));
  };
  drawPrompt();
  const menuSlot = h("div");
  const toggleMenu = () => {
    menuOpen = !menuOpen;
    menuSlot.replaceChildren(menuOpen ? h("div", { class: "menu", role: "menu" },
      h("button", { role: "menuitem", onclick: async () => { await flush(); show(help, () => show(write, draft)); } }, "♡ Hilfe in schweren Momenten"),
      draft.feelings.length && !draft.prompt ? h("button", { role: "menuitem", onclick: () => { draft.prompt = pickPrompt(draft.feelings); drawPrompt(); toggleMenu(); } }, "Impuls anzeigen") : null,
      h("button", { role: "menuitem", onclick: async () => { clearTimeout(saveTimer); await vault.clearDraft(); show(today); toast("Entwurf verworfen."); } }, "Entwurf verwerfen")) : "");
  };
  const flush = async () => { clearTimeout(saveTimer); if (draft.text.trim()) await vault.saveDraft(draft); };
  const finish = async () => {
    clearTimeout(saveTimer);
    const now = Date.now();
    const entry = { id: draft.id, createdAt: draft.startedAt, updatedAt: now, feelings: draft.feelings, prompt: draft.prompt || null, text: draft.text.trim() };
    await vault.putEntry(entry);
    await vault.clearDraft();
    state.entries = state.entries.filter((e) => e.id !== entry.id).concat(entry); sortEntries();
    if (!entry.feelings.length) show(tagLater, entry.id);
    else { show(entries, {}); toast(SAVE_THANKS); }
  };
  const root = screen("",
    h("div", { class: "writehead" },
      h("button", { class: "iconbtn", "aria-label": "Schließen, Entwurf bleibt gespeichert", onclick: async () => {
        await flush(); show(today); if (draft.text.trim()) toast("Dein Entwurf ist gespeichert.");
      } }, "✕"),
      draft.feelings.length ? h("div", { class: "row wrap" }, draft.feelings.map((f) => tagEl(f))) : h("span", { class: "date" }, "Freies Schreiben"),
      h("button", { class: "iconbtn", "aria-label": "Menü", "aria-haspopup": "menu", onclick: toggleMenu }, "⋯")),
    menuSlot, promptBox, ta,
    h("div", { class: "foot" }, status, done));
  root.style.position = "relative";
  setTimeout(() => ta.focus({ preventScroll: true }), 50);
  return root;
}

// 5. Gefühl nachtragen
function tagLater(entryId) {
  return screen("",
    h("div", { class: "pill", role: "status" }, "✓ " + SAVE_THANKS),
    h("h1", null, "Magst du noch festhalten, wie es dir ging?"),
    h("p", { class: "p sm" }, "Hilft dir später im Rückblick, Muster zu erkennen."),
    wheelOrList((core) => show(refine, { core, mode: "tag", entryId, onBack: () => show(tagLater, entryId) })),
    h("div", { class: "grow" }),
    h("button", { class: "link", onclick: () => show(entries, {}) }, "Nein, danke"));
}

// ---------- 6. Einträge & Kalender ----------
function entries(opts) {
  const now = new Date();
  let month = opts.month || new Date(now.getFullYear(), now.getMonth(), 1);
  let day = opts.day || null, query = "", filter = opts.filter || null;
  const root = screen("with-nav");
  const byDay = {};
  state.entries.forEach((e) => { (byDay[dayKey(e.createdAt)] ||= []).push(e); });
  const listSlot = h("div"), calSlot = h("div"), headSlot = h("div");
  const drawHead = () => headSlot.replaceChildren(h("div", { class: "row between" },
    h("h1", { class: "h1", style: { margin: "0" } }, fmt.month(month)),
    h("div", { class: "row", style: { gap: "0" } },
      h("button", { class: "iconbtn", "aria-label": "Vorheriger Monat", onclick: () => { month = new Date(month.getFullYear(), month.getMonth() - 1, 1); day = null; drawAll(); } }, "‹"),
      h("button", { class: "iconbtn", "aria-label": "Nächster Monat", onclick: () => { month = new Date(month.getFullYear(), month.getMonth() + 1, 1); day = null; drawAll(); } }, "›"))));
  const drawCal = () => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7;
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const cells = ["M", "D", "M", "D", "F", "S", "S"].map((d, i) => h("span", { class: "wd", "aria-hidden": "true", title: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"][i] }, d));
    for (let i = 0; i < offset; i++) cells.push(h("span"));
    for (let d = 1; d <= days; d++) {
      const date = new Date(month.getFullYear(), month.getMonth(), d);
      const key = dayKey(date), list = byDay[key] || [];
      const firstFeeling = list.slice().sort((a, b) => a.createdAt - b.createdAt).flatMap((e) => e.feelings)[0];
      const dot = list.length ? (firstFeeling ? h("i", { style: { background: CORE[firstFeeling.core].color } }) : h("i", { class: "nn" })) : null;
      const isToday = key === dayKey(now);
      cells.push(h("button", { class: "d" + (isToday ? " today" : ""), "aria-pressed": day === key ? "true" : "false",
        "aria-label": `${fmt.long(date)}${list.length ? `, ${list.length} ${list.length === 1 ? "Eintrag" : "Einträge"}` : ", kein Eintrag"}`,
        onclick: () => { day = day === key ? null : key; drawCal(); drawList(); } }, String(d), dot));
    }
    calSlot.replaceChildren(h("div", { class: "cal" }, cells));
  };
  const drawList = () => {
    let list = state.entries;
    if (day) list = byDay[day] || [];
    if (filter) list = list.filter((e) => filter === "none" ? !e.feelings.length : e.feelings.some((f) => f.core === filter));
    if (query.trim()) { const q = query.trim().toLowerCase(); list = list.filter((e) => e.text.toLowerCase().includes(q) || e.feelings.some((f) => feelingLabel(f).toLowerCase().includes(q))); }
    const kids = [];
    if (filter) {
      const name = filter === "none" ? UNNAMED.name : CORE[filter].name;
      kids.push(h("div", { class: "filterbar" }, h("span", null, "Gefiltert: " + name),
        h("button", { class: "iconbtn", "aria-label": "Filter entfernen", onclick: () => { filter = null; drawList(); } }, "✕")));
    }
    if (day) kids.push(h("div", { class: "filterbar" }, h("span", null, fmt.long(new Date(list[0]?.createdAt || dayFromKey(day)))),
      h("button", { class: "iconbtn", "aria-label": "Tagesauswahl aufheben", onclick: () => { day = null; drawCal(); drawList(); } }, "✕")));
    if (!state.entries.length) kids.push(h("p", { class: "empty" }, "Noch keine Einträge. Dein erster wartet unter „Heute“."));
    else if (!list.length) kids.push(h("p", { class: "empty" }, day ? "An diesem Tag gibt es keinen Eintrag." : "Nichts gefunden."));
    list.forEach((e) => kids.push(h("button", { class: "entry", onclick: () => show(read, e.id) },
      h("div", { class: "row" }, h("b", null, fmt.short(new Date(e.createdAt))), h("span", { class: "time" }, fmt.time(new Date(e.createdAt))),
        e.feelings.length ? e.feelings.map((f) => tagEl(f)) : h("span", { class: "tag sm", style: { background: "#ECE7DF" } }, UNNAMED.name)),
      h("p", null, e.text))));
    listSlot.replaceChildren(...kids);
  };
  const drawAll = () => { drawHead(); drawCal(); drawList(); };
  const search = h("input", { class: "search", type: "search", placeholder: "Suchen nach Wort oder Gefühl", "aria-label": "Einträge durchsuchen",
    oninput: () => { query = search.value; drawList(); } });
  drawAll();
  root.append(...[headSlot, calSlot, state.entries.length ? search : null, listSlot].filter(Boolean));
  return [root, nav("Einträge")];
}
const dayFromKey = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d).getTime(); };

// Eintrag lesen, bearbeiten, löschen
function read(id) {
  const e = state.entries.find((x) => x.id === id);
  if (!e) return entries({});
  let confirmDel = false;
  const delBtn = h("button", { class: "btn danger", onclick: async () => {
    if (!confirmDel) { confirmDel = true; delBtn.textContent = "Wirklich endgültig löschen?"; delBtn.classList.add("strong"); return; }
    await vault.deleteEntry(id); state.entries = state.entries.filter((x) => x.id !== id);
    show(entries, {}); toast("Eintrag gelöscht.");
  } }, "Eintrag löschen");
  const d = new Date(e.createdAt);
  return screen("",
    back("Einträge", () => show(entries, {})),
    h("h1", null, fmt.long(d)),
    h("div", { class: "date" }, fmt.time(d) + " Uhr" + (e.updatedAt - e.createdAt > 60000 ? " · bearbeitet" : "")),
    h("div", { class: "row wrap", style: { margin: "12px 0 0" } }, e.feelings.length ? e.feelings.map((f) => tagEl(f, false)) : h("span", { class: "tag", style: { background: "#ECE7DF" } }, UNNAMED.name)),
    e.prompt ? h("p", { class: "readprompt" }, "Impuls: " + e.prompt) : null,
    h("div", { class: "readtext" }, e.text),
    h("div", { class: "grow" }),
    h("button", { class: "btn soft", onclick: () => show(editText, id) }, "Text bearbeiten"),
    h("button", { class: "btn soft", onclick: () => show(chooseFeeling, id) }, e.feelings.length ? "Gefühle ändern" : "Gefühl ergänzen"),
    delBtn);
}
function editText(id) {
  const e = state.entries.find((x) => x.id === id);
  const ta = h("textarea", { class: "write", "aria-label": "Eintrag bearbeiten" }); ta.value = e.text;
  const save = h("button", { class: "btn sm", onclick: async () => {
    if (!ta.value.trim()) return toast("Ein Eintrag braucht Text. Zum Entfernen nutze „Eintrag löschen“.");
    e.text = ta.value.trim(); e.updatedAt = Date.now(); await vault.putEntry(e); show(read, id); toast("Gespeichert.");
  } }, "Speichern");
  setTimeout(() => ta.focus({ preventScroll: true }), 50);
  return screen("", h("div", { class: "writehead" }, h("button", { class: "back", onclick: () => show(read, id) }, "‹ Abbrechen"),
    h("span", { class: "date" }, fmt.short(new Date(e.createdAt)))), ta, h("div", { class: "foot" }, h("span"), save));
}
function chooseFeeling(id) {
  const e = state.entries.find((x) => x.id === id);
  return screen("", back("Eintrag", () => show(read, id)),
    h("h1", null, "Wie ging es dir?"),
    h("p", { class: "p sm" }, "Wähle ein Grundgefühl. Deine bisherige Auswahl wird ersetzt."),
    wheelOrList((core) => show(refine, { core, mode: "edit", entryId: id, onBack: () => show(chooseFeeling, id) })),
    h("div", { class: "grow" }),
    e.feelings.length ? h("button", { class: "link", onclick: () => saveFeelings(id, [], "edit") }, "Ohne Gefühl speichern") : null);
}

// ---------- 7. Rückblick ----------
function review(days) {
  const now = Date.now(), span = days * 86400000;
  const inRange = (from, to) => state.entries.filter((e) => e.createdAt > from && e.createdAt <= to);
  const cur = inRange(now - span, now), prev = inRange(now - 2 * span, now - span);
  const count = (list) => {
    const c = Object.fromEntries(CORES.map((x) => [x.id, 0])); c.none = 0;
    list.forEach((e) => { if (!e.feelings.length) c.none++; else new Set(e.feelings.map((f) => f.core)).forEach((k) => c[k]++); });
    return c;
  };
  const c = count(cur), p = count(prev);
  const rows = CORES.map((x) => ({ id: x.id, name: x.name, color: x.color, n: c[x.id] })).concat([{ id: "none", name: UNNAMED.name, color: UNNAMED.color, n: c.none }])
    .sort((a, b) => b.n - a.n || (a.id === "none") - (b.id === "none"));
  const max = Math.max(1, ...rows.map((r) => r.n));
  const top = rows.filter((r) => r.id !== "none" && r.n > 0)[0];
  let insight = null;
  if (prev.length >= 3) {
    const diffs = CORES.map((x) => ({ x, d: c[x.id] - p[x.id] })).filter((v) => v.d > 0).sort((a, b) => b.d - a.d);
    if (diffs[0]) insight = `Du hast in den letzten ${days} Tagen öfter „${diffs[0].x.name}“ gewählt als in den ${days} Tagen davor.`;
  }
  const seg = h("div", { class: "segctl", role: "group", "aria-label": "Zeitraum" },
    [7, 30].map((d) => h("button", { "aria-pressed": d === days ? "true" : "false", onclick: () => show(review, d) }, `${d} Tage`)));
  const body = cur.length < 3
    ? [h("div", { class: "hint" }, cur.length === 0 ? `In den letzten ${days} Tagen gibt es noch keinen Eintrag. Sobald ein paar zusammenkommen, siehst du hier, welche Gefühle dich begleitet haben.`
        : `Hier gibt es erst ${cur.length === 1 ? "einen Eintrag" : "zwei Einträge"}. Ab drei Einträgen zeigt dir der Rückblick, welche Gefühle dich begleitet haben.`)]
    : [h("div", { class: "stat" }, h("div", null, h("b", null, String(cur.length)), h("small", null, cur.length === 1 ? "Eintrag" : "Einträge")),
        h("div", null, h("b", { style: { color: top ? CORE[top.id].ink : "inherit", "font-size": "1rem", "padding-top": "3px" } }, top ? top.name : "–"), h("small", null, "am häufigsten gewählt"))),
      h("div", { class: "sub" }, "Gefühle im Überblick"),
      rows.map((r) => h("button", { class: "bar", "aria-label": `${r.name}: ${r.n}. Antippen zeigt die Einträge.`, onclick: () => show(entries, { filter: r.id }) },
        h("span", { class: "n" }, r.name), h("span", { class: "track" }, h("i", { style: { width: (r.n / max * 100) + "%", background: r.color } })), h("span", { class: "c" }, String(r.n)))),
      insight ? h("div", { class: "insight" }, h("span", { "aria-hidden": "true" }, "✦"), insight) : null];
  return [screen("with-nav", h("h1", null, `Deine letzten ${days} Tage`), seg, body), nav("Rückblick")];
}

// ---------- 8. Schwere Momente ----------
function help(onBack) {
  return screen("", h("div", { class: "grow" }), h("div", { class: "col center" },
    h("div", { class: "heart", "aria-hidden": "true" }, s("svg", { width: "56", height: "56", viewBox: "0 0 24 24" },
      s("path", { d: "M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3.2 4.5 6.9 4.5c2.1 0 3.6 1.2 5.1 3 1.5-1.8 3-3 5.1-3 3.7 0 6 3.7 4.5 7.2C19.5 16.4 12 21 12 21z", fill: "#E09696" }))),
    h("h1", null, "Du bist nicht allein."),
    h("p", { class: "p" }, "Wenn es gerade zu viel ist, kannst du jederzeit mit jemandem sprechen, kostenlos und anonym, rund um die Uhr."),
    h("a", { class: "btn", href: "tel:08001110111" }, "📞 Telefonseelsorge anrufen"),
    h("div", { class: "nums" }, h("a", { href: "tel:08001110111" }, "0800 111 0 111"), " · ", h("a", { href: "tel:08001110222" }, "0800 111 0 222")),
    h("a", { class: "btn ghost", href: "tel:112" }, "Notruf 112")),
    h("div", { class: "grow" }),
    h("button", { class: "link", onclick: onBack }, "Zurück"));
}

// ---------- 9. Einstellungen ----------
function settings() {
  const hasPin = state.lock?.mode === "pin";
  const row = (label, fn, opts = {}) => h("button", { class: "srow" + (opts.danger ? " danger" : ""), onclick: fn },
    h("span", null, label, opts.small ? h("small", null, opts.small) : null), h("span", { class: "chev", "aria-hidden": "true" }, "›"));
  const toSettings = () => show(settings);
  return screen("", back("Heute", () => show(today)), h("h1", null, "Einstellungen"),
    h("div", { class: "sh" }, "Sicherheit"),
    h("div", { class: "sgroup" }, hasPin ? [
      row("PIN ändern", () => show(unlock, { title: "PIN ändern", backLabel: "Einstellungen", onBack: toSettings, onOk: () => show(pinSetup, { first: false }) })),
      row("Sperre deaktivieren", () => show(unlock, { title: "Sperre deaktivieren", backLabel: "Einstellungen", onBack: toSettings,
        onOk: async () => { await vault.removePin(); state.lock = await vault.lockInfo(); show(settings); toast("Die PIN-Sperre ist aus."); } }), { small: "Das Journal öffnet sich dann ohne PIN." }),
    ] : row("PIN einrichten", () => show(pinSetup, { first: false }), { small: "Schützt dein Journal beim Öffnen." })),
    h("div", { class: "sh" }, "Hilfe"),
    h("div", { class: "sgroup" }, row("♡ Hilfe in schweren Momenten", () => show(help, toSettings))),
    h("div", { class: "sh" }, "Daten"),
    h("div", { class: "sgroup" },
      row("Datenschutz: alles bleibt lokal", () => show(privacy, toSettings)),
      row("Journal als Datei sichern", () => show(backupExport), { small: "Verschlüsselt, ohne Server" }),
      row("Sicherung wiederherstellen", () => show(backupImport)),
      isStandalone() ? null : row("Zum Home-Bildschirm hinzufügen", () => show(installHint, false)),
      row("Alle Daten löschen", () => show(deleteAll, toSettings), { danger: true })),
    h("div", { class: "grow" }),
    h("div", { class: "ver" }, `Gefühls-Journal · Version ${VERSION}`, h("br"), "Komplett gebaut von einem Grok-Bot-Team, ohne menschliche Hand.", h("br"),
      h("a", { href: REPO_URL, target: "_blank", rel: "noopener noreferrer" }, "Quellcode auf GitHub")));
}

function privacy(onBack) {
  return screen("", back("Zurück", onBack), h("h1", null, "Datenschutz"),
    h("div", { class: "prose" },
      h("p", null, h("b", null, "Alles, was du schreibst, bleibt nur auf deinem Gerät.")),
      h("p", null, "Das Gefühls-Journal hat kein Konto, keine Cloud und keinen Server. Deine Einträge, Gefühle und Entwürfe werden ausschließlich im Speicher dieses Browsers abgelegt, verschlüsselt mit AES-256. Hast du eine PIN eingerichtet, ist der Schlüssel zusätzlich mit deiner PIN geschützt."),
      h("p", null, "Die App lädt nach dem ersten Öffnen keine Inhalte mehr nach außer Updates der App selbst von GitHub Pages. Es gibt keine Analyse, keine Werbung, keine Cookies und keine externen Schriften. Eine Sicherheitsregel im Browser verhindert, dass die App Daten an andere Adressen sendet."),
      h("h2", null, "Was das für dich bedeutet"),
      h("ul", null, h("li", null, "Löschst du die Browserdaten oder die App, sind deine Einträge weg."),
        h("li", null, "Vergisst du die PIN, kann niemand die Einträge wiederherstellen."),
        h("li", null, "Mit „Journal als Datei sichern“ kannst du selbst eine verschlüsselte Sicherung anlegen. Wo du sie speicherst, entscheidest du.")),
      h("p", null, "Beim Laden der Seite sieht GitHub als Anbieter von GitHub Pages technisch bedingt deine IP-Adresse, wie bei jeder Website. Deine Einträge sieht dabei niemand.")));
}

// Sicherung als Datei
function backupExport() {
  const p1 = h("input", { class: "field normal", type: "password", id: "bp1", autocomplete: "new-password" });
  const p2 = h("input", { class: "field normal", type: "password", id: "bp2", autocomplete: "new-password" });
  const msg = h("div", { "aria-live": "polite" });
  const btn = h("button", { class: "btn", onclick: async () => {
    if (p1.value.length < 6) return msg.replaceChildren(h("div", { class: "err" }, "Das Passwort braucht mindestens 6 Zeichen."));
    if (p1.value !== p2.value) return msg.replaceChildren(h("div", { class: "err" }, "Die Passwörter stimmen nicht überein."));
    btn.disabled = true; msg.replaceChildren(h("p", { class: "p sm" }, "Sicherung wird erstellt …"));
    const text = await vault.exportBackup(p1.value);
    const name = `gefuehlsjournal-sicherung-${new Date().toISOString().slice(0, 10)}.json`;
    const file = new File([text], name, { type: "application/json" });
    let done = false;
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: "Gefühls-Journal Sicherung" }); done = true; } catch (_) {}
    }
    if (!done) {
      const url = URL.createObjectURL(file);
      const a = h("a", { href: url, download: name }); document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }
    btn.disabled = false;
    msg.replaceChildren(h("div", { class: "okmsg" }, `Sicherung mit ${state.entries.length} ${state.entries.length === 1 ? "Eintrag" : "Einträgen"} erstellt.`));
  } }, "Sicherung erstellen");
  return screen("", back("Einstellungen", () => show(settings)), h("h1", null, "Journal als Datei sichern"),
    h("p", { class: "p" }, "Die Datei ist mit einem Passwort verschlüsselt, das du hier festlegst. Ohne dieses Passwort lässt sie sich nicht öffnen. Bewahre die Datei dort auf, wo du sie haben möchtest."),
    h("label", { class: "sub", for: "bp1" }, "Passwort für die Sicherung"), p1,
    h("label", { class: "sub", for: "bp2" }, "Passwort wiederholen"), p2, msg,
    h("div", { class: "grow" }), btn);
}
function backupImport() {
  const file = h("input", { class: "field normal", type: "file", id: "bf", accept: "application/json,.json" });
  const pass = h("input", { class: "field normal", type: "password", id: "bpw", autocomplete: "current-password" });
  const msg = h("div", { "aria-live": "polite" });
  const btn = h("button", { class: "btn", onclick: async () => {
    if (!file.files[0]) return msg.replaceChildren(h("div", { class: "err" }, "Bitte wähle zuerst eine Sicherungsdatei."));
    btn.disabled = true; msg.replaceChildren(h("p", { class: "p sm" }, "Wird wiederhergestellt …"));
    try {
      const n = await vault.importBackup(await file.files[0].text(), pass.value);
      state.entries = await vault.allEntries();
      msg.replaceChildren(h("div", { class: "okmsg" }, n ? `${n} ${n === 1 ? "Eintrag" : "Einträge"} wiederhergestellt.` : "Alle Einträge aus der Datei waren schon da."));
    } catch (e) {
      msg.replaceChildren(h("div", { class: "err" }, e.message === "bad-pass" ? "Das Passwort passt nicht zu dieser Datei." : "Das ist keine Sicherung des Gefühls-Journals."));
    }
    btn.disabled = false;
  } }, "Wiederherstellen");
  return screen("", back("Einstellungen", () => show(settings)), h("h1", null, "Sicherung wiederherstellen"),
    h("p", { class: "p" }, "Einträge aus der Datei werden zu deinem Journal hinzugefügt. Vorhandene Einträge bleiben erhalten."),
    h("label", { class: "sub", for: "bf" }, "Sicherungsdatei"), file,
    h("label", { class: "sub", for: "bpw" }, "Passwort der Sicherung"), pass, msg,
    h("div", { class: "grow" }), btn);
}

// ---------- Sperre im Hintergrund, verdeckte Vorschau ----------
let hiddenAt = 0;
document.addEventListener("visibilitychange", () => {
  if (document.hidden) { hiddenAt = Date.now(); document.body.classList.add("covered"); return; }
  document.body.classList.remove("covered");
  if (state.lock?.mode === "pin" && vault.isUnlocked() && Date.now() - hiddenAt > LOCK_AFTER_MS) {
    vault.lock(); state.entries = []; show(unlock);
  }
});
window.addEventListener("pagehide", () => document.body.classList.add("covered"));
window.addEventListener("pageshow", () => document.body.classList.remove("covered"));

// Tastatur: sichtbare Höhe nachführen, damit das Textfeld nicht verdeckt wird
if (window.visualViewport) {
  const fit = () => document.documentElement.style.setProperty("--vvh", window.visualViewport.height + "px");
  visualViewport.addEventListener("resize", fit); fit();
}

window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); state.installEvt = e; });

// Service Worker: offline und automatische Updates
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then((reg) => {
    const offer = (w) => toast("Eine neue Version ist da.", { label: "Aktualisieren", fn: () => w.postMessage("skipWaiting") });
    if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
    reg.addEventListener("updatefound", () => {
      const w = reg.installing;
      w?.addEventListener("statechange", () => { if (w.state === "installed" && navigator.serviceWorker.controller) offer(w); });
    });
    document.addEventListener("visibilitychange", () => { if (!document.hidden) reg.update().catch(() => {}); });
  }).catch(() => {});
  let reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => { if (!reloading) { reloading = true; location.reload(); } });
}

boot();
