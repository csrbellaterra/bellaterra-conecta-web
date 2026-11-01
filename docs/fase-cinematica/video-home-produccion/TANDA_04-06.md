# Segunda tanda: escenas 04, 05 y 06

Fecha: 31/10/2026. Los ajustes de Runway son los mismos que en la primera tanda: **Gen-4 Turbo, image to video, 16:9 (1280×720), 5 s**, seed aleatoria y una sola variante. Guarda cada clip en `02-clips-runway/` con el nombre exacto que se indica, **sin doble extensión**: Runway ya añade `.mp4`, así que al guardar escribe solo `04_piscina-barbacoa_v1`.

## 1. Revisión de la foto 05 (piscina, julio de 2024)

Comparación: [`revision-piscina-2024-2026.jpg`](./revision-piscina-2024-2026.jpg).

- **05 (16/07/2024):** el vaso es turquesa claro, con el fondo liso y solo un friso de gresite en el borde.
- **2026** (`IMG_5545`, desde el **mismo punto de vista**; `IMG_5551`; `IMG_4703`): **todo el vaso es de gresite azul intenso**. La coronación clara, la escalera de acero, el muro de rocas y la forma de la piscina son los mismos.

**Conclusión: la 05 no representa el estado actual de la piscina.** El acabado interior cambió. No la sustituyo: la propuesta está en el apartado 2 y la decides tú.

### Fotos 03 y 04 (mayo de 2025)

- **Contradicción en el inventario:** `inventario-fotos.csv` marca también las fotos de piscina de 2025 (entre ellas DSC00798 = 03 y DSC00946 = 04) como "desactualizada · piscina reacondicionada en 2026".
- **Lo que muestran las fotos:** las de 2025 ya tienen el mismo gresite azul intenso, la misma coronación, la misma escalera, las mismas tumbonas y la misma pérgola que las de 2026. A la vista, la 03 y la 04 coinciden con el estado actual.
- **Necesito que lo confirmes:** ¿el reacondicionamiento fue antes de mayo de 2025 o hubo cambios en 2026 que no se aprecian en las fotos?
  - La 03 ya está aprobada y la 04 va en esta tanda, así que esta confirmación afecta a las dos.
  - Si las confirmas, corregiré la nota del inventario.

## 2. Propuesta para el plano 05

Comparación de las opciones: [`05-alternativas.jpg`](./05-alternativas.jpg).

