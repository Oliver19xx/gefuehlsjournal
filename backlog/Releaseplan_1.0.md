# Gefühls-Journal – Releaseplan bis Version 1.0.0

Stand: 08.10.2026, 08:15 Uhr · Owner: Product Owner (Grok Bot) · Grundlage: [Backlog MVP v0.2](Backlog_MVP_v0.2.md), [Testbericht v0.1.0](../review/Testbericht_App_v0.1.0.md), [UX-Review](../flows/review/UX-Review_App_v0.1.0.md), [Design-Review](../design/review/Design-Review_App_v0.1.0.md)

## Wann ist die App fertig? (Definition von 1.0.0)
1. Alle Must-Stories aus Backlog v0.2 stehen auf ✔ und sind vom Tester abgenommen.
2. Keine offenen Fehler mit hoher oder mittlerer Priorität aus Testbericht und Reviews.
3. Ein Durchlauf auf echten Geräten ist bestanden: iPhone mit Safari (installiert und im Browser) und Android mit Chrome, nach der Checkliste unten.
4. Versionsnummer 1.0.0, Changelog und README sind aktuell; die Live-Seite zeigt 1.0.0 mit Grok-Bot-Hinweis.

## Ausgangslage (08.10., morgens)
- Live: v0.1.0. Bisher nur in iPhone-Emulation getestet.
- Offen: 10 Fehler aus dem Testbericht (T1 bis T3 hoch, T4 bis T8 mittel, T9 und T10 niedrig), dazu UX- und Design-Review und Anhang A.
- Dev hat v0.1.1 angefangen (Zoom und Kontextmenü, Anruf-Buttons, Anhang A, Teile der Fehler); noch nicht veröffentlicht.

## Phasen

### Phase 1 · Release 0.1.1 · Dev
Alles in dieser Reihenfolge, als ein Release:
1. T1 Sicherung bei großem Journal (Datenverlust-Risiko, zuerst).
2. T2 Neuladen beim ersten Öffnen.
3. T3 Wartezeit nach US-1.5 (30 s, dann verdoppeln, maximal 15 min).
4. US-7.1 App-Verhalten (Doppeltipp-Zoom, Kontextmenü, Markieren, 16-Pixel-Eingaben).
5. T4 bis T8 inklusive aller Lücken aus T7, Datumsregel E9, Datenschutzsatz und PIN-Vorschlag 6 Ziffern aus T8.
6. UX-Review: Button "Weiter mit …", Anruf-Buttons ab 44 Pixeln; Design-Review: doppelte Tags, übrige Kleinigkeiten.
7. Anhang A aus Backlog v0.2 in `data.js`.
8. T9 und T10.
Fertig, wenn veröffentlicht, Changelog ergänzt und Dev im Team-Chat meldet, welche Punkte erledigt sind.

### Phase 2 · Regressionstest 0.1.1 · Tester
- Kompletter Durchlauf gegen Backlog v0.2 und Testbericht, Ergebnis als `review/Testbericht_App_v0.1.1.md`.
- Product Owner setzt danach den Status im Backlog.
- Findet der Tester neue Fehler mit hoher oder mittlerer Priorität, folgt 0.1.2 nach demselben Muster.

### Phase 3 · Gerätetest · Oliver (etwa 20 Minuten, mit Android etwa 25)
Das Team hat keine echten Geräte. Der Gerätetest ist der einzige Schritt, bei dem ein Mensch die App bedient; gebaut und geändert wird weiterhin nur vom Team. Checkliste (Tester ergänzt sie bei Bedarf):
**A · iPhone, Safari im Browser (ca. 5 Minuten)**
1. Seite in Safari öffnen, "Los geht's", PIN mit 6 Ziffern einrichten. Die Seite lädt dabei nicht neu.
2. Bei der PIN schnell mehrmals dieselbe Ziffer tippen: Es wird nicht gezoomt, nichts wird markiert, kein Menü erscheint. Einen Button lange drücken: kein Kontextmenü.
3. Einen kurzen Eintrag direkt schreiben und speichern.

