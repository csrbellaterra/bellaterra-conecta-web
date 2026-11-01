# Vídeo de Home: prueba comparativa de resolución y recomendación web

Fecha: 31/10/2026.

- El montaje aprobado (`03-montaje/salida-montaje-completo-v1/`) y los clips originales **no se han tocado**.
- No se ha aplicado ningún escalado por IA y **no se ha gastado ningún crédito**.

## 1. Fragmentos de la prueba

| Fragmento | Clip | Tramo | Por qué |
|---|---|---|---|
| **01** Llegada | `01_entrada-camino_v1.mp4.mp4` | 0,8–3,3 s (el mismo del montaje) | Fachada con rejas, persianas, tejas y zócalo de piedra, más un árbol y una magnolia |
| **07** Porche | `07_porche-comedor_v1.mp4` | 1,0–3,5 s | Puerta de cuarterones, gresite, columnas, ventanales con reflejos, tejas y mobiliario (mesa y sillas) |

**Zonas de detalle a 1:1** (640×360 sobre 1920×1080):

- **01 zona 1:** rejas, persianas y puerta.
- **01 zona 2:** árbol, tejado y pinos.
- **07 zona 1:** puerta, aplique, piedra y tejas.
- **07 zona 2:** mesa, sillas, ventana y gresite.

## 2. Variantes

Todas salen del mismo tramo del clip original, en una sola pasada.

| | Variante | Qué es | Coste |
|---|---|---|---|
| A | Navegador | El 720p ampliado con bilineal: lo que haría el navegador con un vídeo de 720p | 0 |
| B | **Lanczos** | El escalado del montaje aprobado | 0 |
| C | **Lanczos + CAS 0,5** | Lanczos más un realce de nitidez adaptativo (Contrast Adaptive Sharpening). **No es IA:** solo acentúa los bordes que ya existen y no puede inventar líneas ni objetos | 0 |
| D | Runway 4K | Upscale de Runway del clip completo, reducido a 1080p/1920p con Lanczos | **Créditos. Preparado, no ejecutado** |

### Archivos

Todos están en `03-montaje/prueba-upscale/`, son locales y quedan fuera de git.

| Archivo | Para qué |
|---|---|
| `comparativa_01_zona1_1a1.mp4`, `comparativa_01_zona2_1a1.mp4`, `comparativa_07_zona1_1a1.mp4`, `comparativa_07_zona2_1a1.mp4` | **Vídeo en cuadrícula 2×2** con la misma zona de cada variante a 1:1 y su nombre en la esquina. El cuarto hueco queda en negro hasta que exista la D. **Míralo a pantalla completa** |
| `detalle_01_zona1_1a1.jpg`, `detalle_01_zona2_1a1.jpg`, `detalle_07_zona1_1a1.jpg`, `detalle_07_zona2_1a1.jpg` | Fotograma fijo de cada zona, con las variantes en fila |
| `detalle_01_movil_centro_1a1.jpg`, `detalle_07_movil_centro_1a1.jpg` | Centro del encuadre móvil (1080×1920) a 1:1 |
| `01_desk_*.mp4`, `07_desk_*.mp4`, `01_movil_*.mp4`, `07_movil_*.mp4` | Cada variante completa (2,5 s), casi sin pérdida, para verla entera |

Para regenerar la prueba (incluida la D cuando exista):

```bash
bash 03-montaje/comparar_upscale.sh
```

## 3. Resultado (A, B y C)

| Qué se mira | A · Navegador | B · Lanczos | C · Lanczos + CAS |
|---|---|---|---|
| Líneas de fachada, rejas y persianas | Bordes blandos; los barrotes se funden | Algo más definidas | **Las más nítidas.** Barrotes, lamas y aristas separados |
| Tejas, zócalo y piedra | Textura empastada | Similar a A, algo más limpia | **Textura visible** en tejas y piedra |
| Árboles y follaje | Manchas verdes | Igual que A | Más hoja individual. **Parpadea un 9 % más** entre fotogramas: el realce acentúa el temblor de textura de la IA |
| Mobiliario (sillas y mesa) | Patas finas difusas | Algo mejor | Patas y respaldos bien definidos |
| Arquitectura | Fiel | Fiel | **Fiel:** no añade ni cambia nada, porque solo realza bordes existentes |
| Halos o artefactos | — | — | No se ven a 1:1 con fuerza 0,5 |
| Peso (H.264 CRF 20, montaje completo) | — | 27,3 MB | 31,8 MB (+17 %) |

**Conclusión:**

- **B mejora poco a A:** el límite es el origen de 720p.
- **C da la mejora visible más grande sin coste y sin riesgo de inventar.** Se nota sobre todo en móvil, donde el recorte vertical parte de solo 404 píxeles de ancho.
- **El precio de C:** un poco más de vibración en el follaje y algo más de peso. Debes juzgarlo tú en movimiento, con los vídeos 2×2.
- **Ninguna de las tres recupera detalle que el clip no tiene.** Si después de verlas el resultado sigue siendo blando, la única vía real es la D.

