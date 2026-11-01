# Vídeo de Home: criterio de calidad y ficha técnica

Fecha: 31/10/2026. **Prioridad absoluta: calidad visual excelente**, sin perder detalle por comprimir de más. Los criterios de esta página se aplican a todo el montaje y ya están integrados en [`03-montaje/montar_home.sh`](./03-montaje/montar_home.sh).

## 1. Reglas de producción

1. **Los clips originales de Runway no se tocan nunca.** `02-clips-runway/` solo se lee: no se renombra, no se recorta y no se recomprime.
2. **Una sola generación por salida.** Cada archivo final (máster, web desktop y web móvil) se renderiza en una sola pasada de FFmpeg directamente desde los clips originales aprobados. No hay intermedios comprimidos.
   - Internamente se trabaja en 4:4:4 de 16 bits, para que fundidos y escalados no generen bandas.
3. **Máster de archivo:** ProRes 422 HQ, 10 bits, a la resolución nativa de los clips (hoy 1280×720), sin escalar. Es la base para futuras reediciones.
4. **Web desktop:** 1920×1080, escalado con **Lanczos** (`lanczos+accurate_rnd+full_chroma_int`).
   - Es un escalado clásico: suaviza la ampliación, pero **no recupera detalle que no existe en un origen de 720p**.
   - **No se usa escalado por IA** (ver la sección 5).
5. **Codificación web:** H.264 High, `preset slow`, CRF por calidad, **sin tope de bitrate**, GOP de 2 s, `faststart`, color BT.709 etiquetado.
6. **Fotogramas por segundo:** se conservan los **24 fps** de Runway. El script solo convierte si algún clip llegara a otra cadencia, y lo avisa.
7. **Sin audio:** ningún archivo lleva pista de audio (`-an`).
8. **Alternativa fija:** la foto actual del hero (`public/images/home/hero-provisional.jpg` y `hero-provisional-mobile.jpg`, que salen de la foto 01 de la fachada) se conserva sin cambios. Si el vídeo final no supera su calidad visual, la Home sigue con la foto.

## 2. Ficha técnica real

### Originales de Runway (`02-clips-runway/`)

| Archivo | Resolución | FPS | Códec | Bitrate | Tamaño | Duración |
|---|---|---|---|---|---|---|
| `01_entrada-camino_v1.mp4.mp4` | 1280×720 | 24 | H.264 High, yuv420p | 9,04 Mb/s | 5,4 MB | 5,04 s (121 fotogramas) |
| `02_entrada-arbol_v1.mp4.mp4` | 1280×720 | 24 | H.264 High, yuv420p | 8,58 Mb/s | 5,2 MB | 5,04 s |
| `03_piscina-ramas_v1.mp4.mp4` | 1280×720 | 24 | H.264 High, yuv420p | 8,04 Mb/s | 4,8 MB | 5,04 s |
| `04_piscina-barbacoa_v1.mp4.mp4` | 1280×720 | 24 | H.264 High, yuv420p | 6,68 Mb/s | 4,2 MB | 5,04 s |
| `05_piscina-ras-agua_v1.mp4.mp4` | 1280×720 | 24 | H.264 High, yuv420p | 5,09 Mb/s | 3,2 MB | 5,04 s |
| `05c_caseta-esquina-piscina_v1.mp4.mp4` (reserva) | 1280×720 | 24 | H.264 High, yuv420p | 5,32 Mb/s | 3,4 MB | 5,04 s |
| `06_fachada-trasera_v1.mp4.mp4` | 1280×720 | 24 | H.264 High, yuv420p | 7,24 Mb/s | 4,6 MB | 5,04 s |

**Montaje definitivo (01/11/2026, `03-montaje/salida-montaje-final/`):**

- **Variantes:** híbrido, con D (Runway 4K) en 07, 10 y 11 y C (Lanczos + CAS) en el resto.
- **Máster:** ProRes 1920×1080.
- **Desktop:** AV1 de 24,5 MB a 7,6 Mb/s (VMAF 98,9), con H.264 de respaldo de 32,5 MB.
- **Móvil:** AV1 de 10,5 MB a 3,3 Mb/s, con H.264 de respaldo de 17,8 MB.
- Ficha completa en `03-montaje/REVISION_UPSCALE_FINAL.md`.

**Montaje completo v1 (`03-montaje/salida-montaje-completo-v1/`, 27,04 s, 13 planos):**

