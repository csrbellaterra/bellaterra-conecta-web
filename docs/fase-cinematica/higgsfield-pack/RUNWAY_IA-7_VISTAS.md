# IA-7 · Revelación de vistas (Runway Gen-4 Turbo)

Fecha: 30/10/2026 · **Foto `_RA60746` aprobada para generar el clip el 30/10/2026.** Todavía no se ha generado ningún vídeo. Para publicarlo en la web sigue faltando validar que los pinos del primer plano son los actuales.

Hoja de contacto con las tres candidatas: [`../vistas-candidatas.jpg`](../vistas-candidatas.jpg)

## Foto recomendada

- **Archivo:** `_RA60746.jpg`
- **Ruta:** `C:\Users\aleix\OneDrive\Escritorio\BellaterraConecta\Fotos Casa\FOTOS CASA\exterior\Casa\Casa y Vistas parte trasera\_RA60746.jpg`
- **Datos de la foto:** 5472×3648, 200 mm, f/4, tomada el 16/07/2024 a las 19:33. Sin personas.
- **Qué se ve:** la sierra de Collserola, con la Torre de Collserola y el Tibidabo, enmarcada por pinos en primer plano.
- **Recorte de trabajo:** `03-crops-trabajo/_RA60746_16x9.jpg`, de 5472×3078 (16:9). Sale de un recorte centrado con desplazamiento y=285, que quita una franja de cielo arriba y de pinos abajo.
- **Validación:** en el inventario consta como "pendiente de validación (2024)". El paisaje no cambia, pero hay que confirmar que los pinos del primer plano siguen existiendo.

## Movimiento de cámara

Travelling lateral muy lento hacia la izquierda, a la altura de una persona, como alguien que camina por el jardín:
- Los pinos del primer plano se desplazan suavemente.
- La sierra queda casi fija, porque es un teleobjetivo de 200 mm.
- Sin avance, sin zoom y sin inclinación.

Motivos:
- Con un teleobjetivo, avanzar se percibe como un zoom digital.
- El paralaje entre los pinos y la sierra es el único movimiento creíble con este objetivo.
- Al moverse, el plano solo descubre cielo y bosque, que ya son continuos en la foto. No hace falta inventar vistas ni arquitectura.

## Prompt (Gen-4 Turbo)

Gen-4 Turbo no tiene campo de negative prompt, y Runway recomienda redactar en positivo y describir solo el movimiento. Por eso las restricciones van como frases afirmativas.

```
The camera trucks very slowly to the left at eye level, perfectly steady. The pine trees in the foreground drift gently across the frame while the distant mountain ridge, the telecommunications tower and the hilltop church stay fixed and unchanged. Pine needles sway slightly in a light breeze. Calm late-afternoon light, hazy sky, static clouds. Realistic telephoto footage, natural colors, continuous single shot.
```

## Configuración

| Parámetro | Valor |
|---|---|
| Modo | Image to Video, con el recorte como primer fotograma |
| Modelo | Gen-4 Turbo |
| Relación de aspecto | 16:9 (1280×720) |
| Duración | 5 s |
| Variantes | 2–3, cambiando solo la semilla |
| Escalado 4K | No, de momento |
| Archivo de salida | `04-clips-generados/IA-7_v1.mp4`, `IA-7_v2.mp4`, etc. |

## Criterios de revisión

El clip se descarta si falla cualquiera de estos puntos:
- **Hitos:** la Torre de Collserola y el templo del Tibidabo mantienen su forma, altura y posición. No aparecen torres, antenas ni edificios nuevos.
- **Paisaje:** el perfil de la sierra y la franja urbana inferior no cambian, y no aparece mar donde no lo hay.
- **Primer plano:** los pinos se mueven en bloque y no se duplican, cambian de forma ni ganan ramas nuevas.
- **Movimiento:** lateral y constante, sin zoom ni empuje hacia delante, sin giros y sin cambios de luz.
- **Fotograma final:** lo bastante nítido para usarlo como imagen fija.
