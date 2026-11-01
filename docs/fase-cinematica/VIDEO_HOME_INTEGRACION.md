# Vídeo de la Home · integración en el hero (V2)

Fecha: 01/11/2026. Estado: integrado y probado en local, pendiente de aprobación. No está desplegado.

## 1. Archivos que usa

| Pantalla | Archivo AV1 (principal) | Archivo H.264 (respaldo) | Origen |
|---|---|---|---|
| Escritorio, tablet en horizontal y teléfono en horizontal | `home_web_1920x1080_av1.mp4` (24,5 MB) | `home_web_1920x1080_h264.mp4` (32,5 MB) | `video-home-produccion/03-montaje/salida-montaje-final/` (montaje aprobado) |
| Móvil y tablet en vertical | `home_web_movil_1080x1920_av1.mp4` (9,6 MB) | `home_web_movil_1080x1920_h264.mp4` (12,7 MB) | `video-home-produccion/03-montaje/salida-movil-v3/` (móvil v3) |

- **En local:** copias idénticas (mismo hash) en `public/videos/home/`. La carpeta `public/videos/` está en `.gitignore`: los vídeos nunca entran en git.
- **Códecs declarados:** AV1 `video/mp4; codecs="av01.0.08M.10"` (Main, 10 bits, nivel 4.0) y H.264 `avc1.64002A` (High, nivel 4.2).
  - Comprobados con ffprobe: contenedor MP4, etiquetas `av01` y `avc1`.
  - El índice (`moov`) va al principio del archivo, así que el vídeo empieza a reproducirse antes de descargarse entero.

## 2. Cómo se elige y se reproduce

Componente: `components/sections/home/HeroBackgroundVideo.tsx`.

1. **Póster:** el servidor pinta la foto actual de la fachada (`/images/home/hero-provisional*.jpg`, carga inmediata y prioridad alta; con `<picture>` cada pantalla descarga solo su póster). Es lo primero que se ve, la imagen principal de la carga (LCP) y el respaldo si algo falla.
2. **Sin vídeo** cuando el usuario tiene `prefers-reduced-motion` o el ahorro de datos (`saveData`) activado: se queda la foto.
3. **Una sola descarga:** antes de montar el `<video>` se decide la pantalla y se elige UNA sola fuente.
   - Pantalla: móvil por debajo de 768 px, o tablet en vertical (hasta 1199 px y proporción ≤ 4:5). Si no, escritorio.
   - Códec: AV1 si el navegador lo soporta y `MediaCapabilities` dice que lo decodifica con fluidez; si no, H.264.
   - Comprobado en red: en móvil solo se pide el AV1 móvil y en escritorio solo el AV1 de escritorio. El H.264 no se descarga si no hace falta.
4. **Si una fuente falla**, se pasa a la siguiente. Si fallan todas, el vídeo se retira y queda la foto, nunca un fondo negro (probado ocultando los archivos).
5. **Reproducción:** `autoplay`, `muted`, `loop` y `playsInline`, sin pista de audio. Aparece con un fundido de 1 s cuando empieza a reproducirse, así que no hay saltos durante la carga.
6. **Sin botón flotante** (retirado el 01/11/2026). En su lugar:
   - Opción accesible en el pie de todas las páginas: «Detener vídeo de portada» / «Reanudar vídeo de portada» (`components/ui/MotionPreferenceToggle.tsx`, con `aria-pressed`). Se recuerda en ese navegador (`lib/motionPreference.ts`); si está detenido, el vídeo ni siquiera se descarga.
   - El vídeo se pausa solo mientras el hero no está en pantalla y vuelve a reproducirse al regresar.

### Encaje de la versión móvil v3

El vídeo trae su ventana 4:3 y bandas lisas `#14130F`, que es el mismo `bg-ink` del hero. Nunca se recorta la ventana.

| Pantalla | Encaje |
|---|---|
| Teléfonos (más alargados que 9:16) | `object-contain`, anclado arriba, sobre `bg-ink`. Se ve el vídeo entero y el hueco que sobra abajo es del mismo color que las bandas. |
| Teléfonos bajos (≤ 720 px de alto, p. ej. 375×667) | El vídeo sube hasta 21,5vw sobre su banda superior; la ventana queda justo bajo la navegación. El titular baja a 2,6rem y se reduce el margen inferior. |
| Tablets en vertical (más anchas que 9:16) | `object-cover`, que solo recorta bandas (nunca la ventana), con la ventana justo debajo de la navegación. El titular pasa a `text-6xl` para no tapar la imagen. |

Todo se hace con CSS: el vídeo no se ha vuelto a editar.

## 3. Configuración (sin escribir en Sanity)

`components/sections/home/HomeHero.tsx` decide las fuentes en este orden:

1. **Sanity** (`homePage.hero.media`), si es un vídeo:
   - «Vídeo subido»: un archivo por pantalla, como hasta ahora.
   - «Vídeo externo»: URL H.264 y, como campos nuevos opcionales, URL AV1, URL móvil H.264 y URL móvil AV1.
   - Campo nuevo **«Encaje del vídeo en móvil»**: «Rellenar» (lo de siempre) o «Completo, sin recortar» (el de la v3).
2. **Variable de entorno `HOME_HERO_VIDEO_BASE_URL`** (solo servidor), si en Sanity no hay vídeo. Es la carpeta que contiene los cuatro archivos con sus nombres definitivos.
   - En local: `HOME_HERO_VIDEO_BASE_URL=/videos/home` (en `.env.local`, fuera de git).
   - Con esta vía el móvil usa siempre el encaje «completo».