- **Web desktop:** 1920×1080, CRF 18, 11,9 Mb/s, 38,2 MB.
- **Web móvil:** 1080×1920, CRF 18, 8,9 Mb/s, 28,7 MB.
- **Máster ProRes 422 HQ:** 92,0 Mb/s, 296,5 MB.
- Todas las salidas a 24 fps, con 649 fotogramas y sin audio.
- **VMAF desktop frente al máster:** 98,1 de media, con un mínimo de 93,4.
- Los originales de 07–13 y su revisión están en `03-montaje/REVISION_07-13.md`.

Montaje de prueba 01 → 06 (`03-montaje/salida-prueba-01-06/`, 12,04 s): web desktop 9,8 Mb/s y 14,0 MB; web móvil 3,4 Mb/s y 4,8 MB; máster ProRes 91,9 Mb/s. Ver `03-montaje/REVISION_04-06.md`.

Runway no etiqueta el espacio de color. Se trata como BT.709 de rango limitado, que es lo habitual en vídeo HD, y así se etiquetan las salidas.

### Montaje de prueba 01 → 03 (`03-montaje/salida-prueba-01-03/`)

| Archivo | Resolución | FPS | Códec | Bitrate | Tamaño | Duración |
|---|---|---|---|---|---|---|
| `home_master_prores_1280x720.mov` | 1280×720 | 24 | ProRes 422 HQ, yuv422p10le | 92,2 Mb/s | 71,9 MB | 6,54 s |
| `home_web_1920x1080.mp4` (CRF 20) | 1920×1080 | 24 | H.264 High, yuv420p | 11,3 Mb/s | 8,8 MB | 6,54 s |
| `home_web_movil_720x1280.mp4` (CRF 21) | 720×1280 | 24 | H.264 High, yuv420p | 3,8 Mb/s | 3,0 MB | 6,54 s |

Cada montaje escribe su propia ficha en `ficha_tecnica.csv`, dentro de su carpeta de salida.

## 3. Elección del CRF (medido, no estimado)

Medición sobre el montaje 01–03. La referencia es el máster ProRes escalado con el mismo Lanczos. VMAF: 100 = idéntico; por encima de ~95 se considera sin diferencias visibles a distancia normal.

**Web desktop 1920×1080, H.264 `slow`:**

| CRF | Bitrate | Para 27 s | VMAF | SSIM |
|---|---|---|---|---|
| 16 | 18,6 Mb/s | ~63 MB | 99,99 | 0,9911 |
| 18 | 14,5 Mb/s | ~49 MB | 99,98 | 0,9898 |
| **20 (elegido)** | **11,3 Mb/s** | **~38 MB** | **99,73** | 0,9881 |
| 22 | 8,7 Mb/s | ~29 MB | 98,85 | 0,9858 |
| 24 | 6,7 Mb/s | ~23 MB | 97,41 | 0,9830 |
| 26 | 5,2 Mb/s | ~18 MB | 95,31 | 0,9793 |

**Web móvil 720×1280:**

| CRF | Bitrate | Para 27 s | VMAF |
|---|---|---|---|
| 18 | 4,8 Mb/s | ~16 MB | 98,5 |
| 20 | 3,7 Mb/s | ~13 MB | 97,8 |
| **21 (elegido)** | **~3,3 Mb/s** | **~11 MB** | **~97** |
| 22 | 2,9 Mb/s | ~10 MB | 96,5 |

**Conclusiones:**

- **Entre CRF 16 y 20 no hay diferencia visible.** Lo confirman la comparativa a 1:1 de fachada, rejas, ramas y agua (`03-montaje/revision-crf-detalle.png`) y VMAF de 99,7 o más. Bajar de 20 a 16 casi duplica el peso sin ganar nada perceptible: el codificador solo gasta más bits en reproducir el grano y los artefactos del clip de 720p ampliado. **Por eso CRF 20 es el valor por defecto.** Si al revisar el montaje completo aparece algún artefacto, se baja a 18 con `CRF=18`.
- **El peso es alto porque el material es difícil.** Este tramo tiene mucha vegetación y enlosado, que son muy costosos de comprimir. Los planos de cielo, agua o fachada lisa pesarán menos. El tamaño real del montaje completo se medirá cuando estén los 13 clips. Previsión: 30–38 MB a CRF 20.
- **Comprobado en el montaje:** los clips son de 24 fps nativos, el máster y la web conservan 24 fps y la web tiene el mismo número de fotogramas que el máster (157), sin desfases.

**Mejora futura, que requiere tocar la Home:** AV1 (SVT-AV1, CRF 28) da **VMAF 99,1 con 5,9 Mb/s**, unos 20 MB para 27 s, un 45 % menos que H.264 a igual calidad. Para usarlo, el reproductor de la Home tendría que ofrecer dos fuentes (`<source>` AV1 y H.264 de respaldo). Ahora acepta una sola URL por formato. Se propondrá cuando toque integrar el vídeo; ahora no se toca la Home.

