# Revisión de los clips 01–03 (v1) y montaje de prueba

Fecha: 31/10/2026 · Clips de Runway Gen-4 Turbo: 1280×720, 24 fps, 5,04 s (121 fotogramas) y sin pista de audio.

**Cómo se ha revisado:**

- Un fotograma cada 0,5 s, comparado con el recorte que se subió.
- Comparación a resolución completa: original y fotogramas de 1 s, 3 s y 5 s.
- Medición de la diferencia entre fotogramas consecutivos, para detectar saltos o aceleraciones.
- Medición del color medio, para detectar cambios de luz.

Hojas de revisión (locales, fuera de git):

| Clip | Fotogramas cada 0,5 s | Detalle |
|---|---|---|
| 01 | `revision-clip-01-v1.jpg` | `revision-clip-01-v1-detalle.jpg` |
| 02 | `revision-clip-02-v1.jpg` | `revision-clip-02-v1-detalle.jpg` |
| 03 | `revision-clip-03-v1.jpg` | `revision-clip-03-v1-detalle.jpg` |

Los archivos descargados tienen doble extensión (`…_v1.mp4.mp4`). No los he renombrado; `cortes_01-03.txt` usa los nombres tal cual. Para los siguientes, guarda solo `NN_slug_vN.mp4`.

## Veredicto

| Clip | Veredicto | Tramo para el montaje |
|---|---|---|
| **01** Llegada por el camino | ✅ **Aprobado** | 0,8–3,3 s (es usable hasta unos 4,5 s) |
| **02** Entrada bajo la magnolia | ✅ **Aprobado con recorte** | 0,8–3,2 s |
| **03** Piscina entre ramas | ✅ **Aprobado con recorte** (revisado de nuevo; ver abajo) | 2,0–4,0 s |

### 01 · Aprobado

- **Movimiento:** avance hacia la casa con un leve desplazamiento lateral y algo de elevación. Se percibe como un plano de gimbal real.
  - La velocidad es constante y sin saltos: la diferencia entre fotogramas es estable, de 3,3 a 4,8.
  - En el último segundo acelera ligeramente, pero ese tramo no se usa.
- **Arquitectura estable:** se mantienen el ala izquierda (ventanal, ventana con reja, puerta de madera y garaje), la puerta principal, las rejas y persianas de la planta baja, las dos ventanas de la planta alta, las tres chimeneas y la antena. Las líneas del tejado siguen rectas.
- **Vegetación:** la magnolia, el árbol de la izquierda y los arbustos se mueven poco y de forma natural. Las estacas y la cuerda conservan su posición.
- **Luz:** constante. El brillo medio solo baja un 5 % a lo largo del clip, por el cambio de encuadre.
- **Sin elementos nuevos:** ni personas ni objetos.

### 02 · Aprobado con recorte

- **Movimiento:** no es el travelling lateral que pedía el prompt. La cámara **baja y avanza** bajo la magnolia.
  - El resultado es natural: las ramas tienen un paralaje creíble y el plano sigue funcionando como "cortinilla" hacia la piscina.
  - No hace falta regenerarlo por esto.
- **Arquitectura:** la casa conserva la puerta lateral de madera, la ventana con reja, el ventanal, las persianas grises, la puerta principal, el zócalo de piedra, la escalera y las jardineras.
- **Magnolia:** el tronco y las ramas principales mantienen su forma. No se duplican ni se funden con la fachada.
- **Recorte:** en el último segundo las hojas del primer plano se ablandan y el lado derecho de la casa queda muy tapado, así que conviene usar solo hasta los 3,2 s.
- **Luz:** constante. Oscurece ligeramente porque el tronco ocupa más encuadre.

### 03 · Aprobado con recorte (segunda revisión)

**Segunda revisión (31/10/2026).** Tras tu observación de que el clip se ve bien, he comparado la zona derecha del clip con la foto 03 original y con la foto 04 (2025), que muestra la caseta desde el otro lado. **La primera revisión era demasiado estricta:**

