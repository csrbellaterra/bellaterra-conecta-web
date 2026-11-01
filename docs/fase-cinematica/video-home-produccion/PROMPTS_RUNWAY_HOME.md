# Vídeo de Home: prompts de Runway (13 planos)

Fecha: 31/10/2026 · Paquete listo para generar. **Todavía no se ha generado ningún clip ni se ha gastado ningún crédito.**

- Orden, duraciones y transiciones: [`STORYBOARD_VIDEO_HOME.md`](../STORYBOARD_VIDEO_HOME.md) (sin cambios de orden).
- Montaje: [`PLAN_MONTAJE.md`](./PLAN_MONTAJE.md).
- Hoja de los recortes: [`recortes-16x9.jpg`](./recortes-16x9.jpg). El rectángulo amarillo es el encuadre vertical previsto para móvil.

## Estructura

```
video-home-produccion/
├── 01-imagenes-runway/     13 recortes 16:9 (3840×2160, JPG q92) que se suben a Runway
├── 02-clips-runway/        aquí guardas los clips descargados: NN_slug_v1.mp4, _v2…
├── 03-montaje/             cortes.txt + montar_home.sh; cada montaje crea salida-AAAAMMDD-HHMM/
├── recortes_16x9.py        script que generó los recortes (reproducible)
├── recortes-16x9.jpg       hoja de revisión
├── PROMPTS_RUNWAY_HOME.md  este documento
└── PLAN_MONTAJE.md
```

Las imágenes, clips y montajes están excluidos de git con el `.gitignore` de esta carpeta. Los originales no se han tocado: los recortes se leen de ellos y se guardan aparte.

### Originales de 01 y 02

