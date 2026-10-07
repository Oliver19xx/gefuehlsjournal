# Design

## v0.3 – Progressive Web App, Wireframes v0.2 (aktueller Stand)

- `v0.3/screens_v0.3.png`: alle 15 Screens (1, 1b, 1c, 2 bis 11). Inhalte und Zahlen sind Beispieldaten.
- `tokens.css`: Farben, Schriften, Radien und Abstände als CSS-Variablen für die Umsetzung.
- `assets/app-icon.svg`: App-Icon für Manifest und Home-Bildschirm (sechs Grundgefühle als Ring).

Änderungen gegenüber v0.2:
- Grundgefühle nach Willcox: Freude, Stärke, Frieden, Trauer, Angst, Wut. Die Farben bleiben, Stärke übernimmt Apricot, Frieden Grün.
- Neu gestaltet: PIN einrichten (1b), Entsperren (1c), Einstellungen (9), PIN vergessen (10), Alle Daten löschen (11).
- Erster Start zeigt sichtbar „Komplett gebaut von einem Grok-Bot-Team, ohne menschliche Hand.“ und die Versionsnummer; beides steht auch unten in den Einstellungen.
- „Als Liste anzeigen“ unter dem Rad als Alternative für große Schrift und Screenreader.
- Schreiben: „Ohne Impuls schreiben“ und ⋯-Menü mit Hilfe in schweren Momenten.
- Rückblick rollierend 7 oder 30 Tage, inklusive „nicht benannt“; Kalender markiert Einträge ohne Gefühl mit grauem Ring.
- Biometrie heißt „Gerätesperre (Face ID oder Fingerabdruck)“ und erscheint nur, wenn Browser und Gerät sie anbieten.

Hinweise für die PWA-Umsetzung:
- Schriften und Icons lokal ausliefern, keine CDNs. Nichts verlässt das Gerät.
- Mobile first, Tippflächen mindestens 44 px, Inhalte innerhalb der sicheren Bereiche (`env(safe-area-inset-*)`).
- `theme_color` und `background_color` im Manifest: `#FBF7F1`.

## v0.2 – alle acht Screens auf Basis der Wireframes v0.1

- `v0.2/screens_v0.2.png`: Erster Start, Gefühl wählen, Genauer werden, Schreiben mit Impuls, Gefühl nachtragen, Einträge und Kalender, Rückblick, Schwere Momente. Inhalte und Zahlen sind Beispieldaten.
- `v0.2/quellen/`: HTML-Quelle und Generator-Skript (`python3 generate.py`).
- Rad auf Ebene 1 zum Tippen; Ebene 2 und 3 als Chips in den Abstufungen der Grundfarbe.
- Schreibfläche und Eintragsvorschau in Noto Serif, damit sich Schreiben wie ein Tagebuch anfühlt; UI-Texte in Nunito.

## v0.1 – erster Entwurf (Stilrichtung: ruhig und warm)

- `v0.1/gefuehlsrad-farbsystem.png`: Gefühlsrad mit drei Ebenen (6 Grundgefühle, 12 Gefühle, 24 Feinabstufungen) und Farbpalette.
- `v0.1/screens-rad-schreiben-rueckblick.png`: drei Screens (Gefühl wählen, Schreiben mit Impuls, Rückblick). Inhalte und Zahlen sind Beispieldaten.
- `v0.1/quellen/`: HTML/SVG-Quellen und das Python-Skript, das sie erzeugt (`python3 generate.py`).

### Farben

| Grundgefühl | Ebene 1 | Ebene 2 (62 %) | Ebene 3 (32 %) |
|---|---|---|---|
| Freude | `#F2C35B` | `#f7da99` | `#fbeccb` |
| Geborgenheit | `#93C4A0` | `#bcdac4` | `#dcece1` |
| Überraschung | `#F0A487` | `#f6c7b5` | `#fae2d9` |
| Trauer | `#8BB0D8` | `#b7cee7` | `#dae6f3` |
| Angst | `#B3A3D6` | `#d0c6e6` | `#e7e2f2` |
| Wut | `#E09696` | `#ecbebe` | `#f5dddd` |

Basis: Papier `#FBF7F1`, Fläche `#FFFDF8`, Text `#3B3A45`, Sekundärtext `#7A7684`. Schrift: Nunito.

Grundsatz: keine Signalfarben. Kein Gefühl soll farblich als „schlecht“ markiert sein.

### Nächste Schritte

- Komponentenbibliothek und Spezifikation für die Entwicklung.