| Opción | Foto | Qué muestra | Valoración |
|---|---|---|---|
| 05b (reserva) | `DSC00939.JPG` · 24/05/2025 · Sony, 6000×4000 · `FOTOS CASA\exterior\Casa\Porche parte trasera (Piscina y Espacio Empresas)\` | Desde el porche: la columna de piedra en primer plano, el camino de losas, la buganvilla y, al fondo, la caseta y la barbacoa de la zona de piscina | Es el **puente natural de la piscina a la casa**: la buganvilla y la fachada enlazan con la 06. Sin personas. No se ve el agua |
| 05c (reserva) | `DSC00944.JPG` · 24/05/2025 · `FOTOS CASA\exterior\Piscina\` | Gran roca en primer plano, la caseta de vestuarios, la barbacoa y una esquina de la piscina con la escalera | Muestra la piscina con el gresite actual y la caseta. Es un plano de detalle; la roca del primer plano domina el encuadre |
| Sin 05 | — | Se elimina el plano y la 04 funde directamente con la 06 | El vídeo pasa de 27 a 25,5 s. Es la opción más segura si no quieres más fotos de 2025 |
| Descartada | `IMG_5545` (2026), mismo punto de vista que la 05 | Piscina actual a ras de agua | Hay un **castillo hinchable** en el jardín y no se puede quitar con un recorte sin perder la casa. No representa la finca |

**Decisión final (31/10/2026): se mantiene la 05 original, piscina a ras de agua (`5.jpg`).** Lo ha decidido el usuario. 05b y 05c quedan como reserva, con sus recortes y prompts.

Aplicado en `cortes.txt` (corte 04 → 05 y fundido de 0,4 s 05 → 06), en el storyboard, en `PLAN_MONTAJE.md` y en `PROMPTS_RUNWAY_HOME.md`. El vídeo sigue durando 27 s.

## 3. Archivos y prompts para Runway

### 04 · Piscina y barbacoa: lista (sujeta a la confirmación del apartado 1)

- **Subir:** `01-imagenes-runway/04_piscina-barbacoa_16x9.jpg`
- **Guardar como:** `04_piscina-barbacoa_v1.mp4`

```
Slow, steady elevated dolly-in toward the swimming pool, high camera, perfectly level, no rotation. The pool, the white stone barbecue structure, the picnic tables, the outdoor dining tables with umbrellas, the dark metal pergola, the sun loungers and the pine trees all stay exactly as they are. The water ripples softly, pine branches sway slightly. Soft bright daylight with light clouds, stable exposure. Photorealistic real-estate film.
```

- **Qué debe pasar:** la cámara se acerca despacio a la piscina desde lo alto y la piscina crece en el centro del encuadre. Al fondo, la barbacoa, la pérgola y las sombrillas se mantienen.
- **Para aprobar:**
  - La pérgola sigue recta, con el mismo número de postes.
  - La barbacoa conserva sus huecos y su chimenea.
  - Las sillas y las tumbonas no cambian de número.
  - La escalera de la piscina sigue en su sitio.
  - El agua conserva el azul intenso.
  - No aparece ninguna persona.

### 05 · Piscina a ras de agua: lista

- **Subir:** `01-imagenes-runway/05_piscina-ras-agua_16x9.jpg`
- **Guardar como:** `05_piscina-ras-agua_v1.mp4`

```
Nearly static, locked-off shot at water level beside the swimming pool, with an extremely slow, subtle push forward. Only the water surface moves: gentle ripples and shimmering reflections of the white house and the trees. The house, the stone retaining wall, the metal pool ladder, the pool edge and the trees remain perfectly still and unchanged. Clear soft evening daylight, stable exposure. Photorealistic real-estate film.
```

- **Qué debe pasar:** el plano está prácticamente quieto. Solo se mueven la superficie del agua y los reflejos de la casa y los árboles.
- **Para aprobar:**
  - El reflejo de la casa se mueve con el agua, sin deformarse de forma distinta a la casa real.
  - La escalera metálica conserva su forma.
  - El muro de piedra y las rocas no cambian.
  - El borde de la piscina sigue recto.
  - La luz de tarde es constante.

### 05b · Del porche a la piscina (reserva)

- **Subir:** `01-imagenes-runway/05b_porche-hacia-piscina_16x9.jpg`
- **Guardar como:** `05b_porche-hacia-piscina_v1.mp4`

```
Slow, smooth dolly forward from the covered porch along the stepping-stone path into the garden, eye level, perfectly steady. The stone porch column in the foreground passes on the left with natural parallax. The white house wall with its grey roller shutter, the pink bougainvillea, the stone base, the small white changing-room building, the barbecue and the pine trees stay exactly as they are. Bougainvillea flowers and pine needles move gently in a light breeze. Soft natural daylight, stable exposure. Photorealistic real-estate film.
```

- **Qué debe pasar:** la cámara sale del porche hacia el jardín. La columna queda atrás, a la izquierda, y el camino lleva la mirada hacia la zona de piscina.
- **Para aprobar:**
  - La columna no se deforma (bloques de piedra estables).
  - La persiana sigue cerrada y recta.
  - La buganvilla no crece ni cambia de sitio.
  - La caseta y la barbacoa del fondo conservan su forma.
  - Las losas del camino no "fluyen".

### 05c · Caseta y esquina de la piscina (descartada; se conserva como reserva)

- **Subir:** `01-imagenes-runway/05c_caseta-esquina-piscina_16x9.jpg`
- **Guardar como:** `05c_caseta-esquina-piscina_v1.mp4`

```
Slow, gentle camera push forward over the large limestone rock in the foreground toward the pool corner and the white changing-room building, low and steady, short camera travel. The rock, the ivy, the pool with its deep blue mosaic tiles and steel ladder, the white building with its open doorways and green roof edge, the barbecue and the pine trees stay exactly as they are. The water ripples softly, leaves move slightly. Soft natural daylight, stable exposure. Photorealistic real-estate film.
```

- **Para aprobar:**
  - La roca no cambia de forma.
  - La caseta conserva el número de puertas y su cornisa verde.
  - La escalera de la piscina no se deforma.
  - No aparecen tramos de piscina inventados por la derecha.

### 06 · Fachada trasera: lista

- **Subir:** `01-imagenes-runway/06_fachada-trasera_16x9.jpg`
- **Guardar como:** `06_fachada-trasera_v1.mp4`

```
Slow, smooth dolly-in across the lawn toward the covered porch of the white two-storey house with the pink bougainvillea, eye level, perfectly steady. The house, its windows, roof tiles, stone columns, porch chairs, the ping-pong table and the pine trees stay exactly as they are. Pine needles and bougainvillea flowers move slightly in a light breeze. Warm late-afternoon sunlight, stable exposure. Photorealistic real-estate film.
```

- **Qué debe pasar:** la cámara avanza por el césped hacia el porche y la casa crece de forma uniforme. La mesa de ping-pong queda a la derecha.
- **Para aprobar:**
  - Las ventanas de la planta alta mantienen su número.
  - Las columnas de piedra del porche siguen rectas.
  - Las sillas del porche no cambian.
  - La mesa de ping-pong conserva las patas y la red.
  - La buganvilla no crece.
  - La antena sigue en su sitio.

## 4. Orden recomendado

1. **04 y 06**, que no dependen de nada más que de tu confirmación sobre 2025. Unos 50 créditos.
2. **05**: confirmada; se puede generar junto con la 04 y la 06.
3. Cuando lleguen los clips, los reviso como los anteriores: hoja de contacto, comparación con la foto y tramo útil. Después monto 01 → 06 con los criterios de [`CALIDAD_VIDEO.md`](./CALIDAD_VIDEO.md).
