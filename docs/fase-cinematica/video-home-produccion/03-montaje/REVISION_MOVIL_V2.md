# Vídeo de la Home · versión móvil v2 (encuadre abierto)

> **Descartada por el usuario (01/11/2026):** no quiere fondos desenfocados ni rellenos sacados del vídeo. La sustituye la v3, en `REVISION_MOVIL_V3.md`. El modo de fondo desenfocado se ha eliminado de `montar_home.sh`, así que el comando de la sección 7 ya genera la ventana limpia de la v3.

Fecha: 01/11/2026. El montaje desktop aprobado (`salida-montaje-final/`) no se ha tocado.

## 1. Problema de la versión móvil anterior

- Cada plano se recortaba a 9:16 a pantalla completa: solo se veía el **32 % del ancho** del plano.
- En un teléfono real (proporción ~19,5:9) la Home recorta además los lados del vídeo (`object-cover`): quedaba visible en torno al **26 %** del ancho. De ahí el efecto de zoom.
- Ampliar ese 32 % de un clip de 720p a 1080 px de ancho exige multiplicar por 2,7, lo que hace más visible la blandura del original.

## 2. Por qué no basta con la opción A pura

- Un vídeo vertical a pantalla completa no puede enseñar más del 32 % del ancho de un plano horizontal: es geometría, no encuadre.
- Mover el centro del recorte solo cambia qué 32 % se ve.
- Para ver la escena hay que dejar de llenar toda la pantalla con el plano.
- Por eso se aplica la **opción B en los 13 planos**, con un mismo formato para todos. Mezclar planos a pantalla completa con planos en ventana haría saltar el tamaño de la imagen en cada corte.

## 3. Solución: ventana editorial cuadrada

- **La ventana:** cada plano se ve en una ventana cuadrada de 1080×1080, centrada al 45 % de la altura (de y=324 a y=1404 en el lienzo de 1080×1920).
  - Enseña el **56 % del ancho** del plano, 1,8 veces más que antes; en teléfono real, unas 1,8 veces más también.
  - El aumento de un clip de 720p baja de 2,7× a 1,5×, así que el plano se ve más nítido.
- **El fondo:** arriba y abajo hay una extensión del propio plano.
  - Está tan desenfocada (a 1/40 de resolución) que solo queda su tono: cielo arriba, suelo abajo, sin siluetas fantasma.
  - Va oscurecida (−0,18 de brillo) y desaturada (55 %).
- **Los bordes:** la ventana se funde con el fondo en 200 px arriba y abajo, con una curva suave. No hay líneas duras ni marcos tipo reel.
- **Encaje con la Home:**
  - Los velos de la Home (arriba, para la navegación; abajo, para el titular y el botón) caen sobre las bandas de tono, no sobre el plano.
  - Los lados del lienzo que el teléfono recorta no contienen nada importante.

Se probaron también una ventana 4:3 (75 % del ancho, pero solo el 42 % de la altura de la pantalla: demasiado pequeña) y desenfoques más suaves, que dejaban ver fantasmas de la casa y los árboles.

## 4. Encuadre plano a plano

Mismo orden, tramos, transiciones, fuentes (C/D) y realce que el montaje desktop. Solo cambia el centro horizontal de la ventana (focoX), en `cortes_movil.txt`.

| Plano | Antes (9:16, 32 % del ancho) | Ahora (ventana cuadrada, 56 %) | focoX |
|---|---|---|---|
| 01 Entrada por el camino | Media fachada y el camino; no se entendía que es la llegada a la casa | Casa entera, camino y jardín de entrada | 0,70 → 0,60 |
| 02 Entrada bajo el árbol | Sobre todo ramas del árbol | El árbol enmarcando la fachada, como en desktop | 0,58 → 0,55 |
| 03 Piscina entre ramas | Agua y una hamaca | Piscina completa con las hamacas y las flores | 0,55 → 0,55 |
| 04 Piscina y barbacoa | Barbacoa o piscina, no las dos | Barbacoa, piscina y zona de mesas juntas | 0,38 → 0,48 |
| 05 Piscina a ras de agua | Muro de piedra y agua, sin la casa | Casa, muro y piscina con el reflejo | 0,40 → 0,40 |
| 06 Fachada trasera | Columna y porche muy cerrados | Fachada trasera entera con buganvilla y pinos | 0,42 → 0,40 |
| 07 Porche y comedor | Puerta y una ventana | Porche y gran ventanal del comedor | 0,50 → 0,42 |
| 08 Terraza y pistas | Terraza volada sin contexto | Terraza, pino y la primera pista | 0,55 → 0,55 |
| 09 Jardín y vistas | Un árbol y cielo | Árboles, jardín y vistas al valle | 0,50 → 0,45 |
| 10 Terraza con toldo | Pared y toldo | Toldo, mesa y barandilla con el jardín | 0,55 → 0,62 |
| 11 Terraza chill out | Una mesa y sillas | Varias mesas, barandilla y pinos | 0,45 → 0,40 |
| 12 Pistas y casa | Tronco del pino | Pino, pistas y casa al fondo | 0,50 → 0,55 |
| 13 Pistas y horizonte | Red en primer plano | Pistas, pinos y horizonte | 0,45 → 0,45 |

## 5. Archivos (`salida-movil-v2/`)

| Archivo | Uso | Resolución | Códec | Bitrate | Tamaño | Fotogramas | Audio |
|---|---|---|---|---|---|---|---|
| `home_web_movil_1080x1920_av1.mp4` | **Móvil principal** | 1080×1920 | AV1 Main 10 bits, CRF 28 | 2,5 Mb/s | 8,0 MB | 649 | No |
| `home_web_movil_1080x1920_h264.mp4` | Móvil de respaldo | 1080×1920 | H.264 High, CRF 22 | 4,2 Mb/s | 13,6 MB | 649 | No |
| `home_master_movil_prores_1080x1920.mov` | Máster vertical | 1080×1920 | ProRes 422 HQ 10 bits | 108 Mb/s | 349 MB | 649 | No |

- Todas duran 27,04 s a 24 fps, con el mismo bucle sin salto.
- **Calidad medida** (por primera vez en móvil, gracias al máster vertical): VMAF frente al máster.
  - AV1: **96,4 de media**, mínimo 91,5.
  - H.264: **95,0 de media**, mínimo 89,5.
  - En los dos casos, el mínimo cae en el fundido 04 → 05 (segundo 8), igual que en desktop. Por encima de ~95 no se aprecian diferencias.
- Mismos CRF que la versión anterior. Pesan menos (8,0 MB frente a 10,5 MB en AV1; 13,6 MB frente a 17,8 MB en H.264) porque las bandas desenfocadas casi no ocupan.

## 6. Revisión

- `revision-movil-v2-antes-despues.jpg`: el fotograma central de cada plano, versión anterior arriba y nueva abajo.
- `revision-movil-v2-telefono.jpg`: tres fotogramas tal y como se verían en un teléfono alto.
- `comparativa-movil-antes-despues.mp4`: los dos vídeos completos, uno al lado del otro.
- La versión móvil anterior sigue intacta en `salida-montaje-final/`.

## 7. Cómo rehacerla

```bash
CORTES=cortes_movil.txt SOLO_MOVIL=1 MOVIL_MODO=ventana bash montar_home.sh "" "$PWD/salida-movil-v2"
```