## 4. Versión móvil

- **El recorte se hace por plano antes de encadenar.** Cada plano se recorta en vertical (9:16) centrado en su `focoX` de `cortes.txt`, sin deformar: es un recorte y un escalado proporcional.
- **Pantalla real:** el hero de la Home ocupa toda la altura (`100svh`, `object-cover`). En un teléfono de 9:19,5, el navegador recorta además unos 10 % por cada lado del 9:16. Lo importante de cada plano debe quedar en el **80 % central** de la franja vertical.
- **Revisión de 01–03** (`03-montaje/revision-movil-01-03.jpg`):
  - **01:** la puerta y la fachada quedan centradas. Correcto.
  - **02:** se ven la casa, las persianas y el zócalo bajo las ramas. La puerta principal queda tras el tronco, igual que en la foto. Correcto. Si se quiere ver la puerta lateral de madera, se baja `focoX` a 0,45.
  - **03:** se ven la piscina, la escalera y las tumbonas. Correcto.
- **Límite de nitidez:** con origen de 720p, la franja vertical sale de solo 404×720 píxeles reales y se amplía a 720×1280. En móvil es donde más se nota la falta de resolución. Es el principal argumento para la prueba de la sección 5.

## 5. Mejorar la resolución: propuesta de prueba comparativa

> **31/10/2026:** la prueba sin coste (A navegador, B Lanczos y C Lanczos + CAS) está hecha sobre los clips 01 y 07. La variante Runway 4K está preparada, pendiente de autorizar los créditos. Resultado y recomendación web en [`PRUEBA_UPSCALE.md`](./PRUEBA_UPSCALE.md).

No se ha usado escalado por IA. Antes de decidir nada, propongo una prueba **con un solo clip, el 01** (fachada, rejas y enlosado: el más exigente para detectar invenciones):

| Variante | Cómo | Coste |
|---|---|---|
| A · Lanczos (actual) | Clip de 720p escalado con Lanczos a 1080p y recortado para móvil | 0 créditos |
| B · Upscale 4K de Runway | Upscale del mismo clip `01_…_v1` en Runway y montaje desde ese archivo | Créditos de upscale (comprobar el precio en la interfaz) |
| C · Generación nativa 9:16 | Solo para móvil: Gen-4 Turbo en 720:1280 desde un recorte vertical de la foto 01 | ~25 créditos |

**Qué se compara:**

- Fotogramas a 1:1 de rejas, persianas, tejas y enlosado.
- Si B **inventa** detalle: líneas que no están en la foto, texturas repetidas o rejas con barrotes de más. Es el riesgo principal del escalado por IA.
- Nitidez en un teléfono real, que es donde más diferencia puede haber.

**Decisión:** si B no inventa nada y se ve claramente mejor, se escala solo el conjunto de clips aprobados. Si inventa, se mantiene A. C solo merece la pena si la versión móvil de A no convence.

## 6. Lista de revisión antes de aprobar el vídeo definitivo

- [ ] **Fachadas:** las líneas rectas no ondulan; ventanas, rejas, persianas y puertas se mantienen en número y forma.
- [ ] **Árboles:** las ramas no se duplican ni se funden con la arquitectura; las hojas no parpadean.
- [ ] **Piscina:** la forma del vaso, la escalera y el gresite son estables; el agua no cambia de color de forma brusca.
- [ ] **Barandillas y redes:** los barrotes y las mallas no "nadan" ni generan moiré.
- [ ] **Compresión** (revisar a 1:1 en pantalla grande): sin bloques en el cielo, sin bandas en los degradados y sin emborronamiento en los fundidos.
- [ ] **Bucle:** sin salto visible en el cambio 13 → 01 tras varias vueltas.
- [ ] **Móvil:** revisado en un teléfono real; lo importante dentro del 80 % central.
- [ ] **Comparación con la foto actual del hero:** si el vídeo no la supera en calidad, se mantiene la foto.

## Versión móvil v2 (01/11/2026)

La versión móvil se rehízo dos veces. La v2 (ventana cuadrada con fondo desenfocado) se descartó. La v3, vigente, pone el plano en una ventana 4:3 que enseña el 75 % del ancho, sobre bandas lisas del color tinta de la marca y sin ningún desenfoque. El montaje desktop no cambia. Detalle en `03-montaje/REVISION_MOVIL_V3.md`.
