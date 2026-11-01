# Revisión de los clips 07–13 (v1) y montaje completo

Fecha: 31/10/2026 · Clips de Runway Gen-4 Turbo: 1280×720, 24 fps, 5,04 s (121 fotogramas) y sin pista de audio.

**Cómo se ha revisado** (igual que en las tandas anteriores):

- Un fotograma cada 0,5 s, comparado con el recorte que se subió.
- Detalle a 1:1 al principio y al final del tramo elegido.
- Diferencia media entre fotogramas, para detectar saltos.
- Luminancia media, para detectar cambios de luz.

## Archivos recibidos

Nombres comprobados en `02-clips-runway/`. Esta vez tienen **una sola extensión**.

| Archivo | Bitrate | Tamaño | Movimiento (diferencia por 0,5 s) | Luz (luminancia media) |
|---|---|---|---|---|
| `07_porche-comedor_v1.mp4` | 5,49 Mb/s | 3,5 MB | 3,5–3,9, constante | 136 → 134, estable |
| `08_terraza-pistas_v1.mp4` | 6,58 Mb/s | 4,1 MB | 1,8–2,7, suave | 120 → 122, estable |
| `09_jardin-vistas_v1.mp4` | 6,33 Mb/s | 4,0 MB | 1,4–3,3 (casi fijo en el centro) | 106 → 110, aclara muy poco |
| `10_terraza-toldo_v1.mp4` | 5,40 Mb/s | 3,4 MB | 2,6–3,1, constante | 126 → 134, aclara poco a poco |
| `11_terraza-chillout_v1.mp4` | 6,76 Mb/s | 4,3 MB | 3,9–5,0, acelera al final | 132 → 135, estable |
| `12_pistas-casa_v1.mp4` | 9,69 Mb/s | 6,1 MB | **7,4–11,6, el más rápido** | 114 → 118, estable |
| `13_pistas-horizonte_v1.mp4` | 6,79 Mb/s | 4,3 MB | 2,4–3,2, suave | 110 → 106, estable |

- **La 13 se generó desde el recorte v2,** el que no tiene la lona: el primer fotograma coincide con `13_pistas-horizonte_16x9_v2.jpg`.
- **Hoja de contacto:** `hoja-contacto-07-13.jpg`. Hay una fila por escena, de la 07 a la 13. En cada fila: la foto subida y los fotogramas de 0,5, 1,5, 2,5, 3,5 y 4,5 s.
- **Hojas por clip:** `revision-clip-07-v1.jpg` … `revision-clip-13-v1.jpg`. Cada una tiene la foto y un fotograma cada 0,5 s.

## Veredicto

| Clip | Veredicto | Tramo en el montaje | Salida |
|---|---|---|---|
| **07** Porche y ventanales | ✅ Aprobado | 1,0–3,0 s | Corte |
| **08** Terraza elevada y pistas | ✅ Aprobado | 1,0–3,4 s | Fundido 0,4 s |
| **09** Jardín con vistas | ✅ Aprobado | 1,0–3,9 s | Fundido 0,4 s (nuevo; antes era corte) |
| **10** Terraza con toldo | ✅ Aprobado | 1,0–2,5 s | Corte |
| **11** Terraza chill out | ✅ Aprobado | 1,0–3,4 s | Fundido 0,4 s |
| **12** Pistas y casa | ✅ **Aprobado solo en parte** | **0,5–2,5 s** | Corte |
| **13** Pistas y horizonte | ✅ Aprobado | 1,0–4,8 s | Fundido de bucle 0,8 s |

**No hace falta regenerar ninguno.**

### 07 · Aprobado

- **Movimiento:** desplazamiento lateral corto, constante y sin aceleraciones.
- **Estable a 1:1 entre 1 y 3 s:**
  - La puerta de cuarterones conserva su retícula.
  - El gresite verde, la viga de madera, las tejas, el aplique y las macetas no cambian.
  - Los ventanales y su reflejo de los pinos se mueven con la cámara, sin animarse por su cuenta.
- **Luz:** cálida y estable.

### 08 · Aprobado

- **Movimiento:** avance muy suave hacia el pino; es el plano más tranquilo de la tanda.
- **Estable:**
  - La barandilla mantiene sus barrotes y no genera moiré.
  - El toldo, los pilares y la pista no cambian.
- La bicicleta y el arcón bajo la terraza siguen visibles, como en la foto. Es la duda A de `TANDA_07-13.md`.

### 09 · Aprobado

- **Movimiento:** casi fijo. Las nubes se desplazan y los pinos se mecen.
- **Estable:** el perfil de las montañas, la ciudad, las macetas y la cuerda no cambian.
- **Montaje:** ocupa 2,5 s. Su salida pasa a ser un **fundido de 0,4 s hacia la 10**: es un cambio de zona (del jardín a la terraza) y de luz (del sol al cielo cubierto), y un corte seco se notaba brusco.

### 10 · Aprobado

