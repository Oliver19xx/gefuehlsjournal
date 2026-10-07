import math
cores = [
 ("Freude", "#F2C35B", [("Stolz",["selbstbewusst","erfolgreich"]),("Optimismus",["hoffnungsvoll","inspiriert"])]),
 ("Geborgenheit", "#93C4A0", [("Vertrauen",["sicher","angenommen"]),("Gelassenheit",["entspannt","zufrieden"])]),
 ("Überraschung", "#F0A487", [("Staunen",["fasziniert","ehrfürchtig"]),("Verwirrung",["unsicher","überwältigt"])]),
 ("Trauer", "#8BB0D8", [("Einsamkeit",["verlassen","isoliert"]),("Enttäuschung",["entmutigt","verletzt"])]),
 ("Angst", "#B3A3D6", [("Sorge",["nervös","unruhig"]),("Verletzlichkeit",["schutzlos","hilflos"])]),
 ("Wut", "#E09696", [("Frust",["gereizt","ungeduldig"]),("Kränkung",["verbittert","missachtet"])]),
]
def mix(h, t):
    h=h.lstrip('#'); r,g,b=[int(h[i:i+2],16) for i in (0,2,4)]
    r,g,b=[round(c+(255-c)*t) for c in (r,g,b)]
    return f"#{r:02x}{g:02x}{b:02x}"
def arc(cx,cy,r0,r1,a0,a1):
    p=lambda r,a:(cx+r*math.cos(math.radians(a)),cy+r*math.sin(math.radians(a)))
    large=1 if a1-a0>180 else 0
    x0,y0=p(r1,a0);x1,y1=p(r1,a1);x2,y2=p(r0,a1);x3,y3=p(r0,a0)
    return f"M{x0:.1f},{y0:.1f} A{r1},{r1} 0 {large} 1 {x1:.1f},{y1:.1f} L{x2:.1f},{y2:.1f} A{r0},{r0} 0 {large} 0 {x3:.1f},{y3:.1f} Z"
def label(cx,cy,r,a,text,size,weight,color="#3B3A45",radial=False):
    x=cx+r*math.cos(math.radians(a)); y=cy+r*math.sin(math.radians(a))
    if radial:
        rot=a if -90<=((a+180)%360-180)<=90 else a+180
    else:
        rot=a+90
        if 0<(a%360)<180: rot=a-90
    return f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" font-weight="{weight}" fill="{color}" text-anchor="middle" dominant-baseline="central" transform="rotate({rot:.1f} {x:.1f} {y:.1f})">{text}</text>'
def wheel(cx,cy,R,scale=1.0,highlight=None):
    s=[]; n=len(cores); seg=360/n; start=-90-seg/2
    r0,r1,r2,r3=R*0.18,R*0.45,R*0.72,R
    s.append(f'<circle cx="{cx}" cy="{cy}" r="{r0}" fill="#FFFDF8"/>')
    for i,(name,col,subs) in enumerate(cores):
        a0=start+i*seg;a1=a0+seg
        dim = highlight is not None and highlight!=name
        op = ' opacity="0.35"' if dim else ''
        s.append(f'<g{op}>')
        s.append(f'<path d="{arc(cx,cy,r0,r1,a0,a1)}" fill="{col}" stroke="#FFFDF8" stroke-width="{3*scale}"/>')
        s.append(label(cx,cy,(r0+r1)/2,(a0+a1)/2,name,13*scale,700,radial=True))
        sub=seg/len(subs)
        for j,(sn,ts) in enumerate(subs):
            b0=a0+j*sub;b1=b0+sub
            s.append(f'<path d="{arc(cx,cy,r1,r2,b0,b1)}" fill="{mix(col,0.38)}" stroke="#FFFDF8" stroke-width="{3*scale}"/>')
            s.append(label(cx,cy,(r1+r2)/2,(b0+b1)/2,sn,11*scale,600,radial=True))
            tt=sub/len(ts)
            for k,t in enumerate(ts):
                c0=b0+k*tt;c1=c0+tt
                s.append(f'<path d="{arc(cx,cy,r2,r3,c0,c1)}" fill="{mix(col,0.68)}" stroke="#FFFDF8" stroke-width="{3*scale}"/>')
                s.append(label(cx,cy,(r2+r3)/2,(c0+c1)/2,t,10*scale,500,radial=True))
        s.append('</g>')
    return "\n".join(s)

