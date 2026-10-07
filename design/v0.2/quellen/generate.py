import math
CORES=[("Freude","#F2C35B"),("Geborgenheit","#93C4A0"),("Überraschung","#F0A487"),("Trauer","#8BB0D8"),("Angst","#B3A3D6"),("Wut","#E09696")]
COL=dict(CORES)
def mix(h,t):
    h=h.lstrip('#'); r,g,b=[int(h[i:i+2],16) for i in (0,2,4)]
    return "#%02x%02x%02x"%tuple(round(c+(255-c)*t) for c in (r,g,b))
def arc(cx,cy,r0,r1,a0,a1):
    p=lambda r,a:(cx+r*math.cos(math.radians(a)),cy+r*math.sin(math.radians(a)))
    x0,y0=p(r1,a0);x1,y1=p(r1,a1);x2,y2=p(r0,a1);x3,y3=p(r0,a0)
    return f"M{x0:.1f},{y0:.1f} A{r1},{r1} 0 0 1 {x1:.1f},{y1:.1f} L{x2:.1f},{y2:.1f} A{r0},{r0} 0 0 0 {x3:.1f},{y3:.1f} Z"
def wheel1(size,sel=None,center="Tippen"):
    c=size/2;R=c-4;r0=R*0.34;n=6;seg=60;s=[]
    for i,(name,col) in enumerate(CORES):
        a0=-90-seg/2+i*seg;a1=a0+seg;am=math.radians((a0+a1)/2)
        isSel=name==sel; dim=sel and not isSel
        rr=R+ (4 if isSel else 0)
        fill=col if not dim else mix(col,.55)
        s.append(f'<path d="{arc(c,c,r0,rr-4,a0+0.01,a1-0.01)}" fill="{fill}" stroke="#FBF7F1" stroke-width="4" stroke-linejoin="round"/>')
        lx=c+(r0+R)/2*math.cos(am);ly=c+(r0+R)/2*math.sin(am)
        fs=11 if len(name)>8 else 13
        s.append(f'<text x="{lx:.1f}" y="{ly:.1f}" text-anchor="middle" dominant-baseline="central" font-size="{fs}" font-weight="{800 if isSel else 700}" fill="#3B3A45" opacity="{0.55 if dim else 1}">{name}</text>')
    s.append(f'<circle cx="{c}" cy="{c}" r="{r0-6}" fill="#FFFDF8"/>')
    s.append(f'<text x="{c}" y="{c}" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#7A7684">{center}</text>')
    return f'<svg width="{size}" height="{size}" viewBox="-4 -4 {size+8} {size+8}" font-family="Nunito">{"".join(s)}</svg>'
NAV=lambda a: '<div class="nav">'+"".join(f'<div class="{"on" if x==a else ""}"><span>{ic}</span>{x}</div>' for x,ic in [("Heute","◐"),("Einträge","▦"),("Rückblick","◔")])+'</div>'
def phone(num,title,body,note):
    return f'<div class="cell"><div class="lbl">{num}. {title}</div><div class="phone"><div class="status"><span>9:41</span><span>●●● ▮</span></div>{body}</div><div class="note">{note}</div></div>'
