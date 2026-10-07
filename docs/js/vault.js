// Lokaler, verschlüsselter Speicher. Alles bleibt in IndexedDB dieses Browsers.
// Ein zufälliger AES-GCM-Schlüssel (256 Bit) verschlüsselt jeden Eintrag einzeln.
// Mit PIN wird dieser Schlüssel mit einem aus der PIN abgeleiteten Schlüssel (PBKDF2-SHA-256) verpackt.
const DB_NAME = "gefuehlsjournal";
const DB_VERSION = 1;
const PBKDF2_ITERATIONS = 310000;
const enc = new TextEncoder();
const dec = new TextDecoder();

let db = null;
let dataKey = null;

function req(r) {
  return new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
}
function tx(store, mode = "readonly") { return db.transaction(store, mode).objectStore(store); }

export async function open() {
  if (db) return;
  const r = indexedDB.open(DB_NAME, DB_VERSION);
  r.onupgradeneeded = () => {
    const d = r.result;
    if (!d.objectStoreNames.contains("meta")) d.createObjectStore("meta");
    if (!d.objectStoreNames.contains("entries")) d.createObjectStore("entries", { keyPath: "id" });
  };
  db = await req(r);
  if (navigator.storage && navigator.storage.persist) { try { await navigator.storage.persist(); } catch (_) {} }
}

const getMeta = (k) => req(tx("meta").get(k));
const setMeta = (k, v) => req(tx("meta", "readwrite").put(v, k));
const delMeta = (k) => req(tx("meta", "readwrite").delete(k));

export async function lockInfo() { return (await getMeta("lock")) || null; }
export const isUnlocked = () => !!dataKey;
export function lock() { dataKey = null; }

const rand = (n) => crypto.getRandomValues(new Uint8Array(n));

async function deriveKek(pin, salt) {
  const base = await crypto.subtle.importKey("raw", enc.encode(pin), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    base, { name: "AES-GCM", length: 256 }, false, ["wrapKey", "unwrapKey"]);
}
async function newDataKey() {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
}

/** Ersteinrichtung ohne PIN. Daten sind trotzdem verschlüsselt abgelegt. */
export async function setupWithoutPin() {
  dataKey = await newDataKey();
  await setMeta("lock", { mode: "none", key: dataKey });
}
/** Ersteinrichtung mit PIN oder PIN nachträglich setzen/ändern (Journal muss entsperrt sein). */
export async function setPin(pin) {
  if (!dataKey) dataKey = await newDataKey();
  const salt = rand(16), iv = rand(12);
  const kek = await deriveKek(pin, salt);
  const wrapped = await crypto.subtle.wrapKey("raw", dataKey, kek, { name: "AES-GCM", iv });
  await setMeta("lock", { mode: "pin", salt, iv, wrapped, len: pin.length });
}
/** Sperre entfernen (Journal muss entsperrt sein). */
export async function removePin() {
  await setMeta("lock", { mode: "none", key: dataKey });
}
/** Ohne PIN: Schlüssel direkt laden. */
export async function unlockWithoutPin() {
  const l = await lockInfo();
  if (!l || l.mode !== "none") throw new Error("pin-required");
  dataKey = l.key;
}
/** Prüft die PIN. Gibt true zurück, wenn sie stimmt, und entsperrt dann. */
export async function unlockWithPin(pin) {
  const l = await lockInfo();
  try {
    const kek = await deriveKek(pin, l.salt);
    dataKey = await crypto.subtle.unwrapKey("raw", l.wrapped, kek, { name: "AES-GCM", iv: l.iv },
      { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
    return true;
  } catch (_) { return false; }
}
/** Prüft eine PIN, ohne den Zustand zu ändern. */
export async function checkPin(pin) {
  const l = await lockInfo();
  if (!l || l.mode !== "pin") return false;
  try {
    const kek = await deriveKek(pin, l.salt);
    await crypto.subtle.unwrapKey("raw", l.wrapped, kek, { name: "AES-GCM", iv: l.iv },
      { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
    return true;
  } catch (_) { return false; }
}

async function seal(obj, key = dataKey) {
  const iv = rand(12);
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(JSON.stringify(obj)));
  return { iv, ct };
}
async function open_(rec, key = dataKey) {
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: rec.iv }, key, rec.ct);
  return JSON.parse(dec.decode(pt));
}

export async function allEntries() {
  const recs = await req(tx("entries").getAll());
  const out = [];
  for (const r of recs) { try { out.push(await open_(r)); } catch (_) {} }
  return out.sort((a, b) => b.createdAt - a.createdAt);
}
export async function putEntry(entry) {
  const s = await seal(entry);
  await req(tx("entries", "readwrite").put({ id: entry.id, ...s }));
}
export async function deleteEntry(id) { await req(tx("entries", "readwrite").delete(id)); }

export async function getDraft() {
  const r = await getMeta("draft");
  if (!r) return null;
  try { return await open_(r); } catch (_) { return null; }
}
export async function saveDraft(d) { await setMeta("draft", await seal(d)); }
export async function clearDraft() { await delMeta("draft"); }

export async function getFlag(k) { return getMeta("flag:" + k); }
export async function setFlag(k, v) { return setMeta("flag:" + k, v); }

/** Löscht wirklich alles: Datenbank, Flags, Caches bleiben (enthalten nur die App selbst). */
export async function wipe() {
  dataKey = null;
  if (db) { db.close(); db = null; }
  await new Promise((res) => { const r = indexedDB.deleteDatabase(DB_NAME); r.onsuccess = r.onerror = r.onblocked = () => res(); });
  try { localStorage.clear(); sessionStorage.clear(); } catch (_) {}
}

// ---------- Sicherung als Datei (verschlüsselt mit eigenem Passwort) ----------
const b64 = (u8) => btoa(String.fromCharCode(...new Uint8Array(u8)));
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function passKey(pass, salt) {
  const base = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}
export async function exportBackup(pass) {
  const entries = await allEntries();
  const salt = rand(16);
  const key = await passKey(pass, salt);
  const { iv, ct } = await seal({ entries, exportedAt: Date.now() }, key);
  return JSON.stringify({ app: "gefuehlsjournal", format: 1, kdf: "PBKDF2-SHA256", iterations: PBKDF2_ITERATIONS,
    salt: b64(salt), iv: b64(iv), data: b64(ct) });
}
/** Gibt die Zahl neu hinzugefügter Einträge zurück. Wirft "bad-file" oder "bad-pass". */
export async function importBackup(text, pass) {
  let f;
  try { f = JSON.parse(text); } catch (_) { throw new Error("bad-file"); }
  if (!f || f.app !== "gefuehlsjournal" || f.format !== 1) throw new Error("bad-file");
  let payload;
  try {
    const key = await passKey(pass, unb64(f.salt));
    payload = await open_({ iv: unb64(f.iv), ct: unb64(f.data) }, key);
  } catch (_) { throw new Error("bad-pass"); }
  const existing = new Set((await allEntries()).map((e) => e.id));
  let added = 0;
  for (const e of payload.entries || []) {
    if (!e || !e.id || existing.has(e.id)) continue;
    await putEntry(e); added++;
  }
  return added;
}
