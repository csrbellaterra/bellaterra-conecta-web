# Vídeo de Home: plan de montaje

Fecha: 31/10/2026 · **Montaje completo v1 hecho el 31/10/2026** (`03-montaje/salida-montaje-completo-v1/`). El procedimiento sí está probado: el script se ha ejecutado con 13 clips de prueba hechos a partir de las fotos fijas (fuera del repositorio), y los resultados están en la sección 5.

## 1. Orden, duración y transiciones

La lista que usa el script está en [`03-montaje/cortes.txt`](./03-montaje/cortes.txt). Es lo único que hay que editar cuando lleguen los clips.

| # | Plano | Tramo del clip | En pantalla | Salida | Foco móvil (x) |
|---|---|---|---|---|---|
| 01 | Llegada por el camino | 0,8–3,3 s | 2,5 s | Corte | 0,70 (puerta) |
| 02 | Entrada bajo la magnolia | 0,8–3,2 s | 2,0 s | Fundido 0,4 s | 0,58 |
| 03 | Piscina entre ramas | 2,0–4,0 s | 2,0 s | Corte | 0,55 |
| 04 | Piscina y barbacoa | 1,0–3,3 s | 2,0 s | Fundido sutil 0,3 s | 0,38 (barbacoa) |
| 05 | Piscina a ras de agua | 1,0–2,9 s | 1,5 s | Fundido 0,4 s | 0,40 |
| 06 | Fachada trasera | 1,0–3,0 s | 2,0 s | Corte | 0,42 (porche) |
| 07 | Porche y ventanales | 1,0–3,0 s | 2,0 s | Corte | 0,50 |
| 08 | Terraza y pistas | 1,0–3,4 s | 2,0 s | Fundido 0,4 s | 0,55 (pino) |
| 09 | Jardín con vistas | 1,0–3,9 s | 2,5 s | Fundido 0,4 s | 0,50 |
| 10 | Terraza con toldo | 1,0–2,5 s | 1,5 s | Corte | 0,55 |
| 11 | Terraza chill out | 1,0–3,4 s | 2,0 s | Fundido 0,4 s | 0,45 |
| 12 | Pistas y casa | **0,5–2,5 s** | 2,0 s | Corte | 0,50 |
| 13 | Pistas y horizonte | 1,0–4,8 s | 3,0 s | Fundido de bucle 0,8 s → 01 | 0,45 |

**Total: 27,0 s (montaje completo v1, 31/10/2026).** Es la suma de la columna "En pantalla".

- **La 05 vuelve al montaje** por decisión definitiva del usuario (31/10/2026). Se descartaron la 05b y la 05c.
- **De 04 a 05**, un fundido sutil de 0,3 s, que suaviza el cambio de tono del agua.
- **De 09 a 10**, un fundido de 0,4 s, porque cambian la zona y la luz.
- **La 12** solo se usa hasta 2,5 s (ver `03-montaje/REVISION_07-13.md`).

### Criterios

- **Elegir los mejores segundos.** El primer segundo de un clip de Gen-4 suele ser casi la foto quieta, y el final es donde más inventa la IA. Por defecto se usa el tramo central, a partir de 0,8–1,0 s. Al revisar cada clip, cambia `entrada` en `cortes.txt` para quedarte con el tramo más limpio. La regla es `entrada + dur + trans ≤ duración del clip`; el script avisa si no se cumple.
- **Transiciones.**
  - **Corte seco** entre planos de la misma zona con el mismo sentido de movimiento: es un corte en movimiento y se percibe como continuidad.
  - **Fundido corto de 0,4 s** solo en los cuatro cambios de zona: entrada → piscina, piscina → casa, casa → jardín y terrazas → pistas.
  - Nada de cortinillas, zooms de transición ni efectos.
- **Orden narrativo:** siempre el de las fotografías (01 → 13).
- **Si se elimina un plano** (por ejemplo, el 05 si la piscina ha cambiado), se borra su línea. Si el plano anterior quedaba unido por corte a otra zona, se le pone un fundido de 0,4 s.
- **Ritmo:** un plano lento no debe ir pegado a un corte brusco. Si dos clips seguidos tienen velocidades de cámara muy distintas, conviene recortar el más rápido o ponerles un fundido.

### Bucle sin salto

La última transición (0,8 s) funde el final del plano 13 con el inicio del 01. Técnicamente, el vídeo final empieza 0,8 s dentro del plano 01, y en sus últimos 0,8 s el plano 13 funde con ese mismo arranque. Por eso el último fotograma enlaza con el primero y el `loop` del navegador no tiene corte visible. Verificado con los clips de prueba: el primer y el último fotograma son el mismo plano, en la misma posición.

## 2. Exportaciones

> **Criterio de calidad vigente (31/10/2026):** [`CALIDAD_VIDEO.md`](./CALIDAD_VIDEO.md). Sustituye los valores de compresión de la primera versión de este plan (CRF 23/25 con tope de bitrate), que perdían demasiada calidad.

Todas las salidas se generan **directamente desde los clips originales**, cada una en una sola pasada.