## 4. Variante D · Runway 4K (requiere tu autorización)

**No la he ejecutado.** Solo está todo preparado.

1. En Runway, abre el clip ya generado **`01_entrada-camino_v1`** y elige **Upscale to 4K** (o "Upscale"). Haz lo mismo con **`07_porche-comedor_v1`**.
2. **Comprueba el coste en la interfaz antes de confirmar.** Runway cobra el upscale por segundo de vídeo. En su documentación suele figurar en torno a 2 créditos por segundo, unos 10 por clip de 5 s y unos **20 para los dos**. No lo he podido verificar en tu cuenta.
3. Guarda los resultados en `02-clips-runway/upscale/`, que ya está creada, con estos nombres:
   - `01_entrada-camino_v1_4k.mp4`
   - `07_porche-comedor_v1_4k.mp4`
4. Avísame. Ejecutaré `comparar_upscale.sh`, que añade la D automáticamente a todas las comparativas y hojas de detalle.

**Qué revisaré en la D:**

- Si **inventa**: rejas con barrotes de más, tejas o piedras con patrón repetido, texto o formas en las hojas, o cambios en la puerta de cuarterones o en las sillas. Es el riesgo principal del escalado por IA.
- Si mejora claramente a C en móvil.
- Que conserve la duración, los 24 fps y el color del original.

### Resultado de la D (01/11/2026)

**Archivos recibidos:**

- `02-clips-runway/upscale/01_entrada-camino_v1_4k.mp4` y `07_porche-comedor_v1_4k.mp4`.
- Formato: 4096×2304, 24 fps, 121 fotogramas, 5,04 s, H.264, sin audio.
- Bitrate: 99,4 Mb/s (01) y 46,2 Mb/s (07).

**Fidelidad al original:**

- Están alineados fotograma a fotograma con el original y conservan el color.
  - Medido reduciendo el 4K a 720p y comparando con el clip: PSNR luma de 32,5 dB (01) y 35,8 dB (07); croma por encima de 40 dB.
- Los originales de 720p siguen intactos.

| Qué se mira | D · Runway 4K frente a C |
|---|---|
| Rejas, persianas y lamas de la puerta | **Mejor que C.** Líneas más limpias y finas, mismo número de barrotes y lamas. No inventa elementos |
| Tejas, zócalo de piedra y jardinera | **Mejor que C.** Textura más definida y coherente con la foto |
| Puerta de cuarterones (07) | Más nítida. Algún círculo queda ligeramente irregular a resolución 4K nativa; a 1080p no se aprecia |
| Gresite (07) | Retícula más marcada que en el original: es plausible (es mosaico), pero es textura reconstruida |
| Sillas y mesa | Algo más definidas que en C; sin cambios de forma ni de número |
| **Follaje** (árbol de la 01) | **Peor que C.** Las hojas toman un aspecto "recortado", artificial, y el follaje **parpadea un 32 % más** que con Lanczos (C: +9 %) |
| Pared lisa | Aparecen vetas tenues en el estuco que no se veían en el original. Solo se notan a 1:1 en móvil |
| Móvil (1080×1920) | **Es donde más se nota la mejora:** la fachada, las rejas y la piedra se ven claramente más nítidas que en C |

**Conclusión:**

- **La D es la mejor opción para la arquitectura**, sobre todo en móvil. No altera ningún elemento de la finca.
- **Empeora la vegetación:** textura artificial y más temblor en el follaje.
- **El juicio final es en movimiento:** hay que ver `comparativa_01_zona2_1a1.mp4` (el árbol) y `comparativa_01_zona1_1a1.mp4` (la fachada) a pantalla completa.

**Opciones:**

1. **C en todo el montaje.** Sin coste y segura. Gana nitidez sin tocar el follaje de forma artificial.
2. **D solo en los planos donde manda la arquitectura** y la vegetación es secundaria: **05, 06, 07, 10 y 11**. El resto, con C.
   - Son 5 upscales más; el coste por clip se puede comprobar en el historial de Runway.
   - Mezclar las dos técnicas no se nota, porque cada plano se escala por separado.
3. **D en los 13 clips.** Máxima nitidez en fachadas, pero con el follaje artificial en 01, 02, 03, 08, 09, 12 y 13, que son muy vegetales. **No lo recomiendo.**

**Recomendación: opción 2,** si al ver los vídeos 2×2 la fachada de la D te convence y el árbol no te molesta en los planos donde es secundario. Si no, opción 1.

**Decisión posterior** (redactada antes de tener la D):

