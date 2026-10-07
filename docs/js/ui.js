// Kleine DOM-Helfer. Keine Inline-Styles im HTML (CSP), Farben werden per CSSOM gesetzt.
const SVGNS = "http://www.w3.org/2000/svg";

export function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  applyAttrs(el, attrs);
  append(el, kids);
  return el;
}
export function s(tag, attrs, ...kids) {
  const el = document.createElementNS(SVGNS, tag);
  applyAttrs(el, attrs, true);
  append(el, kids);
  return el;
}
function applyAttrs(el, attrs, svg) {
  if (!attrs) return;
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === "class") el.setAttribute("class", v);
    else if (k === "style") for (const [p, val] of Object.entries(v)) el.style.setProperty(p, val);
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
    else if (k === "text") el.textContent = v;
    else if (!svg && (k === "value" || k === "disabled" || k === "checked")) el[k] = v;
    else el.setAttribute(k, v === true ? "" : v);
  }
}
function append(el, kids) {
  for (const k of kids.flat(Infinity)) {
    if (k === null || k === undefined || k === false) continue;
    el.append(k instanceof Node ? k : document.createTextNode(String(k)));
  }
}

let toastTimer;
export function toast(msg, action) {
  document.querySelectorAll(".toast").forEach((t) => t.remove());
  const t = h("div", { class: "toast", role: "status" }, h("span", null, msg),
    action ? h("button", { onclick: () => { t.remove(); action.fn(); } }, action.label) : null);
  document.body.append(t);
  clearTimeout(toastTimer);
  if (!action) toastTimer = setTimeout(() => t.remove(), 3200);
}

const DF = new Intl.DateTimeFormat("de-DE", { weekday: "long", day: "numeric", month: "short" });
const DS = new Intl.DateTimeFormat("de-DE", { weekday: "short", day: "numeric", month: "short" });
const DL = new Intl.DateTimeFormat("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const TM = new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit" });
const MY = new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric" });
export const fmt = {
  today: (d) => DF.format(d),
  short: (d) => DS.format(d),
  long: (d) => DL.format(d),
  time: (d) => TM.format(d),
  month: (d) => MY.format(d),
};
export const dayKey = (t) => { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
export const uid = () => Date.now().toString(36) + "-" + Array.from(crypto.getRandomValues(new Uint8Array(6)), (b) => b.toString(16).padStart(2, "0")).join("");