- **Movimiento:** avance por la terraza siguiendo la barandilla.
- **Estable a 1:1:** el toldo no ondea y conserva sus brazos y su soporte. El farol, la mesa con el mantel y las sillas también se mantienen.
- **Luz:** aclara ligeramente (126 → 134), pero en el tramo de 1,5 s no se percibe.

### 11 · Aprobado

- **Movimiento:** avance entre las mesas hacia los pinos, algo más rápido en el último segundo, que no se usa.
- **Estable a 1:1 entre 1,0 y 3,4 s:**
  - Las mesas-bobina, las mesas altas de listones y las sillas verdes, todas en su número.
  - La barandilla con sus luces.
  - Los portavelas.

### 12 · Aprobado solo hasta 2,5 s

- **Movimiento:** desplazamiento lateral a la izquierda, el más rápido de todo el vídeo. En el tramo elegido se percibe dinámico, pero sin tirones.
- **Estable hasta 2,5 s:** las líneas de pista siguen rectas, la red está entera y la casa, el pino y la terraza no cambian.
- **Defecto a partir de ~3,3 s:** al descubrir lo que queda fuera de la foto por la izquierda, **la IA inventa una pequeña construcción con tejado y unos cipreses**. Ese tramo no se usa. Por eso el tramo empieza en 0,5 s: así se aprovechan 2 s limpios.
- **Paneles verdes del muro** (duda B de `TANDA_07-13.md`): no se deforman de forma visible en el tramo elegido.

### 13 · Aprobado

- **Movimiento:** avance suave hacia el horizonte con una deriva leve a la derecha.
- **Estable a 1:1 entre 1,0 y 4,8 s:** la red, las líneas, las sillas y el perfil de las montañas se mantienen.
- **Borde derecho:** al final aparecen más rocas y vegetación del borde de la pista. Son coherentes con la foto completa original, no es arquitectura inventada.
- **Bucle:** el fundido de 0,8 s hacia la 01 cubre los últimos segundos.

## Montaje completo v1 (01 → 13)

- **Lista:** [`cortes.txt`](./cortes.txt). Son los 13 planos, con la 05 restaurada.
- **Comando:**

```bash
CRF=18 CRF_MOVIL=18 MOVIL=1080x1920 bash montar_home.sh "" "$PWD/salida-montaje-completo-v1"
```

- **Calidad aplicada,** por encima del criterio por defecto, porque la prioridad es que no se vea borroso ni pixelado:
  - **Desktop:** CRF 18 en lugar de 20.
  - **Móvil:** CRF 18 en lugar de 21, y a **1080×1920** en lugar de 720×1280.
    - El escalado lo hace Lanczos en la exportación, no el navegador del teléfono, que es más blando.
    - No añade detalle que no exista, pero evita una segunda ampliación de peor calidad en pantallas de alta densidad.

### Ficha técnica real (`salida-montaje-completo-v1/`)

| Archivo | Resolución | FPS | Códec | Bitrate | Tamaño | Duración | Fotogramas | Audio |
|---|---|---|---|---|---|---|---|---|
| `home_master_prores_1280x720.mov` | 1280×720 | 24 | ProRes 422 HQ, yuv422p10le | 92,0 Mb/s | 296,5 MB | 27,04 s | 649 | Sin pista |
| `home_web_1920x1080.mp4` (CRF 18) | 1920×1080 | 24 | H.264 High, yuv420p | 11,9 Mb/s | 38,2 MB | 27,04 s | 649 | Sin pista |
| `home_web_movil_1080x1920.mp4` (CRF 18) | 1080×1920 | 24 | H.264 High, yuv420p | 8,9 Mb/s | 28,7 MB | 27,04 s | 649 | Sin pista |
| `home_poster_1920x1080.jpg` | 1920×1080 | — | JPEG | — | 0,4 MB | — | — | — |

### Comprobaciones

- **Compresión:** VMAF de la web desktop frente al máster, a la misma escala.
  - Media de 98,1, con todos los segundos entre 96 y 100.
  - Mínimo de 93,4, en un único fotograma del fundido 04 → 05.
  - **No hay pérdida visible por compresión:** ni bloques, ni bandas, ni pixelado.
- **Fluidez:**
  - Los 24 fps nativos se conservan en todas las salidas, con 649 fotogramas en las tres y sin duplicados ni saltos.
  - Las uniones se hacen en la línea de tiempo, sin reconversión de cadencia.
- **Bucle:** el último fotograma enlaza con el primero; el fundido de 0,8 s de 13 → 01 no tiene salto.
- **Hojas de revisión:**
  - `revision-montaje-completo-v1.jpg`: desktop, un fotograma por plano, más los fundidos 04 → 05 y 09 → 10 y el bucle.
  - `revision-movil-completo-v1.jpg`: móvil, un fotograma por plano, más el bucle.
- **Móvil:** el punto importante de cada plano queda dentro del encuadre vertical.
  - Ejemplos: la puerta en la 01, la barbacoa en la 04, el porche en la 06, el pino en la 08 y la red en la 13.