FONT="'Nunito', sans-serif"
# Image 1: wheel + palette
sw="".join(f'''<div class="sw"><div class="chips"><div style="background:{c}"></div><div style="background:{mix(c,.38)}"></div><div style="background:{mix(c,.68)}"></div></div><div class="n">{n}</div><div class="h">{c}</div></div>''' for n,c,_ in cores)
html1=f'''<html><head><style>
body{{margin:0;background:#FBF7F1;font-family:{FONT};color:#3B3A45}}
.wrap{{display:flex;gap:56px;padding:56px;align-items:center}}
h1{{font-size:34px;margin:0 0 6px;font-weight:800}} p{{margin:0 0 28px;color:#7A7684;font-size:16px;line-height:1.5}}
.sw{{display:flex;align-items:center;gap:16px;margin-bottom:16px}}
.chips{{display:flex;border-radius:14px;overflow:hidden}} .chips div{{width:44px;height:44px}}
.n{{font-weight:700;font-size:17px;width:130px}} .h{{color:#9A96A3;font-size:14px;font-family:monospace}}
.note{{margin-top:24px;font-size:14px;color:#7A7684;line-height:1.6;max-width:380px}}
.base{{display:flex;gap:10px;margin-top:20px}} .base div{{width:60px;height:36px;border-radius:10px;font-size:10px;display:flex;align-items:flex-end;padding:4px 6px;box-sizing:border-box;border:1px solid #eee5d8}}
</style></head><body><div class="wrap">
<svg width="720" height="720" viewBox="0 0 720 720" font-family="Nunito">{wheel(360,360,350,1.15)}
<text x="360" y="352" text-anchor="middle" font-size="15" font-weight="800" fill="#3B3A45">Wie fühlst</text>
<text x="360" y="372" text-anchor="middle" font-size="15" font-weight="800" fill="#3B3A45">du dich?</text></svg>
<div><h1>Gefühlsrad · Farbsystem</h1><p>Entwurf v0.1, ruhig und warm.<br>Innen Grundgefühl, außen Feinabstufung.</p>{sw}
<div class="base"><div style="background:#FBF7F1">Papier</div><div style="background:#FFFDF8">Fläche</div><div style="background:#3B3A45;color:#fff">Text</div><div style="background:#7A7684;color:#fff">Sekundär</div></div>
<div class="note">Keine Signalfarben: Wut ist ein gedämpftes Rosé statt Alarm-Rot, damit kein Gefühl als „falsch“ wirkt. Jede Ebene ist eine aufgehellte Stufe der Grundfarbe (100 %, 62 %, 32 % Farbstärke).</div></div>
</div></body></html>'''
open("wheel.html","w").write(html1)

# Image 2: phone mockups
def phone(inner):
    return f'<div class="phone"><div class="notch"></div>{inner}</div>'
