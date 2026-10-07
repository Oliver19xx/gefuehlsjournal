# Gefühls-Journal – Produkt-Backlog MVP (v0.2)

Stand: 07.10.2026 · Owner: Product Owner (Grok Bot) · Grundlage: Backlog v0.1, [Review des Testers](../review/Review_Backlog_v0.1.md), Flows v0.2, Design v0.3, App v0.1.0, UX- und Design-Review zu v0.1.0

> Dieses Backlog wurde, wie die ganze App, von einem Grok-Bot-Team erstellt.

## Was sich gegenüber v0.1 geändert hat
- Plattform entschieden: Progressive Web App für das Handy, ausgeliefert über GitHub Pages.
- Alle offenen Entscheidungen sind getroffen (siehe unten), alle Hoch-Punkte aus dem Review sind eingearbeitet.
- Neue Stories: PIN vergessen, falsche PIN, Sicherung als Datei, Home-Bildschirm-Hinweis, App-Verhalten ohne Browser-Effekte, Grok-Bot-Hinweis mit Version, automatische Veröffentlichung, Update-Hinweis.
- Mehrfachauswahl ist jetzt Must, Biometrie ist aus v1 gestrichen.
- Wertende Wörter wie "sanft", "warm" oder "gleichwertig" in Akzeptanzkriterien sind durch prüfbare Regeln ersetzt; verbindliche Texte stehen in `docs/js/data.js`, Korrekturen dazu im Anhang A.

## Produktvision
Eine Journal-App, die mit Hilfe eines Gefühlsrads einlädt, sich zu öffnen: erst das Gefühl benennen, dann mit einem passenden Impuls ins Schreiben kommen und über die Zeit Muster erkennen.

## Zielgruppe
Erwachsene, die gern reflektieren würden, aber vor der leeren Seite hängen bleiben oder ihre Gefühle schwer benennen können.

## Harte Vorgaben
1. **Nichts verlässt das Gerät.** Keine Anfrage an einen Server außer dem Laden der App selbst von GitHub Pages. Keine Analyse, keine CDNs, keine externen Schriften. Eine Content-Security-Policy erzwingt das.
2. **Mobile zuerst.** Die App fühlt sich installiert wie eine normale App an, nicht wie eine Website (siehe US-7.1).
3. **Grok-Bot-Hinweis und Versionsnummer** sind auf dem ersten Screen sichtbar (siehe US-7.2).
4. **Kein Gefühl ist "schlecht".** Keine Signalfarben, keine Scores, keine Streaks.

## Entscheidungen
| # | Frage | Entscheidung |
|---|-------|--------------|
| E1 | Plattform | PWA für mobile Browser, installierbar über "Zum Home-Bildschirm". Referenzgeräte: iPhone mit Safari (aktuelle und Vorversion von iOS), Android mit Chrome. |
| E2 | Gefühlsmodell | Feeling Wheel nach Willcox: Freude, Stärke, Frieden, Trauer, Angst, Wut. Ebene 2 und 3 wie in `docs/js/data.js`, mit den Korrekturen aus Anhang A. |
| E3 | Stilrichtung | Ruhig und warm, Design v0.3 ist verbindlich. |
| E4 | Mehrfachauswahl (Review W3) | Kernverhalten, Must. Bis zu 3 Gefühle pro Eintrag, auch über verschiedene Grundgefühle hinweg. |
| E5 | System-Backups (Review 2) | Keine. Daten liegen nur im Browser-Speicher (IndexedDB) und verschlüsselt. Die einzige Sicherung ist eine verschlüsselte Datei, die die Nutzerin selbst exportiert (US-6.4). Der Datenschutz-Satz bleibt deshalb wahr. |
| E6 | Biometrie | Nicht in v1, weil Face ID und Fingerabdruck im Browser nicht verlässlich nutzbar sind. Nur PIN. |
| E7 | Rückblick-Zeiträume (W1) | Rollierend: heute plus die 6 bzw. 29 Tage davor, nach lokaler Gerätezeit. |
| E8 | Hinweise im Rückblick (W2) | Nur aus gewählten Gefühlen und Datum berechnet, nie aus dem Text. |
| E9 | Eintrag für vergangene Tage | Nicht in v1. Ein Eintrag zählt für den Tag, an dem er zuerst gespeichert wurde (lokale Zeit). |
| E10 | Land der Krisennummern | v1 nur Deutschland; der Screen sagt das ausdrücklich. |

## Nicht in v1
Konten und Cloud-Sync, Biometrie, Erinnerungen und Push, PDF-Export, Fotos und Sprachnotizen, Streaks, Teilen, Einträge für vergangene Tage, Krisennummern für andere Länder.

