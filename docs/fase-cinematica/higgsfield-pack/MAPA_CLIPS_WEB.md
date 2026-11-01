# Mapa de clips → web

Fecha: 30/10/2026 · Propuesta para revisión. Los prompts de cada clip están en [`HIGGSFIELD_PROMPTS.md`](./HIGGSFIELD_PROMPTS.md).

## Asignación por página

| Página | Clip principal | Formato | Alternativa / móvil | Nota |
|---|---|---|---|---|
| **Home hero** | **IA-1** `IMG_5404`: terraza → vistas | 16:9 | **IA-5** `4a055ba6` en móvil (9:16) | Resume la finca en un plano: espacio exterior, mobiliario actual y paisaje |
| **Empresas** | **IA-4** `IMG_5396`: comedor hacia ventanales | 16:9 | **IA-2** `IMG_5402` (terraza) como segundo bloque | Interior de trabajo luminoso y pausa exterior |
| **Eventos** | **IA-6** `IMG_8878`: banquete → piscina | 9:16 (columna o banda) | Foto fija `IMG_5395` como respaldo horizontal | Es vertical; para un hero 16:9 a pantalla completa haría falta otra foto horizontal |
| **Estancias** | **IA-3** `IMG_5394`: comedor → escalera | 16:9 | — | Solo zonas comunes; las habitaciones siguen pendientes de validación |
| Comunidad | Sin clip propio | — | Reutilizar IA-2 o la foto fija `IMG_5403` | Hacen falta fotos o clips con personas autorizadas |
| Pickleball | Sin clip | — | — | No hay foto de pistas lista (2026 con personas; 2024 pendiente de validación) |

**Apoyo / backup:**

- **IA-2** (terraza lateral): segundo plano en Empresas, fondo de Comunidad y escena 9 del recorrido.
- **IA-5** (ventanal vertical): hero móvil de Home y de la escena 10.
- Si IA-3 o IA-4 salen con deformaciones, se usan las fotos fijas `IMG_5395` y `IMG_5397` con zoom lento por CSS, sin IA.

## Relación con el recorrido `/experimento-scroll`

| Escena | Clip |
|---|---|
| 3 · Piscina | IA-6 |
| 5 · Comedor | IA-3 (primeros segundos) |
| 7 · Escalera | IA-3 (final); la subida necesitará grabación real |
| 8 · Regreso al comedor | IA-4 |
| 9 · Terraza chill out | IA-2 → IA-1 |
| 10 · Revelación de vistas | IA-1 (desktop) / IA-5 (móvil) |

Faltan por cubrir: escenas 1, 2, 4, 6, 11, 12 y 13. Dependen del dron 4K y de las zonas pendientes de validación.

## Prioridad de producción

| Prioridad | Clip | Motivo |
|---|---|---|
| 1 | **IA-1** `IMG_5404` | Piloto: Home hero, la escena con más impacto y la que menos riesgo tiene |
| 2 | **IA-5** `4a055ba6` | Completa el hero de Home en móvil |
| 3 | **IA-4** `IMG_5396` | Empresas: la puerta con más peso comercial |
| 4 | **IA-6** `IMG_8878` | Eventos |
| 5 | **IA-3** `IMG_5394` | Estancias. Riesgo medio: la IA tiende a "subir" la escalera |
| 6 | **IA-2** `IMG_5402` | Apoyo / backup |

## Clip piloto recomendado: IA-1 (`IMG_5404`)

1. **Es el clip con más valor.** Va en el hero de Home y es la imagen que resume Bellaterra Conecta: terraza actual, mobiliario nuevo y vistas.
2. **Es el que menos riesgo tiene para la IA.** Un push-in recto hacia un paisaje abierto apenas exige "inventar". Lo que se revela al avanzar ya está en la foto (pinos y montañas). La arquitectura (fachada y barandilla) es sencilla y de líneas rectas, y por eso es fácil detectar cualquier deformación.
3. **Sirve de prueba de calidad para los demás.** Permite ajustar el preset de cámara, la duración, la velocidad y la redacción del prompt antes de pasar a los interiores, que son más difíciles (escalera y campana).
4. **Encaja con dos usos:** el hero de Home y la escena 9 → 10 del recorrido. Además, con la versión 9:16 recortada de la misma foto se puede comparar directamente con IA-5 para el hero móvil.

## Estado de los clips generados

| Clip | Archivo | Estado | Nota |
|---|---|---|---|
| IA-1 v1 | `04-clips-generados/IA-1_v1.mp4` (Runway Gen-4 Turbo, 1280×720, 5 s) | **Aprobado para prototipo** (30/10/2026): escena 9 de `/experimento-scroll` | No apto aún para Home hero: resolución 720p y recorrido hacia la fachada, sin apertura de vistas. Revisión: [`../revision-IA-1_v1.jpg`](../revision-IA-1_v1.jpg) |
| IA-7 v1 | `04-clips-generados/IA-7_v1.mp4` (Runway Gen-4 Turbo, 1280×720, 5 s), desde `_RA60746_16x9.jpg` | **Aprobado para prototipo, recortado a 0–3,5 s** (31/10/2026): escena 10 de `/experimento-scroll`. Derivado: `04-clips-generados/IA-7_v1_0-3.5s.mp4` (fotogramas 0–83) | Travelling lateral real e hitos estables, pero al final el pino izquierdo tapa el Tibidabo. Revisión: [`../revision-IA-7_v1.jpg`](../revision-IA-7_v1.jpg) |
| IA-7 (foto) | `_RA60746` (Collserola entre pinos), recorte `03-crops-trabajo/_RA60746_16x9.jpg` | **Foto aprobada** (30/10/2026) | Candidato a hero de Home y escena 10. Prompt y criterios: [`RUNWAY_IA-7_VISTAS.md`](./RUNWAY_IA-7_VISTAS.md). Publicación sujeta a validar los pinos del primer plano |

Criterio de aceptación del piloto: superar la checklist de `HIGGSFIELD_PROMPTS.md` y que el último fotograma tenga calidad suficiente para usarlo como póster.