| Archivo | Formato | Uso |
|---|---|---|
| `home_master_prores_1280x720.mov` | ProRes 422 HQ, 10 bits, 24 fps, resolución nativa, sin audio | **Máster** para reediciones. No va a la web ni a git |
| `home_web_1920x1080.mp4` | H.264 High, escalado Lanczos, `preset slow`, **CRF 20**, sin tope de bitrate, `faststart`, sin audio | **Web desktop** → `homePage.hero.media` (vídeo) en Sanity |
| `home_web_movil_720x1280.mp4` | H.264 High 9:16, **CRF 21**, `faststart`, sin audio | **Web móvil** → vídeo móvil del hero en Sanity |
| `home_web_1920x1080.webm` | VP9 (opcional, `WEBM=1`) | Alternativa para navegadores compatibles |
| `home_poster_1920x1080.jpg` | Primer fotograma del máster | Póster del vídeo |
| `ficha_tecnica.csv` | Resolución, fps, códec, bitrate, tamaño y duración reales de cada archivo | Documentación |

- **Sin sonido:** todas las salidas se generan con `-an`, es decir, sin pista de audio, no solo silenciadas.
- **Versión móvil:** cada plano se recorta en vertical (9:16) **antes** de encadenarlo, centrado en su `focoX`, porque el punto importante cambia de un plano a otro: la puerta en 01, el porche en 06, el pino en 08… Los rectángulos amarillos de [`recortes-16x9.jpg`](./recortes-16x9.jpg) muestran ese encuadre.
- **Resolución:** con los clips de Runway a 720p, el recorte vertical sale de una franja de solo 404×720 píxeles reales. Cualquier mejora de resolución pasa antes por la prueba comparativa de `CALIDAD_VIDEO.md` (sección 5). No se usa escalado por IA de forma automática.

## 3. Cómo montar

Requisitos: FFmpeg (ya instalado, 9.0) y Git Bash.

```bash
cd "docs/fase-cinematica/video-home-produccion/03-montaje"
bash montar_home.sh
```

- Lee `cortes.txt` y los clips de `../02-clips-runway/`.
- Crea `salida-AAAAMMDD-HHMM/`, una carpeta por versión, sin pisar las anteriores.
- Todo queda fuera de git.

Para exportar también la versión WebM:

```bash
WEBM=1 bash montar_home.sh
```

Para un montaje parcial (por ejemplo, solo 01–03), copia `cortes.txt` como `cortes_01-03.txt`, deja esas tres líneas y monta con:

```bash
CORTES=cortes_01-03.txt bash montar_home.sh
```

**Pasos internos del script:**

1. Comprueba que existen todos los clips y que cada tramo cabe en su clip.
2. Recorta cada tramo y genera dos intermedios casi sin pérdida, a 24 fps: 1920×1080 y 720×1280 centrado en el foco.
3. Encadena los tramos con `xfade` (un corte seco es un fundido de 1 fotograma, invisible) y cierra el bucle.
4. Exporta el archivo ProRes, los MP4 web, el WebM opcional y los pósteres. Después borra los intermedios.

## 4. Revisión antes de publicar

- Ver el MP4 web en bucle al menos 3 veces: no debe haber salto en el cambio 13 → 01.
- Ver la versión móvil en un teléfono real: el punto importante de cada plano queda dentro del encuadre.
- Peso: desktop ≤ 6–8 MB y móvil ≤ 2,5–3 MB.
- Ningún plano muestra deformaciones (criterios de [`PROMPTS_RUNWAY_HOME.md`](./PROMPTS_RUNWAY_HOME.md)).
- La 05 está confirmada o eliminada.
- **Subida a Sanity** (`homePage.hero.media`): es un paso aparte, que solo se hace con tu aprobación. La Home ya está preparada para recibir el vídeo: autoplay, muted, loop, playsInline, póster, pausa y respeto a `prefers-reduced-motion`.

## 5. Prueba del procedimiento (31/10/2026, primera versión del script)

> Los pesos de esta tabla corresponden a la compresión inicial, ya descartada. Las cifras con el criterio de calidad actual están en `CALIDAD_VIDEO.md`.

Se hizo con 13 clips falsos de 5 s a 1280×720: cada foto con un zoom lento, no clips de Runway. Los clips y los resultados están fuera del repositorio.

| Comprobación | Resultado |
|---|---|
| Duración | 27,04 s (27 s más un fotograma) |
| Web desktop | 1920×1080, H.264, 24 fps, **6,2 MB**, sin pista de audio |
| Web móvil | 720×1280, H.264, 24 fps, **2,4 MB**, sin pista de audio |
| Bucle | El primer y el último fotograma son el mismo plano (01), sin salto |
| Recorte móvil | Cada plano queda centrado en su foco |
| Archivo ProRes | Unos 600 MB (desktop) y 300 MB (móvil) |

Con clips reales, que tienen más movimiento y más detalle, el peso web puede subir. Si pasa de 8 MB, sube el CRF a 24–25 o baja `-maxrate` en el script.