Spalte "App": Stand laut Dev in v0.1.0. ✔ umgesetzt, ◐ bekannte Lücke aus den Reviews, ○ offen. Wo v0.2 Kriterien präzisiert (z. B. genaue Wartezeiten), muss der Tester gegen die neuen Kriterien abnehmen.

---

## Epic 1: Onboarding & Datenschutz

**US-1.1 PIN einrichten** · Must · App ✔
Als neue Nutzerin möchte ich eine PIN einrichten, damit niemand außer mir meine Einträge lesen kann.
- PIN aus 4 bis 6 Ziffern, zweimal einzugeben; bei Abweichung Hinweis und erneute Eingabe.
- Vor dem Speichern erscheint die Pflicht-Warnung "Wenn du deine PIN vergisst, können deine Einträge nicht wiederhergestellt werden" und muss bestätigt werden.
- Einrichtung ist überspringbar und in den Einstellungen nachholbar.
- Ist eine PIN gesetzt, wird sie beim Öffnen und nach mehr als 60 Sekunden im Hintergrund verlangt (fester Wert, auch bei gesperrtem Bildschirm).
- Beim Wechsel in den Hintergrund werden Inhalte sofort verdeckt.

**US-1.2 Datenschutz-Hinweis** · Must · App ✔
- Erster Screen enthält den Satz "Alles, was du schreibst, bleibt nur auf deinem Gerät."
- Die ausführliche Datenschutzerklärung ist in der App enthalten und offline lesbar.

**US-1.3 Lokale, verschlüsselte Speicherung** · Must · App ✔
- Einträge und Entwürfe liegen nur in IndexedDB, jeweils mit AES-256-GCM verschlüsselt.
- Mit PIN ist der Schlüssel per PBKDF2 an die PIN gebunden.
- Abnahme: In den Netzwerk-Werkzeugen des Browsers gibt es während einer kompletten Nutzung keine Anfrage außer an die eigene GitHub-Pages-Adresse.

**US-1.4 PIN vergessen** · Must · App ✔ · neu
Als Nutzerin, die ihre PIN vergessen hat, möchte ich verstehen, was ich tun kann.
- Auf dem Entsperren-Screen gibt es "PIN vergessen?".
- Der Screen erklärt: Ohne PIN sind die Einträge nicht lesbar. Wege: erneut versuchen, eine Sicherungsdatei einspielen (US-6.4) oder das Journal zurücksetzen.
- Zurücksetzen nur nach Eintippen von LÖSCHEN; danach Zustand wie beim ersten Start.

**US-1.5 Falsche PIN** · Must · App ✔ · neu
- Nach jeder falschen Eingabe Hinweis mit Zahl der verbleibenden Versuche bis zur Wartezeit.
- Nach 5 Fehlversuchen 30 Sekunden Wartezeit, danach bei jedem weiteren Fehlversuch doppelt so lang, maximal 15 Minuten.
- Die Wartezeit bleibt auch nach Neuladen der App bestehen.

**US-1.6 Hinweis "Zum Home-Bildschirm hinzufügen"** · Must · App ✔ · neu
Als Nutzerin möchte ich wissen, dass ich die App installieren sollte, damit meine Daten nicht vom Browser gelöscht werden.
- Erscheint einmal direkt nach dem Onboarding, wenn die App nicht installiert läuft.
- Erklärt in einem Satz, warum (Safari kann Daten nicht installierter Seiten nach einer Weile löschen), und zeigt die Schritte für iPhone bzw. Android.
- Läuft die App installiert, erscheint der Hinweis nie.
- Ist in den Einstellungen erneut aufrufbar.

## Epic 2: Gefühlsrad

**US-2.1 Einstieg "Wie geht es dir gerade?"** · Must · App ✔
- Der Screen "Heute" zeigt das Rad und den Button "Lieber direkt schreiben".
- Beide Wege sind auf einem iPhone SE (375 × 667) ohne Scrollen sichtbar und mit einem Tipp erreichbar.

**US-2.2 Grundgefühl wählen** · Must · App ✔
- Das Rad zeigt die 6 Grundgefühle aus E2 in den Farben aus Design v0.3.
- Tippen wählt ein Grundgefühl und öffnet Ebene 2.
- "Als Liste anzeigen" zeigt dieselbe Auswahl als Liste; die Liste ist die Alternative für Screenreader und große Schrift.
- Jedes Segment hat ein Screenreader-Label mit dem Gefühlsnamen.

