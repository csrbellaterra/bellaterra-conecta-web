# Pendientes fotográficos — experiencias V2 (02/11/2026)

## Autorizaciones de personas (bloqueadas)

Escenas con `review: "consent"` en `lib/doorExperience.ts`. Solo se ven en `next dev`; en Preview y producción se omiten. Sus derivados web no están en el repositorio (solo en local).

| Experiencia | Foto | Escena |
|---|---|---|
| Empresas | DSC04690 | Reunión vista desde arriba |
| Empresas | IMG_5467 | Presentación en el salón |
| Empresas | IMG_5474 | Dinámica al aire libre |
| Eventos | IMG_5107 | Piscina y jardín (grupo bajo la pérgola) |
| Eventos | IMG_4713 | Celebración al atardecer |
| Comunidad | IMG_5409 | Pistas, balcón y casa |
| Comunidad | IMG_5408 | Partido de pickleball |
| Comunidad | IMG_5412 | Yoga junto a la piscina |

- IMG_5551 (Empresas, jardín): pendiente de validación; no se usa.
- Al confirmar una autorización: generar sus derivados y quitar su `"consent"`. Con las tres de Comunidad, la portada editorial pasa sola a la introducción completa.

## Validación de Estancias

Las cuatro habitaciones (_RA60292, _RA60328, _RA60459, _RA60461) son de 2024 y se publican como provisionales (`review: "validation"`). Falta confirmar que las habitaciones siguen igual.

## Sanity

`lib/approvedMedia.ts` sustituye al pintar 7 fotos antiguas de Sanity (personas sin autorización o banco de imágenes) por fotos aprobadas. Cuando se cambien en el Studio, se retiran de `BLOCKED`.
