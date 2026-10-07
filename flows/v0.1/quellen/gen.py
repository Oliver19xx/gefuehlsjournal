import math
def wheel(size=220, highlight=None):
    c=size/2; R=[c*0.28,c*0.62,c*0.97]
    s=f'<svg width="{size}" height="{size}" viewBox="0 0 {size} {size}">'
    for r in R[::-1]: s+=f'<circle cx="{c}" cy="{c}" r="{r}" fill="#fff" stroke="#555" stroke-width="1.5"/>'
    names=["Freude","Ruhe","Überr.","Angst","Trauer","Wut"]
    for i in range(6):
        a=math.radians(i*60-90)
        s+=f'<line x1="{c+R[0]*math.cos(a)}" y1="{c+R[0]*math.sin(a)}" x2="{c+R[2]*math.cos(a)}" y2="{c+R[2]*math.sin(a)}" stroke="#555" stroke-width="1.5"/>'
        for k in (1,2):
            b=math.radians(i*60-90+k*20)
            s+=f'<line x1="{c+R[1]*math.cos(b)}" y1="{c+R[1]*math.sin(b)}" x2="{c+R[2]*math.cos(b)}" y2="{c+R[2]*math.sin(b)}" stroke="#999" stroke-width="1"/>'
        m=math.radians(i*60-60); rr=(R[0]+R[1])/2
        fill="#222" if highlight==i else "#444"
        if highlight==i:
            # shade segment
            a1=math.radians(i*60-90);a2=math.radians(i*60-30)
            p=f'M{c+R[0]*math.cos(a1)},{c+R[0]*math.sin(a1)} L{c+R[1]*math.cos(a1)},{c+R[1]*math.sin(a1)} A{R[1]},{R[1]} 0 0 1 {c+R[1]*math.cos(a2)},{c+R[1]*math.sin(a2)} L{c+R[0]*math.cos(a2)},{c+R[0]*math.sin(a2)} A{R[0]},{R[0]} 0 0 0 {c+R[0]*math.cos(a1)},{c+R[0]*math.sin(a1)}Z'
            s+=f'<path d="{p}" fill="#d0d0d0" stroke="#222" stroke-width="2"/>'
        s+=f'<text x="{c+rr*math.cos(m)}" y="{c+rr*math.sin(m)+4}" font-size="11" text-anchor="middle" fill="{fill}" font-weight="{"700" if highlight==i else "400"}">{names[i]}</text>'
    s+=f'<circle cx="{c}" cy="{c}" r="{R[0]}" fill="#f2f2f2" stroke="#555" stroke-width="1.5"/><text x="{c}" y="{c+4}" font-size="10" text-anchor="middle" fill="#666">Tippen</text></svg>'
    return s

def phone(n,title,body,note):
    return f'''<div class="col"><div class="label">{n}. {title}</div><div class="phone"><div class="status">9:41</div>{body}</div><div class="note">{note}</div></div>'''

btn=lambda t,p=False:f'<div class="btn {"pri" if p else ""}">{t}</div>'
chip=lambda t,on=False:f'<span class="chip {"on" if on else ""}">{t}</span>'
lines=lambda n:''.join(f'<div class="line" style="width:{w}%"></div>' for w in ([92,85,95,70,88,60,90,40][:n]))
nav='<div class="nav"><span>Heute</span><span>Einträge</span><span>Rückblick</span></div>'