**US-2.3 Gefühl verfeinern** · Must · App ◐
- Ebene 2 und 3 erscheinen als Chips mit mindestens 44 × 44 Pixeln Tippfläche.
- Jede Ebene ist überspringbar.
- Gespeichert wird je Gefühl der Pfad (Grundgefühl, Ebene 2, Ebene 3), so weit er gewählt wurde.
- Der Button zum Weitergehen beschreibt immer, was gespeichert wird, z. B. "Weiter mit enttäuscht"; er darf nie so klingen, als würde die Auswahl verworfen (UX-Review).

**US-2.4 Mehrere Gefühle wählen** · Must (vorher Should) · App ◐
- Bis zu 3 Gefühle pro Eintrag, auch aus verschiedenen Grundgefühlen.
- Gewählte Gefühle stehen als Chips oben und lassen sich einzeln entfernen.
- Beim Versuch, ein viertes zu wählen, passiert nichts außer dem Hinweis "Du kannst bis zu 3 Gefühle wählen".
- Jedes Gefühl erscheint höchstens einmal (Design-Review: keine doppelten Tags).

## Epic 3: Schreiben

**US-3.1 Passender Schreibimpuls** · Must · App ✔
- Angezeigt wird ein zufälliger Impuls aus der Liste des ersten gewählten Grundgefühls (`PROMPTS` in `docs/js/data.js`).
- "Anderer Impuls" zeigt einen anderen Impuls derselben Liste, nie zweimal hintereinander denselben.
- "Ohne Impuls schreiben" blendet den Impuls für diesen Eintrag aus.

**US-3.2 Freies Schreiben** · Must · App ✔
- Schreibfläche in Noto Serif, mindestens 16 Pixel Schriftgröße, keine Formatierungsleiste, kein Zeichenlimit.
- Entwurf wird spätestens 5 Sekunden nach der letzten Eingabe und sofort beim Wechsel in den Hintergrund verschlüsselt gespeichert.
- Nach einem Absturz oder Schließen wird der Entwurf beim nächsten Öffnen angeboten ("Weiterschreiben" oder "Verwerfen").
- Die Bildschirmtastatur verdeckt weder die Schreibfläche noch den Fertig-Button (auf echtem iPhone zu prüfen).

**US-3.3 Eintrag speichern** · Must · App ✔
- "Fertig" ist bei leerem Text deaktiviert.
- Schließen (X) mit Text fragt "Entwurf behalten" oder "Verwerfen".
- Nach dem Speichern erscheint auf beiden Wegen für 3 Sekunden der Text `SAVE_THANKS` aus `docs/js/data.js`.
- Gespeichert werden Text, Gefühle (falls gewählt), Impuls (falls gezeigt), Erstell-Zeitpunkt.

**US-3.4 Gefühl nachtragen** · Must · App ✔
- Nach dem Speichern ohne Gefühl erscheint das Rad als optionaler Schritt mit "Überspringen".
- In Sprint 1 von v0.1 fehlte das bewusst; ab v0.1.0 ist es da.

## Epic 4: Einträge

**US-4.1 Kalender und Liste** · Must · App ✔
- Monatskalender; ein Tag mit Einträgen zeigt einen Punkt in der Farbe des ersten Gefühls des ersten Eintrags dieses Tages, ohne Gefühl einen grauen Ring.
- Tippen auf einen Tag zeigt dessen Einträge als Liste unter dem Kalender, auch wenn es nur einer ist.
- "Als Liste anzeigen" schaltet auf eine chronologische Liste aller Einträge, neueste zuerst.
- Leerer Zustand: "Hier erscheinen deine Einträge" mit Button zum ersten Eintrag.

**US-4.2 Eintrag lesen** · Must · App ✔
- Zeigt Datum, Uhrzeit, Gefühle, Impuls und Text; bei bearbeiteten Einträgen zusätzlich "bearbeitet am …".

**US-4.3 Eintrag bearbeiten und löschen** · Must · App ✔
- Text und Gefühle sind bearbeitbar, Impuls und Erstell-Zeitpunkt nicht.
- Löschen nur nach Bestätigung, danach endgültig weg.

**US-4.4 Suche** · Could · App ✔
- Volltextsuche über entschlüsselte Einträge, nur im Speicher des Geräts; Filter nach Grundgefühl.
- Leerer Zustand: "Nichts gefunden".

## Epic 5: Rückblick

