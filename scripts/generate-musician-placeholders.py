"""Generate original, code-drawn musician silhouette assets for the fallback roster."""
from pathlib import Path
import math, re
from PIL import Image, ImageDraw, ImageFilter

ROOT=Path(__file__).resolve().parents[1]
text=(ROOT/'data'/'artists.js').read_text(encoding='utf-8')
musicians=re.findall(r"\{id:'([^']+)'.*?nameEn:'([^']+)'.*?color:'(#[0-9a-fA-F]{6})'",text)
out=ROOT/'assets'/'characters'
out.mkdir(parents=True,exist_ok=True)

def mix(a,b,t): return tuple(round(a[i]*(1-t)+b[i]*t) for i in range(3))
def rgb(value): return tuple(int(value[i:i+2],16) for i in (1,3,5))

def make(musician,kind):
    ident,name,color_hex=musician
    accent=rgb(color_hex); w,h=(512,768) if kind=='gallery' else (640,768)
    image=Image.new('RGB',(w,h),(4,7,16)); base=ImageDraw.Draw(image)
    for y in range(h):
        vertical=max(0,1-abs(y-h*.38)/(h*.7))
        base.line((0,y,w,y),fill=mix((4,7,16),mix(accent,(18,24,48),.55),vertical*.42))
    glow=Image.new('RGBA',(w,h),(0,0,0,0)); g=ImageDraw.Draw(glow)
    for r in range(180,4,-7):
        alpha=int(2+22*(1-r/180))
        g.ellipse((w/2-r,h*.36-r,w/2+r,h*.36+r),fill=(*accent,alpha))
    image=Image.alpha_composite(image.convert('RGBA'),glow.filter(ImageFilter.GaussianBlur(14)))
    d=ImageDraw.Draw(image)
    # Musical staff and arena rings.
    for i in range(5): d.line((24,h*.16+i*18,w-24,h*.16+i*18),fill=(245,226,177,70),width=2)
    d.ellipse((w*.12,h*.78,w*.88,h*.92),outline=(*accent,170),width=5)
    # Original conductor silhouette; poses vary by frame.
    cx=w*.5; head_y=h*.31
    d.ellipse((cx-38,head_y-38,cx+38,head_y+38),fill=(7,9,18,255),outline=(*accent,255),width=5)
    body=[(cx-42,head_y+40),(cx-105,h*.72),(cx+108,h*.72),(cx+42,head_y+40)]
    d.polygon(body,fill=(6,8,17,255),outline=(*accent,255))
    if kind=='battle': arms=((cx-35,h*.43,cx-150,h*.54),(cx+35,h*.43,cx+150,h*.37))
    elif kind=='ultimate': arms=((cx-32,h*.43,cx-145,h*.25),(cx+32,h*.43,cx+145,h*.22))
    elif kind=='ko': arms=((cx-35,h*.48,cx-128,h*.67),(cx+35,h*.48,cx+125,h*.68))
    else: arms=((cx-35,h*.43,cx-118,h*.51),(cx+35,h*.43,cx+126,h*.34))
    for x1,y1,x2,y2 in arms: d.line((x1,y1,x2,y2),fill=(7,9,18,255),width=24); d.line((x1,y1,x2,y2),fill=(*accent,255),width=4)
    # Baton and note emblem.
    d.line((arms[1][2],arms[1][3],arms[1][2]+62,arms[1][3]-88),fill=(250,236,194,255),width=5)
    d.ellipse((cx-26,h*.5-26,cx+26,h*.5+26),fill=(*accent,255))
    d.text((cx,h*.5),'♪',anchor='mm',fill=(255,250,228,255),font=None)
    initials=''.join(part[0] for part in name.replace('-',' ').split()[:3]).upper()
    d.text((w/2,h*.84),initials,anchor='mm',fill=(250,235,194,255),stroke_width=1,stroke_fill=(0,0,0,255))
    d.text((w/2,h*.89),kind.upper(),anchor='mm',fill=(*accent,255))
    image=image.convert('RGB')
    if kind=='gallery': image.save(out/f'{ident}-gallery.png',optimize=True)
    else: image.save(out/f'{ident}-{kind}.webp',format='WEBP',quality=90,method=6)

for musician in musicians:
    for kind in ('gallery','battle','ultimate','ko'): make(musician,kind)
print(f'generated {len(musicians)*4} assets for {len(musicians)} musicians')
