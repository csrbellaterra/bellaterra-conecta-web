# Páginas de experiencia: integración del scroll cinematográfico

Fecha: 31/10/2026 · Solo la definición de la arquitectura. Ninguna puerta tiene todavía el scroll implementado.

## Objetivo

Las cuatro puertas (Empresas, Eventos, Estancias y Comunidad) usarán **un único componente** basado en `/experimento-scroll`, configurado con los datos de cada puerta en Sanity. No habrá cuatro soluciones distintas.

```
door.cinematicIntro (Sanity)  →  <DoorCinematicIntro intro={…} door={…} />   ← bloque A
door (campos V2 existentes)    →  DoorPageTemplateV2 (contenido actual)       ← bloque B
door.finalCta* / primaryForm   →  CTA final hacia /solicitud/<slug>           ← bloque C
```

## 1. Componente reutilizable

Se parte de `components/experimento-scroll/`. `FrameCanvas` y `useFrameSequence` se reutilizan tal cual. `ScrollFilm` se generaliza como `DoorCinematicIntro`:

- **Escenas:** recibe un array de 3–4 escenas en lugar de las dos fijas (`ia1` e `ia7`).
- **Escena de vídeo:** tiene secuencia de fotogramas (base URL y número de fotogramas para desktop y móvil), póster, punto focal, texto opcional y transición de salida (`corte`, `fundido` o `velo`).
- **Escena de foto:** una fotografía con movimiento suave hecho con CSS/Motion (zoom o desplazamiento lento). Sirve mientras no haya clip.
- **Guion del scroll:** se calcula automáticamente a partir de las escenas, repartiendo el recorrido según el peso de cada una. No hay que escribir rangos a mano.
- **Duración razonable:** unas 1,1 pantallas de scroll por escena, con un máximo de unas 4,5 pantallas en total.
- **Siempre visible desde el principio:** el nombre de la puerta, la propuesta de valor y el enlace **"Saltar a la información"**, que es un ancla al bloque B.
- **CTA secundario:** discreto durante el recorrido (por ejemplo, "Solicitar una propuesta"), apuntando al mismo formulario que el bloque C.
- **Sin animación:** con `prefers-reduced-motion` o ahorro de datos se muestran las mismas escenas como fotos fijas (lo que hoy hace `StaticFilm`).

## 2. Sanity

Se reutiliza lo que ya existe en `door` y se añade **un solo objeto** nuevo, opcional. No se duplica ningún documento.

| Campo | Tipo | Notas |
|---|---|---|
| `door.cinematicIntro.enabled` | boolean | Si está apagado, la puerta muestra su hero actual. Permite activar las puertas una a una. |
| `door.cinematicIntro.scenes[]` | array de `cinematicScene` | 3–4 elementos |
| `cinematicScene.kind` | `"sequence"` / `"photo"` | |
| `cinematicScene.media` | `media` (objeto existente) | Póster o foto, con `mobileImage` |
| `cinematicScene.sequenceBaseUrl`, `framesDesktop`, `framesMobile` | string / number | Apunta al CDN de los derivados, no a Sanity |
| `cinematicScene.focusX` | number 0–1 | |
| `cinematicScene.caption` | string | |
| `cinematicScene.transitionOut` | `"cut"` / `"fade"` / `"veil"` | |

- **Textos del bloque A:** se reutilizan `heroEyebrow`, `heroHeadline` y `heroDescription`, que ya existen.
- **CTAs:** se reutilizan `primaryCtaLabel`, `finalCtaLabel` y `finalCtaForm`/`primaryForm`. Las rutas `/solicitud/<slug>` se mantienen.

**Fotogramas:** se generan con `docs/fase-cinematica/make_frames.py` (habría que generalizarlo para que acepte una lista de clips) y se publican en el CDN con versión, tal como se describe en `EXPERIMENTO_SCROLL.md`.

## 3. Integración sin romper nada

1. Crear el schema `cinematicScene` y el campo `door.cinematicIntro` (opcional, apagado por defecto).
2. Extraer de `ScrollFilm` el motor genérico (`DoorCinematicIntro`) y mantener `/experimento-scroll` como banco de pruebas que usa ese mismo motor.
3. En `DoorPageTemplateV2`: si `cinematicIntro.enabled` está activo, se monta `DoorCinematicIntro` en lugar del hero, y el resto de la página queda igual. Si no, la página no cambia.
4. Activar las puertas una a una a medida que se aprueben sus escenas.

## 4. CTAs por puerta (bloque C)

| Puerta | CTA | Formulario existente |
|---|---|---|
| Empresas | Solicitar una propuesta | `/solicitud/empresas` |
| Eventos | Organizar mi evento | `/solicitud/eventos` |
| Estancias | Consultar disponibilidad | `/solicitud/estancias` |
| Comunidad | Participar en la comunidad | `/solicitud/comunidad` |

Estos textos se cambiarán en Sanity (`finalCtaLabel` y `primaryCtaLabel`) cuando se aborde cada puerta. No requieren cambios en los formularios ni en Airtable.