**US-5.1 Gefühlsmuster** · Must · App ✔
- Umschalter "7 Tage" und "30 Tage", rollierend nach E7.
- Balken je Grundgefühl in dessen Farbe plus "nicht benannt" für Einträge ohne Gefühl.
- Ein Eintrag mit mehreren Gefühlen zählt für jedes gewählte Grundgefühl einmal; mehrere Gefühle desselben Grundgefühls im selben Eintrag zählen einmal.
- Bei weniger als 3 Einträgen im gewählten Zeitraum erscheint statt der Balken ein Hinweis.
- Hinweise auf Muster nur nach E8, ohne Bewertung.

**US-5.2 Vom Muster zum Eintrag** · Should · App ✔
- Tippen auf ein Grundgefühl öffnet die gefilterte Eintragsliste für den Zeitraum.

## Epic 6: Einstellungen & Sicherheit

**US-6.1 PIN verwalten** · Must · App ✔
- Erreichbar über das Zahnrad auf "Heute".
- PIN einrichten, ändern (alte PIN nötig) und deaktivieren (PIN nötig).

**US-6.2 Hilfe in schweren Momenten** · Must · App ◐
- Erreichbar über die Einstellungen und das Menü im Schreib-Screen; nie automatisch eingeblendet.
- Zeigt Telefonseelsorge 0800 111 0 111 und 0800 111 0 222 sowie Notruf 112 als Buttons mit mindestens 44 Pixeln Höhe, die direkt anrufen (UX-Review: aktuell nur 18 Pixel hohe Links).
- Hinweis, dass die Nummern für Deutschland gelten.
- "Zurück zum Schreiben" führt zum offenen Entwurf zurück.

**US-6.3 Alle Daten löschen** · Must · App ✔
- Bestätigung durch Eintippen von LÖSCHEN.
- Löscht Einträge, Entwürfe, PIN, Einstellungen und Sicherungsschlüssel; danach Zustand wie beim ersten Start.
- Wird der Vorgang unterbrochen, ist beim nächsten Öffnen entweder alles gelöscht oder nichts.

**US-6.4 Sicherung als Datei und Wiederherstellung** · Must · App ✔ · neu
Als Nutzerin möchte ich mein Journal als Datei sichern, damit ich es bei Gerätewechsel oder Datenverlust zurückholen kann, ohne dass es auf einen Server muss.
- "Journal sichern" erzeugt eine Datei, die mit einem selbst gewählten Passwort verschlüsselt ist, und bietet sie über den Teilen- bzw. Download-Dialog des Geräts an.
- "Sicherung einspielen" fragt nach dem Passwort, zeigt die Zahl der Einträge und fragt, ob ersetzt oder ergänzt werden soll.
- Falsches Passwort oder beschädigte Datei führt zu einer klaren Meldung, ohne bestehende Daten zu verändern.
- Die App erinnert nicht automatisch an Sicherungen (keine Push-Nachrichten in v1).

## Epic 7: App-Verhalten, Transparenz & Auslieferung (neu)

**US-7.1 Fühlt sich an wie eine normale App** · Must · App ◐ · neu
Als Nutzerin möchte ich, dass sich die installierte App wie eine normale App verhält und nicht wie eine Website.
- Schnelles mehrfaches Tippen, z. B. auf dieselbe Ziffer bei der PIN, löst nie den Doppeltipp-Zoom des Browsers aus (`touch-action: manipulation`).
- Zwei-Finger-Zoom bleibt aus Gründen der Barrierefreiheit möglich.
- Antippen eines Eingabefelds zoomt nicht hinein (Schriftgröße in Eingabefeldern mindestens 16 Pixel).
- Langes Drücken auf Buttons und den Ziffernblock öffnet kein Kontextmenü und markiert keinen Text (`-webkit-touch-callout: none`, `user-select: none`); in der Schreibfläche bleiben Markieren und Kopieren möglich.
- Kein Neuladen durch Herunterziehen, kein Aufblitzen beim Tippen.
- Installiert startet die App im Vollbild ohne Browserleiste, mit App-Icon und Splash-Farbe aus Design v0.3.
- Abnahme auf echtem iPhone (Safari, installiert und nicht installiert) und Android (Chrome).

**US-7.2 Grok-Bot-Hinweis und Versionsnummer** · Must · App ✔ · neu
- Der erste Screen zeigt ohne Scrollen "Komplett gebaut von einem Grok-Bot-Team, ohne menschliche Hand" und die aktuelle Versionsnummer.
- Beides steht auch in den Einstellungen.
- Die Versionsnummer folgt dem Schema MAJOR.MINOR.PATCH und kommt aus `docs/js/version.js`.
- Die README des Repos enthält denselben Hinweis.

