"""Derivados del prototipo /experimento-scroll: secuencias WebP (desktop y móvil) + pósters.
Lee los MP4 originales (solo lectura) y escribe en public/experimento-scroll-media (fuera de git)."""
import json, os, subprocess, sys, tempfile
from PIL import Image

ROOT = sys.argv[1]  # raíz del repo
CLIPS = os.path.join(ROOT, "docs", "fase-cinematica", "higgsfield-pack", "04-clips-generados")
OUT = os.path.join(ROOT, "public", "experimento-scroll-media")
# id, archivo original, nº de fotogramas a usar, centro horizontal del recorte móvil (0–1)
SCENES = [("ia1", "IA-1_v1.mp4", 121, 0.45), ("ia7", "IA-7_v1.mp4", 84, 0.5)]
MOBILE_STEP = 2  # móvil: 12 fps efectivos

manifest = {}
for sid, fn, n, cx in SCENES:
    tmp = tempfile.mkdtemp()
    subprocess.run(["ffmpeg", "-v", "error", "-i", os.path.join(CLIPS, fn), "-frames:v", str(n), "-an",
                    os.path.join(tmp, "%03d.png")], check=True)
    frames = sorted(os.listdir(tmp))[:n]
    d, m = os.path.join(OUT, sid, "d"), os.path.join(OUT, sid, "m")
    os.makedirs(d, exist_ok=True); os.makedirs(m, exist_ok=True)
    mi = 0
    for i, f in enumerate(frames):
        im = Image.open(os.path.join(tmp, f)).convert("RGB")
        im.save(os.path.join(d, f"{i:03d}.webp"), quality=78, method=6)
        if i % MOBILE_STEP == 0 or i == len(frames) - 1:
            w, h = im.size; cw = round(h * 3 / 4)
            x0 = min(max(round(w * cx - cw / 2), 0), w - cw)
            im.crop((x0, 0, x0 + cw, h)).save(os.path.join(m, f"{mi:03d}.webp"), quality=72, method=6)
            mi += 1
        if i in (0, len(frames) - 1):
            tag = "first" if i == 0 else "last"
            im.save(os.path.join(OUT, sid, f"poster-{tag}.jpg"), quality=86, optimize=True)
    manifest[sid] = {"desktop": len(frames), "mobile": mi, "width": im.size[0], "height": im.size[1]}

size = lambda p: sum(os.path.getsize(os.path.join(r, f)) for r, _, fs in os.walk(p) for f in fs)
for sid in manifest:
    manifest[sid]["MB_desktop"] = round(size(os.path.join(OUT, sid, "d")) / 1e6, 2)
    manifest[sid]["MB_mobile"] = round(size(os.path.join(OUT, sid, "m")) / 1e6, 2)
json.dump(manifest, open(os.path.join(OUT, "manifest.json"), "w"), indent=2)
print(json.dumps(manifest, indent=2))
