# Review Backlog MVP v0.1 (Tester)

Stand: 07.10.2026 · Geprüft: `backlog/Backlog_MVP_v0.1.md` gegen `flows/README.md` (Wireframes v0.1) und `design/v0.2/screens_v0.2.png`

Priorität: **Hoch** = blockiert Entwicklung oder Test, **Mittel** = führt sonst zu Rückfragen, **Niedrig** = Feinschliff.

## 1. Widersprüche zwischen Backlog, Flows und Design

| # | Prio | Story | Backlog sagt | Flows/Design zeigen | Vorschlag |
|---|---|---|---|---|---|
| W1 | Hoch | US-5.1 | Zeiträume "letzte 7 Tage" und "letzte 30 Tage" (rollierend) | Umschalter "Woche / Monat", Titel "Dein Oktober" (Kalendermonat) | Eine Variante festlegen und im AK genau definieren (rollierend oder Kalenderwoche/-monat, Wochenstart Montag). |
| W2 | Hoch | US-5.1 / US-6.2 | "Kein automatisches Auswerten von Texten" | Rückblick zeigt Hinweis "Nach Spaziergängen hast du oft Geborgenheit gewählt", das geht nur über Textauswertung | Entweder Hinweis streichen oder eigene Story mit klarer Regel (lokal, welche Daten, welche Formulierungen). Aktuell nicht testbar. |
| W3 | Hoch | US-2.3 / US-2.4 | Mehrfachauswahl ist eigene Should-Story erst in Sprint 3, US-2.3 speichert "die feinste gewählte Stufe" (Einzahl) | Screen 3 zeigt Mehrfachauswahl als Kernverhalten ("Mehrere Antworten sind okay") | Entscheiden, ob Mehrfachauswahl in Sprint 1 gehört. Außerdem klären: zählt "bis zu 3" pro Eintrag über mehrere Grundgefühle hinweg oder nur innerhalb eines Grundgefühls? Was passiert beim 4. Tipp? |
| W4 | Hoch | E2 / US-2.2 | Vorschlag Willcox-Rad | Design-Rad: Freude, Geborgenheit, Überraschung, Trauer, Angst, Wut. "Überraschung" gibt es bei Willcox nicht (dort u. a. "kraftvoll"/Powerful) | Gefühlsmodell final entscheiden und die komplette Begriffsliste für alle 3 Ebenen als Anhang ins Backlog, sonst sind US-2.2, 2.3 und 3.1 nicht abnehmbar. |
| W5 | Mittel | US-2.1 | Beide Wege "gleichwertig dargestellt" | Rad groß im Zentrum, "Lieber direkt schreiben" als kleinerer Sekundär-Button | AK an Design anpassen (z. B. "beide Wege ohne Scrollen sichtbar und mit einem Tipp erreichbar") oder Design ändern. "Gleichwertig" ist so nicht prüfbar. |
| W6 | Mittel | US-6.2 | Krisenhilfe nur in den Einstellungen | Flows: "über das Menü und als sanfter Hinweis"; Design Screen 8 hat "Zurück zum Schreiben" | Alle Einstiegspunkte im AK auflisten. Wann erscheint der "sanfte Hinweis", wenn Texte nicht ausgewertet werden (z. B. nach Wahl bestimmter Gefühle)? |
| W7 | Mittel | Epic 6 | US-6.1 bis 6.3 brauchen einen Einstellungs-Screen | Weder Wireframes noch Design haben Einstellungen, die Navigation hat nur Heute / Einträge / Rückblick | Screen bei UX/UI anfragen und festlegen, wo Einstellungen erreichbar sind. |
| W8 | Mittel | US-1.1 / US-1.2 | PIN 4 bis 6 Ziffern, Datenschutz als eigener Screen nach der Sperre | Design: "Face ID oder Code", Datenschutz-Satz und Sperre auf einem Screen | Angleichen. Bei "Code" klären: nur Ziffern? Länge? |
| W9 | Mittel | US-3.3 | Bestätigung "Danke, dass du dir Zeit genommen hast" | Kein Bestätigungs-Screen im Design; nur das Chip "Eintrag gespeichert" auf Screen 5 (nur beim Weg ohne Gefühl) | Festlegen, wo und wie die Bestätigung auf beiden Wegen erscheint (Toast, Screen, Dauer). |
| W10 | Mittel | US-4.1 | Tippen auf einen Tag zeigt die Liste der Einträge | Flows: "Tippen öffnet den Eintrag"; Design zeigt Liste unter dem Kalender | Verhalten bei 1 und bei mehreren Einträgen pro Tag festlegen. Die "zusätzliche chronologische Listenansicht" fehlt im Design. |
| W11 | Niedrig | US-3.1 | "Ohne Impuls schreiben" blendet den Impuls aus | Im Design nur "Anderer Impuls" | Button im Design ergänzen oder AK streichen. |
| W12 | Niedrig | US-5.1 | Kategorie "nicht benannt" für Einträge ohne Gefühl | Fehlt im Rückblick-Design; "häufigstes Gefühl"-Kachel steht dafür nicht im Backlog | Beides angleichen. |

