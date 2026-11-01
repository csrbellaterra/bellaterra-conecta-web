# Vídeo de la Home · versión móvil v3 (ventana 4:3 limpia)

Fecha: 01/11/2026.

- **Lo que no cambia:** el montaje desktop aprobado (`salida-montaje-final/`), y también el orden, los tramos, las duraciones, las transiciones, las fuentes (C/D), el realce y el bucle.
- **Sin audio.**

## 1. Qué corrige

| Versión | Presentación | Problema |
|---|---|---|
| v1 (`salida-montaje-final/`) | Recorte 9:16 a pantalla completa: 32 % del ancho del plano | Efecto zoom; no se entiende la escena |
| v2 (`salida-movil-v2/`, descartada) | Ventana cuadrada (56 %) sobre el propio plano desenfocado | Bandas borrosas arriba y abajo |
| **v3** (`salida-movil-v3/`) | **Ventana 4:3 (75 % del ancho) sobre bandas lisas** | — |

## 2. Presentación

- **La ventana:** cada plano conserva toda su altura y solo se recorta un poco a los lados, a 4:3. Se ve el 75 % de la escena, más del doble que en la v1.
  - Ocupa 1080×810 y está centrada al 45 % de la altura de la pantalla (y=458).
- **Las bandas:** arriba y abajo son lisas, del color tinta de la marca (`#14130F`, el mismo `bg-ink` del hero de la Home), con borde limpio.
  - No hay desenfoque, ni degradado, ni relleno sacado del vídeo.
  - En la Home se funden con el fondo del hero y con sus velos oscuros.
  - El titular y el botón quedan sobre la banda inferior, con máxima legibilidad.
- **Nitidez:** el aumento de un clip de 720p baja de 2,7× (v1) a 1,1×. Los planos D (07, 10 y 11) se reducen desde 4K.
- **Tamaños descartados:**
  - Cuadrada: más grande, pero vuelve a cortar la escena.
  - 16:9 completa: enseña todo, pero ocupa solo un tercio de la pantalla y en teléfono pierde igualmente los lados.

## 3. Encuadre por plano

Con la ventana 4:3 el margen lateral es pequeño. El centro de cada ventana está en `cortes_movil.txt`, y el script lo limita al rango 0,375–0,625.

| Plano | v1 (9:16) | v3 (4:3) |
|---|---|---|
| 01 Entrada | Media fachada | Casa entera, camino y jardín |
| 02 Árbol | Ramas | Árbol enmarcando la fachada |
| 03 Piscina con ramas | Agua y una hamaca | Piscina con hamacas y flores |
| 04 Piscina y barbacoa | Una de las dos | Barbacoa, piscina, mesas y pérgola |
| 05 Ras de agua | Muro y agua | Casa, muro, piscina y reflejo |
| 06 Fachada trasera | Columna del porche | Fachada entera con buganvilla y pinos |
| 07 Porche | Puerta y una ventana | Porche y ventanal completos |
| 08 Terraza y pistas | Terraza sin contexto | Terraza, pino, vistas y pista |
| 09 Vistas | Un árbol | Jardín, árboles y valle |
| 10 Toldo | Pared y toldo | Toldo, mesas, barandilla y jardín |
| 11 Chill out | Una mesa | Terraza entera con mesas y pinos |
| 12 Pistas y casa | Tronco del pino | Pino, pistas y casa |
| 13 Horizonte | Red de cerca | Pistas, pinos y horizonte |

## 4. Archivos (`salida-movil-v3/`)

| Archivo | Uso | Códec | Bitrate | Tamaño | VMAF frente al máster |
|---|---|---|---|---|---|
| `home_web_movil_1080x1920_av1.mp4` | **Móvil principal** | AV1 Main 10 bits, CRF 28 | 3,0 Mb/s | 9,6 MB | 96,6 de media (mínimo 92,2) |
| `home_web_movil_1080x1920_h264.mp4` | Móvil de respaldo | H.264 High, CRF 22 | 4,0 Mb/s | 12,7 MB | 95,4 de media (mínimo 90,2) |
| `home_master_movil_prores_1080x1920.mov` | Máster vertical | ProRes 422 HQ 10 bits | 83 Mb/s | 267 MB | referencia |

- **Formato común:** 1080×1920, 24 fps, 649 fotogramas, 27,04 s y sin pista de audio.
- **Calidad:** los mínimos de VMAF caen en fundidos (04 → 05 y 08 → 09). Por encima de ~95 de media no se aprecia pérdida.

## 5. Revisión

- `comparativa-movil-v1-v2-v3.mp4`: las tres versiones móviles completas, una al lado de otra.
- `revision-movil-v3-antes-despues.jpg`: el fotograma central de cada plano, v1 arriba y v3 abajo.
- `revision-movil-v3-telefono.jpg`: cómo se ve en un teléfono alto (19,5:9).

## 6. Para la integración (cuando se apruebe)

- En teléfonos más alargados que 9:16, el `object-cover` del hero recorta un ~9 % de cada lado del vídeo, también de la ventana.
- Las bandas siguen siendo del color del fondo, así que no se nota un corte. Aun así, al integrar se puede valorar `object-contain` en móvil, sobre `bg-ink`, para conservar la ventana completa.
- No se ha tocado la Home.

## 7. Cómo rehacerla

```bash
CORTES=cortes_movil.txt SOLO_MOVIL=1 MOVIL_MODO=ventana bash montar_home.sh "" "$PWD/salida-movil-v3"
```
