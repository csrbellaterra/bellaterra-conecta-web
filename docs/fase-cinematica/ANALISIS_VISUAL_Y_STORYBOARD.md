# Fase cinematográfica — Análisis visual, selección y storyboard

Fecha: 30/10/2026 · Rama `v2-redesign` · Documento de trabajo, **pendiente de aprobación**. No se ha modificado ninguna página, Sanity, Airtable ni ningún archivo original.

Inventario completo (308 fotos, una fila por archivo, con zona física, resolución, personas y estado): [`inventario-fotos.csv`](./inventario-fotos.csv) (separador `;`, abre directamente en Excel).

---

## 0. Acceso y rutas

Ruta base de todas las imágenes: `C:\Users\aleix\OneDrive\Escritorio\BellaterraConecta\Fotos Casa\`

En este documento:

- **A26** = `Fotos Casa\Fotos Actual 2026\` (la carpeta se llama así, no "FOTOS ACTUALES 2026"; es hermana de FOTOS CASA, no está dentro).
- **FC** = `Fotos Casa\FOTOS CASA\`

| Carpeta | Contenido | Uso en este análisis |
|---|---|---|
| A26 `1-EVENTOS` | 39 imágenes (31 HEIC iPhone, 8 JPG) | Analizada, prioridad |
| A26 `2-EMPRESA` | 24 imágenes | Analizada, prioridad |
| A26 `3-ESTANCIAS` | 31 imágenes | Analizada, prioridad. **Ojo:** 23 de 31 son de la sesión profesional del 16/07/2024 (también están en FC) |
| FC | 214 imágenes en 17 subcarpetas por zona | Analizada (referencia y recuperación) |
| `FOTOS CASA comprimido` | 207 copias comprimidas de FC | Excluida: es un derivado, no material original |
| `Videos Casa` | `DRON1_JUL24.mp4`, `DRON2_JUL24.mp4` (960×544, 2 min c/u), `BELLATERRA ONLINE CAST NO SUBT.mp4` (1080p) | Revisados los drones (ver §5) |
| `INAUGURACIO` | 166 fotos de evento (personas) | No analizada: fuera del alcance pedido |

De los 94 archivos de A26:

- 88 son únicos; los otros 6 son copias internas.
- 31 tienen una copia idéntica en FC.
- **Solo 60 son fotos realmente nuevas** y únicas.
- 49 no tienen personas, contando duplicados y fotos de 2024.

---

## 1. Zonas físicas de la finca y fotos por zona

"A26 limpias" = fotos actuales sin personas reconocibles, utilizables ya.

| Zona física | A26 total | A26 limpias | FC (anteriores) | Estado del material |
|---|---|---|---|---|
| Paisaje / vistas lejanas | 0 | 0 (solo de fondo en `IMG_5404`, `4a055ba6`) | 4 (`_RA60746/50/51/55`) + 2 vídeos dron | Vistas no cambian: FC válidas |
| Fachada trasera (lado vistas) | 1 (`DSC00995`, con personas) | 0 | 9 | **Falta actual** |
| Lateral casa + piscina | 4 | 2 (`IMG_5545`, `IMG_5550`, con hinchable) | — | Actuales con elemento temporal |
| Piscina / barbacoa / vestuarios | 17 | 4 | 23 (+14 de eventos) | FC 2024 coherentes con A26 |
| Entrada principal (calle) | 0 | 0 | 2 | **Falta actual** |
| Recibidor / zonas de paso / escalera | 0 (escalera visible en comedor) | 3 (`IMG_5394`, `IMG_5395`, `IMG_5573`) | 7 | Falta recorrido real |
| Comedor (espacio empresas) | 20 | 9 | 28 → **desactualizadas** (sofás, alfombras, mobiliario anterior) | Bien cubierto en A26 |
| Comedor secundario / sala (confirmar) | 1 | 1 (`IMG_5383`) | — | Confirmar qué sala es |
| Cocina | 5 (todas 2024) | 5 | 19 | Solo 2024 |
| Habitación 1 (Airbnb, zona piscina) + baño | 5 (todas 2024) | 5 | 18 | Solo 2024; baños en baja res. |
| Habitación 2 (zona terraza) + baño | 6 (2024, 3 son "Copia de") | 6 | 15 | Solo 2024 |
| Habitación superior (literas, vistas) | 3 (2024) | 3 | 13 | Solo 2024 |
| Terraza chill out | 9 | 4 (`IMG_5400/02/03/04`) | 9 → **probablemente desactualizadas** (sofás de palés; en 2026 hay mesas-bobina y sillas verdes) | Bien cubierta en A26 |
| Porche (trasero, techo de madera) | 2 (con personas) | 0 | 10 (5 de eventos) | **Falta actual limpia** |
| Pistas de pickleball | 6 (con personas) | 0 | 24 | **Falta actual limpia** |
| Jardín / pérgola / zona ceremonias | 6 | 2 (`01ee3063`, `IMG_5554`) | — | Ceremonias solo con personas |
| Gimnasio | 0 | 0 | 6 | Solo 2024 |
| Detalles de catering | 4 | 4 | — | OK para Eventos |
| **Habitación planta baja (NO DISPONIBLE)** | 0 | — | 6 | **Excluida, no se usa** |

---

## 2. Duplicados, baja resolución, desactualizadas y personas

**Duplicados exactos (mismo contenido binario):**

- Dentro de A26: `2-EMPRESA\Copia de DSC09508.jpg` = `DSC09508.jpg`. En `3-ESTANCIAS`, `Copia de _RA60328/_RA60330/_RA60356.jpg` = los originales sin "Copia de". `IMG_5395.HEIC` e `IMG_5404.HEIC` están a la vez en `1-EVENTOS` y `3-ESTANCIAS`.
- Entre A26 y FC hay 31 archivos de A26 idénticos a alguno de FC (todas las `_RA60xxx` y `Baño1-3` de `3-ESTANCIAS`, más `228A3243`, `3Y7A1475`, `3Y7A1569`, `IMG_4703/06/13`, `DSC00500`, `6dee4b55…`). **Son fotos de 2024 colocadas en la carpeta actual, no fotos nuevas.**
- Dentro de FC, la subcarpeta "Celebración Informal Evento Piscina" está duplicada (bajo Porche y bajo Piscina).

**Baja resolución** (lado largo < 2000 px; no aptas para hero ni para IA, solo galería pequeña):
`01ee3063…jpg` (1500×2000), `1558a27f…` (2000×1500), `51da8f3b…`, `67d4d70d…`, `d4cd4f7b…`, `DC03BF5A…` (1152×2048), `093b28dd…` (1600×716), `4baff0ff…`, `5f29ce0b…`, `a242411f…` (1232×1640), `Copia de 43c0d1bd…` (1600×1098), `c3f5b181…` (1600×900), `IMG_5478.heic` (1660×2146), `Baño1/2/3.jpeg` (1200×1600). `FC\Aerea.png` (482×281) no sirve.

**Desactualizadas** (no publicar):

- Comedor 2024: todo `FC\interior\Comedor (Espacios Empresas)`, incluidas `_RA60468-Editar`, `_RA60474` y `_RA60481-Editar`, que están en `A26\3-ESTANCIAS`. Muestran sofás, alfombras y mesa antigua; hoy es una sala de mesas con sillas mostaza.
- Terraza chill out 2024 (`FC\exterior\Casa\Zona Terraza Chill Out…`): mobiliario de palés distinto al actual. **Confirmar.**
- `_RA60745` (vista desde el comedor): la vista vale, pero la mesa del primer plano es la antigua.

**Personas:** 43 de las fotos A26 tienen personas reconocibles y 2 más tienen personas lejanas. Las de `2-EMPRESA` son casi todas con grupos, por eso esa carpeta solo aporta una foto limpia (`IMG_5109.jpeg`).

- **Nunca usar:** `51da8f3b`, `67d4d70d`, `d4cd4f7b` y `DC03BF5A`, porque salen menores.
- **Pendientes de autorización:** las de la sesión lifestyle 2026 (`228A3243`, `3Y7A1475`, `3Y7A1569`, que parecen modelos), las de la boda A&G (`IMG_8880`–`IMG_9008`) y las de empresas (`DSC00377`–`DSC09508`, `IMG_5470`–`IMG_5479`).

---

## 3. Selección propuesta para la web (para aprobar)

Criterio: A26 limpia primero. Después, FC 2024 solo si la zona no ha cambiado (marcado **[2024 — confirmar]**). Las fotos con personas aparecen aparte, solo si llega autorización.

### Home

| Archivo | Carpeta | Resolución | Zona física | Uso en página | Uso cinematográfico |
|---|---|---|---|---|---|
| `IMG_5404.HEIC` | A26\1-EVENTOS | 4032×3024 | Terraza chill out con vistas | Hero / bloque "la finca" | Escena 9–10: push-in hacia barandilla → vistas |
| `IMG_5394.HEIC` | A26\1-EVENTOS | 4032×3024 | Comedor + escalera + altillo | Bloque espacios | Escena 5 y 7: plano general comedor, subida escalera |
| `4a055ba6-91ae-46de-b319-7201070f50ee.JPG` | A26\3-ESTANCIAS | 3024×4032 | Comedor, ventanal con vistas | Mobile hero vertical | Escena 10 (versión móvil): dolly hacia ventana |
| `Copia de IMG_8878.HEIC` | A26\1-EVENTOS | 4284×5712 | Piscina, banquete montado | Puerta Eventos | Escena 3 alternativa (vertical) |
| `IMG_5545.HEIC` | A26\1-EVENTOS | 4032×3024 | Piscina + lateral casa | Puerta Estancias/Eventos | Escena 3 (hinchable visible: valorar) |
| `_RA60751.jpg` [2024 — vistas] | FC\exterior\Casa\Casa y Vistas parte trasera | 5472×3648 | Paisaje | Full-width de cierre | Escena 1 y 10 |

### Empresas

| Archivo | Carpeta | Resolución | Zona física | Uso en página | Uso cinematográfico |
|---|---|---|---|---|---|
| `IMG_5109.jpeg` | A26\2-EMPRESA | 3024×4032 | Comedor, mesa de reuniones | Hero | Escena 5 (detalle) |
| `IMG_5110.HEIC` | A26\3-ESTANCIAS | 3024×4032 | Comedor, mesa de reuniones | Espacios | — |
| `IMG_5396.HEIC` | A26\1-EVENTOS | 4032×3024 | Comedor hacia ventanales | Espacios | Escena 5: pan lateral |
| `IMG_5397.HEIC` | A26\3-ESTANCIAS | 3024×4032 | Comedor, mesas en línea | Espacios (vertical) | Móvil escena 5 |
| `IMG_5402.HEIC` | A26\1-EVENTOS | 4032×3024 | Terraza chill out (lateral casa) | Pausas / exterior | Escena 9 |
| `IMG_5400.HEIC` | A26\1-EVENTOS | 3024×4032 | Terraza chill out con rotafolio | Workshop exterior | — |
| *Con autorización:* `DSC00414.JPG`, `DSC09498.jpg`, `IMG_5470.HEIC`, `DSC04690.JPG`, `DSC00500.JPG` | A26\2-EMPRESA | 6000×4000 / 3024×4032 | Comedor / terraza | Prueba social | No (personas) |

### Eventos

| Archivo | Carpeta | Resolución | Zona física | Uso en página | Uso cinematográfico |
|---|---|---|---|---|---|
| `Copia de IMG_8878.HEIC` | A26\1-EVENTOS | 4284×5712 | Piscina, mesa banquete | Hero | Escena 3: travelling a lo largo de la mesa |
| `IMG_5392.HEIC` | A26\1-EVENTOS | 4032×3024 | Comedor montado | Espacios interiores | Escena 8 |
| `IMG_5395.HEIC` | A26\1-EVENTOS | 4032×3024 | Comedor + campana + escalera | Espacios | Escena 5 |
| `IMG_5546.HEIC` | A26\1-EVENTOS | 3024×4032 | Piscina, buffet | Catering | — |
| `IMG_4706.HEIC` | A26\1-EVENTOS | 4032×3024 | Catering | Catering | — |
| `IMG_4712.HEIC` | A26\1-EVENTOS | 3024×4032 | Catering (detalle) | Catering | — |
| `DSC04837.JPG` | A26\1-EVENTOS | 6000×4000 | Catering | Catering | — |
| `IMG_5551.HEIC` | A26\1-EVENTOS | 4032×3024 | Piscina panorámica | Espacios exteriores | Personas lejanas: confirmar o descartar |
| *Con autorización:* `IMG_4713.HEIC`, `IMG_8897.HEIC`, `IMG_8902.HEIC`, `IMG_8886.HEIC` | A26\1-EVENTOS | 4032×3024 | Piscina atardecer / ceremonia con vistas / porche | Ambiente real | No (personas) |

### Estancias

| Archivo | Carpeta | Resolución | Zona física | Uso en página | Uso cinematográfico |
|---|---|---|---|---|---|
| `_RA60292.jpg` [2024 — confirmar] | A26\3-ESTANCIAS | 5472×3648 | Habitación 1 (Airbnb) | Hero habitación | Escena 6 |
| `_RA60308.jpg` [2024 — confirmar] | FC\interior\Habitació 1 (Alquiler AirBnb - zona piscina) | 5318×3545 | Habitación 1, ventana a piscina | Detalle | Escena 6: transición interior → piscina |
| `_RA60328.jpg` [2024 — confirmar] | A26\3-ESTANCIAS | 5377×3585 | Habitación 2 | Habitación 2 | Escena 6 |
| `_RA60356.jpg` [2024 — confirmar] | A26\3-ESTANCIAS | 5379×3586 | Habitación 2 (rincón) | Detalle | — |
| `_RA60459.jpg` [2024 — confirmar] | A26\3-ESTANCIAS | 5472×3648 | Habitación superior (literas) | Casa entera | Escena 7 |
| `_RA60443.jpg` [2024 — confirmar] | FC\interior\Habitación literas (…) | 5472×3648 | Literas con vistas | Casa entera | Escena 7: dolly hacia ventana |
| `_RA60385.jpg` [2024 — confirmar] | A26\3-ESTANCIAS | 5472×3648 | Cocina | Casa entera | — |
| `_RA60552.jpg` [2024 — confirmar] | A26\3-ESTANCIAS | 5472×3648 | Cocina (office) | Casa entera | — |
| `IMG_5573.HEIC` | A26\3-ESTANCIAS | 3024×4032 | Comedor + altillo | Zonas comunes | Escena 7 (vertical) |
| `IMG_5383.HEIC` | A26\3-ESTANCIAS | 3024×4032 | Comedor secundario (confirmar) | Zonas comunes | — |

### Comunidad (sin carpeta propia; se reutiliza material)

| Archivo | Carpeta | Resolución | Zona física | Uso en página | Uso cinematográfico |
|---|---|---|---|---|---|
| `IMG_5403.HEIC` | A26\3-ESTANCIAS | 4032×3024 | Terraza chill out | Hero | Escena 9 |
| `IMG_5537.HEIC` | A26\1-EVENTOS | 3024×4032 | Piscina (air hockey) | Actividades | — |
| `IMG_5550.HEIC` | A26\1-EVENTOS | 4032×3024 | Lateral casa desde piscina | Espacios | Escena 3 |
| *Con autorización:* `IMG_5441.HEIC` | A26\1-EVENTOS | 4032×3024 | Jardín (foto de grupo) | Comunidad real | No |

### Pickleball (sin carpeta propia)

No hay ninguna foto A26 de pistas sin personas. Propuesta provisional **[2024 — confirmar que pistas, vallas y entorno siguen igual]**:

| Archivo | Carpeta | Resolución | Zona física | Uso en página | Uso cinematográfico |
|---|---|---|---|---|---|
| `_RA60672.jpg` | FC\exterior\Pistas Pickleball | 5472×3648 | Pistas desde el suelo, casa al fondo | Hero | Escena 11–12 |
| `_RA60669.jpg` | FC\exterior\Pistas Pickleball | 5472×3648 | Pistas + casa | Espacios | Escena 12 (cierre) |
| `_RA60675.jpg` | FC\exterior\Pistas Pickleball | 5472×3648 | Pista con vistas | Espacios | Escena 11 |
| `DSC00932.JPG` | FC\exterior\Pistas Pickleball | 6000×4000 | Pista con vistas, contraluz | Full-width | Escena 11 |
| `_RA60662.jpg` | FC\exterior\Pistas Pickleball | 5472×3648 | Detalle de palas | Detalle | — |
| *Con autorización:* `IMG_5471.HEIC`, `IMG_5474.HEIC` | A26\2-EMPRESA | 3024×4032 / 4032×3024 | Pistas con grupos | Family Days / grupos | No |

---

## 4. Selección para vídeo IA (image-to-video)

Requisitos: sin personas, ≥ 3000 px, encuadre limpio, perspectiva clara y nada temporal en primer plano. **La IA solo mueve la cámara dentro de lo visible**, sin inventar volúmenes, aberturas ni estancias.

| # | Archivo | Carpeta | Resolución | Zona | Movimiento IA propuesto | Riesgo |
|---|---|---|---|---|---|---|
| 1 | `IMG_5404.HEIC` | A26\1-EVENTOS | 4032×3024 | Terraza → vistas | Push-in lento hacia la barandilla con leve tilt-up | Bajo |
| 2 | `IMG_5402.HEIC` | A26\1-EVENTOS | 4032×3024 | Terraza lateral | Travelling lateral a lo largo de la fachada | Bajo |
| 3 | `IMG_5394.HEIC` | A26\1-EVENTOS | 4032×3024 | Comedor + escalera | Dolly-in hacia la escalera | Medio: el altillo no se ve completo |
| 4 | `IMG_5395.HEIC` | A26\1-EVENTOS | 4032×3024 | Comedor | Pan suave de izquierda a derecha | Bajo |
| 5 | `IMG_5396.HEIC` | A26\1-EVENTOS | 4032×3024 | Comedor → ventanales | Dolly-in hacia la luz (transición a exterior por fundido a blanco) | Bajo |
| 6 | `4a055ba6-…JPG` | A26\3-ESTANCIAS | 3024×4032 | Ventanal con vistas | Push-in hacia el cristal (vertical, móvil) | Bajo |
| 7 | `Copia de IMG_8878.HEIC` | A26\1-EVENTOS | 4284×5712 | Piscina banquete | Travelling a lo largo de la mesa | Bajo |
| 8 | `_RA60751.jpg` / `_RA60750.jpg` | FC\exterior\Casa\Casa y Vistas parte trasera | 5472×3648 | Paisaje | Parallax lento con capas de pinos | Muy bajo |
| 9 | `_RA60647.jpg` [2024] | FC\exterior\Casa\Casa y Vistas parte trasera | 5472×3648 | Fachada lado vistas | Aproximación frontal lenta | Medio: requiere confirmar fachada actual |
| 10 | `_RA60609.jpg` [2024] | FC\exterior\Piscina | 5472×3648 | Piscina + casa | Orbit corto alrededor de la piscina | Bajo |
| 11 | `_RA60672.jpg` [2024] | FC\exterior\Pistas Pickleball | 5472×3648 | Pistas → casa | Push-in a ras de suelo | Bajo |
| 12 | `_RA60459.jpg` [2024] | A26\3-ESTANCIAS | 5472×3648 | Habitación superior | Dolly-in hacia la ventana | Medio: hay varias habitaciones en planta, no inventar las contiguas |
| 13 | `_RA60411-Editar.jpg` [2024] | FC\exterior\Casa\Porche parte trasera (…) | 5472×3648 | Porche | Dolly-out del porche al jardín | Medio: falta foto actual |

Descartadas para IA por elementos temporales o personas: `IMG_5545` y `IMG_5550` (hinchable), `IMG_4703` y `IMG_5551` (personas), y todas las de evento.

---

## 5. Zonas sin material suficiente (necesitan sesión nueva)

1. **Fachada trasera actual** (lado vistas): solo hay fotos de 2024.
2. **Entrada principal de calle**: solo `_RA60581` y `_RA60591` (2024). Tampoco existe ningún plano de la puerta que permita pasar al interior.
3. **Porche** actual sin personas.
4. **Pistas de pickleball** actuales sin personas, a ras de suelo, con la casa al fondo (el cierre del recorrido).
5. **Habitaciones disponibles, cocina y baños** en estado 2026. Hay que confirmar si cambiaron; si siguen igual, el material de 2024 sirve.
6. **Recorridos interiores reales**: entrada → recibidor → comedor; escalera → planta superior; habitación ↔ pasillo.
7. **Dron en alta resolución**: los MP4 de 2024 son exportaciones de 960×544. `DRON2_JUL24.mp4` contiene justo la aproximación paisaje → bosque → finca → pistas que pide la escena 1. Hay que pedir los **originales 4K** del dron o hacer un vuelo nuevo. Un vuelo nuevo es preferible, porque la terraza ha cambiado.
8. Piscina limpia **sin hinchable** en 2026, como alternativa a `IMG_5545`.

Recomendación de rodaje: una mañana de luz suave con móvil en 4K y gimbal (o cámara con estabilizador), haciendo planos continuos de 5–10 s a velocidad constante y sin personas, más un vuelo de dron 4K. Es más barato y más fiel que pedirle a la IA que invente las transiciones entre espacios.

---

## 6. Storyboard provisional (13 escenas)

Clave: **IA** = se puede generar con image-to-video a partir de la foto. **REAL** = hace falta grabar, porque la IA tendría que inventar arquitectura. **FUNDIDO** = la transición se resuelve con fundido o match-cut en lugar de movimiento continuo.

| # | Escena | Foto(s) base | Movimiento | Transición a la siguiente | Material |
|---|---|---|---|---|---|
| 1 | Vista lejana desde el paisaje hacia la finca | `DRON2_JUL24.mp4` (referencia), `_RA60755`, `_RA60751` | Dron avanzando sobre pinar hacia la casa | Descenso continuo hacia la fachada | **REAL** (dron 4K). IA solo como maqueta |
| 2 | Aproximación a la fachada de las vistas | `_RA60647`, `_RA60652` [2024] | Dolly frontal lento | Giro lateral hacia la piscina | **REAL** (foto 2026) → luego IA |
| 3 | Lateral y piscina | `_RA60609` / `_RA60617` [2024], `IMG_5545`, `Copia de IMG_8878` | Orbit corto alrededor de la piscina | FUNDIDO a la entrada (son lados opuestos de la casa) | IA (sobre foto limpia 2026) |
| 4 | Entrada principal de calle | `_RA60581`, `_RA60591` [2024] | Avance hacia la puerta | Puerta que se abre → interior | **REAL** (foto + clip de cruce de puerta) |
| 5 | Comedor | `IMG_5394`, `IMG_5395`, `IMG_5396` | Dolly-in + pan | Hacia el pasillo de habitaciones | IA (A26). Transición a pasillo **REAL** |
| 6 | Habitaciones disponibles | `_RA60292`, `_RA60308`, `_RA60328` [2024] | Push-in suave por habitación | FUNDIDO entre habitaciones | IA. **Excluida** la habitación de planta baja |
| 7 | Escaleras y habitación superior | `IMG_5394`/`IMG_5573` (escalera), `_RA60459`, `_RA60443` | Subida por escalera → dolly a ventana | Bajada / vuelta | Subida **REAL**. Habitación IA |
| 8 | Regreso al comedor | `IMG_5392`, `IMG_5396` | Dolly-in hacia ventanales | Fundido a luz → terraza | IA |
| 9 | Terraza chill out | `IMG_5402`, `IMG_5403` | Travelling lateral | Giro hacia la barandilla | IA (A26) |
| 10 | Revelación de las vistas | `IMG_5404`, `4a055ba6`, `_RA60751` | Push-in + tilt-up, el paisaje se abre | FUNDIDO al porche (está en otra fachada) | IA |
| 11 | Porche | `_RA60411-Editar`, `_RA60417-Editar` [2024] | Dolly-out del porche al jardín | Descenso hacia las pistas | **REAL** (foto 2026) → IA |
| 12 | Pistas de pickleball desde el suelo | `_RA60675`, `DSC00932` [2024] | Cámara a ras de pista, avance lento | Giro 180° hacia la casa | **REAL** (foto 2026) → IA |
| 13 | Cierre: la casa vista desde las pistas | `_RA60672`, `_RA60669` [2024] | Pull-back lento, plano final estable | — (CTA) | IA sobre foto 2026 |

**Movimientos que la IA hace bien** (Higgsfield, Kling o Runway con start/end frame): push-in, pull-back, pan, tilt, orbit corto y parallax de paisaje, siempre en clips de 3–5 s y dentro del encuadre de la foto.

**Movimientos que exigen material real**: atravesar puertas, subir escaleras, pasar de un espacio a otro no visible en la foto y la aproximación aérea larga. En todos ellos la IA inventaría arquitectura.

---

## 7. Propuesta técnica del prototipo `/experimento-scroll`

### 7.1 Vídeo convencional frente a secuencia controlada por scroll

| | Vídeo cinematográfico convencional | Secuencia controlada por scroll |
|---|---|---|
| Tiempo | Lineal, lo marca el vídeo | Lo marca el usuario (adelante y atrás) |
| Formato | Un MP4/HLS en streaming | Clips por escena o secuencias de fotogramas |
| Decodificación | Secuencial, eficiente | Acceso aleatorio: exige fotogramas clave densos o imágenes sueltas |
| Montaje | Admite cortes | Necesita continuidad: el último fotograma de una escena es el primero de la siguiente |
| Textos | Quemados o subtítulos | HTML real sincronizado con el progreso (SEO y accesibilidad) |
| Peso | Moderado | Mayor; hay que precargar por tramos |
| Uso recomendado | Pieza de marca (redes, vídeo en Home) | Recorrido inmersivo de la finca |

Ambos salen de los mismos clips. El vídeo convencional es solo el montaje lineal de las 13 escenas.

### 7.2 Arquitectura (sin librerías nuevas)

- **Ruta aislada:**
  - `app/experimento-scroll/page.tsx` con `robots: { index: false }`.
  - Fuera de `app/sitemap.ts` y de `lib/navigation.ts`.
  - Visible solo si `NEXT_PUBLIC_ENABLE_SCROLL_EXPERIMENT=true` (si no, `notFound()`).
  - No toca la Home actual.
- **Componentes:** `components/experimento-scroll/` contendrá `ScrollFilm.tsx` (contenedor), `SceneTrack.tsx` (cada escena), `FrameCanvas.tsx` (pintado) y `SceneCaption.tsx` (textos).
- **Datos:** `lib/experimento-scroll/scenes.ts` define las escenas de forma tipada: id, assets desktop y móvil, póster, duración en "pantallas de scroll" y texto. Mientras sea prototipo no se crea schema Sanity. Tras la aprobación, se valorará un tipo `cinematicScene` editable.
- **Motor:** `motion` (ya instalado, v11) con `useScroll` + `useTransform` sobre un contenedor alto con un hijo `position: sticky; height: 100svh`. Se usa scroll nativo, sin scroll-jacking.
- **Técnica de pintado (recomendada):** secuencia de fotogramas WebP/AVIF pintada en `<canvas>`.
  - Es la única opción con scrub preciso hacia atrás en todos los navegadores, iOS Safari incluido.
  - Alternativa: `<video>` con `currentTime`, pero solo con clips codificados all-intra (`-g 1`), y en iOS sigue siendo inestable.
  - Fallback sin IA: Ken Burns/parallax sobre las fotos fijas. Sirve para probar el ritmo antes de tener clips.
- **Assets:** los derivados se generan aparte (nunca se tocan los originales) y quedan fuera de git. Para el prototipo, una carpeta ignorada; para producción, un CDN (Vercel Blob, R2 o Sanity assets).
- **Carga:** póster de la escena 1 como LCP. Precarga solo de la escena actual y la siguiente; las demás se cargan bajo demanda.

### 7.3 Versión móvil

- Renders **verticales propios** (9:16), no recortes automáticos. Ya hay fotos verticales A26 aptas: `4a055ba6`, `IMG_5397`, `IMG_5573`, `Copia de IMG_8878`, `IMG_5400`.
- Menos fotogramas por escena (unos 40–60 frente a 90–120 en desktop) y unos 720 px de ancho, en AVIF/WebP.
- Presupuesto orientativo: ≤ 15 MB en móvil y ≤ 40 MB en desktop para todo el recorrido, cargados progresivamente.
- `100svh` para evitar saltos con la barra del navegador.
- Con `prefers-reduced-motion` o `navigator.connection.saveData` se muestra una secuencia editorial de fotos fijas con texto, sin scrub.
- Textos en HTML legibles sobre gradiente y sin sonido (cumple la regla de CLAUDE.md).

### 7.4 Siguientes pasos propuestos (no ejecutados)

1. Aprobar la selección de §3 y §4, y confirmar qué zonas de 2024 siguen iguales.
2. Sesión de fotos y vídeo 2026 para las zonas de §5, y pedir los originales 4K del dron.
3. Prototipo con Ken Burns sobre fotos fijas para validar ritmo y textos (sin IA).
4. Generar clips IA de las escenas marcadas como IA y sustituirlos en el prototipo.
5. Revisión en móvil real antes de plantear cualquier cambio en la Home.