s1=phone(f'''<div class="top"><span>Mi, 7. Okt</span><span class="lock">🔒</span></div>
<div class="title">Wie fühlst du dich<br>gerade?</div><div class="sub">Tippe auf das, was am ehesten passt.<br>Es gibt kein richtig oder falsch.</div>
<svg width="330" height="330" viewBox="0 0 330 330" font-family="Nunito">{wheel(165,165,160,0.52,highlight="Geborgenheit")}</svg>
<div class="chipsel"><span style="background:{mix("#93C4A0",.38)}">Gelassenheit</span><span style="background:{mix("#93C4A0",.68)}">entspannt</span></div>
<div class="btn">Weiter</div><div class="skip">Lieber direkt schreiben</div>''')
s2=phone(f'''<div class="top"><span>‹ Zurück</span><span class="lock">🔒</span></div>
<div class="tag" style="background:{mix("#93C4A0",.6)}">● Geborgenheit · entspannt</div>
<div class="prompt">Was hat heute dazu beigetragen, dass du zur Ruhe kommen konntest?</div>
<div class="paper"><span class="ph">Schreib einfach los, nur für dich …</span><div class="caret"></div></div>
<div class="hint">🔒 Bleibt auf deinem Gerät</div>
<div class="row"><div class="ghost">Anderer Impuls</div><div class="btn sm">Speichern</div></div>''')
s3=phone(f'''<div class="top"><span>Dein Oktober</span><span class="lock">🔒</span></div>
<div class="title sm">Rückblick</div><div class="sub">Diese Woche warst du oft gelassen.</div>
<div class="cal">{"".join(f'<div style="background:{c}"></div>' for c in [mix(x,.3) for x in ["#93C4A0","#F2C35B","#8BB0D8","#93C4A0","#F0A487","#93C4A0","#B3A3D6","#F2C35B","#93C4A0","#E09696","#93C4A0","#F2C35B","#8BB0D8","#93C4A0"]]+["#F1ECE4"]*14)}</div>
<div class="bars">{"".join(f'<div class="bar"><span>{n}</span><div><i style="width:{w}%;background:{c}"></i></div></div>' for n,c,w in [("Geborgenheit","#93C4A0",86),("Freude","#F2C35B",58),("Trauer","#8BB0D8",34),("Überraschung","#F0A487",22),("Angst","#B3A3D6",18),("Wut","#E09696",12)])}</div>
<div class="card">„Ich habe gemerkt, dass Spaziergänge mir guttun.“<small>Eintrag vom 3. Okt</small></div>''')
html2=f'''<html><head><style>
body{{margin:0;background:#EFE8DD;font-family:{FONT};color:#3B3A45}}
.wrap{{display:flex;gap:48px;padding:56px 64px;justify-content:center}}
.phone{{width:360px;height:760px;background:#FBF7F1;border-radius:46px;box-shadow:0 30px 60px rgba(80,60,40,.18),0 0 0 10px #2E2D35;padding:44px 22px 24px;box-sizing:border-box;position:relative;display:flex;flex-direction:column;align-items:center}}
.notch{{position:absolute;top:12px;width:110px;height:26px;background:#2E2D35;border-radius:14px}}
.top{{width:100%;display:flex;justify-content:space-between;font-size:14px;color:#7A7684;font-weight:600;margin-bottom:18px}}
.title{{font-size:27px;font-weight:800;text-align:center;line-height:1.2;margin-bottom:8px;width:100%}} .title.sm{{text-align:left}}
.sub{{font-size:14px;color:#7A7684;text-align:center;line-height:1.45;margin-bottom:10px;width:100%}}
.title.sm+.sub{{text-align:left}}
.chipsel{{display:flex;gap:8px;margin:8px 0 18px}} .chipsel span{{padding:7px 14px;border-radius:20px;font-size:13px;font-weight:700}}
.btn{{background:#3B3A45;color:#fff;border-radius:18px;padding:15px 0;width:100%;text-align:center;font-weight:700;font-size:16px}}
.btn.sm{{width:auto;padding:13px 26px}}
.skip{{margin-top:14px;font-size:14px;color:#7A7684;font-weight:600}}
.tag{{align-self:flex-start;padding:7px 14px;border-radius:20px;font-size:13px;font-weight:700;margin-bottom:18px}}
.prompt{{font-size:23px;font-weight:800;line-height:1.3;margin-bottom:20px;align-self:flex-start}}
.paper{{flex:1;width:100%;background:#FFFDF8;border-radius:22px;padding:20px;box-sizing:border-box;border:1px solid #EDE5D8;position:relative}}
.ph{{color:#B0ABB8;font-size:16px}} .caret{{position:absolute;left:20px;top:18px;width:2px;height:24px;background:#93C4A0}}
.hint{{font-size:12px;color:#9A96A3;margin:12px 0}}
.row{{display:flex;width:100%;justify-content:space-between;align-items:center}} .ghost{{font-weight:700;color:#7A7684;font-size:15px}}
.cal{{display:grid;grid-template-columns:repeat(7,1fr);gap:7px;width:100%;margin:14px 0 22px}} .cal div{{aspect-ratio:1;border-radius:10px}}
.bars{{width:100%}} .bar{{display:flex;align-items:center;gap:10px;margin-bottom:9px;font-size:13px;font-weight:600}} .bar span{{width:100px}} .bar div{{flex:1;height:12px;background:#F1ECE4;border-radius:6px;overflow:hidden}} .bar i{{display:block;height:100%;border-radius:6px}}
.card{{margin-top:auto;background:#FFFDF8;border:1px solid #EDE5D8;border-radius:20px;padding:16px;font-size:15px;font-weight:600;line-height:1.4;width:100%;box-sizing:border-box}} .card small{{display:block;color:#9A96A3;font-weight:500;margin-top:6px}}
</style></head><body><div class="wrap">{s1}{s2}{s3}</div></body></html>'''
open("screens.html","w").write(html2)
