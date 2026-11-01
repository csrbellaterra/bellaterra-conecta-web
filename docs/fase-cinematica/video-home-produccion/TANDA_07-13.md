# Última tanda: escenas 07–13

Fecha: 31/10/2026. **Una sola generación por escena: 7 clips, unos 175 créditos.**

**Ajustes de Runway**, los mismos de siempre:

- Gen-4 Turbo, image to video.
- 16:9 (1280×720), 5 s.
- Seed aleatoria y una sola variante.

**Al guardar:** escribe el nombre **sin `.mp4`**, porque Runway ya lo añade. Por ejemplo, escribe `07_porche-comedor_v1` y el archivo quedará como `07_porche-comedor_v1.mp4` en `02-clips-runway/`. Si vuelve a salir con doble extensión, no pasa nada: uso el nombre real.

## 1. Estado actual de cada fotografía

| # | Foto | Fecha | ¿Representa el estado actual? |
|---|---|---|---|
| 07 | `7.jpg` | 16/07/2024 | **Sí.** Es el mismo porche que la 06, ya aprobada: gresite verde, puerta de cuarterones, columnas de piedra y ventanales |
| 08 | `8.jpg` | 16/07/2024 | **Sí, con una duda menor (A).** La terraza elevada, su barandilla oscura y el toldo coinciden con las fotos 10 y 11 de 2026 |
| 09 | `9.jpg` | 31/10/2026 | **Sí.** Es de hoy |
| 10 | `10.jpg` | 03/10/2026 | **Sí** |
| 11 | `11.jpg` | 03/10/2026 | **Sí** |
| 12 | `12.jpg` | 16/07/2024 | **Sí, con una duda menor (B).** Las pistas, el pino y la casa coinciden con la 13 (2025) y la 09 (2026) |
| 13 | `13.JPG` | 24/05/2025 | **Sí, con un cambio de recorte recomendado (C)** |

### Dudas antes de gastar créditos

**A · 08: objetos bajo la terraza (2024)**

- Junto a la pared de piedra, bajo la terraza, hay:
  - una bicicleta;
  - un saco de boxeo;
  - un arcón de resina;
  - una carretilla;
  - cubos de reciclaje.
- No son arquitectura y el avance hacia el pino los saca poco a poco del encuadre. Aun así, son objetos de 2024 que quizá ya no están ahí.
- **Si te parece aceptable, no hay que hacer nada.** No hay otra foto de este ángulo.

**B · 12: paneles PLASTY y mobiliario de la terraza (2024)**

- En el muro de piedra de bajo la terraza hay cuatro paneles verdes con texto, entre ellos *"Contaminació plàstica"*. Son paneles de sensibilización, no de la antigua escuela.
- Dos cosas que debes saber:
  - **¿Siguen colgados hoy?** Si ya no están, el plano mostraría algo que no existe.
  - **La IA tiende a deformar los textos.** A este tamaño son casi ilegibles, pero el movimiento lateral puede hacer que "bailen". Para limitarlo, el prompt pide un recorrido corto.
- La terraza de arriba se ve con celosía, pérgola y sofás de 2024. En 2026 (foto 11) hay mesas-bobina. A esa distancia apenas se distingue.

**C · 13: lona publicitaria en el borde derecho**

- En el recorte original, en el borde derecho, se ven:
  - una lona enrollable con un logotipo y letras ("CS…", "…ow");
  - una bandera azul.
- Es material de un evento de 2025 y no representa la finca. Además, la IA deformaría el texto.
- **Recorte nuevo recomendado:** `13_pistas-horizonte_16x9_v2.jpg`.
  - Usa el 90 % del ancho, anclado a la izquierda, sin ningún otro cambio.
  - Quedan fuera la lona y la bandera. Se conservan la red, las pistas, los pinos, las sillas y el horizonte.
  - El recorte original sigue en la carpeta.
- **La tabla usa la v2.** Si prefieres el original, sube `13_pistas-horizonte_16x9.jpg`; el prompt es el mismo.

## 2. Recortes 16:9

- **Origen:** los siete se hicieron con `recortes_16x9.py`, directamente desde los originales de `Fotos Video Landing General`, que son de solo lectura.
- **Formato:** 3840×2160, JPG q92.
- **Qué se ha hecho:** solo recortar y escalar, sin retoques. La arquitectura es la de la foto.
- **Revisión:** los he vuelto a revisar uno por uno. Las fachadas, las barandillas, las pistas y el horizonte están enteros y sin cortes raros.
- **Recortes con particularidades:**
  - **10:** deja fuera la mesa de cristal del primer plano.
  - **12:** deja fuera el perro de la terraza.
  - **13 v2:** deja fuera la lona.