3. **Si no hay ninguna de las dos**, solo se ve la foto, exactamente como antes.

- **Campos nuevos:** se han añadido al tipo `mediaField` (`sanity/schemaTypes/objects/mediaField.ts`), a la consulta (`lib/sanity/queries.ts`) y al tipo `MediaField` (`types/content.ts`). Son aditivos y opcionales: no cambian ningún contenido existente.
- **Dataset:** no se ha escrito nada. La Home publicada sigue mostrando la foto hasta que se configure el vídeo.

## 4. Peso y carga

| Visita | Primera carga | Vídeo (descarga progresiva, tras hidratar la página) |
|---|---|---|
| Escritorio con AV1 (Chrome, Edge, Firefox, Safari con soporte AV1 por hardware) | Igual que antes (foto con `priority`) | 24,5 MB, 7,6 Mb/s |
| Escritorio con H.264 | Igual que antes | 32,5 MB, 10,1 Mb/s |
| Móvil con AV1 | Igual que antes | 9,6 MB, 3,0 Mb/s |
| Móvil con H.264 (la mayoría de iPhone sin AV1 por hardware) | Igual que antes | 12,7 MB, 4,0 Mb/s |

- **Arranque:** el vídeo no bloquea la primera pintura; la foto ya está y el vídeo entra con fundido cuando puede reproducirse.
  - Con `moov` al principio, arranca tras descargar los primeros segundos: unos 2–3 MB, poco más de 1 s en una conexión 4G de ~20 Mb/s (estimación, no medida en red real).
- **Pendiente de medir en el despliegue de prueba:** en local los tiempos no son representativos.
- **Pósters:** corregido el 01/11/2026. El escritorio descargaba también el póster móvil; ahora cada pantalla baja solo el suyo (−234 KB en escritorio). Detalle y mediciones en `RENDIMIENTO_Y_DESPLIEGUE_VIDEO.md`.

## 5. Propuesta para Vercel (sin subir vídeos a git)

Los cuatro archivos web pesan 79 MB en total y el máster ProRes no se publica. Vercel solo sirve el código; los vídeos, desde un almacenamiento externo.

- **Activarlo en producción:** basta con definir `HOME_HERO_VIDEO_BASE_URL=https://…/home` en las variables de entorno de Vercel, o rellenar las URL del vídeo externo en Sanity.
- **Consumo de transferencia:** ~25 MB por visita de escritorio y ~10 MB por visita móvil, si se ve completo (el navegador descarga de forma progresiva y puede no bajarlo entero). Por ejemplo, 2.000 visitas al mes son entre 20 y 50 GB de transferencia.

| Opción | Cómo | Ventajas | A tener en cuenta |
|---|---|---|---|
| **A. Cloudflare R2 con dominio público** (recomendada) | Bucket con los 4 MP4 y `HOME_HERO_VIDEO_BASE_URL` apuntando a él | Sin coste de transferencia de salida; capa gratuita de almacenamiento sobrada para 79 MB; CDN global; admite peticiones por rangos (`206`) | Requiere crear una cuenta de Cloudflare. Hay que configurar `Content-Type: video/mp4` y `Cache-Control: public, max-age=31536000, immutable` (y versionar el nombre si cambia el vídeo) |
| B. Assets de Sanity (CDN de Sanity) | Subir los 4 MP4 como archivos y poner sus URL `cdn.sanity.io` en «Vídeo externo» | Todo dentro del CMS actual; el equipo lo cambia desde el Studio | Escribe en el dataset (ahora no autorizado); la transferencia de assets cuenta en la cuota del plan de Sanity |
| C. Vercel Blob | Subir los archivos a Blob y usar su URL | Mismo proveedor que el hosting | La transferencia de Blob cuenta en la cuota y el coste del plan de Vercel; con vídeos de 25 MB se puede agotar rápido |

- **Recomendación: A.**
  - Es la que mejor aguanta el peso del vídeo sin coste por visitas.
  - Si se prefiere gestionarlo desde Sanity, se puede usar «Vídeo externo» con las URL de R2.
- **Antes de contratar:** comprobar las tarifas vigentes de cada servicio. No se ha creado ninguna cuenta ni se ha subido nada.
- **Paso a paso de R2 + Vercel Preview:** ver `RENDIMIENTO_Y_DESPLIEGUE_VIDEO.md`.

## 6. Archivos tocados

- `components/sections/home/HeroBackgroundVideo.tsx`: pares AV1/H.264, detección de fluidez, una sola fuente por pantalla, respaldo encadenado y encaje de la v3.
- `components/sections/home/HomeHero.tsx`: resolución de fuentes (Sanity → variable de entorno → solo foto) y ajustes responsive del texto en teléfonos bajos y tablets en vertical.
- `sanity/schemaTypes/objects/mediaField.ts`, `lib/sanity/queries.ts` y `types/content.ts`: campos opcionales nuevos.
- `.gitignore`: `/public/videos/`.
- **Solo locales, fuera de git:** `.env.local` (`HOME_HERO_VIDEO_BASE_URL`) y `public/videos/home/` (los 4 MP4).
- **Capturas de la verificación:** `video-home-produccion/03-montaje/capturas-home-integrada/`.