- **Si la D no inventa y supera claramente a C:** te propondré escalar solo los 13 clips aprobados (unos 130 créditos con ese precio orientativo) y volver a montar desde ellos.
- **Si inventa o la mejora es mínima:** C, o B si C no te convence.

**Otras vías de IA** (no recomendadas ahora):

- Real-ESRGAN, gratuito, en local. Habría que descargar e instalar un programa y su modelo, con tu permiso.
- Topaz Video AI, de pago.

Ambas comparten el riesgo de inventar detalle.

## 5. Peso y velocidad de carga

Medido sobre el montaje completo de 27 s.

- **Desktop:** codificado desde el máster ProRes. VMAF frente al máster escalado.
- **Móvil:** codificado desde la salida móvil CRF 18. El VMAF mide la pérdida adicional respecto a ella.
- Todo en `03-montaje/prueba-upscale/pesos/`.

| Uso | Formato | Tamaño | Bitrate | VMAF |
|---|---|---|---|---|
| Desktop | H.264 CRF 18 (montaje actual) | 38,2 MB | 11,9 Mb/s | 98,1 |
| Desktop | H.264 CRF 20 | 27,3 MB | 8,5 Mb/s | 96,7 |
| Desktop | H.264 CRF 22 | 20,6 MB | 6,4 Mb/s | 95,5 |
| Desktop | **AV1 CRF 24** | **17,9 MB** | **5,5 Mb/s** | **97,8** |
| Desktop | AV1 CRF 28 | 13,3 MB | 4,1 Mb/s | 96,9 |
| Desktop | AV1 CRF 32 | 10,0 MB | 3,1 Mb/s | 95,6 |
| Móvil 1080×1920 | H.264 CRF 18 (montaje actual) | 28,7 MB | 8,9 Mb/s | referencia |
| Móvil 1080×1920 | H.264 CRF 21 | 19,3 MB | 6,0 Mb/s | 97,2 |
| Móvil 1080×1920 | **H.264 CRF 22** | **16,9 MB** | **5,3 Mb/s** | **96,4** |
| Móvil 1080×1920 | H.264 CRF 24 | 12,9 MB | 4,0 Mb/s | 94,6 |
| Móvil 1080×1920 | **AV1 CRF 28** | **8,7 MB** | **2,7 Mb/s** | **96,7** |
| Móvil 1080×1920 | AV1 CRF 32 | 6,6 MB | 2,1 Mb/s | 95,5 |
| Móvil 720×1280 | H.264 CRF 20 | 11,2 MB | 3,5 Mb/s | 97,1 (a 720p; pierde la ventaja del escalado propio) |

**Lo importante para la carga:**

- Un vídeo de fondo se reproduce mientras se descarga. Si su bitrate supera la conexión del visitante, **se detiene a cargar**.
- El montaje actual va a 11,9 Mb/s (desktop) y 8,9 Mb/s (móvil). Funciona en fibra, pero puede atascarse en wifi lentas o en 4G.
- **Por encima de VMAF ~95 no se aprecia diferencia a distancia normal.** Bajar de 98 a 97 no se ve; un vídeo que se para, sí.

## 6. Recomendación

**Desktop (1920×1080):**

- **Principal: AV1 CRF 24.** Ocupa 17,9 MB, va a 5,5 Mb/s y tiene VMAF 97,8. Da casi la calidad del CRF 18 actual con menos de la mitad de peso.
- **Respaldo: H.264 CRF 20** (27,3 MB, 8,5 Mb/s), para los navegadores sin AV1.

**Móvil (1080×1920, con el encuadre propio por plano):**

- **Principal: AV1 CRF 28.** Ocupa 8,7 MB y va a 2,7 Mb/s.
- **Respaldo: H.264 CRF 22** (16,9 MB, 5,3 Mb/s).
  - Si priorizas la carga en datos móviles, la alternativa es **H.264 CRF 24** (12,9 MB, 4,0 Mb/s).
  - La Home ya no carga el vídeo con "ahorro de datos" activado; en ese caso muestra el póster.

**Nitidez:**

- Si apruebas la variante C al verla, la aplicaría a las dos versiones (CAS 0,5), con un 15–20 % más de peso.
- **La D (Runway 4K)** solo si, después de ver C, quieres más detalle y autorizas los créditos de la prueba.

**Condiciones para aplicar esta recomendación:**

- **Requiere un cambio en la Home** (no hecho): el reproductor debe ofrecer dos fuentes, primero AV1 y después H.264. Ahora acepta una URL por formato.
- **Hasta entonces, el montaje aprobado (H.264 CRF 18) sigue siendo la referencia de calidad máxima.** No se ha modificado.
- Las codificaciones de la tabla son pruebas de peso hechas desde el máster y la salida móvil. Las versiones definitivas se generarán con `montar_home.sh`, en una sola pasada desde los clips originales.