## 3. Coherencia del recorrido

**Orden del storyboard** (el que se usa por defecto):

1. **06 → 07:** de la fachada trasera al porche, acercándose.
2. **07 → 08:** del porche al lateral de la casa, con la terraza y las pistas.
3. **08 → 09:** fundido a las vistas desde el jardín.
4. **09 → 10 → 11:** de vuelta a la casa por la terraza.
5. **11 → 12:** fundido a las pistas.
6. **12 → 13:** de las pistas hacia el horizonte.
7. **13 → 01:** fundido del bucle.

**Dos saltos que conviene conocer:**

- **De 09 a 10 se vuelve hacia atrás:** del jardín, de nuevo a la terraza.
- **Cambia la luz:**
  - 07 y 08: tarde cálida.
  - 09: sol con nubes.
  - 10 y 11: cielo cubierto.
  - 12 y 13: sol.

**Alternativa sin coste:**

- Otro orden: 07 → 10 → 11 → 08 → 09 → 12 → 13.
  - Sigue el camino físico: porche, terraza superior, la misma terraza vista desde abajo, jardín, pistas y horizonte.
  - Agrupa los dos planos nublados después del porche.
- **No cambia nada de la generación:** el orden se decide en `cortes.txt` al montar.
- Cuando tenga los clips, montaré el orden del storyboard. Si el movimiento lo justifica, te propondré la alternativa con las dos versiones para comparar.

## 4. Tabla para Runway

**Mejoras de los prompts respecto a la versión anterior:**

- Recorrido de cámara corto ("short camera travel") en todos los planos.
- Los elementos que más se deforman (texto, toldo, mantel) se piden quietos.
- En 08, el "tilt-down" del storyboard pasa a ser un avance lento hacia el pino. Es más estable y enlaza mejor con las vistas de la 09.

| # | Subir (`01-imagenes-runway/`) | Prompt completo | Movimiento esperado | Guardar como |
|---|---|---|---|---|
| 07 | `07_porche-comedor_16x9.jpg` | `Very slow, short lateral tracking shot gliding to the right, parallel to the covered porch, eye level, perfectly steady and level. The stone columns, the green tiled wall, the wooden panelled door, the table and chairs, the potted plants and the large dining-room windows stay rigid and unchanged; reflections in the glass shift only slightly with the camera. The bougainvillea moves gently in a light breeze. Warm late-afternoon sunlight, stable exposure. Photorealistic real-estate film.` | Desplazamiento corto a la derecha, paralelo al porche. Los ventanales ganan peso en el encuadre. Solo se mueven los reflejos y la buganvilla | `07_porche-comedor_v1` |
| 08 | `08_terraza-pistas_16x9.jpg` | `Slow, steady dolly-in toward the large umbrella pine and the distant valley, eye level, no rotation, short camera travel. The white house, the elevated terrace with its long dark metal railing and stone pillars, the court with its straight lines and net, and the pine trees stay exactly as they are. Pine needles sway gently in a light breeze; the hazy valley and hills remain unchanged. Warm late-afternoon sunlight, stable exposure. Photorealistic real-estate film.` | Avance recto hacia el pino; las vistas se abren detrás. La barandilla mantiene sus barrotes | `08_terraza-pistas_v1` |
| 09 | `09_jardin-vistas_16x9.jpg` | `Very slow, gentle push-in toward the open valley view between the pine trees, almost static, perfectly steady. White clouds drift slowly across the blue sky and pine branches sway softly. The mountain silhouette, the distant city, the white planters, the rope fence, the court and the lawn remain exactly as they are. Bright clear daylight, stable exposure. Photorealistic real-estate film.` | Casi fijo. Las nubes se desplazan y los pinos se mecen. El horizonte no cambia de perfil | `09_jardin-vistas_v1` |
| 10 | `10_terraza-toldo_16x9.jpg` | `Slow, smooth dolly-in along the terrace, following the black metal railing toward the long table with the white tablecloth, eye level, perfectly steady, short camera travel. The white facade, the grey retractable awning, the black chairs, the wooden pallet bench, the railing with its string lights and the garden beyond stay exactly as they are. The awning fabric and the tablecloth stay still; leaves move slightly. Soft overcast daylight, stable exposure. Photorealistic real-estate film.` | Avance por la terraza siguiendo la barandilla hacia la mesa larga. El banco de palés sale poco a poco por la derecha | `10_terraza-toldo_v1` |
| 11 | `11_terraza-chillout_16x9.jpg` | `Slow, steady cinematic push-in across the terrace toward the gap between the pine trees and the distant hills, eye level, no rotation, short camera travel. The round wooden cable-spool tables, the slatted wooden high tables, the dark green woven chairs, the white facade, the black railing and the grey floor tiles stay exactly as they are. Pine needles sway gently. Soft overcast daylight, stable exposure. Photorealistic real-estate film.` | Avance lento entre las mesas hacia el hueco de vistas. Las sillas verdes no cambian de número | `11_terraza-chillout_v1` |
| 12 | `12_pistas-casa_16x9.jpg` | `Slow, short lateral tracking shot gliding to the left across the sports courts, low and steady, perfectly level. The court surfaces with their straight white lines, the net, the white chairs, the large umbrella pine, the stone wall with its green panels and the house with its terrace stay rigid and unchanged. Pine branches sway softly; the distant hills remain the same. Warm late-afternoon sunlight, stable exposure. Photorealistic real-estate film.` | Desplazamiento corto a la izquierda. La casa se aleja hacia la derecha y se abren las montañas. Las líneas de pista siguen rectas | `12_pistas-casa_v1` |
| 13 | **`13_pistas-horizonte_16x9_v2.jpg`** (ver C) | `Slow, smooth push-in over the sports courts toward the distant horizon of hills, with a very slight rise of the camera, calm and steady, easing into an almost still frame at the end. The net, the straight court lines and their shadows, the white chairs, the tall pine trees and the mountain silhouette stay exactly as they are. Pine needles sway gently. Bright clear daylight, stable exposure. Photorealistic real-estate film.` | Avance con una elevación mínima hacia el horizonte. Termina casi quieto, para el fundido del bucle a la 01 | `13_pistas-horizonte_v1` |