## 2. Akzeptanzkriterien, die so nicht eindeutig testbar sind

- **US-1.1:** "nach mehr als 1 Minute im Hintergrund": fest oder einstellbar? Gilt die Minute auch bei gesperrtem Bildschirm?
- **US-1.3:** "verschlüsselt" ohne Vorgabe. Vorschlag: Datenbank verschlüsselt, Schlüssel im Schlüsselbund des Betriebssystems (Keychain/Keystore). Wichtig: **System-Backups** (iCloud-/Google-Backup) widersprechen "keine Inhalte verlassen das Gerät". Ausschließen oder bewusst erlauben und im Datenschutz-Satz erwähnen.
- **US-1.2:** Link zur Datenschutzerklärung braucht Internet, die App soll aber voll offline laufen. Erklärung zusätzlich in der App hinterlegen.
- **US-3.1, US-3.3, US-5.1:** "sanft", "warm", "freundlich", "wertfrei" sind Geschmackssache. Vorschlag: feste, vom PO freigegebene Texte als Anhang, AK prüft "zeigt Text aus Liste X".
- **US-3.2:** "ohne Ablenkung" streichen oder konkretisieren. Autospeicher-Intervall angeben (z. B. spätestens alle 5 Sekunden und bei App-Wechsel). Was passiert nach einem Absturz: Entwurf wiederherstellen?
- **US-4.1:** "Farbe des (ersten) Gefühls" bei mehreren Einträgen pro Tag: erster Eintrag des Tages oder erstes Gefühl des letzten Eintrags? Welche Farbe haben Tage, deren Einträge kein Gefühl haben?
- **US-5.1:** Wie zählt ein Eintrag mit 3 Gefühlen: dreimal (je Gefühl) oder anteilig? "Weniger als 3 Einträge" im gewählten Zeitraum oder insgesamt?

## 3. Fehlende Randfälle

- **PIN vergessen:** Bei lokaler Verschlüsselung ohne Konto heißt das Datenverlust. Braucht eine eigene Story mit klarer Warnung beim Einrichten (Hoch).
- **Falsche PIN:** Anzahl Versuche, Wartezeit, Verhalten danach.
- **Biometrie fällt weg** (neuer Fingerabdruck, Face ID deaktiviert): Rückfall auf PIN.
- **Leerer Eintrag:** Was macht "Fertig" bei leerem Text? Was passiert beim Schließen (X) mit einem angefangenen Text: verwerfen mit Rückfrage oder als Entwurf behalten?
- **Bearbeiten (US-4.3):** Bleiben Datum und Uhrzeit beim Bearbeiten erhalten? Wird "bearbeitet am" angezeigt? Kann der Impuls nachträglich geändert werden?
- **Datum und Zeitzone:** Eintrag um 23:59 beginnen und nach Mitternacht speichern; Reisen über Zeitzonen. Welcher Tag zählt?
- **Einträge für vergangene Tage** nachtragen: gewollt oder nicht? Sollte explizit drinstehen.
- **Leere Zustände:** Kalender und Liste ohne Einträge, Suche ohne Treffer.
- **Große Schrift / Screenreader am Rad:** Rad-Beschriftungen bei dynamischer Schriftgröße (DoD) brauchen eine Alternative, z. B. Liste statt Rad.
- **Alle Daten löschen (US-6.3):** Werden auch PIN und Biometrie zurückgesetzt? Was, wenn der Löschvorgang unterbrochen wird?
- **Krisennummern** gelten nur für Deutschland. Falls die App in AT/CH erscheint, Nummern je Land oder Hinweis.

## 4. Kleinigkeiten zur Release-Reihenfolge

- US-3.4 (Gefühl nachtragen) ist Must, kommt aber erst in Sprint 2. In Sprint 1 erzeugt "Lieber direkt schreiben" also Einträge ohne Gefühl. Ist okay, sollte aber bewusst so drinstehen.
- Wenn W3 entschieden wird, dass Mehrfachauswahl Kern ist, US-2.4 in Sprint 1 ziehen.
