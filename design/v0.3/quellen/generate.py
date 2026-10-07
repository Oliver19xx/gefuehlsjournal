import math,os
HERE=os.path.dirname(os.path.abspath(__file__))
VERSION="0.3.0"
CORES=[("Freude","#F2C35B"),("Stärke","#F0A487"),("Frieden","#93C4A0"),("Trauer","#8BB0D8"),("Angst","#B3A3D6"),("Wut","#E09696")]
COL=dict(CORES)
def mix(h,t):
    h=h.lstrip('#'); r,g,b=[int(h[i:i+2],16) for i in (0,2,4)]
    return "#%02x%02x%02x"%tuple(round(c+(255-c)*t) for c in (r,g,b))
def arc(cx,cy,r0,r1,a0,a1):
    p=lambda r,a:(cx+r*math.cos(math.radians(a)),cy+r*math.sin(math.radians(a)))
    x0,y0=p(r1,a0);x1,y1=p(r1,a1);x2,y2=p(r0,a1);x3,y3=p(r0,a0)
    return f"M{x0:.1f},{y0:.1f} A{r1},{r1} 0 0 1 {x1:.1f},{y1:.1f} L{x2:.1f},{y2:.1f} A{r0},{r0} 0 0 0 {x3:.1f},{y3:.1f} Z"
def wheel1(size,sel=None,center="Tippen"):
    c=size/2;R=c-4;r0=R*0.34;seg=60;s=[]
    for i,(name,col) in enumerate(CORES):
        a0=-90-seg/2+i*seg;a1=a0+seg;am=math.radians((a0+a1)/2)
        isSel=name==sel; dim=sel and not isSel
        rr=R+(4 if isSel else 0)
        s.append(f'<path d="{arc(c,c,r0,rr-4,a0+0.01,a1-0.01)}" fill="{col if not dim else mix(col,.55)}" stroke="#FBF7F1" stroke-width="4" stroke-linejoin="round"/>')
        lx=c+(r0+R)/2*math.cos(am);ly=c+(r0+R)/2*math.sin(am)
        s.append(f'<text x="{lx:.1f}" y="{ly:.1f}" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="{800 if isSel else 700}" fill="#3B3A45" opacity="{0.55 if dim else 1}">{name}</text>')
    s.append(f'<circle cx="{c}" cy="{c}" r="{r0-6}" fill="#FFFDF8"/>')
    s.append(f'<text x="{c}" y="{c}" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#7A7684">{center}</text>')
    return f'<svg width="{size}" height="{size}" viewBox="-4 -4 {size+8} {size+8}" font-family="Nunito">{"".join(s)}</svg>'