**Puntos que revisaré en cada clip** (criterios de rechazo de `PROMPTS_RUNWAY_HOME.md`):

- **07:** los reflejos de los ventanales no se "animan" por su cuenta, y la puerta conserva sus cuarterones.
- **08 y 10:** las barandillas no generan moiré y los barrotes no se multiplican.
- **10:** el toldo no ondea.
- **12 y 13:** la red y las líneas de pista siguen rectas.
- **12:** los paneles no se deforman de forma visible.
- **09, 11, 12 y 13:** el horizonte de montañas no cambia de perfil.

## 5. Cambios ya aplicados en el montaje (31/10/2026)

> **Sustituido:** el usuario decidió después mantener la 05. El montaje completo v1 la incluye, con un fundido sutil de 0,3 s entre 04 y 05. Ver `03-montaje/REVISION_07-13.md`.

En `03-montaje/cortes.txt`, `PLAN_MONTAJE.md` y el storyboard:

- **Escena 05 retirada.**
  - El clip `05_piscina-ras-agua_v1.mp4.mp4` sigue intacto en `02-clips-runway/`.
  - La 05c tampoco se usa.
- **Transición 04 → 06:** fundido de 0,4 s, porque es el cambio de zona de la piscina a la casa. La 06 pasa de 2,0 a 2,5 s.
- **Duración total:** 26,0 s.
- **Comprobado** en `03-montaje/salida-prueba-01-06-sin05/`, con la lista `cortes_01-06_sin05.txt`: 11,04 s, desktop a 9,96 Mb/s y 13,1 MB, móvil a 3,45 Mb/s.
  - El fundido 04 → 06 es limpio y sin saltos (ver `revision-transicion-04-06.jpg`).
- **Móvil 04:** `focoX` pasa de 0,55 a 0,38. La barbacoa entra entera durante todo el tramo, junto con la piscina y su escalera. Es un recorte vertical, sin deformar nada.

## 6. Cuando tengas los siete MP4

1. Los reviso en una sola ronda, con el mismo método que en las tandas anteriores:
   - un fotograma cada 0,5 s;
   - detalle a 1:1;
   - movimiento y color.
2. Fijo el tramo aprovechable de cada uno.
3. Monto los 12 planos con `montar_home.sh`, con el criterio de [`CALIDAD_VIDEO.md`](./CALIDAD_VIDEO.md), en una sola pasada desde los originales:
   - máster ProRes 422 HQ;
   - web desktop H.264 CRF 20 a 1920×1080;
   - web móvil CRF 21 a 720×1280;
   - póster;
   - ficha técnica.

La foto actual de la fachada (`public/images/home/hero-provisional.jpg` y `-mobile.jpg`) sigue siendo la alternativa aprobada del hero.
