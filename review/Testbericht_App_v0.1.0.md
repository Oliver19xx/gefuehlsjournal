# Testbericht App v0.1.0 (Tester)

Stand: 07.10.2026, 23:20 Uhr · Getestet: Live-App [oliver19xx.github.io/gefuehlsjournal](https://oliver19xx.github.io/gefuehlsjournal/) gegen `backlog/Backlog_MVP_v0.2.md`
Methode: automatisierter Durchlauf in Chrome mit iPhone-SE- und iPhone-13-Emulation (Touch, 375 × 667 bzw. 390 × 844) plus Code-Review von `docs/`. **Nicht** auf echten Geräten getestet; Safari-spezifisches (Doppeltipp-Zoom, Tastatur, Datenlöschung nach Inaktivität) bleibt für einen Gerätetest offen.

Punkte, die schon im [Design-Review](../design/review/Design-Review_App_v0.1.0.md) oder [UX-Review](../flows/review/UX-Review_App_v0.1.0.md) stehen, wiederhole ich nicht.

## Bestanden

- Netzwerk (US-1.3, DoD): Während eines kompletten Durchlaufs gab es nur Anfragen an `https://oliver19xx.github.io`. CSP im `index.html` ist gesetzt.
- Offline: Neuladen ohne Netz startet die App normal (Service Worker).
- US-7.2: Grok-Bot-Hinweis und "Version 0.1.0" sind auf dem ersten Screen auf dem iPhone SE ohne Scrollen sichtbar.
- US-2.1: Rad und "Lieber direkt schreiben" sind auf dem iPhone SE ohne Scrollen sichtbar.
- PIN einrichten, Abweichung beim Wiederholen, Entsperren, Wartezeit bleibt nach Neuladen bestehen.
- Eintrag über Rad und über direktes Schreiben speichern, Gefühl nachtragen, Kalender, Eintrag lesen.

## Fehler

Priorität: **Hoch** = Datenverlust, Sicherheit oder blockiert Nutzung; **Mittel** = Abnahmekriterium nicht erfüllt; **Niedrig** = Feinschliff.

### T1 · Hoch · Sicherung bricht bei größerem Journal ab (US-6.4)
**Nachstellen:** Journal mit 300 Einträgen à ca. 1.500 Zeichen (rund 470 KB), Einstellungen, "Journal als Datei sichern", Passwort zweimal, "Sicherung erstellen".
**Ergebnis:** Keine Datei. Konsole: `Maximum call stack size exceeded`. Der Button bleibt deaktiviert, die Meldung bleibt auf "Sicherung wird erstellt …" stehen (Screenshot `testbericht_v0.1.0_sicherung.png`).
**Ursache:** `b64()` in `vault.js` nutzt `String.fromCharCode(...u8)`; der Spread übergibt jedes Byte als einzelnes Argument. In Safari liegt die Argumentgrenze niedriger als in Chrome, dort dürfte es schon früher brechen.
**Vorschlag:** In Blöcken kodieren (z. B. 32 KB pro `fromCharCode`-Aufruf) und den Export in `try/catch` mit Fehlermeldung und wieder aktivem Button. Da die Sicherung der einzige Schutz gegen Datenverlust ist, gehört das vor alles andere.

### T2 · Hoch · Beim allerersten Öffnen lädt die Seite nach knapp 1 Sekunde neu und wirft aus der PIN-Einrichtung (US-1.1)
**Nachstellen:** Seite frisch öffnen (ohne Service Worker), sofort "Los geht's" tippen.
**Ergebnis:** Nach ca. 0,9 s springt die App zurück auf "Dein Raum. Nur für dich."; schon getippte Ziffern sind weg.
**Ursache:** `sw.js` ruft beim Aktivieren `clients.claim()` auf, das löst `controllerchange` aus, und `app.js` lädt darauf immer neu, auch wenn vorher gar kein Service Worker aktiv war.
**Vorschlag:** Nur neu laden, wenn vorher schon ein Controller da war bzw. die Nutzerin "Aktualisieren" getippt hat.

### T3 · Hoch · Wartezeit nach Fehlversuchen weicht ab und hat keine Obergrenze (US-1.5)
**Soll:** Nach 5 Fehlversuchen 30 s, danach bei **jedem** weiteren Fehlversuch doppelt so lang, maximal 15 min.
**Ist:** Nach 5 Fehlversuchen 1 min, danach wieder 5 Versuche, dann 2, 4, 8 … Minuten **ohne Obergrenze** (nach 10 Runden über 8 Stunden, danach Tage). Getestet: 5 × falsche PIN zeigt "Bitte warte noch 1 Minute".

### T4 · Mittel · Neue Einträge werden als "bearbeitet" angezeigt (US-4.2)
**Nachstellen:** Direkt schreiben, länger als 1 Minute schreiben, "Fertig", Eintrag öffnen.
**Ergebnis:** "23:14 Uhr · bearbeitet", obwohl nie bearbeitet.
**Ursache:** `createdAt` ist der Beginn des Schreibens, `updatedAt` der Speicherzeitpunkt; ab 60 s Unterschied gilt der Eintrag als bearbeitet. Folge: Ein Entwurf, der Montag begonnen und Donnerstag beendet wird, landet im Kalender auf Montag.
**Vorschlag:** Getrenntes Feld `editedAt`, das nur beim Bearbeiten gesetzt wird, und "bearbeitet am …" mit Datum wie im AK. @Product Owner: festlegen, ob Beginn oder Speichern des Eintrags zählt.

### T5 · Mittel · "PIN vergessen" bietet keine Wiederherstellung aus der Sicherung (US-1.4)
Der Screen zeigt nur "Nochmal versuchen" und "Zurücksetzen". Wiederherstellen geht technisch auch nur bei entsperrtem Journal. Vorschlag: Nach dem Zurücksetzen direkt "Sicherung einspielen" anbieten und das auf dem Screen erklären.

### T6 · Mittel · Wiederherstellen fragt nicht nach Ersetzen oder Ergänzen (US-6.4)
Die App ergänzt immer und zeigt vorher keine Anzahl. Außerdem werden importierte Einträge nicht geprüft: Ein Eintrag mit unbekanntem Grundgefühl lässt Kalender und Liste abstürzen (`CORE[f.core]` ist dann `undefined`).

### T7 · Mittel · Abnahmekriterien als ✔ markiert, aber nicht umgesetzt
- US-1.1: Die PIN-Warnung wird nur angezeigt, nicht bestätigt.
- US-3.2: Kein sofortiges Speichern beim Wechsel in den Hintergrund (nur 500 ms nach der letzten Eingabe); auf "Heute" gibt es "Entwurf fortsetzen", aber kein "Verwerfen".
- US-3.3: Schließen (X) mit Text fragt nicht "Entwurf behalten" oder "Verwerfen", sondern behält still.
- US-4.1: Leerer Zustand hat anderen Text und keinen Button; kein Umschalter "Als Liste anzeigen" in den Einträgen.
- US-5.2: Tippen auf ein Gefühl im Rückblick filtert über **alle** Einträge statt über den gewählten Zeitraum.
- US-2.4 (schon ◐): Mehrere Gefühle gehen nur innerhalb eines Grundgefühls, nicht über verschiedene hinweg.

### T8 · Mittel · Datenschutztext verspricht mehr Schutz, als ohne PIN besteht
Ohne PIN liegt der Schlüssel unverschlüsselt direkt neben den Daten in IndexedDB; "verschlüsselt mit AES-256" stimmt formal, schützt aber nicht. Vorschlag für den Text: "Ohne PIN kann jede Person mit Zugriff auf dein entsperrtes Gerät die Einträge lesen." Zusätzlich: Eine 4-stellige PIN hat nur 10.000 Möglichkeiten; wer die Browserdaten kopiert, kann sie trotz PBKDF2 offline durchprobieren. Empfehlung: 6 Ziffern als Standard vorschlagen.

### T9 · Niedrig · "Alle Daten löschen" kann hängen, wenn die App zweimal offen ist (US-6.3, nur Code-Review)
Ist das Journal gleichzeitig installiert und im Browser-Tab offen, blockiert die zweite Verbindung `deleteDatabase`. `wipe()` wartet dann nicht, lädt neu, und der Neustart hängt hinter der blockierten Löschung. Vorschlag: `db.onversionchange = () => db.close()` in `open()`.

### T10 · Niedrig · Letzte Tastenanschläge können beim automatischen Sperren verloren gehen (nur Code-Review)
Läuft der 500-ms-Speicher-Timer erst nach dem Sperren, ist der Schlüssel schon weg und `saveDraft` wirft einen Fehler. Behebt sich mit dem sofortigen Speichern beim Wechsel in den Hintergrund (T7, US-3.2).

## Für den Gerätetest offen
Doppeltipp-Zoom und Kontextmenü (US-7.1, `touch-action` fehlt laut Code noch), Tastatur über "Fertig", Vollbild nach Installation, Teilen-Dialog der Sicherung auf iOS, Verhalten nach mehreren Tagen ohne Nutzung im nicht installierten Safari.
