# Design

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

- Plattform festlegen, danach Komponentenbibliothek und Spezifikation für die Entwicklung.