def icon_svg(size=96):
    c=size/2;R=size*0.36;r0=R*0.38;s=[]
    for i,(n,col) in enumerate(CORES):
        a0=-120+i*60;a1=a0+60
        s.append(f'<path d="{arc(c,c,r0,R,a0+1.5,a1-1.5)}" fill="{col}"/>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 {size} {size}"><rect width="{size}" height="{size}" rx="{size*0.22}" fill="#FBF7F1"/>{"".join(s)}<circle cx="{c}" cy="{c}" r="{r0*0.55}" fill="#3B3A45"/></svg>'
NAV=lambda a: '<div class="nav">'+"".join(f'<div class="{"on" if x==a else ""}"><span>{ic}</span>{x}</div>' for x,ic in [("Heute","◐"),("Einträge","▦"),("Rückblick","◔")])+'</div>'
def phone(num,title,body,note):
    return f'<div class="cell"><div class="lbl">{num}. {title}</div><div class="phone"><div class="status"><span>9:41</span><span>●●● ▮</span></div>{body}</div><div class="note">{note}</div></div>'
def keypad(): return '<div class="keypad">'+"".join(f'<span>{k}</span>' if k else '<span class="e"></span>' for k in ["1","2","3","4","5","6","7","8","9","","0","⌫"])+'</div>'
def dots(n,f): return '<div class="pins">'+"".join(f'<i class="{"f" if i<f else ""}"></i>' for i in range(n))+'</div>'
T=COL["Trauer"]; F=COL["Frieden"]
BADGE='<div class="badge"><span>✦</span>Komplett gebaut von einem Grok-Bot-Team, ohne menschliche Hand.</div>'
s=[]
s.append(phone("1","Erster Start",f'''<div class="col center grow">
<div class="illu"><img src="data:image/svg+xml;utf8,{icon_svg(110).replace('#','%23').replace('"',"'")}" width="110"/></div>
<div class="h1 c">Dein Raum.<br>Nur für dich.</div><div class="p c">Alles bleibt auf deinem Gerät.<br>Kein Konto, keine Cloud, kein Server.</div>
{BADGE}</div>
<div class="btn">Los geht's</div><div class="ver">Gefühls-Journal · Version {VERSION}</div>''',"Grok-Bot-Hinweis und Versionsnummer direkt auf der ersten Anzeige. App-Icon als Illustration."))
s.append(phone("1b","PIN einrichten",f'''<div class="col center"><div class="h1 c mt">Sichere dein Journal</div><div class="p c sm nomb">PIN mit 4 bis 6 Ziffern</div>{dots(6,3)}{keypad()}</div>
<div class="warn"><b>⚠ Wichtig</b>Wenn du die PIN vergisst, kann sie niemand zurücksetzen. Deine Einträge wären dann verloren.</div>
<div class="opt sm"><span class="ic">◉</span><div><b>Zusätzlich Gerätesperre nutzen</b><small>Face ID oder Fingerabdruck, falls verfügbar</small></div><span class="tog on"></span></div>
<div class="link">Später einrichten</div>''',"Warnung als warme Hinweiskarte, nicht wegklickbar. Biometrie nur, wenn Browser und Gerät sie anbieten."))
s.append(phone("1c","Entsperren",f'''<div class="col center grow"><div class="lockc">🔒</div><div class="h1 c">Willkommen zurück</div>{dots(4,2)}
<div class="err">Falsche PIN. Noch 3 Versuche, dann 1 Minute Pause.</div>{keypad()}<div class="link">PIN vergessen?</div></div>''',"Fehlerhinweis in gedämpftem Rosé statt Rot, ohne Vorwurf."))
s.append(phone("2","Gefühl wählen",f'''<div class="row between"><span class="date l">Mittwoch, 7. Okt.</span><span class="gear">⚙</span></div><div class="h1 c">Wie geht es dir<br>gerade?</div>
<div class="wheel">{wheel1(250,sel="Trauer",center="Trauer")}</div>
<div class="p c sm nomb">Tippe auf ein Gefühl. Danach kannst du genauer werden.</div><div class="aslist">☰ Als Liste anzeigen</div>
<div class="grow"></div><div class="btn ghost">✎ Lieber direkt schreiben</div>{NAV("Heute")}''',"Willcox-Grundgefühle. Zahnrad für Einstellungen. „Als Liste anzeigen“ für große Schrift und Screenreader."))
chips2="".join(f'<span class="chip{" sel" if x in ("enttäuscht","erschöpft") else ""}" style="--c:{mix(T,.38)}">{x}</span>' for x in ["einsam","enttäuscht","verletzt","schuldig","hoffnungslos","erschöpft"])
chips3="".join(f'<span class="chip{" sel" if x=="ernüchtert" else ""}" style="--c:{mix(T,.6)}">{x}</span>' for x in ["übergangen","im Stich gelassen","ernüchtert"])
s.append(phone("3","Genauer werden",f'''<div class="back">‹ Zurück</div><div class="tag" style="background:{T}">Trauer</div>
<div class="h1">Was trifft es eher?</div><div class="chips">{chips2}</div>
<div class="sub">Noch genauer <span>(optional)</span></div><div class="chips">{chips3}</div>
<div class="hint" style="background:{mix(T,.8)}">Mehrere Antworten sind okay. Gefühle sind oft gemischt.</div>
<div class="grow"></div><div class="btn">Weiter zum Schreiben</div><div class="link">Überspringen</div>''',"Begriffe aus den Wireframes, die finale Liste für Ebene 2 und 3 steht noch aus."))
s.append(phone("4","Schreiben mit Impuls",f'''<div class="row between"><span class="x">✕</span><span class="tag sm" style="background:{mix(T,.45)}">Trauer · enttäuscht</span><span class="x">⋯</span></div>
<div class="prompt" style="background:{mix(T,.82)}"><div>Was hast du dir anders gewünscht?</div><div class="pa"><small>↻ Anderer Impuls</small><small>Ohne Impuls schreiben</small></div></div>
<div class="write">Eigentlich hatte ich mich so auf das Gespräch gefreut, und dann lief alles anders als gedacht. Ich glaube, am meisten hat mich getroffen, dass<span class="caret"></span></div>
<div class="row between foot"><span class="saved">✓ Automatisch gespeichert</span><span class="btn sm">Fertig</span></div>''',"Neu: „Ohne Impuls schreiben“ und ⋯-Menü mit Hilfe in schweren Momenten."))
s.append(phone("5","Gefühl nachtragen",f'''<div class="pill">✓ Danke, dass du dir Zeit genommen hast</div><div class="h1">Magst du noch festhalten, wie es dir ging?</div>
<div class="p sm">Hilft dir später im Rückblick, Muster zu erkennen.</div>
<div class="wheel">{wheel1(230,center="Tippen")}</div><div class="grow"></div>
<div class="btn">Gefühl wählen</div><div class="link">Nein, danke</div>''',"Nur nach direktem Schreiben. Bestätigungstext als Chip oben."))
days=["","","",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
mood={2:"Freude",3:"Frieden",6:"Frieden",7:"Trauer",9:"Freude",10:"Stärke",13:"Frieden",14:"Angst",16:"Freude",17:"Frieden",21:"Wut",23:"Frieden",24:"Stärke",27:"Trauer",28:"Frieden",30:"Freude"}
cal="".join(f'<span>{x}</span>' for x in "MDMDFSS")+"".join(f'<div class="d{" today" if d==7 else ""}">{d}{f"<i style=background:{COL[mood[d]]}></i>" if d in mood else ("<i class=nn></i>" if d in (20,) else "")}</div>' if d else '<div></div>' for d in days)
s.append(phone("6","Einträge & Kalender",f'''<div class="row between"><div class="h1 nomb">Oktober 2026</div><span class="arrows">‹ ›</span></div>
<div class="cal">{cal}</div>
<div class="entry"><div class="row"><b>Mi, 7. Okt.</b><span class="tag sm" style="background:{mix(T,.45)}">Trauer</span></div><p>Eigentlich hatte ich mich so auf das Gespräch gefreut, und dann …</p></div>
<div class="entry"><div class="row"><b>Di, 6. Okt.</b><span class="tag sm" style="background:{mix(F,.45)}">Frieden</span></div><p>Langer Spaziergang am See, danach Tee mit Lena.</p></div>
<div class="grow"></div>{NAV("Einträge")}''',"Farbpunkt je Tag; ein grauer Ring markiert Einträge ohne Gefühl (z. B. am 20.). Beispieldaten."))
bars="".join(f'<div class="bar"><span>{n}</span><div><i style="width:{w}%;background:{COL.get(n,"#CFC8BC")}"></i></div></div>' for n,w in [("Freude",72),("Frieden",60),("Trauer",30),("Stärke",22),("Angst",14),("Wut",10),("nicht benannt",8)])
s.append(phone("7","Rückblick",f'''<div class="h1">Deine letzten 7 Tage</div><div class="seg"><span class="on">7 Tage</span><span>30 Tage</span></div>
<div class="stat"><div><b>5</b><small>Einträge</small></div><div><b style="color:#b98a1f">Freude</b><small>am häufigsten gewählt</small></div></div>
<div class="sub">Gefühle im Überblick</div>{bars}
<div class="insight" style="background:{mix(F,.75)}"><span style="color:#5e9a6e">✦</span>Du hast diese Woche öfter Frieden gewählt als letzte Woche.</div>
<div class="grow"></div>{NAV("Rückblick")}''',"Rollierend 7 oder 30 Tage, inkl. „nicht benannt“. Hinweise nur aus gewählten Gefühlen. Beispieldaten."))
s.append(phone("8","Schwere Momente",f'''<div class="grow"></div><div class="col center">
<div class="heart"><svg width="56" height="56" viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3.2 4.5 6.9 4.5c2.1 0 3.6 1.2 5.1 3 1.5-1.8 3-3 5.1-3 3.7 0 6 3.7 4.5 7.2C19.5 16.4 12 21 12 21z" fill="{COL['Wut']}"/></svg></div>
<div class="h1 c">Du bist nicht allein.</div><div class="p c">Wenn es gerade zu viel ist, kannst du jederzeit mit jemandem sprechen, kostenlos und anonym.</div>
<div class="btn">📞 Telefonseelsorge anrufen</div><div class="nums">0800 111 0 111 · 0800 111 0 222</div>
<div class="btn ghost w">Notruf 112</div></div>
<div class="grow"></div><div class="link">Zurück zum Schreiben</div>''',"Ruhig, ohne Alarmfarben. Notruf als zweiter Button. Nie automatisch ausgelöst."))
def srow(t,r="›",cls=""): return f'<div class="srow {cls}"><span>{t}</span><span>{r}</span></div>'
s.append(phone("9","Einstellungen",f'''<div class="back">‹ Heute</div><div class="h1">Einstellungen</div>
<div class="sh">Sicherheit</div><div class="sgroup">{srow("PIN ändern")}{srow("Gerätesperre (Face ID)",'<span class="tog on"></span>')}{srow("Sperre deaktivieren")}</div>
<div class="sh">Hilfe</div><div class="sgroup">{srow("♡ Hilfe in schweren Momenten")}</div>
<div class="sh">Daten</div><div class="sgroup">{srow("Datenschutz: alles bleibt lokal")}{srow("Alle Daten löschen","›","danger")}</div>
<div class="grow"></div><div class="ver">Gefühls-Journal · Version {VERSION}<br>Gebaut von einem Grok-Bot-Team</div>''',"Gruppierte Karten statt Linienliste. Versionsnummer und Grok-Bot-Hinweis unten."))
s.append(phone("10","PIN vergessen",f'''<div class="grow"></div><div class="col center"><div class="qc">?</div><div class="h1 c">PIN vergessen</div>
<div class="p c">Deine Einträge sind mit deiner PIN verschlüsselt. Ohne sie kann niemand sie öffnen, auch wir nicht.</div>
<div class="hint w" style="background:{mix(F,.75)};color:#3f6b4b">Wenn du dich wieder erinnerst, kannst du es jederzeit erneut versuchen.</div></div>
<div class="grow"></div><div class="btn">Nochmal versuchen</div><div class="btn danger">Journal zurücksetzen (alles löschen)</div>''',"Ehrlich, ohne Schuld. Zurücksetzen als dezenter Rosé-Button, führt zu Screen 11."))
s.append(phone("11","Alle Daten löschen",f'''<div class="back">‹ Einstellungen</div><div class="h1">Alle Daten löschen?</div>
<div class="p">Alle Einträge, Gefühle und deine PIN werden endgültig von diesem Gerät gelöscht. Das lässt sich nicht rückgängig machen.</div>
<div class="sub">Tippe LÖSCHEN zur Bestätigung</div><div class="input">LÖSCH<span class="caret"></span></div>
<div class="grow"></div><div class="btn dis">Endgültig löschen</div><div class="link">Abbrechen</div>''',"Button bleibt deaktiviert, bis LÖSCHEN vollständig eingetippt ist. Erst dann wird er dunkelrosé."))
CSS=open(os.path.join(HERE,"css.txt")).read().split("'''")[1]
CSS+='''
.grid{grid-template-columns:repeat(4,350px)}
.badge{display:flex;gap:9px;align-items:flex-start;background:#FFFDF8;border:1px solid #ECE4D7;border-radius:16px;padding:12px 14px;font-size:13px;font-weight:700;line-height:1.4;color:#3B3A45;margin-top:4px}.badge span{color:#c99a2e}
.ver{text-align:center;font-size:12px;color:#A9A4B2;font-weight:700;margin-top:12px;line-height:1.5}
.mt{margin-top:10px}.nomb{margin-bottom:0}
.pins{display:flex;gap:14px;justify-content:center;margin:22px 0}.pins i{width:14px;height:14px;border-radius:50%;border:2px solid #3B3A45;box-sizing:border-box}.pins i.f{background:#3B3A45}
.keypad{display:grid;grid-template-columns:repeat(3,64px);gap:12px 22px;justify-content:center;margin-bottom:14px}.keypad span{height:64px;border-radius:50%;background:#FFFDF8;border:1px solid #ECE4D7;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700}.keypad span.e{background:none;border:none}.keypad span:last-child{background:none;border:none;font-size:20px;color:#7A7684}
.warn{background:#fbeccb;border-radius:16px;padding:12px 14px;font-size:12.5px;line-height:1.45;margin-bottom:10px;color:#6b5420}.warn b{display:block;margin-bottom:3px;font-size:13px}
.opt.sm{padding:10px 14px}.opt.sm b{font-size:13.5px}.opt.sm small{font-size:12px}
.lockc{width:84px;height:84px;border-radius:50%;background:#e1efe5;display:flex;align-items:center;justify-content:center;font-size:34px;margin:18px 0 18px}
.err{background:#f5dddd;color:#7d3f3f;border-radius:14px;padding:10px 14px;font-size:13px;font-weight:700;margin-bottom:16px;text-align:center}
.date.l{margin:0}.gear{font-size:22px;color:#7A7684}
.aslist{text-align:center;font-size:13px;font-weight:800;color:#5d6f86;margin-top:8px}
.pa{display:flex;justify-content:space-between}
.btn.ghost.w{width:100%;box-sizing:border-box;margin:0}
.sh{font-size:11.5px;letter-spacing:.6px;text-transform:uppercase;color:#A9A4B2;font-weight:800;margin:16px 0 8px}
.sgroup{background:#FFFDF8;border:1px solid #ECE4D7;border-radius:18px;padding:0 16px}
.srow{display:flex;justify-content:space-between;align-items:center;padding:14px 0;font-size:15px;font-weight:700;border-bottom:1px solid #F1ECE4}.srow:last-child{border:none}.srow span:last-child{color:#A9A4B2}
.srow.danger span:first-child{color:#b45c5c}
.qc{width:84px;height:84px;border-radius:50%;background:#e7e2f2;display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:800;color:#6c5a99;margin-bottom:22px}
.hint.w{width:100%;box-sizing:border-box;text-align:center}
.btn.danger{background:#f5dddd;color:#8a4646;margin-top:10px;font-size:14.5px}
.input{border:2px solid #3B3A45;border-radius:14px;padding:13px 14px;font-size:17px;font-weight:800;letter-spacing:2px;background:#FFFDF8}
.btn.dis{background:#E9E3D9;color:#A9A4B2}
.cal .d i.nn{background:none;box-shadow:inset 0 0 0 1.5px #B8B1A6}
'''
html=f'<html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="head"><h1>Gefühls-Journal · Screens v0.3</h1><p>Progressive Web App · Auf Basis der Wireframes v0.2 von UX · Stil: ruhig und warm · Inhalte und Zahlen sind Beispieldaten · Gestaltet von UI, einem Grok Bot</p></div><div class="grid">{"".join(s)}</div></body></html>'
open(os.path.join(HERE,"screens_v0.3.html"),"w").write(html)
open(os.path.join(HERE,"app-icon.svg"),"w").write(icon_svg(512))
