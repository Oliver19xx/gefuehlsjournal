# Gefühls-Journal

> **Komplett gebaut von einem Grok-Bot-Team, ohne menschliche Hand.**
> Planung, Backlog, Flows, Design, Code, Tests und Deployment stammen von KI-Agenten (Grok Bots: Product Owner, UX, UI, Tester und Dev). Kein Mensch hat Code oder Inhalte geschrieben; Oliver hat nur die Richtung vorgegeben.

Eine Journal-App, die mit Hilfe eines Gefühlsrads einlädt, sich zu öffnen: erst das Gefühl benennen, dann mit einem passenden Impuls ins Schreiben kommen und über die Zeit Muster erkennen.

**App öffnen:** [oliver19xx.github.io/gefuehlsjournal](https://oliver19xx.github.io/gefuehlsjournal/) (immer die neueste Version von `main`)

## Die App

- **Progressive Web App** für das Handy: im Browser öffnen und über „Zum Home-Bildschirm“ installieren. Funktioniert danach komplett offline.
- **Alles bleibt auf dem Gerät.** Kein Konto, keine Cloud, kein Server, keine Analyse, keine externen Schriften oder Skripte. Eine Content-Security-Policy verbietet der App, Daten an andere Adressen zu senden.
- **Verschlüsselt:** Jeder Eintrag liegt mit AES-256-GCM verschlüsselt in IndexedDB. Mit PIN (4 bis 6 Ziffern) ist der Schlüssel zusätzlich per PBKDF2-SHA-256 (310 000 Runden) an die PIN gebunden. PIN vergessen heißt: Daten sind nicht wiederherstellbar, darauf weist die App beim Einrichten hin.
- **Sicherung als Datei:** verschlüsselt mit eigenem Passwort, ohne Server, und wieder einspielbar.
- Versionsnummer und Grok-Bot-Hinweis stehen auf dem ersten Screen und in den Einstellungen.

### Umgesetzte Stories (Backlog MVP v0.1)

| Story | Stand |
|---|---|
| US-1.1 App-Sperre | PIN 4 bis 6 Ziffern, überspringbar, Sperre nach über 1 Minute im Hintergrund, verdeckte Vorschau im App-Wechsler, wachsende Wartezeit nach 5 Fehlversuchen. Biometrie bewusst nicht in v1 (im Browser nicht verlässlich, siehe UX). |
| US-1.2 Datenschutz-Hinweis | Erster Screen plus eigene Datenschutzseite. |
| US-1.3 Lokale, verschlüsselte Speicherung | Ja, offline über Service Worker. |
| US-2.1 bis 2.4 Gefühlsrad | Rad mit Willcox-Grundgefühlen, „Als Liste anzeigen“, Ebene 2 und 3 als Chips, bis zu 3 Gefühle, jede Stufe überspringbar. |
| US-3.1 bis 3.4 Schreiben | 6 Impulse pro Grundgefühl, „Anderer Impuls“, „Ohne Impuls schreiben“, automatisches Speichern als verschlüsselter Entwurf, Gefühl nachtragen. |
| US-4.1 bis 4.4 Einträge | Monatskalender mit Farbpunkten (grauer Ring ohne Gefühl), Tagesauswahl, Liste, Lesen, Bearbeiten, Löschen mit Bestätigung, Suche. |
| US-5.1, 5.2 Rückblick | Rollierend 7 oder 30 Tage, inkl. „nicht benannt“, Hinweis unter 3 Einträgen, Vergleich nur aus gewählten Gefühlen, Antippen filtert die Einträge. |
| US-6.1 bis 6.3 Einstellungen | PIN ändern/einrichten/deaktivieren, Hilfe in schweren Momenten (Telefonseelsorge, 112), alles löschen mit Eintippen von LÖSCHEN. |

Offen für den Product Owner: Die deutschen Begriffe für Ebene 2 und 3 in `docs/js/data.js` sind ein Vorschlag von Dev nach dem Willcox-Rad, ebenso die Schreibimpulse.

### Technik

Reines HTML, CSS und JavaScript (ES-Module), keine Abhängigkeiten, kein Build-Schritt. Schriften Nunito und Noto Serif liegen lokal unter `docs/fonts/` (SIL OFL).

```
docs/
  index.html, manifest.webmanifest, sw.js
  css/app.css      Styles auf Basis von design/tokens.css
  js/app.js        Screens und Ablauf
  js/vault.js      Verschlüsselung und IndexedDB
  js/data.js       Gefühlsrad und Schreibimpulse
  js/version.js    Versionsnummer
```

Lokal starten: `cd docs && python3 -m http.server 8123`, dann `http://localhost:8123` öffnen.

**Release:** Version in `docs/js/version.js` und `CACHE_VERSION` in `docs/sw.js` erhöhen (beide gleich), Eintrag in `CHANGELOG.md`, auf `main` pushen. GitHub Pages veröffentlicht den Ordner `docs/` von `main` bei jedem Push automatisch; installierte Apps zeigen dann „Eine neue Version ist da“.

## Repo-Struktur

- `docs/` – die PWA, von GitHub Pages ausgeliefert (Dev)
- `backlog/` – Produkt-Backlog mit User Stories und Akzeptanzkriterien (Product Owner)
- `flows/` – User Flows und Wireframes (UX)
- `design/` – Farbsystem, Typografie, Screens und Tokens (UI)
- `review/` – Reviews (Tester)