He comprobado `_RA60581` y `_RA60591`: son **idénticos byte a byte** (mismo MD5) a `1.jpg` y `2.jpg` de `Fotos Video Landing General`. Lo mismo pasa con las copias de `FOTOS CASA\exterior\Casa\Entrada Casa parte delantera\`, que ahora se llaman `1.jpg` y `2.jpg`. La etiqueta "comprimido" de la carpeta no significa que esas copias tengan menos calidad: las tres son el mismo archivo a resolución completa (5472×3648). Los recortes 01 y 02 se han generado desde `_RA60581.jpg` y `_RA60591.jpg`, como pediste. No existe ninguna versión de mayor calidad.

## Ajustes comunes de Runway

| Ajuste | Valor |
|---|---|
| Herramienta | Generate Video → **image to video** |
| Modelo | **Gen-4 Turbo**, el mismo que en IA-1 e IA-7 |
| Imagen | El JPG de `01-imagenes-runway/` como primer fotograma. Ya es 16:9: si Runway propone recortar, deja el encuadre completo |
| Relación | **16:9 (1280×720)** |
| Duración | **5 s**. El montaje usa como mucho unos 3,8 s de cada clip |
| Seed | Aleatoria. Si un clip sale bien, anota la seed para repetir variaciones |
| Prompt | El de cada plano, copiado tal cual. Está en inglés, describe sobre todo el movimiento de cámara y no lleva negativos |
| Variantes | 1 por plano. Solo si falla, una segunda con el prompt "Variante B" |
| Coste orientativo | Gen-4 Turbo cuesta unos 5 créditos/s, es decir, unos 25 créditos por clip de 5 s. Los 13 planos son unos 325 créditos, más los reintentos. Comprueba el coste real en la interfaz antes de generar |
| Nombre al descargar | `NN_slug_v1.mp4`, por ejemplo `01_entrada-camino_v1.mp4`, en `02-clips-runway/`. Es el nombre que espera `cortes.txt` |

**Por qué no hay prompt negativo:** Gen-4 no tiene campo negativo, y escribir "no people" o "no warping" en el prompt puede provocar justo lo contrario. Por eso los prompts describen solo lo que debe pasar: cámara lenta y estable, elementos que se quedan quietos y luz constante.

**Resolución:** Gen-4 Turbo entrega 720p. Es suficiente para probar el montaje, pero se queda corta para un hero a pantalla completa y, sobre todo, para el recorte vertical de móvil. Cuando un clip esté aprobado, se puede escalar con **Upscale to 4K** de Runway. Consume créditos adicionales, así que comprueba el coste antes. Descarga el clip escalado como `NN_slug_v1_4k.mp4` y cambia el nombre en `cortes.txt`. El script acepta las dos versiones.

### Criterios de rechazo (comunes a todos los planos)

Rechaza el clip si ocurre cualquiera de estas cosas:

- Una línea de fachada, tejado, barandilla o red se curva, ondula o "respira".
- Cambia el número o la forma de las ventanas, puertas, persianas, sillas, mesas, tumbonas o farolas.
- Aparece algo que no estaba en la foto: una persona, un animal, un objeto, un edificio, agua o un camino.
- La cámara atraviesa una pared o un árbol, o gira hacia una zona que no aparece en la foto.
- La luz cambia: se nubla, salta la exposición o el sol se mueve.
- El movimiento es rápido, tiene tirones o termina con un zoom brusco.

Es normal, y aceptable, que se muevan suavemente las hojas, el agua y las nubes.

---

## Resumen de los 13 planos

| # | Plano | Archivo para subir | Movimiento | Montaje | Riesgo | Estado |
|---|---|---|---|---|---|---|
| 01 | Llegada por el camino | `01_entrada-camino_16x9.jpg` | Dolly in lento por el camino | 2,5 s · corte | Bajo | **Lista** |
| 02 | Entrada bajo la magnolia | `02_entrada-arbol_16x9.jpg` | Travelling lateral corto a la derecha, con paralaje del árbol | 2,0 s · fundido 0,4 s | Medio | **Lista** |
| 03 | Piscina entre ramas | `03_piscina-ramas_16x9.jpg` | Avance lento a través de las ramas | 2,0 s · corte | Medio | **Lista** |
| 04 | Piscina y barbacoa | `04_piscina-barbacoa_16x9.jpg` | Avance lento en plano alto | 2,0 s · corte | Bajo | Lista |
| 05 | Piscina a ras de agua | `05_piscina-ras-agua_16x9.jpg` | Casi fijo, con avance mínimo | 1,5 s · fundido 0,4 s | Bajo | **Lista** (confirmada por el usuario el 31/10/2026) |
| 06 | Fachada trasera | `06_fachada-trasera_16x9.jpg` | Dolly in hacia el porche | 2,0 s · corte | Bajo | Lista |
| 07 | Porche y ventanales | `07_porche-comedor_16x9.jpg` | Travelling lateral corto a la derecha | 2,0 s · corte | Medio | Lista |
| 08 | Terraza elevada y pistas | `08_terraza-pistas_16x9.jpg` | Avance lento hacia el pino y las vistas | 2,0 s · fundido 0,4 s | Medio | Lista |
| 09 | Jardín con vistas | `09_jardin-vistas_16x9.jpg` | Avance muy lento; se mueven las nubes | 2,5 s · corte | Bajo | Lista |
| 10 | Terraza con toldo | `10_terraza-toldo_16x9.jpg` | Avance a lo largo de la barandilla | 1,5 s · corte | Medio | Lista |
| 11 | Terraza chill out | `11_terraza-chillout_16x9.jpg` | Avance lento hacia el hueco de vistas | 2,0 s · fundido 0,4 s | Bajo | Lista |
| 12 | Pistas y casa | `12_pistas-casa_16x9.jpg` | Travelling lateral lento a la izquierda | 2,0 s · corte | Medio | Lista |
| 13 | Pistas y horizonte | `13_pistas-horizonte_16x9.jpg` | Avance con elevación mínima; termina casi quieto | 3,0 s · fundido de bucle 0,8 s | Medio | Lista |

**Total:** 27 s (13 planos, 4 fundidos internos y el fundido del bucle).

**Lógica del movimiento:**

- Casi todo el recorrido avanza hacia delante, como quien entra en la finca y la recorre.
- Los travellings laterales aparecen solo donde el plano siguiente está de verdad hacia ese lado (02 → piscina, 07 → lateral de la casa, 12 → vistas).
- El 05 y el 09 son casi fijos para dar respiro.
- Los cortes secos unen planos de la misma zona y con el mismo sentido de movimiento. Los fundidos marcan el cambio de zona: entrada → piscina, piscina → casa, casa → jardín, terrazas → pistas.

**Validación de fechas:**

- 01, 02, 06, 07, 08 y 12 son de 2024; 03, 04 y 13, de 2025; 09, 10 y 11, de 2026.
- Al aprobar esta selección las has dado por representativas, excepto la **05**, que queda pendiente de confirmar el estado actual de la piscina. No hay sustituta: si la piscina ha cambiado, el plano se elimina y 04 funde directamente con 06.

---

## 01 · Llegada por el camino — PRIMERA TANDA

| Campo | Valor |
|---|---|
| Qué muestra | Llegada a la casa principal por el camino de losas: fachada blanca con zócalo de piedra, puerta de madera, magnolia a la derecha y cuerda de jardín a la izquierda |
| Original | `FOTOS CASA comprimido\exterior\Casa\Entrada Casa parte delantera\_RA60581.jpg` (5472×3648, 16/07/2024). Es idéntico a `1.jpg` |
| Recorte | Ancho completo; se quita el 13 % superior de cielo y un poco de suelo. Fachada y camino enteros, en proporción real |
| **Archivo para subir** | `01-imagenes-runway/01_entrada-camino_16x9.jpg` |
| Movimiento | **Dolly in** lento y recto por el camino hacia la puerta de madera, a altura de ojos y a paso tranquilo |
| Enlace | El avance continúa en 02, que es el mismo acceso visto más cerca. Corte seco en movimiento |
| Montaje | 2,5 s (tramo 0,8–3,3 s del clip) |
| Riesgos | Bajo. Vigilar: las rejas y las persianas de las ventanas, las líneas del tejado, la antena, las juntas del enlosado (no deben "nadar") y la cuerda con estacas |
| Estado | **Lista para generar** |

**Prompt (copiar tal cual)**

```
Slow, smooth cinematic dolly-in along the stone-paved driveway toward the wooden front door of the white house, at a calm walking pace, eye level, perfectly steady like a gimbal shot. The house stays solid and unchanged: white walls, grey stone base, roof tiles, chimneys, window grilles and shutters keep their exact shape. Only the magnolia leaves on the right and the shrubs sway gently in a light summer breeze. Warm late-afternoon sunlight, stable exposure, soft shadows on the paving. Photorealistic real-estate film.
```

**Qué debe pasar:** la cámara avanza unos pocos metros por el camino. La casa crece de forma uniforme en el encuadre, sin girar ni cambiar de perspectiva de golpe, y la puerta queda algo más cerca y centrada a la derecha. Las sombras del suelo no cambian de forma y la magnolia se mueve ligeramente.

**Para aprobar:**

- La puerta de madera, las rejas y las persianas mantienen la forma y el número durante los 5 s.
- Las líneas del tejado y las chimeneas siguen rectas.
- El enlosado no se deforma ni "fluye" hacia la cámara.
- La velocidad es constante, sin acelerón final.
- No aparece ninguna persona, vehículo ni objeto.
- Entre los segundos 0,8 y 3,3 no hay nada que rechazar: es el tramo que se monta.

**Variante B** (si la casa se deforma):

```
Very slow, subtle forward camera push toward the white house along the paved path, almost static, perfectly stable. The architecture remains completely rigid and unchanged. Gentle breeze in the leaves, steady warm sunlight. Photorealistic.
```

---

## 02 · Entrada bajo la magnolia — PRIMERA TANDA

| Campo | Valor |
|---|---|
| Qué muestra | El mismo acceso, más cerca, enmarcado por la magnolia del primer plano: tronco a la derecha, ramas arriba, puerta lateral, lilo en flor y rocas |
| Original | `…\Entrada Casa parte delantera\_RA60591.jpg` (5472×3648, 16/07/2024). Es idéntico a `2.jpg` |
| Recorte | Ancho completo; se quita el 10 % superior (ramas y cielo) y el 5 % inferior (rocas). La casa y la puerta quedan bajo el arco de ramas |
| **Archivo para subir** | `01-imagenes-runway/02_entrada-arbol_16x9.jpg` |
| Movimiento | **Travelling lateral corto a la derecha**, paralelo a la fachada y a la misma altura. El tronco y las ramas pasan por delante con paralaje natural; la casa del fondo se desplaza menos |
| Enlace | El tronco avanza hacia el centro y hace de "cortinilla" natural. **Fundido de 0,4 s** a 03 (cambio de zona: de la entrada a la piscina) |
| Montaje | 2,0 s (tramo 0,8–3,2 s, con el fundido) |
| Riesgos | **Medio.** Las ramas finas sobre fondo claro tienden a duplicarse o a fundirse con la casa. Vigilar también la persiana gris y la puerta de madera de la izquierda, la puerta de la derecha y las piedras del primer plano. El borde derecho es zona que no aparece en la foto: con un recorrido corto, la IA apenas tiene que inventar |
| Estado | **Lista para generar** |

**Prompt (copiar tal cual)**

```
Slow cinematic lateral tracking shot moving gently to the right, parallel to the white house, same height, steady and smooth. The large magnolia tree and its branches in the foreground pass with natural parallax while the house behind stays rigid and unchanged: white walls, stone base, wooden doors, grey shutters and windows keep their exact shape. Leaves move softly in a light breeze, dappled sunlight on the paving stays stable. Short camera travel, calm pace. Photorealistic real-estate film.
```

**Qué debe pasar:** la cámara se desplaza poco a la derecha. El tronco y las ramas se mueven más rápido que la casa (paralaje), lo que da profundidad real. La casa no gira ni se deforma, y al final el tronco cubre algo más del encuadre.

**Para aprobar:**

- Las ramas no se duplican, no se derriten y no se fusionan con la fachada.
- La casa conserva sus puertas, ventanas y persianas.
- El paralaje es coherente: el primer plano va más rápido que el fondo.
- No aparecen ramas ni troncos nuevos.
- El desplazamiento es corto y lento.

**Variante B** (si las ramas se deforman): un avance mínimo, sin lateral.

```
Almost static camera with a very slow, subtle push forward under the magnolia branches toward the white house. The tree and the house remain rigid and unchanged; only leaves sway softly in the breeze. Steady sunlight. Photorealistic.
```

---

## 03 · Piscina entre ramas — PRIMERA TANDA

| Campo | Valor |
|---|---|
| Qué muestra | La piscina vista desde arriba, entre las ramas del olivo del primer plano: cuatro tumbonas, flores rosas, rocas, césped y la caseta blanca |
| Original | `Fotos Video Landing General\3.JPG` (6000×4000, Sony, 24/05/2025). Original de cámara de 21 MB |
| Recorte | Ancho completo; se quita el **16 % superior**. Así sale del encuadre la casa vecina (tejado de pizarra con buhardilla) y la canasta, que no son de la finca o distraen |
| **Archivo para subir** | `01-imagenes-runway/03_piscina-ramas_16x9.jpg` |
| Movimiento | **Avance lento a través de las ramas**, muy ligeramente descendente: la cámara "se asoma" desde detrás del olivo hacia la piscina |
| Enlace | Llega desde el fundido de 02 (las ramas de la magnolia dan paso a las del olivo). Corte seco a 04, la misma piscina vista entera, que continúa el avance |
| Montaje | 2,0 s (tramo 1,0–3,0 s) |
| Riesgos | **Medio.** Las hojas del primer plano, grandes y desenfocadas, pueden cambiar de forma o multiplicarse. Al avanzar, la IA tiene que "rellenar" lo que tapan las hojas: el agua y el borde de la piscina. Vigilar que el número de tumbonas siga siendo 4, que la escalera de la piscina no cambie y que el agua no invada el borde |
| Estado | **Lista para generar** |

**Prompt (copiar tal cual)**

```
Slow cinematic camera move gently forward and slightly downward through the out-of-focus olive leaves in the foreground, revealing the bright blue swimming pool below. The pool, its pale stone edge, the four grey sun loungers, the pink flowers, the rocks and the small white building stay exactly as they are. Leaves sway softly; the water surface shimmers with gentle ripples. Bright natural daylight, stable exposure, smooth and calm motion. Photorealistic real-estate film.
```

**Qué debe pasar:** las hojas del primer plano se abren o se desplazan hacia los bordes a medida que la cámara avanza un poco. La piscina gana presencia en el centro y el agua se mueve suavemente. Las tumbonas y el borde no cambian.

**Para aprobar:**

- Siguen siendo 4 tumbonas, con la misma forma y posición.
- La forma rectangular de la piscina y la escalera no cambian.
- Las hojas no se convierten en manchas ni crecen de forma extraña.
- No aparece la casa vecina ni ninguna construcción nueva arriba.
- El agua no "sube" ni cambia de color.

**Variante B** (si las hojas se deforman):

```
Almost static shot from behind olive leaves looking down at the blue swimming pool. Very slow, subtle forward drift. Leaves sway gently in the breeze and the water shimmers; the pool, sun loungers and flowers remain unchanged. Bright daylight. Photorealistic.
```

---

## 04 · Piscina y barbacoa

| Campo | Valor |
|---|---|
| Qué muestra | La piscina entera, con la zona de barbacoa de obra, las mesas de picnic, el comedor exterior con sombrillas, la pérgola, las tumbonas y los pinos |
| Original | `4.JPG` (6000×4000, Sony, 24/05/2025) |
| Recorte | Ancho completo; se quita el 6 % superior (copa de pinos) y el 9 % inferior (rocas del primer plano) |
| Movimiento | Avance lento en plano alto, recto hacia el centro de la piscina, sin girar |
| Enlace | Llega por corte desde 03 (de "asomarse" a ver la piscina entera). Corte seco a 05, el contraplano a ras de agua |
| Montaje | 2,0 s (tramo 1,0–3,0 s) |
| Riesgos | Bajo, aunque hay muchos objetos pequeños: sillas, sombrillas y la barandilla de la escalera. Vigilar la pérgola (rectas), la estructura de la barbacoa y el número de sillas |
| Estado | Lista |

```
Slow, steady elevated dolly-in toward the swimming pool, high camera, perfectly level, no rotation. The pool, the white stone barbecue structure, the picnic tables, the outdoor dining tables with umbrellas, the dark metal pergola, the sun loungers and the pine trees all stay exactly as they are. The water ripples softly, pine branches sway slightly. Soft bright daylight with light clouds, stable exposure. Photorealistic real-estate film.
```

---

## 05 · Piscina a ras de agua — LISTA (confirmada el 31/10/2026)

> El usuario confirmó el 31/10/2026 usar esta foto en el montaje. Nota de la revisión: en la foto (2024) el vaso es turquesa con friso de gresite; en 2025–2026 es gresite azul entero. Las alternativas 05b y 05c quedan como reserva en [`TANDA_04-06.md`](./TANDA_04-06.md).

| Campo | Valor |
|---|---|
| Qué muestra | La piscina a ras de agua, con el reflejo de la casa, el muro de piedra, la escalera metálica y los árboles |
| Original | `5.jpg` (5472×3648, Canon, **16/07/2024**) |
| Recorte | Ancho completo; se quita la mitad del sobrante arriba (cielo) y la otra mitad abajo (pavimento) |
| Movimiento | Casi fijo, con un avance mínimo. Solo se mueven el agua y los reflejos |
| Enlace | Llega por corte desde 04 (contraplano). **Fundido de 0,4 s** a 06 (de la piscina a la casa) |
| Montaje | 1,5 s (tramo 1,0–2,9 s) |
| Riesgos | Bajo para la IA: el plano es casi fijo. Vigilar que el reflejo de la casa no se deforme de manera distinta a la casa real y que la escalera metálica mantenga su forma |
| Estado | **Lista para generar** (confirmada por el usuario el 31/10/2026) |

```
Nearly static, locked-off shot at water level beside the swimming pool, with an extremely slow, subtle push forward. Only the water surface moves: gentle ripples and shimmering reflections of the white house and the trees. The house, the stone retaining wall, the metal pool ladder, the pool edge and the trees remain perfectly still and unchanged. Clear soft evening daylight, stable exposure. Photorealistic real-estate film.
```

---

## 06 · Fachada trasera

| Campo | Valor |
|---|---|
| Qué muestra | La fachada trasera con la buganvilla, el porche cubierto, la mesa de ping-pong, los pinos y las vistas al fondo |
| Original | `6.jpg` (5472×3648, 16/07/2024) |
| Recorte | Ancho completo; se quita sobre todo cielo (12 % arriba) y un poco de césped. La antena queda dentro |
| Movimiento | Dolly in lento hacia el porche |
| Enlace | Llega desde el fundido de 05. Corte seco a 07 (el porche, ya de cerca) |
| Montaje | 2,0 s (tramo 1,0–3,0 s) |
| Riesgos | Bajo. Vigilar la buganvilla (que no crezca), las sillas del porche, la mesa de ping-pong (patas y red) y las ventanas de la planta alta |
| Estado | Lista |

```
Slow, smooth dolly-in across the lawn toward the covered porch of the white two-storey house with the pink bougainvillea, eye level, perfectly steady. The house, its windows, roof tiles, stone columns, porch chairs, the ping-pong table and the pine trees stay exactly as they are. Pine needles and bougainvillea flowers move slightly in a light breeze. Warm late-afternoon sunlight, stable exposure. Photorealistic real-estate film.
```

---

## 07 · Porche y ventanales

> **31/10/2026:** los prompts definitivos de 07–13 están en [`TANDA_07-13.md`](./TANDA_07-13.md) (versión optimizada; la 13 usa el recorte `13_pistas-horizonte_16x9_v2.jpg`). La 05 se retiró del montaje.

| Campo | Valor |
|---|---|
| Qué muestra | El porche cubierto, con la pared de gresite verde, la mesa con sillas y la puerta de madera, y los ventanales del comedor, de frente |
| Original | `7.jpg` (5232×3488, 16/07/2024) |
| Recorte | Ancho completo; se quita cielo arriba (11 %) y algo de césped |
| Movimiento | Travelling lateral corto a la derecha, paralelo a la fachada |
| Enlace | Llega por corte desde 06. Avanza hacia el lado derecho de la casa, que es el lateral que muestra 08. Fundido corto con 08 |
| Montaje | 2,0 s (tramo 1,0–3,0 s) |
| Riesgos | **Medio.** Los ventanales tienen reflejos del paisaje, que la IA puede animar de forma incoherente. Vigilar también la puerta de cuarterones, las columnas de piedra, la parabólica y la cuerda con postes |
| Estado | Lista |

```
Slow lateral tracking shot moving gently to the right, parallel to the facade, eye level, steady and smooth. The covered porch with its green tiled wall, table and chairs, the wooden panelled door, the stone columns and the large dining-room windows stay rigid and unchanged; reflections in the glass shift only slightly and naturally with the camera. Warm late-afternoon light, stable exposure, short camera travel. Photorealistic real-estate film.
```

---

## 08 · Terraza elevada y pistas

| Campo | Valor |
|---|---|
| Qué muestra | El lateral de la casa con la terraza elevada sobre pilares, el gran pino piñonero, la pista y las vistas al valle |
| Original | `8.jpg` (5254×3503, 16/07/2024) |
| Recorte | Ancho completo; se quita poco de arriba (casa y copa del pino) y más césped de abajo |
| Movimiento | Avance lento y recto hacia el pino y las vistas |
| Enlace | Llega desde 07 (lateral de la casa). **Fundido de 0,4 s** a 09, las vistas desde el jardín |
| Montaje | 2,0 s (tramo 1,0–3,4 s, con el fundido) |
| Riesgos | **Medio.** La barandilla de la terraza (muchos barrotes), la red y las líneas de la pista, la bicicleta y el saco de boxeo |
| Estado | Lista |

```
Slow, steady dolly-in toward the large umbrella pine and the distant valley view beyond the elevated terrace, eye level, no rotation. The white house, the long metal railing of the terrace, its stone pillars, the court with its lines and net, the bicycle and the pine trees stay exactly as they are. Pine needles sway gently, hazy distant city and hills remain unchanged. Warm late-afternoon sunlight, stable exposure. Photorealistic real-estate film.
```

---

## 09 · Jardín con vistas (2026)

| Campo | Valor |
|---|---|
| Qué muestra | El jardín con pinos, el cielo con nubes, el valle y las montañas, y una pista a la izquierda |
| Original | `9.jpg` (5712×4284, iPhone 15 Pro, 31/10/2026). Formato 4:3 |
| Recorte | Ancho completo; se quita la mitad del sobrante arriba (nubes) y la otra mitad abajo (césped con losas) |
| Movimiento | Avance muy lento hacia las vistas. Las nubes se desplazan lentamente; el resto, casi quieto |
| Enlace | Llega desde el fundido de 08. Corte seco a 10, de vuelta a la casa |
| Montaje | 2,5 s (tramo 1,0–3,5 s) |
| Riesgos | Bajo. El horizonte de las montañas no debe cambiar de perfil, ni la ciudad del valle. Vigilar las macetas blancas, los postes con cuerda y el alero de la esquina superior izquierda |
| Estado | Lista |

```
Very slow, gentle push-in toward the open valley view between the pine trees, almost static, perfectly steady. White clouds drift slowly across the blue sky; pine branches sway softly. The mountain silhouette, the distant city, the white planters, the rope fence, the court and the lawn remain exactly as they are. Bright clear daylight, stable exposure. Photorealistic real-estate film.
```

---

## 10 · Terraza con toldo (2026)

| Campo | Valor |
|---|---|
| Qué muestra | La terraza a lo largo de la fachada, con el toldo, la mesa larga con mantel, la barandilla negra y el jardín |
| Original | `10.jpg` (4032×3024, iPhone 13, 03/10/2026). Formato 4:3 |
| Recorte | Ancho completo; se quita el 20 % de arriba y el **80 % de abajo** del sobrante. Así sale del encuadre casi toda la mesa de cristal del primer plano, con el cenicero y el servilletero |
| Movimiento | Avance lento a lo largo de la barandilla, hacia la mesa del fondo |
| Enlace | Llega por corte desde 09. Corte seco a 11, que continúa por la terraza |
| Montaje | 1,5 s (tramo 1,0–2,5 s) |
| Riesgos | **Medio.** La tela del toldo, la barandilla (barrotes y luces), las sillas negras (número) y la botella de la mesa. Las casas vecinas del fondo no deben cambiar |
| Estado | Lista |

```
Slow, smooth dolly-in along the terrace following the black metal railing toward the long table with the white tablecloth, eye level, perfectly steady. The white facade, the grey retractable awning, the black chairs, the wooden pallet bench, the railing with its string lights and the garden beyond stay exactly as they are. Soft overcast daylight, stable exposure, calm pace. Photorealistic real-estate film.
```

---

## 11 · Terraza chill out (2026)

| Campo | Valor |
|---|---|
| Qué muestra | La terraza chill out, con las mesas-bobina de madera, las mesas altas de listones, las sillas verdes, los pinos y las montañas |
| Original | `11.jpg` (4032×3024, iPhone 13, 03/10/2026). Formato 4:3 |
| Recorte | Ancho completo; se quitan las ramas del pino de arriba (45 % del sobrante) y suelo de abajo (55 %) |
| Movimiento | Avance lento hacia el hueco de vistas entre los pinos. Es el mismo lenguaje que IA-1, ya probado |
| Enlace | Llega por corte desde 10. **Fundido de 0,4 s** a 12, de la terraza a las pistas |
| Montaje | 2,0 s (tramo 1,0–3,4 s, con el fundido) |
| Riesgos | Bajo. Ya se probó un plano casi igual (IA-1). Vigilar el número de sillas verdes, las bobinas y la barandilla |
| Estado | Lista. Si el color encaja, también se puede reutilizar IA-1_v1 (0–2 s) |

```
Slow, steady cinematic push-in across the terrace toward the gap between the pine trees and the distant hills, eye level, no rotation. The round wooden cable-spool tables, the slatted wooden high tables, the dark green woven chairs, the white facade, the black railing and the grey floor tiles stay exactly as they are. Pine needles sway gently. Soft overcast daylight, stable exposure. Photorealistic real-estate film.
```

---

## 12 · Pistas y casa

| Campo | Valor |
|---|---|
| Qué muestra | Las pistas en primer plano, con el gran pino, la casa y su terraza al fondo, y las montañas a la izquierda |
| Original | `12.jpg` (5159×3439, 16/07/2024) |
| Recorte | **95 % del ancho, anclado a la izquierda.** Así queda fuera el perro que hay en la terraza, en el extremo derecho. Se quita poco de arriba (ramas) y más asfalto de abajo |
| Movimiento | Travelling lateral lento a la izquierda: las pistas quedan en primer plano y la casa se aleja hacia la derecha mientras se abren las vistas |
| Enlace | Llega desde el fundido de 11. Corte seco a 13, que continúa hacia las vistas |
| Montaje | 2,0 s (tramo 1,0–3,0 s) |
| Riesgos | **Medio.** Las líneas de la pista deben seguir rectas, y la red no debe deformarse. Los paneles verdes con texto pueden deformar las letras (sin importancia si son ilegibles a este tamaño). Vigilar las sillas blancas y la barandilla de la terraza |
| Estado | Lista |

```
Slow lateral tracking shot moving gently to the left across the sports courts, low and steady, short camera travel. The court surfaces and their straight white lines, the net, the white chairs, the large pine tree and the house with its terrace and stone wall stay rigid and unchanged. Pine branches sway softly, distant hills remain the same. Warm late-afternoon sunlight, stable exposure. Photorealistic real-estate film.
```

---

## 13 · Pistas y horizonte — CIERRE DEL BUCLE

| Campo | Valor |
|---|---|
| Qué muestra | Las pistas con la red en primer plano, los pinos y el horizonte de colinas con el Tibidabo |
| Original | `13.JPG` (6000×4000, Sony, 24/05/2025) |
| Recorte | Ancho completo; se quitan las copas (40 % del sobrante) y algo de pista (60 %). El horizonte queda en el tercio central |
| Movimiento | Avance lento con una elevación mínima hacia el horizonte. El último segundo es casi quieto, para que el fundido del bucle a 01 sea limpio |
| Enlace | Llega por corte desde 12. **Fundido de bucle de 0,8 s** a 01 |
| Montaje | 3,0 s (tramo 1,0–4,8 s, con el fundido) |
| Riesgos | **Medio.** La red (malla fina), las líneas de pista y su sombra, las sillas blancas y el cartel con texto de la derecha. El perfil de las colinas no debe cambiar |
| Estado | Lista |

```
Slow, smooth push-in over the sports courts toward the distant horizon of hills, with a very slight rise of the camera, steady and calm, easing into an almost still frame at the end. The net, the straight court lines and their shadows, the white chairs, the tall pine trees and the mountain silhouette stay exactly as they are. Pine needles sway gently. Bright clear daylight, stable exposure. Photorealistic real-estate film.
```

---

## Orden de producción

1. **Primera tanda: 01, 02 y 03.** Unos 75 créditos. Sirve para probar el lenguaje de cámara y el primer tramo del montaje (entrada → piscina).
2. Revisar los tres clips con los criterios de cada plano. Anota en el registro de abajo la seed y lo que se aprueba.
3. Con el lenguaje validado: 04, 06, 07 y 08; después 09–13. La 05 solo cuando se confirme la piscina.
4. Escalar a 4K solo los clips aprobados que vayan al montaje definitivo.

## Registro de generaciones

| # | Versión | Fecha | Seed | Resultado | Tramo útil | Notas |
|---|---|---|---|---|---|---|
| 01 | v1 | 31/10/2026 | — | **Aprobado** | 0,8–3,3 s (útil hasta ~4,5 s) | Avance con leve desplazamiento lateral. Arquitectura estable. Ver `03-montaje/REVISION_01-03.md` |
| 02 | v1 | 31/10/2026 | — | **Aprobado con recorte** | 0,8–3,2 s | La cámara baja y avanza (no hace travelling lateral). Casa y magnolia estables; último segundo más blando |
| 03 | v1 | 31/10/2026 | — | **Aprobado con recorte** (segunda revisión) | 2,0–4,0 s | Las hojas se abren y descubren la piscina. La caseta y los bloques blancos coinciden con la foto 04. Ver `03-montaje/REVISION_01-03.md` |
| 04 | v1 | 31/10/2026 | — | **Aprobado** | 1,0–3,0 s | Acercamiento elevado y estable. Pérgola, barbacoa, mobiliario y escalera estables. Ver `03-montaje/REVISION_04-06.md` |
| 05 | v1 | 31/10/2026 | — | **Aprobado** | 1,0–2,9 s | Casi fijo; solo se mueven el agua y los reflejos. El vaso turquesa (2024) contrasta con el azul de la 04 |
| 05c | v1 | 31/10/2026 | — | Reserva, no se usa | 0,3–2,3 s como máximo | A partir de ~3,3 s inventa hierba y tallos al pasar sobre la roca |
| 06 | v1 | 31/10/2026 | — | **Aprobado** | 1,0–3,0 s | Acercamiento suave. Ventanas, antena, columnas y ping-pong estables |
| 07 | v1 | 31/10/2026 | — | **Aprobado** | 1,0–3,0 s | Lateral corto. Puerta, gresite y ventanales estables. Ver `03-montaje/REVISION_07-13.md` |
| 08 | v1 | 31/10/2026 | — | **Aprobado** | 1,0–3,4 s | Avance muy suave hacia el pino. La barandilla, sin moiré |
| 09 | v1 | 31/10/2026 | — | **Aprobado** | 1,0–3,9 s | Casi fijo, con nubes en movimiento. El horizonte no cambia |
| 10 | v1 | 31/10/2026 | — | **Aprobado** | 1,0–2,5 s | El toldo y el mantel quedan quietos |
| 11 | v1 | 31/10/2026 | — | **Aprobado** | 1,0–3,4 s | Mesas y sillas estables. Acelera en el último segundo, que no se usa |
| 12 | v1 | 31/10/2026 | — | **Aprobado en parte** | 0,5–2,5 s | A partir de ~3,3 s inventa una construcción con tejado y cipreses en el borde izquierdo |
| 13 | v1 | 31/10/2026 | — | **Aprobado** | 1,0–4,8 s | Generado desde el recorte v2 (sin lona). Red y horizonte estables |
