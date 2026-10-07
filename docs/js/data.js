// Gefühlsmodell nach dem Feeling Wheel von Gloria Willcox: 6 Grundgefühle, je 6 Gefühle (Ebene 2)
// mit je 2 bis 3 Feinabstufungen (Ebene 3). Deutsche Begriffsliste: Vorschlag von Dev, finale Liste durch Product Owner.
export const CORES = [
  { id: "freude", name: "Freude", color: "#F2C35B", c2: "#f7da99", c3: "#fbeccb", ink: "#8a6413",
    l2: {
      "glücklich": ["froh", "heiter", "ausgelassen"],
      "dankbar": ["beschenkt", "erfüllt"],
      "neugierig": ["interessiert", "fasziniert"],
      "begeistert": ["inspiriert", "voller Energie"],
      "hoffnungsvoll": ["optimistisch", "zuversichtlich"],
      "verspielt": ["albern", "übermütig"],
    } },
  { id: "staerke", name: "Stärke", color: "#F0A487", c2: "#f6c7b5", c3: "#fae2d9", ink: "#8c4a2f",
    l2: {
      "stolz": ["zufrieden mit mir", "selbstbewusst"],
      "mutig": ["entschlossen", "tatkräftig"],
      "anerkannt": ["respektiert", "gesehen"],
      "wichtig": ["gebraucht", "wertvoll"],
      "sicher": ["gefestigt", "klar"],
      "kreativ": ["einfallsreich", "schöpferisch"],
    } },
  { id: "frieden", name: "Frieden", color: "#93C4A0", c2: "#bcdac4", c3: "#dcece1", ink: "#3f6b4b",
    l2: {
      "zufrieden": ["ausgeglichen", "im Reinen"],
      "entspannt": ["gelassen", "ruhig"],
      "geborgen": ["behütet", "angekommen"],
      "verbunden": ["nah", "vertraut"],
      "nachdenklich": ["besinnlich", "achtsam"],
      "liebevoll": ["zärtlich", "warmherzig"],
    } },
  { id: "trauer", name: "Trauer", color: "#8BB0D8", c2: "#b7cee7", c3: "#dae6f3", ink: "#3c5f86",
    l2: {
      "einsam": ["verlassen", "isoliert"],
      "enttäuscht": ["übergangen", "im Stich gelassen", "ernüchtert"],
      "verletzt": ["gekränkt", "missverstanden"],
      "schuldig": ["beschämt", "reumütig"],
      "hoffnungslos": ["mutlos", "leer"],
      "erschöpft": ["müde", "ausgelaugt"],
    } },
  { id: "angst", name: "Angst", color: "#B3A3D6", c2: "#d0c6e6", c3: "#e7e2f2", ink: "#5a4a85",
    l2: {
      "unsicher": ["verwirrt", "zweifelnd"],
      "überfordert": ["gestresst", "gehetzt"],
      "besorgt": ["nervös", "angespannt"],
      "hilflos": ["machtlos", "ausgeliefert"],
      "verängstigt": ["bedroht", "panisch"],
      "abgelehnt": ["unerwünscht", "ausgeschlossen"],
    } },
  { id: "wut", name: "Wut", color: "#E09696", c2: "#ecbebe", c3: "#f5dddd", ink: "#7d3f3f",
    l2: {
      "frustriert": ["genervt", "ungeduldig"],
      "gereizt": ["dünnhäutig", "aufgebracht"],
      "wütend": ["zornig", "rasend"],
      "neidisch": ["eifersüchtig", "missgünstig"],
      "bitter": ["verbittert", "nachtragend"],
      "empört": ["entrüstet", "ungerecht behandelt"],
    } },
];
export const CORE = Object.fromEntries(CORES.map((c) => [c.id, c]));
export const UNNAMED = { id: "none", name: "nicht benannt", color: "#CFC8BC" };
export const MAX_FEELINGS = 3;

// Schreibimpulse: wertfrei, mindestens 5 pro Grundgefühl.
export const PROMPTS = {
  freude: [
    "Was hat dir heute ein Lächeln geschenkt?",
    "Wer oder was hat zu diesem Gefühl beigetragen?",
    "Wie fühlt sich die Freude gerade in deinem Körper an?",
    "Was möchtest du von diesem Moment in Erinnerung behalten?",
    "Wofür bist du gerade dankbar?",
    "Was würdest du gern öfter erleben?",
  ],
  staerke: [
    "Worauf bist du gerade stolz, auch wenn es klein ist?",
    "Was hast du heute geschafft, das dir etwas bedeutet?",
    "Wo hast du dich heute gesehen oder ernst genommen gefühlt?",
    "Welche deiner Stärken hat sich heute gezeigt?",
    "Was traust du dir gerade zu?",
    "Wer hat dich auf dem Weg hierher unterstützt?",
  ],
  frieden: [
    "Was hat dir heute Ruhe gegeben?",
    "Wo oder mit wem fühlst du dich gerade geborgen?",
    "Was brauchst du, um dieses Gefühl noch eine Weile zu halten?",
    "Welcher Moment heute war einfach gut, so wie er war?",
    "Was ist dir in letzter Zeit klarer geworden?",
    "Wofür möchtest du dir gerade Zeit nehmen?",
  ],
  trauer: [
    "Was hast du dir anders gewünscht?",
    "Was fehlt dir gerade?",
    "Was würdest du einem guten Freund sagen, dem es so geht wie dir?",
    "Wann hat dieses Gefühl angefangen?",
    "Was würde dir jetzt ein kleines bisschen guttun?",
    "Was möchtest du loswerden, ohne dass jemand antworten muss?",
  ],
  angst: [
    "Was beschäftigt dich gerade am meisten?",
    "Was liegt in deiner Hand, und was nicht?",
    "Was wäre ein kleiner nächster Schritt?",
    "Wer oder was könnte dir gerade Halt geben?",
    "Was sagt die Sorge, und was weißt du sicher?",
    "Wie würde sich ein bisschen mehr Sicherheit anfühlen?",
  ],
  wut: [
    "Was hat dich heute aufgebracht?",
    "Welche Grenze wurde überschritten?",
    "Was hättest du gern gesagt, wenn du dich getraut hättest?",
    "Was ist dir an dieser Sache wichtig?",
    "Wo spürst du die Wut im Körper?",
    "Was brauchst du gerade, damit es ein bisschen leichter wird?",
  ],
};

export const SAVE_THANKS = "Danke, dass du dir Zeit für dich genommen hast";