- **La puerta oscura de la caseta existe:** la foto 04 muestra la caseta con sus puertas abiertas y oscuras.
- **Los elementos blancos junto a la caseta** son, con toda probabilidad, los bloques blancos de obra que también aparecen en la foto 04. No es mobiliario inventado.
- **El agua no cambia de color.** En la foto original, la parte de la piscina al sol ya es turquesa claro. Al apartarse las hojas queda a la vista más agua soleada, y por eso subía la medición de azul. La zona que se ve en ambos casos conserva su color.
- **Hojas del primer plano:** se desplazan y se renuevan, pero es vegetación desenfocada en movimiento. Está dentro de lo aceptable ("se mueven las hojas") y no afecta a la arquitectura.
- **Movimiento:** la cámara retrocede y baja un poco en vez de avanzar. El efecto, aun así, es el que buscábamos: las ramas se abren y descubren la piscina.
- **Estable:** 4 tumbonas, la escalera de la piscina, el borde y la caseta.

**Tramo elegido: 2,0–4,0 s**, el momento en que las hojas se abren. Antes de los 2 s la piscina aún está muy tapada; después de los 4 s, el primer plano vuelve a cerrarse.

**Lo que queda por confirmar:** si quieres estar del todo seguro de los bloques blancos de la derecha (de 3 a 4 s), compáralos con la finca real. Si no existieran, basta con acortar el tramo a 2,0–3,2 s.

---

*Primera revisión, conservada como referencia. Sus puntos 3 y 4 quedan corregidos por la segunda revisión.*

**Problemas señalados en la primera revisión:**

1. **La cámara retrocede y baja en lugar de avanzar.** Se ve más jardín arriba (la canasta entera) y las tumbonas se hacen más pequeñas.
2. **La vegetación del primer plano se reinventa.** A partir de unos 1,5 s aparecen ramas nuevas que cruzan el encuadre, y las hojas cambian de forma y de número.
3. **El color del agua cambia.** El azul intenso del original pasa a un turquesa claro: el canal azul medio sube de 73 a 86. Es un cambio de luz que el montaje no puede esconder.
4. **A la derecha aparecen cosas que no se ven en la foto,** porque allí las hojas tapaban: una mesa redonda blanca, una puerta oscura en la caseta y un tramo de piscina más ancho. No se puede verificar que existan.

Las tumbonas siguen siendo 4 y la forma de la piscina, en lo visible, se mantiene.

**Prompt v2** (solo si en algún momento se quiere una alternativa; con la segunda revisión ya no hace falta):

```
Almost static camera looking down through the olive leaves at the swimming pool, with a very slow, gentle forward drift. The foreground olive leaves stay in place and only flutter slightly in the breeze. The pool keeps its deep saturated blue water with soft ripples. The pale stone edge, the four grey sun loungers, the pink flowers, the rocks and the small white building remain exactly as they are. Constant bright natural daylight. Photorealistic real-estate film.
```

Ajustes: los mismos (Gen-4 Turbo, 16:9, 5 s) y la misma imagen, `01-imagenes-runway/03_piscina-ramas_16x9.jpg`. Si el v2 vuelve a reinventar las hojas, el problema es la propia foto: las hojas desenfocadas del primer plano son difíciles para la IA. En ese caso, el plano 03 se puede montar como **foto fija con un zoom lento hecho en FFmpeg** (sin IA). Así se conservan la piscina y las hojas exactas.

## Montaje de prueba 01 → 02 → 03

- **Lista de cortes:** `cortes_01-03.txt`.
  - 01: corte seco.
  - 02 → 03: fundido de 0,4 s (cambio de zona).
  - Sin bucle, porque es un tramo parcial.
- **Duración:** 6,5 s (2,5 + 2,0 + 2,0).

| Archivo | Formato | Peso |
|---|---|---|
| `salida-prueba-01-03/home_web_1920x1080.mp4` | 1920×1080, H.264, 24 fps, sin pista de audio | 1,9 MB |
| `salida-prueba-01-03/home_web_movil_720x1280.mp4` | 720×1280 (recorte vertical con foco) | 0,7 MB |
| `salida-prueba-01-03/home_archivo_*.mov` | ProRes de archivo | — |
| `revision-montaje-01-03.jpg` | Fotogramas cada 0,25 s | — |

**Qué hay que mirar al verlo:**

- **Corte 01 → 02:** el salto de encuadre, de plano abierto a plano bajo el árbol, es grande. Si se nota brusco, se puede cambiar por un fundido de 0,3 s en `cortes_01-03.txt`.
- **Fundido 02 → 03:** debería leerse como "de las ramas de la magnolia a las del olivo".
- **Calidad:** el original es 720p escalado a 1080p y se nota algo blando. La versión definitiva necesitará el escalado a 4K de los clips aprobados (ver `PLAN_MONTAJE.md`).
