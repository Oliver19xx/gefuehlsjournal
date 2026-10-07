# UX-Review App v0.1.0

Verantwortlich: UX. Durchgeklickt am 7. Oktober 2026 auf https://oliver19xx.github.io/gefuehlsjournal/ im iPhone-Format (390 × 844, Touch). Optische Punkte stehen im Design-Review von UI und werden hier nicht wiederholt.

Was gut funktioniert: Onboarding, PIN-Einrichtung mit automatischem Weiter bei der Bestätigung, Rad mit Ebene 2 und 3 als Chips, „Gefühl nachtragen“ nach direktem Schreiben, leerer Rückblick mit freundlichem Hinweis, Einstellungen und Krisen-Screen entsprechen dem Flow. Keine Fehler in der Konsole, keine Netzwerkanfragen außerhalb von github.io.

| Nr. | Priorität | Screen | Beobachtung | Vorschlag |
|---|---|---|---|---|
| UX1 | Mittel | Genauer werden | Nach Auswahl von „enttäuscht“ heißt der zweite Button „Nur „Trauer“ speichern“. Das widerspricht der gerade getroffenen Auswahl und wirkt, als würde sie verworfen. | Button nur zeigen, solange keine Feinabstufung gewählt ist; sonst „Überspringen“ ganz ausblenden. |
| UX2 | Mittel | Schreiben | Auf dem Gerät prüfen, ob die iOS-Tastatur die untere Leiste mit „Fertig“ verdeckt. Im Emulator nicht testbar. | Leiste über `visualViewport` an die Tastatur heften oder „Fertig“ zusätzlich oben rechts anbieten. |
| UX3 | Mittel | Schwere Momente | Die einzelnen Telefonnummern sind Links mit nur 18 px Höhe. | Als zwei eigene Buttons mit mindestens 44 px, oder nur den großen Button behalten. |
| UX4 | Niedrig | Gefühl wählen | In der Mitte des Rads steht „Tippen“, die Mitte selbst ist aber nicht antippbar. | Mitte leer lassen oder Text „Wähle ein Gefühl“ unter das Rad. |
| UX5 | Niedrig | Home-Bildschirm-Hinweis | Es gibt nur „Später“, kein „Erledigt“. Wer die App gerade installiert hat, muss „Später“ drücken. | Zweiten Button „Hab ich gemacht“; in der installierten App (Standalone-Modus) den Hinweis gar nicht zeigen. |
| UX6 | Niedrig | Nach dem Speichern | Nach „Fertig“ springt die App in „Einträge“ statt zurück zu „Heute“. Das ist okay, sollte aber bewusst entschieden und im Backlog festgehalten sein. | Entscheidung PO. |
| UX7 | Niedrig | Native-Gefühl | Ergänzend zu UIs Punkten (Doppeltipp-Zoom, 16-px-Felder): langes Drücken auf Buttons öffnet in Safari ein Kontextmenü. | `-webkit-touch-callout: none` auf Buttons und Ziffernblock. |
