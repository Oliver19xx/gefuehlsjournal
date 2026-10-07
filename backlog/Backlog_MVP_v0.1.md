# Gefühlsjournal – Produkt-Backlog MVP (v0.1)

Stand: 07.10.2026 · Owner: Product Owner · Status: Entwurf zur Abstimmung im Team

## Produktvision
Eine Journal-App, die Menschen mit Hilfe eines Gefühlsrads einlädt, sich zu öffnen: Erst das Gefühl benennen, dann mit einem passenden Impuls ins Schreiben kommen und über die Zeit Muster erkennen.

## Zielgruppe (MVP)
Erwachsene, die gern reflektieren würden, aber vor der leeren Seite hängen bleiben oder ihre Gefühle schwer benennen können.

## Leitprinzipien
- Vertrauen zuerst: Daten bleiben lokal auf dem Gerät, App-Sperre ab dem ersten Start.
- Kein Gefühl ist "schlecht": Sprache und Farben werten nicht.
- Niedrige Hürde: erster Eintrag in unter einer Minute, jeder Schritt überspringbar.

## Offene Entscheidungen
| # | Frage | Status |
|---|-------|--------|
| E1 | Plattform: iOS, Android, beides oder Web-App? | offen, Entscheidung im Team |
| E2 | Welches Gefühlsmodell (z. B. Feeling Wheel nach Willcox, 6 Grundgefühle)? | Vorschlag PO: Willcox, 3 Ebenen |
| E3 | Stilrichtung ruhig/warm bestätigt? | UI-Entwurf liegt vor, Bestätigung im Team offen |

## Nicht im MVP (Version 2+)
Konten und Cloud-Sync, Erinnerungen/Push, Export (PDF), Fotos/Sprachnotizen im Eintrag, Streaks und Gamification, Teilen.

---

## Epic 1: Onboarding & Datenschutz

**US-1.1 App-Sperre einrichten**
Als neue Nutzerin möchte ich beim ersten Start eine App-Sperre einrichten, damit niemand außer mir meine Einträge lesen kann.
- Beim ersten Start wird die Einrichtung einer PIN (4–6 Ziffern) angeboten; Biometrie (Face ID/Fingerabdruck) kann zusätzlich aktiviert werden, falls das Gerät es unterstützt.
- Die Einrichtung kann übersprungen und später in den Einstellungen nachgeholt werden.
- Bei jedem App-Start und nach mehr als 1 Minute im Hintergrund wird die Sperre verlangt.
- In der App-Übersicht des Betriebssystems sind keine Inhalte sichtbar (verdeckter Snapshot).
Priorität: Must · Grobschätzung: M

**US-1.2 Datenschutz-Hinweis**
Als neue Nutzerin möchte ich in einem Satz erfahren, wo meine Daten liegen, damit ich mich traue, ehrlich zu schreiben.
- Ein Screen mit genau einer Kernaussage: "Alles, was du schreibst, bleibt nur auf deinem Gerät."
- Link zur ausführlichen Datenschutzerklärung.
- Weiter-Button führt direkt zum ersten Eintrag (US-2.1).
Priorität: Must · Grobschätzung: S

**US-1.3 Lokale, verschlüsselte Speicherung**
Als Nutzerin möchte ich, dass meine Einträge verschlüsselt auf dem Gerät gespeichert werden, damit sie auch bei Verlust des Geräts geschützt sind.
- Alle Einträge werden ausschließlich lokal und verschlüsselt gespeichert.
- Die App funktioniert vollständig offline.
- Es werden keine Inhalte an Server oder Analyse-Dienste übertragen.
Priorität: Must · Grobschätzung: M

## Epic 2: Gefühlsrad

**US-2.1 Einstieg "Wie geht es dir gerade?"**
Als Nutzerin möchte ich beim Öffnen gefragt werden, wie es mir geht, und wählen können, ob ich über das Rad oder direkt schreibend starte.
- Startscreen zeigt die Frage und zwei Wege: "Gefühlsrad" und "Lieber direkt schreiben".
- Beide Wege sind gleichwertig dargestellt, keiner wird als "richtig" hervorgehoben.
Priorität: Must · Grobschätzung: S

