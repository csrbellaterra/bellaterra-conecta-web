# Pendientes fotográficos — experiencias V2 (02/11/2026)

## Autorizaciones de personas

Confirmada (02/11/2026) la autorización de publicación de todas las fotos con personas de `SELECCION FOTOS PUERTAS`, incluidas DSC04690, IMG_5467, IMG_5474, IMG_5107, IMG_4713, IMG_5409, IMG_5408 e IMG_5412. Ya se publican.

El mecanismo de exclusión sigue disponible para cualquier foto futura sin autorización: `review: "consent"` en la escena (`lib/doorExperience.ts`) la deja solo en `next dev`. No publicar fotos de fuera de esa selección sin autorización confirmada.

## Validación de Estancias

Las cuatro habitaciones (_RA60292, _RA60328, _RA60459, _RA60461) son de 2024 y se publican como provisionales (`review: "validation"`). Falta confirmar que las habitaciones siguen igual.

## Sanity

`lib/approvedMedia.ts` sustituye al pintar 7 fotos antiguas de Sanity (personas sin autorización confirmada o banco de imágenes; no son de la selección) por fotos aprobadas. Cuando se cambien en el Studio, se retiran de `BLOCKED`.
