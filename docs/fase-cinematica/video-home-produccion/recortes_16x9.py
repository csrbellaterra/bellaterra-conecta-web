# Recortes 16:9 para Runway a partir de los originales (solo lectura). Salida 3840x2160 JPG q92.
import os, hashlib
from PIL import Image, ImageOps, ImageDraw, ImageFont
L = r"C:\Users\aleix\OneDrive\Escritorio\BellaterraConecta\Fotos Casa\Fotos Video Landing General"
E = r"C:\Users\aleix\OneDrive\Escritorio\BellaterraConecta\Fotos Casa\FOTOS CASA comprimido\exterior\Casa\Entrada Casa parte delantera"
OUT = r"C:\BellaterraConecta\Bellaterra Web\docs\fase-cinematica\video-home-produccion\01-imagenes-runway"
# (n, origen, slug, fracción del sobrante que se quita ARRIBA, ancho relativo, ancla x 0..1, foco móvil x 0..1)
SHOTS = [
 (1,  os.path.join(E, "_RA60581.jpg"), "entrada-camino",     0.85, 1.00, 0.5, 0.70),
 (2,  os.path.join(E, "_RA60591.jpg"), "entrada-arbol",      0.65, 1.00, 0.5, 0.58),
 (3,  os.path.join(L, "3.JPG"),        "piscina-ramas",      1.00, 1.00, 0.5, 0.55),
 (4,  os.path.join(L, "4.JPG"),        "piscina-barbacoa",   0.40, 1.00, 0.5, 0.55),
 (5,  os.path.join(L, "5.jpg"),        "piscina-ras-agua",   0.55, 1.00, 0.5, 0.40),
 (6,  os.path.join(L, "6.jpg"),        "fachada-trasera",    0.75, 1.00, 0.5, 0.42),
 (7,  os.path.join(L, "7.jpg"),        "porche-comedor",     0.70, 1.00, 0.5, 0.50),
 (8,  os.path.join(L, "8.jpg"),        "terraza-pistas",     0.35, 1.00, 0.5, 0.55),
 (9,  os.path.join(L, "9.jpg"),        "jardin-vistas",      0.50, 1.00, 0.5, 0.50),
 (10, os.path.join(L, "10.jpg"),       "terraza-toldo",      0.20, 1.00, 0.5, 0.55),
 (11, os.path.join(L, "11.jpg"),       "terraza-chillout",   0.45, 1.00, 0.5, 0.45),
 (12, os.path.join(L, "12.jpg"),       "pistas-casa",        0.30, 0.95, 0.0, 0.50),
 (13, os.path.join(L, "13.JPG"),       "pistas-horizonte",   0.40, 1.00, 0.5, 0.45),
]
thumbs = []
for n, src, slug, top, wf, ax, fx in SHOTS:
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    W, H = im.size
    cw = round(W * wf); ch = round(cw * 9 / 16)
    assert ch <= H, (n, ch, H)
    x0 = round((W - cw) * ax); y0 = round((H - ch) * top)
    crop = im.crop((x0, y0, x0 + cw, y0 + ch)).resize((3840, 2160), Image.LANCZOS)
    name = f"{n:02d}_{slug}_16x9.jpg"
    p = os.path.join(OUT, name)
    crop.save(p, quality=92, optimize=True)
    md5 = hashlib.md5(open(src, "rb").read()).hexdigest()[:8]
    print(f"{n:02d} | {name} | src {os.path.basename(src)} {W}x{H} md5 {md5} | crop x{x0} y{y0} {cw}x{ch} | {os.path.getsize(p)//1024} KB")
    t = crop.resize((640, 360), Image.LANCZOS); d = ImageDraw.Draw(t)
    mw = round(360 * 9 / 16); mx = min(max(round(640 * fx - mw / 2), 0), 640 - mw)
    d.rectangle([mx, 0, mx + mw - 1, 359], outline=(255, 210, 0), width=2)
    d.rectangle([0, 0, 120, 26], fill=(0, 0, 0)); d.text((8, 6), f"{n:02d} {slug}", fill=(255, 255, 255))
    thumbs.append(t)
sheet = Image.new("RGB", (640 * 4 + 50, 360 * 4 + 50), (245, 242, 235))
for i, t in enumerate(thumbs):
    sheet.paste(t, (10 + (i % 4) * 650, 10 + (i // 4) * 370))
sp = os.path.join(os.path.dirname(OUT), "recortes-16x9.jpg"); sheet.save(sp, quality=80); print(sp, sheet.size)