**B · iPhone, installiert (ca. 12 Minuten)**
4. Zum Home-Bildschirm hinzufügen, von dort öffnen: Vollbild ohne Browserleiste, App-Icon passt. Bitte melden: Fragt die installierte App nach der PIN aus Schritt 1 und zeigt den Eintrag aus Schritt 3, oder beginnt sie neu mit "Los geht's"? (Auf dem iPhone haben installierte Web-Apps in der Regel einen eigenen Speicher, getrennt von Safari. Dann müsste der Hinweis zum Installieren davor warnen, vorher in Safari zu schreiben.)
5. Einen Eintrag über das Rad mit zwei Gefühlen aus verschiedenen Grundgefühlen schreiben. Beim Schreiben verdeckt die Tastatur weder Text noch "Fertig". In der Schreibfläche lässt sich Text weiterhin lange drücken, markieren und kopieren.
6. Einen Eintrag direkt schreiben und ein Gefühl nachtragen.
7. Mit zwei Fingern in einen Screen hineinzoomen: Das muss weiterhin gehen (Barrierefreiheit).
8. In eine andere App wechseln: Im App-Umschalter ist kein Eintragstext zu sehen. Mehr als 1 Minute warten und zurückkehren: Die PIN wird verlangt.
9. In den Einstellungen "Journal sichern": Das Passwortfeld zoomt beim Antippen nicht hinein. Der Teilen-Dialog erscheint, die Datei lässt sich in "Dateien" speichern.
10. "Sicherung wiederherstellen" mit genau dieser Datei aus "Dateien": Die Datei lässt sich auswählen, die App zeigt die Zahl der Einträge und fragt nach Ersetzen oder Ergänzen.
11. "Hilfe in schweren Momenten": Ein Tipp auf eine Nummer öffnet den Anruf-Dialog (abbrechen genügt).

**C · Android mit Chrome, falls vorhanden (ca. 5 Minuten)**
12. Schritte 1, 2, 4, 5 und 9 in Kurzform; bei Schritt 4 erscheint statt der iPhone-Anleitung der Button "Jetzt installieren".

**D · Nach dem Release 1.0.0 (1 Minute, gehört zu Phase 4)**
13. Die installierte App öffnen, einen Entwurf anfangen: Der Hinweis "Eine neue Version ist da" erscheint, nach "Aktualisieren" zeigt die App 1.0.0, und der Entwurf ist noch da.

Ergebnis: kurze Rückmeldung im Team-Chat, gern mit Screenshot bei Problemen.

### Phase 4 · Release 1.0.0 · Dev, Tester, Product Owner
- Dev behebt, was der Gerätetest findet, erhöht auf 1.0.0 und ergänzt den Changelog.
- Tester macht einen kurzen Abschlusstest auf der Live-Seite.
- Product Owner setzt alle Stories auf ✔, schließt das Backlog ab und meldet Oliver die Fertigstellung.

## Zeitrahmen (Schätzung)
| Phase | Ziel |
|---|---|
| 1 · Release 0.1.1 | heute (08.10.) bis etwa 11 Uhr |
| 2 · Regressionstest | heute bis etwa 12 Uhr |
| 3 · Gerätetest durch Oliver | sobald Oliver Zeit hat, ideal heute Nachmittag |
| 4 · Release 1.0.0 | etwa 2 Stunden nach dem Gerätetest, Ziel heute Abend |

Die Zeiten sind Schätzungen. Risiko: Safari verhält sich auf echten Geräten anders als in der Emulation; dann kommt eine zusätzliche Runde 0.1.2 dazu, und 1.0.0 rutscht auf morgen.

## Zuständigkeiten
- **Product Owner:** Plan, Prioritäten, Entscheidungen, Backlog-Status, Abnahme.
- **Dev:** alle Code-Änderungen und Releases in `docs/`.
- **Tester:** Regressionstests, Testberichte, Gerätetest-Checkliste.
- **UX und UI:** Prüfen der Umsetzung ihrer Review-Punkte in 0.1.1; keine neuen Features bis 1.0.0.

## Nach 1.0.0 (nicht Teil der Fertigstellung)
Ideen aus "Nicht in v1" im Backlog, z. B. Erinnerungen, PDF-Export, Krisennummern für Österreich und die Schweiz.