**US-2.2 Grundgefühl wählen (Ebene 1)**
Als Nutzerin möchte ich ein Grundgefühl auf dem Rad antippen, damit ich mein Gefühl grob einordnen kann.
- Das Rad zeigt die Grundgefühle in ihren jeweiligen Farben (Farbsystem von UI).
- Antippen wählt das Gefühl aus und blendet Ebene 2 ein.
- Die Auswahl kann jederzeit zurückgenommen werden.
- Bedienbar mit Screenreader (jedes Segment hat ein Label).
Priorität: Must · Grobschätzung: L

**US-2.3 Gefühl verfeinern (Ebene 2 und 3)**
Als Nutzerin möchte ich mein Gefühl in bis zu zwei weiteren Stufen genauer benennen, damit ich besser verstehe, was in mir los ist.
- Nach Wahl eines Grundgefühls erscheinen die passenden Unterbegriffe, danach die Feinabstufungen.
- Jede Stufe ist überspringbar ("Passt so").
- Gespeichert wird die feinste gewählte Stufe inklusive der übergeordneten Stufen.
Priorität: Must · Grobschätzung: M

**US-2.4 Mehrere Gefühle wählen**
Als Nutzerin möchte ich mehr als ein Gefühl auswählen können, weil Gefühle oft gemischt sind.
- Bis zu 3 Gefühle pro Eintrag wählbar.
- Gewählte Gefühle werden als Chips angezeigt und können entfernt werden.
Priorität: Should · Grobschätzung: S

## Epic 3: Schreiben

**US-3.1 Passender Schreibimpuls**
Als Nutzerin möchte ich nach der Gefühlswahl eine sanfte Frage bekommen, die zu meinem Gefühl passt, damit ich nicht vor einer leeren Seite sitze.
- Pro Grundgefühl gibt es mindestens 5 Impulse; angezeigt wird einer, passend zur feinsten gewählten Stufe, sofern vorhanden.
- "Anderer Impuls" zeigt einen neuen; "Ohne Impuls schreiben" blendet ihn aus.
- Impulse sind wertfrei formuliert (Textliste wird separat vom PO geliefert).
Priorität: Must · Grobschätzung: M

**US-3.2 Freies Schreiben**
Als Nutzerin möchte ich ohne Ablenkung frei schreiben können.
- Schlichter Editor ohne Formatierungsleiste; der Impuls bleibt oben sichtbar.
- Kein Zeichenlimit, kein Pflichtfeld außer Text.
- Automatisches Zwischenspeichern, damit nichts verloren geht (auch bei App-Wechsel).
Priorität: Must · Grobschätzung: M

**US-3.3 Eintrag speichern**
Als Nutzerin möchte ich meinen Eintrag speichern und eine kurze, warme Bestätigung bekommen.
- Speichern legt den Eintrag mit Datum, Uhrzeit, Gefühl(en) und Impuls ab.
- Bestätigung ohne Bewertung (z. B. "Danke, dass du dir Zeit für dich genommen hast").
Priorität: Must · Grobschätzung: S

**US-3.4 Gefühl nachtragen**
Als Nutzerin, die direkt geschrieben hat, möchte ich nach dem Speichern optional ein Gefühl nachtragen, damit auch dieser Eintrag im Rückblick zählt.
- Nach dem Speichern ohne Gefühl wird das Rad als optionaler Schritt angeboten.
- "Überspringen" speichert den Eintrag ohne Gefühl.
- Gefühl kann später beim Bearbeiten ergänzt werden (US-4.3).
Priorität: Must · Grobschätzung: S

## Epic 4: Einträge