s=[]
s.append(phone(1,"Erster Start",'''<div class="pad center"><div class="ph-img">Illustration</div><h2>Dein Raum.<br>Nur für dich.</h2><p class="muted">Alles bleibt auf deinem Gerät. Niemand sonst kann mitlesen.</p><div class="box">🔒 App-Sperre mit Face ID / Code</div><div class="grow"></div>'''+btn("Sperre einrichten & los",True)+'<div class="link">Später</div></div>',"Onboarding in unter einer Minute: Sperre, ein Satz Datenschutz, dann direkt zum ersten Eintrag."))
s.append(phone(2,"Gefühl wählen",'<div class="pad center"><div class="muted small">Mittwoch, 7. Okt.</div><h2>Wie geht es dir gerade?</h2><div class="wheelwrap">'+wheel(230,4)+'</div><p class="muted small">Tippe auf ein Gefühl. Du kannst danach genauer werden.</p><div class="grow"></div>'+btn("Lieber direkt schreiben")+'</div>'+nav,"Einstieg über das Rad. Zweiter Weg zum direkten Schreiben ist immer sichtbar."))
s.append(phone(3,"Genauer werden",'<div class="pad"><div class="back">‹ Zurück</div><div class="muted small">Trauer</div><h2>Was trifft es eher?</h2><div class="chips">'+chip("einsam")+chip("enttäuscht",True)+chip("verletzt")+chip("schuldig")+chip("hoffnungslos")+chip("erschöpft")+'</div><div class="muted small" style="margin-top:14px">Noch genauer (optional)</div><div class="chips">'+chip("übergangen",True)+chip("im Stich gelassen")+chip("ernüchtert")+'</div><div class="grow"></div>'+btn("Weiter zum Schreiben",True)+'<div class="link">Überspringen</div></div>',"Ebene 2 und 3 als Auswahl-Chips, jederzeit überspringbar. Mehrfachauswahl möglich."))
s.append(phone(4,"Schreiben mit Impuls",'<div class="pad"><div class="row"><span class="back">✕</span><span class="tag">Trauer · enttäuscht</span></div><div class="prompt">Was hast du dir anders gewünscht?<div class="small link2">↻ Anderer Impuls</div></div><div class="editor">'+lines(6)+'<span class="cursor">|</span></div><div class="grow"></div><div class="row"><span class="muted small">Automatisch gespeichert</span>'+btn("Fertig",True).replace('class="btn','class="btn sm')+'</div></div>',"Impuls passend zum Gefühl, austauschbar. Kein Wortzähler, kein Druck. Speichert automatisch."))
s.append(phone(5,"Gefühl nachtragen",'<div class="pad"><div class="ok">✓ Eintrag gespeichert</div><h2>Magst du noch festhalten, wie es dir ging?</h2><p class="muted small">Hilft dir später im Rückblick, Muster zu erkennen.</p><div class="wheelwrap">'+wheel(190)+'</div><div class="grow"></div>'+btn("Gefühl wählen",True)+'<div class="link">Nein, danke</div></div>',"Nur nach direktem Schreiben. Optional, ein Tipp zum Überspringen."))
cal='<span></span>'*3+''.join(f'<span class="d {c}">{i}</span>' for i,c in zip(range(1,32),(["","f","t","","w","f","t"]*5)[:31]))
s.append(phone(6,"Einträge & Kalender",'<div class="pad"><h2>Oktober 2026</h2><div class="cal">'+''.join(f'<span class="wd">{d}</span>' for d in "MDMDFSS")+cal+'</div><div class="entry"><b>Mi, 7. Okt.</b> <span class="tag">Trauer</span>'+lines(2)+'</div><div class="entry"><b>Di, 6. Okt.</b> <span class="tag">Freude</span>'+lines(2)+'</div></div>'+nav,"Punkte im Kalender zeigen das Gefühl des Tages (Farbe kommt von UI). Tippen öffnet den Eintrag."))
bars=''.join(f'<div class="bar"><span>{n}</span><div style="width:{w}%"></div></div>' for n,w in [("Freude",70),("Ruhe",45),("Trauer",35),("Angst",20),("Wut",15),("Überr.",10)])
s.append(phone(7,"Rückblick",'<div class="pad"><h2>Dein Oktober</h2><div class="seg"><span class="on">Woche</span><span>Monat</span></div><div class="box">12 Einträge · häufigstes Gefühl: Freude</div><div class="muted small" style="margin:10px 0 4px">Gefühle im Überblick</div>'+bars+'<div class="box soft">Dir ging es oft besser an Tagen, an denen du morgens geschrieben hast.</div></div>'+nav,"Einfache Muster, wertungsfrei formuliert. Keine Streaks, kein schlechtes Gewissen."))
s.append(phone(8,"Schwere Momente",'<div class="pad center"><div class="ph-img small2">♡</div><h2>Du bist nicht allein.</h2><p class="muted">Wenn es gerade zu viel ist, kannst du jederzeit mit jemandem sprechen, kostenlos und anonym.</p>'+btn("Telefonseelsorge anrufen",True)+'<div class="muted small">0800 111 0 111 · 0800 111 0 222</div><div class="grow"></div><div class="link">Zurück zum Schreiben</div></div>',"Erreichbar aus dem Menü und als sanfter Hinweis. Nie aufdringlich, nie automatisch ausgelöst."))

