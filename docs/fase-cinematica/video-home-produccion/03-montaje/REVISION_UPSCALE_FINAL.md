# Revisión de los upscales 4K de Runway (05, 06, 07, 10 y 11) y montaje definitivo

Fecha: 01/11/2026.

- **Decisión aprobada por el usuario:** variante D (Runway 4K) en 05, 06, 07, 10 y 11, y variante C (Lanczos + CAS 0,5) en el resto, siempre que la D pase la revisión visual.
- **Si una D empeora el plano:** se usa C y se explica por qué.

## 1. Comprobación técnica

Archivos en `02-clips-runway/upscale/`. Todos tienen formato 4096×2304, H.264, 24 fps, 121 fotogramas, 5,04 s y sin audio.

| Archivo | Bitrate | PSNR frente al original (Y / U / V) |
|---|---|---|
| `05_piscina-ras-agua_v1_4k.mp4` | 70,9 Mb/s | 34,6 / 42,8 / 44,0 dB |
| `06_fachada-trasera_v1_4k.mp4` | 79,0 Mb/s | 34,0 / 41,1 / 43,2 dB |
| `07_porche-comedor_v1_4k.mp4` | 46,2 Mb/s | 35,8 / 43,8 / 44,6 dB |
| `10_terraza-toldo_v1_4k.mp4` | 44,9 Mb/s | 36,0 / 46,8 / 48,1 dB |
| `11_terraza-chillout_v1_4k.mp4` | 61,0 Mb/s | 34,9 / 45,2 / 48,3 dB |

**Cómo se midió el PSNR:** reduciendo el 4K a 720p con Lanczos y comparándolo, fotograma a fotograma, con el clip original.

- **Alineación:** todos están alineados fotograma a fotograma. Un desfase daría valores en torno a 20 dB.
- **Color:** se conserva (croma por encima de 41 dB).

## 2. Revisión visual (tramo usado en el montaje, a 1:1 sobre 1920×1080)

Hojas de revisión: `revision-4k-05-C-vs-D.jpg`, `revision-4k-06-C-vs-D.jpg`, `revision-4k-10-C-vs-D.jpg` y `revision-4k-11-C-vs-D.jpg`.

- En cada una, tres zonas del mismo fotograma: C a la izquierda y D a la derecha.
- Las hojas de 07 son las de la prueba: `prueba-upscale/detalle_07_*`.

**Medida de parpadeo:** diferencia media entre fotogramas consecutivos dentro del tramo usado. Cuanto más alto el valor, más tiembla la imagen.

| Plano | Parpadeo total C → D | Parpadeo en la vegetación C → D | Veredicto |
|---|---|---|---|
| **05** Piscina a ras de agua | 1,64 → 1,66 | 1,03 → 1,38 (+34 %) | ❌ **C**. Explicación debajo |
| **06** Fachada trasera | 4,48 → 4,61 | 3,25 → 4,58 (+41 %) | ❌ **C**. Explicación debajo |
| **07** Porche | — | — | ✅ **D** (revisada en la prueba) |
| **10** Terraza con toldo | 3,01 → **2,51** | 1,72 → 2,07 | ✅ **D** |
| **11** Terraza chill out | 4,73 → **3,96** | 2,87 → 3,13 | ✅ **D** |

### 05 · Se usa C

- **Lo bueno:** el tejado, la persiana, el farol y el reflejo de la casa en el agua quedan igual de bien que con C, o algo mejor.
- **El problema:** la franja central del plano (árboles, tierra y rocas tras el muro de piedra) adquiere una **trama de puntos regular**, como de semitono, que no está en el original.
  - Ocupa casi un tercio del encuadre y se nota a 1:1.
  - El follaje tiembla un 34 % más.
- **Conclusión:** la mejora del agua y de la casa es pequeña y no compensa la textura artificial.

### 06 · Se usa C

- **Lo bueno:** la arquitectura mejora claramente. Ventanas, tejas, columnas de piedra y sillas del porche quedan más definidas, sin ningún cambio de forma.
- **El problema:** los **pinos**, que ocupan casi todo el tercio derecho, toman la misma trama artificial, y la **buganvilla** queda manchada y con contraste exagerado.
  - La vegetación tiembla un 41 % más.
- **Conclusión:** como la vegetación ocupa la mitad del plano, la D empeora el aspecto natural de la escena.

### 07, 10 y 11 · Se usa D

