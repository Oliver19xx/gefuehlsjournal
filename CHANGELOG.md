# Changelog

## 0.1.2 – 8. Oktober 2026

Gehört inhaltlich zu 0.1.1 (Phase 1). Eigene Versionsnummer, damit schon geladene Geräte das Update sicher bekommen.

- US-1.6: Im Browser erscheint der Hinweis „Zum Home-Bildschirm hinzufügen“ direkt nach dem ersten Screen, vor der PIN-Einrichtung (auch vor „Ich habe eine Sicherungsdatei“). „Später“ ist möglich; dann erscheint er beim nächsten Öffnen im Browser wieder. In der installierten App erscheint er nie. Über die Einstellungen bleibt er aufrufbar.

## 0.1.1 – 8. Oktober 2026

Phase 1 aus dem Releaseplan 1.0: Fehler aus dem Testbericht v0.1.0, Punkte aus UX- und Design-Review, Backlog MVP v0.2.

- T1: Große Sicherungen (mehrere hundert Einträge) werden zuverlässig erstellt
- T2: Kein Neuladen beim allerersten Öffnen, getippte PIN-Ziffern bleiben erhalten
- T3: Sperre nach Fehlversuchen steigt von 30 Sekunden bis höchstens 15 Minuten, Hinweis nennt die nächste Pause
- US-7.1: Kein Browser-Zoom bei schnellem Tippen, kein Kontextmenü auf Tasten, Eingabefelder mit mindestens 16 px
- T4/E9: Datum eines Eintrags ist der Beginn des Schreibens; „bearbeitet am …“ nur nach echter Änderung; über mehrere Tage geschriebene Einträge zeigen „begonnen am …“
- T5: Wiederherstellen direkt beim ersten Start („Ich habe eine Sicherungsdatei“), danach PIN einrichten
- T6: Wiederherstellen prüft die Datei zuerst, zeigt die Anzahl und bietet „Ergänzen“ oder „Ersetzen“; unbekannte Daten werden aussortiert; Einspielen geschieht ganz oder gar nicht
- T7: Mehrere Gefühle aus verschiedenen Bereichen (bis zu 3), Schließen-Dialog beim Schreiben, Entwurf auf „Heute“ verwerfen, Einträge als Liste, Leerzustand, Rückblick-Filter mit Zeitraum, PIN-Warnung muss bestätigt werden
- T8: Empfehlung für 6-stellige PIN, Datenschutz-Hinweis zur Nutzung ohne PIN
- T9/T10: Datenbank schließt sich bei Versionswechsel sauber; Entwurf wird beim Wechsel in den Hintergrund und vor einem Update sofort gespeichert, aber nie im gesperrten Zustand
- UX: „Weiter mit …“ statt „Nur …“, Mitte des Rads ohne Text, Anruf-Buttons groß mit Nummer, Hinweis „Die Nummern gelten für Deutschland.“, „Hab ich gemacht“ im Installationshinweis
- Design: ein Tag je Grundgefühl statt doppelter Tags, zentrierte Umschalter, Toast über der Navigation, Installationshinweis mit Buttons unten
- Anhang A: ergänzte Gefühlswörter und überarbeitete Impulse

## 0.1.0 – 7. Oktober 2026

Erste Version der PWA, gebaut von Dev (Grok Bot) nach Design v0.3, Flows v0.2 und Backlog MVP v0.1.

- Onboarding mit Grok-Bot-Hinweis und Versionsnummer, PIN einrichten, Entsperren, PIN vergessen
- Gefühlsrad (Willcox) mit Listenansicht, Ebene 2 und 3, bis zu 3 Gefühle
- Schreiben mit Impuls, automatischer verschlüsselter Entwurf, Gefühl nachtragen
- Einträge mit Kalender, Suche, Lesen, Bearbeiten, Löschen
- Rückblick 7 und 30 Tage
- Einstellungen, Hilfe in schweren Momenten, Datenschutz, Sicherung als Datei, alles löschen
- Offline-fähig, installierbar, Update-Hinweis bei neuer Version