T=COL["Trauer"]
s=[]
s.append(phone(1,"Erster Start",f'''<div class="col center grow">
<div class="illu"><svg width="150" height="120" viewBox="0 0 150 120"><circle cx="75" cy="64" r="48" fill="{mix(COL['Geborgenheit'],.6)}"/><circle cx="52" cy="52" r="22" fill="{mix(COL['Freude'],.35)}"/><circle cx="100" cy="74" r="18" fill="{mix(COL['Trauer'],.4)}"/><path d="M58 76 q17 16 34 0" stroke="#3B3A45" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="62" cy="60" r="3.5" fill="#3B3A45"/><circle cx="88" cy="60" r="3.5" fill="#3B3A45"/></svg></div>
<div class="h1 c">Dein Raum.<br>Nur für dich.</div><div class="p c">Alles bleibt auf deinem Gerät.<br>Niemand sonst kann mitlesen.</div>
<div class="opt"><span class="ic">🔒</span><div><b>App-Sperre</b><small>Face ID oder Code</small></div><span class="tog on"></span></div></div>
<div class="btn">Sperre einrichten &amp; los</div><div class="link">Später</div>''',"Warme Illustration statt Platzhalter, ein klarer Hauptbutton."))
s.append(phone(2,"Gefühl wählen",f'''<div class="date">Mittwoch, 7. Okt.</div><div class="h1 c">Wie geht es dir<br>gerade?</div>
<div class="wheel">{wheel1(250,sel="Trauer",center="Trauer")}</div>
<div class="p c sm">Tippe auf ein Gefühl. Danach kannst du<br>genauer werden, wenn du magst.</div>
<div class="grow"></div><div class="btn ghost">✎ Lieber direkt schreiben</div>{NAV("Heute")}''',"Ebene 1 als großes Rad, die Auswahl hebt sich farbig ab, der Rest tritt zurück."))
chips2="".join(f'<span class="chip{" sel" if x=="Enttäuschung" else ""}" style="--c:{mix(T,.38)}">{x}</span>' for x in ["Einsamkeit","Enttäuschung"])
chips3="".join(f'<span class="chip{" sel" if x=="entmutigt" else ""}" style="--c:{mix(T,.6)}">{x}</span>' for x in ["verlassen","isoliert","entmutigt","verletzt"])
s.append(phone(3,"Genauer werden",f'''<div class="back">‹ Zurück</div><div class="tag" style="background:{T}">Trauer</div>
<div class="h1">Was trifft es eher?</div><div class="chips">{chips2}</div>
<div class="sub">Noch genauer <span>(optional)</span></div><div class="chips">{chips3}</div>
<div class="hint" style="background:{mix(T,.8)}">Mehrere Antworten sind okay. Gefühle sind oft gemischt.</div>
<div class="grow"></div><div class="btn">Weiter zum Schreiben</div><div class="link">Überspringen</div>''',"Ebene 2 und 3 als Chips in den Abstufungen der Grundfarbe, Mehrfachauswahl."))
s.append(phone(4,"Schreiben mit Impuls",f'''<div class="row between"><span class="x">✕</span><span class="tag sm" style="background:{mix(T,.45)}">Trauer · entmutigt</span></div>
<div class="prompt" style="background:{mix(T,.82)}"><div>Was hättest du dir heute anders gewünscht?</div><small>↻ Anderer Impuls</small></div>
<div class="write">Eigentlich hatte ich mich so auf das Gespräch gefreut, und dann lief alles anders als gedacht. Ich glaube, am meisten hat mich getroffen, dass<span class="caret"></span></div>
<div class="row between foot"><span class="saved">✓ Automatisch gespeichert</span><span class="btn sm">Fertig</span></div>''',"Viel Ruhe zum Schreiben, kein Wortzähler. Impuls in der Gefühlsfarbe, austauschbar."))
s.append(phone(5,"Gefühl nachtragen",f'''<div class="pill">✓ Eintrag gespeichert</div><div class="h1">Magst du noch festhalten, wie es dir ging?</div>
<div class="p sm">Hilft dir später im Rückblick, Muster zu erkennen.</div>
<div class="wheel">{wheel1(230,center="Tippen")}</div><div class="grow"></div>
<div class="btn">Gefühl wählen</div><div class="link">Nein, danke</div>''',"Erscheint nur nach direktem Schreiben. Freundlich, mit leichtem Ausweg."))
days=["","","",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
mood={2:"Freude",3:"Geborgenheit",6:"Geborgenheit",7:"Trauer",9:"Freude",10:"Überraschung",13:"Geborgenheit",14:"Angst",16:"Freude",17:"Geborgenheit",21:"Wut",23:"Geborgenheit",24:"Freude",27:"Trauer",28:"Geborgenheit",30:"Freude",31:"Geborgenheit"}
cal="".join(f'<span>{x}</span>' for x in "MDMDFSS")+"".join(f'<div class="d{" today" if d==7 else ""}">{d}{f"<i style=background:{COL[mood[d]]}></i>" if d in mood else ""}</div>' if d else '<div></div>' for d in days)
s.append(phone(6,"Einträge & Kalender",f'''<div class="row between"><div class="h1 nomb">Oktober 2026</div><span class="arrows">‹ ›</span></div>
<div class="cal">{cal}</div>
<div class="entry"><div class="row"><b>Mi, 7. Okt.</b><span class="tag sm" style="background:{mix(T,.45)}">Trauer</span></div><p>Eigentlich hatte ich mich so auf das Gespräch gefreut, und dann …</p></div>
<div class="entry"><div class="row"><b>Di, 6. Okt.</b><span class="tag sm" style="background:{mix(COL['Geborgenheit'],.45)}">Geborgenheit</span></div><p>Langer Spaziergang am See, danach Tee mit Lena.</p></div>
<div class="grow"></div>{NAV("Einträge")}''',"Farbpunkte zeigen das Gefühl des Tages. Heute ist umrandet. Beispieldaten."))
bars="".join(f'<div class="bar"><span>{n}</span><div><i style="width:{w}%;background:{COL[n]}"></i></div></div>' for n,w in [("Geborgenheit",88),("Freude",70),("Trauer",38),("Überraschung",24),("Angst",18),("Wut",14)])
s.append(phone(7,"Rückblick",f'''<div class="h1">Dein Oktober</div><div class="seg"><span>Woche</span><span class="on">Monat</span></div>
<div class="stat"><div><b>17</b><small>Einträge</small></div><div><b style="color:#5e9a6e">Geborgenheit</b><small>häufigstes Gefühl</small></div></div>
<div class="sub">Gefühle im Überblick</div>{bars}
<div class="insight" style="background:{mix(COL['Freude'],.75)}"><span>✦</span>Nach Spaziergängen hast du oft Geborgenheit gewählt.</div>
<div class="grow"></div>{NAV("Rückblick")}''',"Wertungsfreie Hinweise, keine Streaks. Alle Zahlen sind Beispieldaten."))
s.append(phone(8,"Schwere Momente",f'''<div class="grow"></div><div class="col center">
<div class="heart"><svg width="56" height="56" viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3.2 4.5 6.9 4.5c2.1 0 3.6 1.2 5.1 3 1.5-1.8 3-3 5.1-3 3.7 0 6 3.7 4.5 7.2C19.5 16.4 12 21 12 21z" fill="{COL['Wut']}"/></svg></div>
<div class="h1 c">Du bist nicht allein.</div><div class="p c">Wenn es gerade zu viel ist, kannst du jederzeit mit jemandem sprechen, kostenlos und anonym.</div>
<div class="btn">📞 Telefonseelsorge anrufen</div><div class="nums">0800 111 0 111 · 0800 111 0 222</div>
<div class="card2">Rund um die Uhr erreichbar, auch per Chat und Mail.</div></div>
<div class="grow"></div><div class="link">Zurück zum Schreiben</div>''',"Ruhig und warm, ohne Alarmfarben. Nie automatisch ausgelöst."))
CSS='''
body{margin:0;background:#EFE8DD;font-family:Nunito,sans-serif;color:#3B3A45}
.head{padding:44px 56px 8px}.head h1{margin:0;font-size:32px;font-weight:800}.head p{margin:6px 0 0;color:#7A7684;font-size:16px}
.grid{display:grid;grid-template-columns:repeat(4,350px);gap:36px 40px;padding:28px 56px 56px}
.lbl{font-weight:800;font-size:16px;margin-bottom:12px}.note{font-size:13px;color:#7A7684;margin-top:14px;line-height:1.45;padding:0 4px}
.phone{width:350px;height:740px;background:#FBF7F1;border-radius:44px;box-shadow:0 24px 48px rgba(80,60,40,.16),0 0 0 9px #2E2D35;padding:14px 24px 22px;box-sizing:border-box;display:flex;flex-direction:column;position:relative;overflow:hidden}
.status{display:flex;justify-content:space-between;font-size:13px;font-weight:700;margin-bottom:22px;color:#3B3A45}
.col{display:flex;flex-direction:column}.center{align-items:center}.grow{flex:1}.row{display:flex;align-items:center;gap:10px}.between{justify-content:space-between}
.h1{font-size:26px;font-weight:800;line-height:1.2;margin-bottom:10px}.h1.c,.p.c{text-align:center}.nomb{margin:0}
.p{font-size:15px;color:#7A7684;line-height:1.5;margin-bottom:18px}.p.sm{font-size:13.5px}
.illu{margin:30px 0 26px}
.opt{display:flex;align-items:center;gap:12px;background:#FFFDF8;border:1px solid #ECE4D7;border-radius:18px;padding:14px 16px;width:100%;box-sizing:border-box}
.opt b{display:block;font-size:15px}.opt small{color:#7A7684;font-size:13px}.opt div{flex:1}
.tog{width:44px;height:26px;border-radius:13px;background:#93C4A0;position:relative}.tog:after{content:"";position:absolute;right:3px;top:3px;width:20px;height:20px;border-radius:50%;background:#fff}
.btn{background:#3B3A45;color:#fff;border-radius:18px;padding:15px;text-align:center;font-weight:800;font-size:16px}
.btn.ghost{background:transparent;color:#3B3A45;border:1.5px solid #D9D0C2;margin-bottom:14px}.btn.sm{padding:11px 22px;font-size:15px;border-radius:15px}
.link{text-align:center;color:#7A7684;font-weight:700;font-size:14px;margin-top:12px}
.date{text-align:center;color:#7A7684;font-weight:700;font-size:13px;margin-bottom:6px}
.wheel{display:flex;justify-content:center;margin:12px 0 16px}
.nav{display:flex;justify-content:space-around;border-top:1px solid #ECE4D7;margin:0 -24px -22px;padding:10px 0 18px;background:#FFFDF8}
.nav div{display:flex;flex-direction:column;align-items:center;font-size:11.5px;font-weight:700;color:#A9A4B2;gap:2px}.nav span{font-size:18px}.nav .on{color:#3B3A45}
.back{color:#7A7684;font-weight:700;font-size:14px;margin-bottom:14px}
.tag{display:inline-block;align-self:flex-start;padding:6px 14px;border-radius:20px;font-weight:800;font-size:13px;margin-bottom:14px}.tag.sm{font-size:12px;padding:5px 12px;margin:0}
.chips{display:flex;flex-wrap:wrap;gap:9px;margin-bottom:22px}
.chip{padding:10px 16px;border-radius:22px;font-weight:700;font-size:14.5px;border:1.5px solid var(--c);background:#FFFDF8}
.chip.sel{background:var(--c);box-shadow:inset 0 0 0 1.5px #3B3A45;border-color:transparent}.chip.sel:before{content:"✓ "}
.sub{font-weight:800;font-size:14px;margin-bottom:12px}.sub span{color:#A9A4B2;font-weight:600}
.hint{border-radius:16px;padding:13px 15px;font-size:13.5px;line-height:1.45;color:#4f5c70}
.x{font-size:18px;color:#7A7684}
.prompt{border-radius:20px;padding:16px 18px;margin:18px 0 18px;font-size:18px;font-weight:800;line-height:1.35}.prompt small{display:block;font-size:13px;color:#5d6f86;margin-top:8px;font-weight:700}
.write{flex:1;font-size:16.5px;line-height:1.65;color:#3B3A45;font-family:'Noto Serif',serif}
.caret{display:inline-block;width:2px;height:20px;background:#8BB0D8;vertical-align:-4px;margin-left:2px}
.foot{padding-top:10px}.saved{font-size:12.5px;color:#7A7684;font-weight:700}
.pill{align-self:flex-start;background:#e1efe5;color:#3f6b4b;font-weight:800;font-size:12.5px;padding:6px 12px;border-radius:14px;margin-bottom:14px}
.arrows{color:#7A7684;font-weight:800;letter-spacing:6px}
.cal{display:grid;grid-template-columns:repeat(7,1fr);gap:4px 0;margin:16px 0 14px;text-align:center}
.cal span{font-size:11px;color:#A9A4B2;font-weight:800;margin-bottom:6px}
.cal .d{font-size:13.5px;font-weight:700;height:36px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding-top:4px;box-sizing:border-box;border-radius:12px}
.cal .d i{width:8px;height:8px;border-radius:50%;margin-top:4px}.cal .today{box-shadow:inset 0 0 0 1.5px #3B3A45}
.entry{background:#FFFDF8;border:1px solid #ECE4D7;border-radius:18px;padding:13px 15px;margin-bottom:10px}.entry b{font-size:14px}.entry p{margin:6px 0 0;font-size:13.5px;color:#7A7684;line-height:1.4;font-family:'Noto Serif',serif}
.seg{display:flex;background:#F1ECE4;border-radius:14px;padding:4px;margin:6px 0 16px}.seg span{flex:1;text-align:center;padding:8px;font-weight:800;font-size:14px;color:#7A7684;border-radius:11px}.seg .on{background:#FFFDF8;color:#3B3A45;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.stat{display:flex;gap:10px;margin-bottom:18px}.stat div{flex:1;background:#FFFDF8;border:1px solid #ECE4D7;border-radius:16px;padding:12px 14px}.stat b{display:block;font-size:20px;font-weight:800}.stat div:last-child b{font-size:16px;padding-top:3px}.stat small{color:#7A7684;font-size:12px;font-weight:600}
.bar{display:flex;align-items:center;gap:10px;margin-bottom:10px;font-size:13px;font-weight:700}.bar span{width:96px}.bar div{flex:1;height:12px;background:#F1ECE4;border-radius:6px;overflow:hidden}.bar i{display:block;height:100%;border-radius:6px}
.insight{display:flex;gap:10px;border-radius:16px;padding:13px 15px;font-size:13.5px;line-height:1.45;margin-top:10px;font-weight:600}.insight span{color:#c99a2e}
.heart{width:110px;height:110px;border-radius:50%;background:#f6e0e0;display:flex;align-items:center;justify-content:center;margin-bottom:24px}
.nums{font-size:13px;color:#7A7684;font-weight:700;margin:10px 0 18px;text-align:center}
.center .btn{width:100%;box-sizing:border-box}
.card2{background:#FFFDF8;border:1px solid #ECE4D7;border-radius:16px;padding:12px 14px;font-size:13px;color:#7A7684;text-align:center}
'''
html=f'<html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="head"><h1>Gefühls-Journal · Screens v0.2</h1><p>Auf Basis der Wireframes v0.1 von UX · Stil: ruhig und warm · Inhalte und Zahlen sind Beispieldaten</p></div><div class="grid">{"".join(s)}</div></body></html>'
open("screens_v0.2.html","w").write(html)