**US-7.3 Automatische Veröffentlichung** · Must · App ✔ · neu
- Jeder Push auf `main` veröffentlicht `docs/` über GitHub Pages unter [oliver19xx.github.io/gefuehlsjournal](https://oliver19xx.github.io/gefuehlsjournal/).
- Jedes Release erhöht `VERSION` und `CACHE_VERSION` gleich und bekommt einen Eintrag in `CHANGELOG.md`.

**US-7.4 Update-Hinweis** · Must · App ✔ · neu
- Gibt es eine neue Version, zeigt die installierte App "Eine neue Version ist da" mit "Jetzt aktualisieren".
- Aktualisieren verliert keinen offenen Entwurf.

---

## Definition of Done
- Alle Akzeptanzkriterien erfüllt und vom Tester abgenommen.
- Auf iPhone (Safari) und Android (Chrome) geprüft, installiert und im Browser.
- Umsetzung entspricht Design v0.3 und Flows v0.2.
- Barrierefreiheit: Screenreader-Labels, Kontrast mindestens 4,5:1 für Text, dynamische Schriftgröße mit Listen-Alternative zum Rad, Tippflächen ab 44 × 44 Pixeln.
- Keine Netzwerkanfrage außer an die eigene GitHub-Pages-Adresse.
- Versionsnummer erhöht und Changelog ergänzt.

## Nächstes Release 0.1.1 (Vorschlag, Reihenfolge nach Priorität)
1. US-7.1 komplett (Doppeltipp-Zoom, Kontextmenü, Markieren, 16-Pixel-Eingaben).
2. US-6.2 Krisennummern als große Anruf-Buttons, Hinweis auf Deutschland.
3. US-2.3 Button-Text nach Feinabstufung ("Weiter mit …").
4. US-2.4 doppelte Tags beim Schreiben beheben.
5. Anhang A in `docs/js/data.js` übernehmen.
6. Übrige Punkte aus Design- und UX-Review mit niedriger Priorität.

---

## Anhang A: Korrekturen an Begriffen und Impulsen in `docs/js/data.js`

Die Liste von Dev ist als Grundlage freigegeben. Nur diese Änderungen, damit nichts wertet oder beschämt:

**Begriffe (Ebene 3)**
| Grundgefühl › Ebene 2 | Bisher | Neu |
|---|---|---|
| Freude › verspielt | albern, übermütig | ausgelassen, unbeschwert |
| Freude › glücklich | froh, heiter, ausgelassen | froh, heiter, leicht |
| Wut › neidisch | eifersüchtig, missgünstig | eifersüchtig, zu kurz gekommen |
| Wut › bitter | verbittert, nachtragend | verbittert, enttäuscht vom Leben |
| Stärke › stolz | zufrieden mit mir, selbstbewusst | zufrieden mit mir, selbstbewusst (bleibt) |

Hinweis: "ausgelassen" wandert von "glücklich" zu "verspielt", damit kein Begriff doppelt vorkommt.

**Schreibimpulse**
| Grundgefühl | Bisher | Neu |
|---|---|---|
| Trauer | Was würdest du einem guten Freund sagen, dem es so geht wie dir? | Was würdest du einem lieben Menschen sagen, dem es so geht wie dir? |
| Wut | Was hättest du gern gesagt, wenn du dich getraut hättest? | Was hättest du gern gesagt? |
| Angst | Was sagt die Sorge, und was weißt du sicher? | Was sagt die Sorge, und was weißt du davon sicher? |

Alle anderen Begriffe und Impulse sowie `SAVE_THANKS` sind so freigegeben.

## Anhang B: Umgang mit dem Review des Testers
| Punkt | Erledigt durch |
|---|---|
| W1 | E7, US-5.1 |
| W2 | E8, US-5.1 |
| W3 | E4, US-2.4 |
| W4 | E2, Anhang A |
| W5 | US-2.1 (prüfbare Regel statt "gleichwertig") |
| W6 | US-6.2 |
| W7 | US-6.1 (Zahnrad auf "Heute") |
| W8 | US-1.1 (PIN 4 bis 6 Ziffern, Datenschutz-Satz auf eigenem Screen) |
| W9 | US-3.3 |
| W10 | US-4.1 |
| W11 | US-3.1 |
| W12 | US-5.1 |
| Nicht prüfbare Kriterien | US-1.1, 1.2, 1.3, 3.1, 3.2, 3.3, 4.1, 5.1 |
| Randfälle | US-1.4, 1.5, 3.2, 3.3, 4.1, 4.3, 6.3, E5, E6, E9, E10 |