- **Arquitectura:** puerta, gresite, toldo, barandilla, farol, mesas-bobina, sillas verdes y mesa con mantel ganan definición sin cambios de forma ni de número.
- **Parpadeo:** en 10 y 11 el total incluso **baja** respecto a C.
  - El realce de C acentuaba el grano del clip de 720p; la D lo sustituye por detalle limpio.
- **Vegetación:** también muestra algo de trama, pero es secundaria en el encuadre (el fondo de pinos en 10 y 11) y no llama la atención.

## 3. Variantes del montaje definitivo

| Variante | Planos |
|---|---|
| **D** · Runway 4K, reducido con Lanczos y sin realce | 07, 10 y 11 |
| **C** · original de 720p, Lanczos y CAS 0,5 | 01, 02, 03, 04, **05**, **06**, 08, 09, 12 y 13 |

- **Lista de cortes:** `cortes_final.txt`. Mismo orden, tramos, transiciones y foco móvil que el montaje completo v1 (`cortes.txt`); comprobado línea a línea.
- **Si quieres la D en 05 o 06 de todos modos:** basta cambiar su fuente y su realce en `cortes_final.txt` y volver a montar.

## 4. Montaje definitivo (`salida-montaje-final/`)

**Comando:**

```bash
CORTES=cortes_final.txt bash montar_home.sh "" "$PWD/salida-montaje-final"
```

- Una pasada por salida, directamente desde los clips: originales de 720p para C y upscales 4K para D.
- Cada plano se escala directamente a la resolución de cada salida, así los planos D aportan su detalle 4K completo, también en el recorte vertical del móvil.

| Archivo | Uso | Resolución | FPS | Códec | Bitrate | Tamaño | Duración | Fotogramas | Audio |
|---|---|---|---|---|---|---|---|---|---|
| `home_master_prores_1920x1080.mov` | Máster de archivo | 1920×1080 | 24 | ProRes 422 HQ, 10 bits 4:2:2 | 184,5 Mb/s | 594,6 MB | 27,04 s | 649 | No |
| `home_web_1920x1080_av1.mp4` | **Desktop principal** | 1920×1080 | 24 | AV1 Main 10 bits, CRF 24 | 7,6 Mb/s | 24,5 MB | 27,04 s | 649 | No |
| `home_web_1920x1080_h264.mp4` | Desktop de respaldo | 1920×1080 | 24 | H.264 High, CRF 20 | 10,1 Mb/s | 32,5 MB | 27,04 s | 649 | No |
| `home_web_movil_1080x1920_av1.mp4` | **Móvil principal** | 1080×1920 | 24 | AV1 Main 10 bits, CRF 28 | 3,3 Mb/s | 10,5 MB | 27,04 s | 649 | No |
| `home_web_movil_1080x1920_h264.mp4` | Móvil de respaldo | 1080×1920 | 24 | H.264 High, CRF 22 | 5,5 Mb/s | 17,8 MB | 27,04 s | 649 | No |

- **Póster:** no se genera ninguno. Se mantiene la foto actual de la fachada como póster y como alternativa de portada: `public/images/home/hero-provisional.jpg` y `hero-provisional-mobile.jpg`, sin cambios.

## 5. Comprobaciones

- **Calidad de la desktop:** VMAF frente al máster, a la misma resolución.
  - **AV1: 98,9 de media**, con un mínimo de 95,4.
  - **H.264: 97,2 de media**, con un mínimo de 91,0, en el fundido 04 → 05.
  - En ninguna se aprecia pérdida por compresión.
- **Móvil:** no hay un máster vertical con el que medir VMAF; se revisó visualmente fotograma a fotograma (`revision-movil-final.jpg`).
- **Mejora frente al montaje v1:** `revision-final-antes-despues.jpg`.
  - 07 y 11 (variante D): puerta, piedra, sillas y mesas claramente más nítidas.
  - 01 (variante C): rejas, persianas y lamas más definidas.
  - No cambia nada de la arquitectura.
- **Fluidez:** 24 fps nativos y 649 fotogramas en todas las salidas, sin duplicados ni saltos.
- **Bucle:** el fundido de 0,8 s de 13 a 01 cierra sin salto.
- **Sin audio:** ninguna salida tiene pista de audio.
- **Hojas de revisión:** `revision-montaje-final.jpg` (desktop) y `revision-movil-final.jpg` (móvil).
  - Hay un fotograma por plano, más los fundidos 04 → 05 y 09 → 10 y el bucle.
- **Montajes anteriores y originales:** intactos.
  - `salida-montaje-completo-v1/`, `salida-prueba-*`, `02-clips-runway/` y `02-clips-runway/upscale/`.