**US-4.1 Eintragsübersicht mit Kalender**
Als Nutzerin möchte ich meine Einträge in einem Kalender sehen, damit ich frühere Tage wiederfinde.
- Monatskalender; Tage mit Eintrag sind in der Farbe des (ersten) Gefühls markiert.
- Antippen eines Tages zeigt die Einträge dieses Tages als Liste.
- Zusätzlich chronologische Listenansicht.
Priorität: Must · Grobschätzung: M

**US-4.2 Eintrag lesen**
Als Nutzerin möchte ich einen früheren Eintrag vollständig lesen.
- Anzeige von Datum, Uhrzeit, Gefühl(en), Impuls und Text.
Priorität: Must · Grobschätzung: S

**US-4.3 Eintrag bearbeiten und löschen**
Als Nutzerin möchte ich Einträge bearbeiten oder löschen können.
- Text und Gefühle sind bearbeitbar.
- Löschen nur nach Bestätigung; gelöschte Einträge sind endgültig entfernt.
Priorität: Must · Grobschätzung: S

**US-4.4 Suche**
Als Nutzerin möchte ich Einträge nach Stichwort oder Gefühl durchsuchen.
- Volltextsuche über alle Einträge; Filter nach Grundgefühl.
Priorität: Could · Grobschätzung: M

## Epic 5: Rückblick

**US-5.1 Gefühlsmuster**
Als Nutzerin möchte ich sehen, welche Gefühle in einem Zeitraum häufig waren, damit ich Muster erkenne.
- Zeiträume: letzte 7 Tage, letzte 30 Tage.
- Darstellung der Grundgefühle nach Häufigkeit in ihren Farben.
- Einträge ohne Gefühl werden als eigene Kategorie "nicht benannt" gezeigt.
- Wertfreie Sprache, keine "Stimmungs-Scores".
- Bei weniger als 3 Einträgen freundlicher Hinweis statt Diagramm.
Priorität: Must · Grobschätzung: M

**US-5.2 Vom Muster zum Eintrag**
Als Nutzerin möchte ich von einem Gefühl im Rückblick zu den zugehörigen Einträgen springen.
- Antippen eines Gefühls zeigt die gefilterte Eintragsliste.
Priorität: Should · Grobschätzung: S

## Epic 6: Einstellungen & Sicherheit

**US-6.1 Sperre verwalten**
Als Nutzerin möchte ich PIN und Biometrie in den Einstellungen ändern oder deaktivieren.
- PIN ändern erfordert die alte PIN.
Priorität: Must · Grobschätzung: S

**US-6.2 Hilfe in Krisen**
Als Nutzerin in einer schweren Phase möchte ich leicht Hilfsangebote finden.
- Dauerhaft erreichbarer Punkt "Hilfe in schweren Momenten" in den Einstellungen mit Telefonseelsorge (0800 111 0 111 / 0800 111 0 222) und Notruf 112.
- Kein automatisches Auswerten von Texten.
Priorität: Must · Grobschätzung: S

**US-6.3 Alle Daten löschen**
Als Nutzerin möchte ich alle meine Daten auf einmal löschen können.
- Doppelte Bestätigung; danach ist die App im Zustand des ersten Starts.
Priorität: Must · Grobschätzung: S

---

## Definition of Done (für jede Story)
- Akzeptanzkriterien erfüllt und getestet.
- Umsetzung entspricht den finalen Screens (UI) und Flows (UX).
- Barrierefreiheit: Screenreader-Labels, ausreichende Kontraste, dynamische Schriftgröße.
- Keine Inhalte verlassen das Gerät.
- Texte auf Deutsch, wertfrei formuliert.

## Vorgeschlagene Release-Reihenfolge
1. Sprint 1: Epic 1 + US-2.1 bis 2.3 + US-3.2/3.3 (Kern-Eintrag funktioniert)
2. Sprint 2: US-3.1, 3.4, Epic 4 (ohne Suche)
3. Sprint 3: Epic 5, Epic 6, US-2.4
4. Optional: US-4.4 Suche