css='''body{margin:0;padding:30px;background:#ececec;font-family:"Inter","DejaVu Sans",sans-serif;color:#222}
h1{font-size:22px;margin:0 0 4px}.sub{color:#666;margin-bottom:24px;font-size:14px}
.grid{display:grid;grid-template-columns:repeat(4,290px);gap:28px}
.label{font-weight:700;font-size:14px;margin-bottom:8px}.note{font-size:12px;color:#555;margin-top:8px;line-height:1.4}
.phone{width:290px;height:580px;background:#fff;border:2px solid #333;border-radius:30px;overflow:hidden;display:flex;flex-direction:column;position:relative}
.status{font-size:11px;padding:10px 22px 0;color:#888}
.pad{padding:12px 18px 16px;display:flex;flex-direction:column;flex:1}.center{text-align:center;align-items:center}
h2{font-size:19px;margin:8px 0;line-height:1.25}.muted{color:#777;font-size:13px;line-height:1.4}.small{font-size:11.5px}
.grow{flex:1}.btn{border:1.5px solid #333;border-radius:22px;padding:10px;text-align:center;font-size:13px;width:100%;box-sizing:border-box;margin-top:6px}
.btn.pri{background:#333;color:#fff}.btn.sm{width:auto;padding:7px 16px;margin:0}
.link{font-size:12px;color:#666;text-decoration:underline;margin-top:8px;text-align:center;align-self:center}
.ph-img{width:150px;height:110px;border:1.5px dashed #aaa;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#aaa;font-size:12px;margin:14px 0}
.small2{width:70px;height:70px;font-size:28px;border-radius:50%}
.box{border:1.5px solid #bbb;border-radius:12px;padding:10px;font-size:12.5px;margin-top:10px;width:100%;box-sizing:border-box;text-align:left}.soft{background:#f3f3f3;border-style:dashed}
.wheelwrap{margin:8px 0}.back{font-size:13px;color:#555}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.chip{border:1.5px solid #888;border-radius:16px;padding:6px 11px;font-size:12px}.chip.on{background:#333;color:#fff;border-color:#333}
.row{display:flex;justify-content:space-between;align-items:center}.tag{background:#e6e6e6;border-radius:10px;padding:3px 9px;font-size:11px}
.prompt{background:#f3f3f3;border-radius:12px;padding:12px;font-size:14px;margin:12px 0;font-style:italic}.link2{font-style:normal;color:#666;margin-top:6px}
.editor{padding:4px 2px}.line{height:8px;background:#ddd;border-radius:4px;margin:9px 0}.cursor{font-weight:700}
.ok{font-size:12px;color:#555;background:#eee;border-radius:10px;padding:6px 10px;align-self:flex-start}
.nav{display:flex;justify-content:space-around;border-top:1.5px solid #ccc;padding:10px 0 14px;font-size:11px;color:#555}
.cal{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center;font-size:11px;margin:6px 0 12px}.wd{color:#999;font-weight:700}
.d{padding:5px 0;border-radius:50%;position:relative}.d.f::after,.d.t::after,.d.w::after{content:"";position:absolute;left:50%;bottom:0;width:5px;height:5px;margin-left:-2.5px;border-radius:50%;background:#888}.d.t::after{background:#444}.d.w::after{background:#bbb}
.entry{border-top:1px solid #ddd;padding:8px 0;font-size:12px}
.seg{display:flex;border:1.5px solid #888;border-radius:16px;overflow:hidden;font-size:12px;margin:4px 0}.seg span{flex:1;text-align:center;padding:5px}.seg .on{background:#333;color:#fff}
.bar{display:flex;align-items:center;font-size:11px;margin:5px 0}.bar span{width:50px}.bar div{height:10px;background:#999;border-radius:5px}'''
html=f'<html><head><meta charset="utf-8"><style>{css}</style></head><body><h1>Gefühls-Journal · Wireframes v0.1</h1><div class="sub">Low-Fidelity, Struktur und Flow · Farben, Typo und finale Gestaltung kommen von UI · Gefühlsnamen am Rad sind Platzhalter</div><div class="grid">{"".join(s)}</div></body></html>'
open("index.html","w").write(html)
