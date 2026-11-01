# Higgsfield — prompts de los 6 primeros clips

Fecha: 30/10/2026 · Selección aprobada el 30/10/2026 · Paquete para revisión. Aún no se ha generado nada.

## Estructura del paquete

```
higgsfield-pack/
├── 01-originales-copia/   copia binaria exacta de los 6 originales (MD5 verificado, no editar)
├── 02-jpg-fullres/        conversión JPG a resolución completa (Higgsfield no acepta HEIC)
├── 03-crops-trabajo/      recortes 16:9 y 9:16 para subir a Higgsfield
├── HIGGSFIELD_PROMPTS.md  este documento
└── MAPA_CLIPS_WEB.md      qué clip va en cada página y orden de producción
```

Ruta de origen de los originales: `C:\Users\aleix\OneDrive\Escritorio\BellaterraConecta\Fotos Casa\Fotos Actual 2026\`. Los originales no se han tocado. Las imágenes del paquete están excluidas de git con un `.gitignore` local, para no meter unos 56 MB de binarios en el repositorio.

## Configuración común

- **Modo:** image-to-video, usando la imagen de `03-crops-trabajo/` como primer fotograma.
- **Modelo:** el modo de cámara cinematográfica de Higgsfield (DoP) o el modelo que mejor respete la imagen inicial. Si el modelo permite fijar el fotograma final, no usarlo en esta primera tanda.
- **Preset de cámara:** el equivalente al movimiento indicado (Dolly In, Push In, Truck/Track lateral, Tilt Up…). Los nombres cambian entre versiones; elegir el más suave disponible.
- **Duración:** 5 s. Velocidad lenta y constante, sin aceleración final.
- **Sonido:** desactivado. Si el modelo genera audio, se descarta (regla del proyecto: sin sonido).
- **Resolución:** la máxima disponible.
- **Variantes:** generar 2–3 variantes por clip y elegir la que menos altere la arquitectura.
- **Criterio de rechazo:** el clip se descarta si cambia ventanas, puertas, barandillas, muebles (número o forma), proporciones, materiales o el perfil del paisaje, o si aparece una persona, un texto o un objeto nuevo.

**Negative prompt común**, que se añade al específico de cada clip:

```
people, person, human, silhouette, animals, text, logo, watermark, new furniture, extra chairs, extra tables, added objects, changed architecture, new windows, new doors, changed railing, moving walls, warped geometry, bent lines, melting, morphing, flicker, distorted perspective, fisheye, wide-angle stretch, fast camera, shaky camera, zoom burst, cut, scene change, lens flare, rain, snow, night, sunset color shift, oversaturated, cartoon, CGI look, painting
```

---

## IA-1 · `IMG_5404` — Terraza chill out → vistas

| Campo | Valor |
|---|---|
| Archivo original | `IMG_5404.HEIC` |
| Ruta exacta | `…\Fotos Actual 2026\1-EVENTOS\IMG_5404.HEIC` |
| Archivo para subir | `03-crops-trabajo/IMG_5404_16x9.jpg` (4032×2268). Para móvil: `IMG_5404_9x16.jpg` (1701×3024) |
| Uso en la web | **Home hero** (desktop) y escenas 9–10 del recorrido (terraza → revelación de vistas) |
| Objetivo del clip | Que la terraza "respire" y la mirada se vaya hacia el paisaje: la promesa de la finca en 5 s |
| Movimiento | Push-in lento y recto hacia el hueco entre los pinos, con un tilt-up muy leve en el último segundo |
| Duración | 5 s |
| Formato | Recorte 16:9: quita parte de la copa del pino superior y del suelo. La versión 9:16 se centra en el hueco de vistas y la primera mesa |

**Prompt**

```
Slow, steady cinematic push-in across a real Mediterranean villa terrace toward the gap between the pine trees and the distant hills. The camera glides forward at walking pace, perfectly level, then tilts up very slightly at the end to open the view. Keep everything exactly as in the photo: the white rendered facade with its door and window, the black metal railing with string lights, the round wooden cable-spool tables, the slatted wooden high tables, the dark green woven chairs, the grey stone floor tiles, the pine trees and the mountain silhouette. Soft overcast natural daylight, gentle breeze moving only pine needles and leaves. Photorealistic, architectural real-estate film, 24fps, no people.
```

**Negative prompt específico** (además del común)

```
rearranged chairs, missing tables, extra string lights, different sky, sunny harsh shadows, blue sky replacement, new buildings in the view, sea, changed hills
```

**Preservar:** fachada blanca y su esquina; puerta y ventana oscuras; barandilla negra (altura y número de tramos); 3 mesas-bobina y 2 mesas altas de listones; sillas verdes (número y posición); mesa con mantel blanco y cubos de hielo; pavimento gris; pinos y perfil de las montañas; cielo nublado. **No mover la cámara más allá de la barandilla:** el paisaje que quedaría detrás no está en la foto.

---

## IA-2 · `IMG_5402` — Terraza a lo largo de la fachada

| Campo | Valor |
|---|---|
| Archivo original | `IMG_5402.HEIC` |
| Ruta exacta | `…\Fotos Actual 2026\1-EVENTOS\IMG_5402.HEIC` |
| Archivo para subir | `03-crops-trabajo/IMG_5402_16x9.jpg` (4032×2268) |
| Uso en la web | **Empresas** (bloque de espacios exteriores y pausas) y escena 9 del recorrido |
| Objetivo del clip | Mostrar la longitud y la amplitud de la terraza para reuniones o comidas al aire libre |
| Movimiento | Avance lento siguiendo la línea de la barandilla hacia la mesa del fondo (dolly-in en diagonal), sin girar |
| Duración | 5 s |
| Formato | Recorte 16:9 desplazado hacia arriba para dejar fuera el cenicero y casi toda la mesa de vidrio del primer plano. Sin versión vertical (la composición es horizontal) |

**Prompt**

```
Slow, smooth cinematic dolly-in along a long terrace of a real Mediterranean villa, following the line of the black metal railing toward the dining table set at the far end. Camera height and direction stay constant, no rotation. Keep everything exactly as in the photo: the white facade with its doors and windows, the grey retractable awning, the stone-clad corner of the house, the black chairs, the white tablecloth with dark green runner, the wooden pallet bench, the green tablecloth, the grey floor tiles, the garden slope with white concrete planters and the trees behind. Soft overcast daylight, the awning fabric barely moves in the breeze. Photorealistic architectural film, 24fps, no people.
```

**Negative prompt específico**

```
awning opening or closing, extra awning, changed garden, new planters, different neighbouring house, sunny sky, people on terrace
```

**Preservar:** toldo (posición y ángulo); fachada, puertas y aplique de pared; esquina de piedra; barandilla (trazado recto y altura); mesa del fondo con su montaje; banco de palés; talud con jardineras blancas; casa vecina del fondo; árboles. Que **no aparezca** el resto de la casa al girar.

---

## IA-3 · `IMG_5394` — Comedor hacia la escalera

| Campo | Valor |
|---|---|
| Archivo original | `IMG_5394.HEIC` |
| Ruta exacta | `…\Fotos Actual 2026\1-EVENTOS\IMG_5394.HEIC` |
| Archivo para subir | `03-crops-trabajo/IMG_5394_16x9.jpg` (4032×2268) |
| Uso en la web | **Estancias** (zonas comunes) y escenas 5 → 7 del recorrido (comedor → escalera) |
| Objetivo del clip | Presentar el espacio interior principal: doble altura, altillo y escalera |
| Movimiento | Dolly-in suave hacia el pie de la escalera que se detiene antes del primer peldaño. Sin subir |
| Duración | 5 s |
| Formato | Recorte 16:9 que conserva el frente del altillo y la escalera completa |

**Prompt**

```
Gentle, slow cinematic dolly-in through a real villa dining hall toward the foot of the staircase, stopping before the first step. Camera stays level and does not climb. Keep everything exactly as in the photo: the double-height space, the mezzanine with its metal railing, the straight staircase with potted plants on each step, the wooden doors, the two straw hats on the yellow wall, the two tall potted plants, the terrazzo floor, the mustard velvet chairs and the tables with white cloths and dark green runners. Warm soft interior daylight. Photorealistic architectural interior film, 24fps, no people.
```

**Negative prompt específico**

```
camera climbing stairs, view of upper floor, new rooms, changed staircase shape, extra steps, different wall color, chandelier, changed chairs color
```

**Preservar:** trazado y número de peldaños de la escalera; barandilla del altillo; puertas (posición y material); pared amarilla con los dos sombreros; suelo de terrazo; sillas mostaza y caminos de mesa verdes. **Prohibido** mostrar el piso superior: no está en la foto.

---

## IA-4 · `IMG_5396` — Comedor hacia los ventanales

| Campo | Valor |
|---|---|
| Archivo original | `IMG_5396.HEIC` |
| Ruta exacta | `…\Fotos Actual 2026\1-EVENTOS\IMG_5396.HEIC` |
| Archivo para subir | `03-crops-trabajo/IMG_5396_16x9.jpg` (4032×2268) |
| Uso en la web | **Empresas** (sala de trabajo y comidas) y escena 8 del recorrido (comedor → salida a la terraza) |
| Objetivo del clip | Transmitir luz y amplitud; la luz al final sirve de transición hacia el exterior |
| Movimiento | Dolly-in lento hacia los ventanales con estores; en el último segundo, aumento sutil de luz para encadenar con un fundido a blanco en la web |
| Duración | 5 s |
| Formato | Recorte 16:9 que mantiene la campana de cobre en la esquina superior izquierda |

**Prompt**

```
Slow cinematic dolly-in across a bright real villa dining room toward the large windows with yellow roller blinds. The camera moves straight and level between the tables. Keep everything exactly as in the photo: the large hanging copper fireplace hood, the yellow roller blinds and their exact height, the sliding glass door, the terrazzo floor, the mustard velvet chairs, the tables with white cloths and dark green runners, the floor lamp. In the final second the daylight from the windows gently brightens. Photorealistic architectural interior film, 24fps, no people.
```

**Negative prompt específico**

```
blinds moving, blinds opening, visible outdoor landscape through windows, new windows, changed copper hood, extra lamps, curtains
```

**Preservar:** campana de cobre; estores amarillos (altura y número); puerta corredera; distribución de mesas; suelo. **No mostrar el exterior:** el paso a la terraza se resuelve con fundido en la web.

---

## IA-5 · `4a055ba6` — Ventanal del comedor con vistas (móvil)

| Campo | Valor |
|---|---|
| Archivo original | `4a055ba6-91ae-46de-b319-7201070f50ee.JPG` |
| Ruta exacta | `…\Fotos Actual 2026\3-ESTANCIAS\4a055ba6-91ae-46de-b319-7201070f50ee.JPG` |
| Archivo para subir | `03-crops-trabajo/4a055ba6_9x16.jpg` (2268×4032) |
| Uso en la web | **Home hero en móvil** y versión vertical de la escena 10 (revelación de vistas) |
| Objetivo del clip | Equivalente vertical de IA-1: de la mesa a la vista |
| Movimiento | Push-in vertical suave desde la mesa hacia el ventanal |
| Duración | 5 s |
| Formato | Recorte 9:16 desde el original vertical (3:4), centrado en el ventanal |

**Prompt**

```
Slow vertical cinematic push-in from a long set dining table toward a large window overlooking green hills and a distant town. Camera moves forward smoothly and stays level. Keep everything exactly as in the photo: the window frame and roller blinds, the black exterior railing, the potted plant, the long table with grey tablecloth, white plates, small plants and red glasses, the mustard chairs, the exact mountain silhouette and town in the distance. Soft natural daylight. Photorealistic architectural film, 24fps, no people.
```

**Negative prompt específico**

```
going through the window, flying outside, changed landscape, sea, new buildings, rearranged tableware, extra glasses, missing plates
```

**Preservar:** marco del ventanal y estores; barandilla exterior; perfil de montañas y pueblo; vajilla y objetos de la mesa (no añadir ni quitar nada). **La cámara no atraviesa el cristal.**

---

## IA-6 · `IMG_8878` — Mesa de banquete hacia la piscina

| Campo | Valor |
|---|---|
| Archivo original | `Copia de IMG_8878.HEIC` |
| Ruta exacta | `…\Fotos Actual 2026\1-EVENTOS\Copia de IMG_8878.HEIC` |
| Archivo para subir | `03-crops-trabajo/IMG_8878_9x16.jpg` (3213×5712) |
| Uso en la web | **Eventos hero** (vertical o banda lateral) y escena 3 del recorrido (piscina) |
| Objetivo del clip | Mostrar la capacidad de montaje de eventos junto a la piscina |
| Movimiento | Travelling frontal a lo largo de la mesa hacia la piscina, con una elevación mínima |
| Duración | 5 s |
| Formato | Recorte 9:16 centrado en la mesa. La foto es vertical, así que **no se puede sacar un 16:9 limpio**: para el hero de escritorio, usar este clip en una columna o pedir otra foto horizontal del mismo montaje |

**Prompt**

```
Slow cinematic forward tracking shot along a long rustic banquet table set for an event, moving toward a swimming pool in a Mediterranean garden, with a very slight rise in camera height. Keep everything exactly as in the photo: the white distressed wooden table, the burlap runner, the woven placemats with white plates and napkins, the glass bottles and candles, the stone paving, the rectangular pool, the white umbrellas and pergola, the stone wall and the pine trees. Soft natural daylight, water surface gently rippling. Photorealistic event venue film, 24fps, no people.
```

**Negative prompt específico**

```
extra place settings, missing plates, changed pool shape, pool lights, new umbrellas, guests, waiters, decorations added
```

**Preservar:** forma y tamaño de la piscina; pavimento de piedra; pérgola y sombrillas; muro de piedra; número de cubiertos de la mesa y su montaje.

---

## Checklist de revisión de cada clip generado

- [ ] Arquitectura idéntica: ventanas, puertas, barandillas, escalera, fachada.
- [ ] Mobiliario idéntico: número, forma, color y posición.
- [ ] Vistas y paisaje sin cambios.
- [ ] Sin personas, textos ni objetos nuevos.
- [ ] Movimiento suave y constante, sin saltos ni morphing.
- [ ] Sin audio.
- [ ] El primer fotograma coincide con la foto (necesario para encadenar el scroll).
