# Rendimiento, navegación y despliegue del vídeo de la Home

Fecha: 01/11/2026. Estado: optimizado y medido en local; nada desplegado ni subido.

## 1. Causa real de los ~5 s al navegar

Medido con Chrome headless (CDP), las 10 páginas principales, en desarrollo y en un build de producción aislado.

- **Los 5 s eran del modo desarrollo (`next dev`), no de la web.**
  - En desarrollo, cada página se compila la primera vez que se visita. El primer clic a /empresas tardó 5,4 s (otro arranque en frío: 9,8 s), porque además compila el código compartido.
  - Los enlaces no se precargan en desarrollo y el JavaScript va sin minificar (~2 MB por página).
- **En producción la navegación ya era rápida:** 11–54 ms por clic en todas las páginas, también con 4G simulado.
  - Todas las páginas son estáticas: el servidor responde en 5–35 ms.
- **No eran Sanity, el vídeo ni las animaciones.**
  - Sanity se consulta al generar la página, no al navegar.
  - El vídeo se monta después de que la página es interactiva; navegar desde la Home tardaba 17 ms con el vídeo en marcha.
- **Picos sueltos de 1–4 s en local con `next start`:** no se reproducen (16 peticiones seguidas, todas de 5–22 ms). Aparecen ANTES y DESPUÉS.
  - Causa: sin el paquete `sharp`, Next optimiza las imágenes con WASM en el mismo hilo que sirve el HTML.
  - En Vercel las imágenes se optimizan aparte, así que no aplica allí.

### Problemas reales que sí encontraron las mediciones (corregidos)

| Problema | Efecto | Corrección |
|---|---|---|
| Contenido congelado: páginas estáticas sin `revalidate` y consultas a Sanity cacheadas 1 año en la caché de datos de Next | En producción, lo publicado en Sanity no aparecería hasta el siguiente despliegue | `export const revalidate = 60` en `app/layout.tsx`: ISR, la página y sus consultas se regeneran como mucho cada 60 s. Comprobado en el build: `revalidate` pasa de `false` a `60` en páginas y consultas |
| `import { createClient } from "next-sanity"` | Arrastraba a TODAS las páginas el código cliente de Visual Editing / Live (~61 KB transferidos) | Import directo de `@sanity/client` (ya era dependencia) en `lib/sanity/client.ts` |
| La Home precargaba los dos pósters | El escritorio bajaba también el póster móvil (+234 KB) | `<picture>` con `getImageProps` en `HomeHero.tsx`: cada pantalla baja solo el suyo, con carga inmediata y prioridad alta |

## 2. ANTES / DESPUÉS

Producción local (`next start`, build aislado), carga completa sin caché HTTP, 1440×900.

- **Columnas «ANTES → DESPUÉS»:** «servidor» = TTFB, «usable» = LCP.
- **Los pesos son exactos.** Los tiempos locales varían entre ejecuciones (ver picos arriba): se muestran los de una ejecución con 4G simulado (20 Mb/s, 60 ms).

| Página | Servidor (ms) | Usable / LCP (ms) | JS (KB) | Imágenes (KB) | Total (KB) | Navegación por clic (ms) |
|---|---|---|---|---|---|---|
| Home | 27 → 26 | 988 → 716 | 227 → 166 | 905 → 671 | 1253 → 957 | 18 → 18 |
| Empresas | 28 → 22 | 1076 → 764 | 221 → 144 | 228 → 228 | 569 → 475 | 54 → 58 |
| Eventos | 48 → 173* | 848 → 1340* | 221 → 144 | 146 → 146 | 485 → 369 | 37 → 23 |
| Estancias | 1240* → 278* | 2080* → 944 | 221 → 160 | 158 → 158 | 498 → 437 | 15 → 17 |
| Comunidad | 27 → 25 | 872 → 520 | 221 → 160 | 258 → 258 | 597 → 536 | 18 → 35 |
| Reservar pista | 17 → 18 | 1088 → 1480* | 227 → 166 | 150 → 150 | 497 → 435 | 12 → 24 |
| Nuestra historia | 29 → 27 | 752 → 928 | 227 → 166 | 358 → 358 | 702 → 640 | 20 → 30 |
| Impacto | 91 → 16 | 664 → 456 | 227 → 166 | 135 → 135 | 478 → 416 | 23 → 31 |
| Galería | 1784* → 16 | 2344* → 492 | 227 → 166 | 377 → 377 | 723 → 662 | 17 → 24 |
| Contacto | 10 → 84 | 1192 → 996 | 227 → 166 | 22 → 22 | 368 → 307 | 11 → 18 |

\* Pico del optimizador de imágenes local (ver sección 1); no se repite en ejecuciones siguientes.

**Desarrollo (`next dev`, primer clic tras arrancar en frío):**

| Página | ANTES (ms) | DESPUÉS (ms) |
|---|---|---|
| Empresas (primer clic: compila lo compartido) | 5354 | 9789 |
| Eventos · Estancias · Comunidad | 1149 · 1182 · 1966 | 656 · 948 · 738 |
| Reservar pista · Nuestra historia · Impacto | 1252 · 2859 · 2353 | 656 · 1171 · 1031 |
| Galería · Contacto · Home | 1094 · 1803 · 629 | 961 · 771 · 78 |

- En desarrollo seguirá habiendo esperas la primera vez que se abre cada página: es la compilación, no la web.
- En producción y en Vercel no existe esa compilación.

## 3. Vídeo del hero: cambios de comportamiento

- **Retirado el botón flotante** Pausar/Reanudar en todas las pantallas.
- **Se mantienen:** autoplay, muted, loop, playsInline, póster de respaldo, vídeo móvil v3 sin recortes extra, `prefers-reduced-motion` y ahorro de datos.
- **Nuevo control:** opción «Detener vídeo de portada» en el pie de todas las páginas (botón accesible con `aria-pressed`).
  - Se recuerda en ese navegador.
  - Si está detenido, el vídeo no se descarga.
- **Pausa automática** mientras el hero no está en pantalla, con reanudación al volver.
- **Verificado en Chrome headless** a 1440×900 y 390×844: un solo póster por pantalla, ningún botón en el hero, pausa fuera de pantalla, reanudación y preferencia persistente tras recargar (0 peticiones de MP4).
- **Sin cambios:** el montaje y los archivos de vídeo.

## 4. Propuesta Cloudflare R2 + Vercel Preview (no ejecutada)

No se ha creado ninguna cuenta ni se ha subido ningún vídeo.

### Costes y límites (tarifas oficiales consultadas el 01/11/2026)

- **Cloudflare R2, capa gratuita mensual:**
  - 10 GB-mes de almacenamiento Standard.
  - 1 millón de operaciones de clase A (escrituras).
  - 10 millones de clase B (lecturas).
  - La salida de datos (egress) es gratis.
  - Fuente: https://developers.cloudflare.com/r2/pricing/
- **Fuera de la capa gratuita:** $0,015/GB-mes; clase A $4,50/millón; clase B $0,36/millón.
- **Nuestro caso:** 4 MP4, 79 MB, por tanto ~0,08 GB de almacenamiento.
  - Cada visita que reproduce el vídeo genera unas pocas lecturas por rangos (clase B).
  - Las lecturas que sirve la caché de Cloudflare con dominio propio no llegan al bucket.
  - Previsión: dentro de la capa gratuita, coste 0 €.
- **El subdominio `r2.dev`** tiene límite de peticiones y Cloudflare lo desaconseja para producción. Usar un **dominio propio** (p. ej. `media.<dominio>`), que necesita que el DNS del dominio esté en Cloudflare.
- **Vercel:** el plan Hobby es solo para uso personal no comercial; un sitio de empresa debe ir en **Pro** ($20/mes por miembro, con $20 de consumo incluido).
  - Fuente: https://vercel.com/pricing
  - Con el vídeo fuera de Vercel, su transferencia no consume la cuota de Vercel.

### Paso a paso (cuando se apruebe)

1. **Cuenta y bucket**
   - Crear la cuenta de Cloudflare (la hace el equipo).
   - R2 → Create bucket, p. ej. `bellaterra-media`, ubicación automática (o UE).
2. **Origen de los archivos:** subir siempre los de `public/videos/home/` (idénticos por SHA-256 a los aprobados).
   - **Ojo:** `03-montaje/salida-montaje-final/` también contiene versiones móviles ANTIGUAS con los mismos nombres; las válidas son las de `salida-movil-v3/`.
3. **Subir los 4 MP4** a una carpeta versionada, p. ej. `home/v1/`, con estos metadatos en cada archivo:
   - `Content-Type: video/mp4`
   - `Cache-Control: public, max-age=31536000, immutable`
   - Con wrangler, por ejemplo:
     `npx wrangler r2 object put bellaterra-media/home/v1/home_web_1920x1080_av1.mp4 --file=<ruta> --content-type=video/mp4 --cache-control="public, max-age=31536000, immutable" --remote`
   - Nombres exactos, que el código espera:
     - `home_web_1920x1080_av1.mp4`
     - `home_web_1920x1080_h264.mp4`
     - `home_web_movil_1080x1920_av1.mp4`
     - `home_web_movil_1080x1920_h264.mp4`
   - **Si el vídeo cambia:** subir a `home/v2/` y cambiar la URL. Nunca sobrescribir `v1`: la caché `immutable` serviría el antiguo durante un año.
4. **Dominio público**
   - **Para probar Preview:** bucket → Settings → Public Development URL (`r2.dev`) → Allow. Da una URL `https://pub-<id>.r2.dev`. Tiene límite de peticiones: solo para pruebas.
   - **Para producción:**
   - Bucket → Settings → Custom Domains → `media.<dominio>`. Cloudflare crea el DNS y el certificado.
   - No hace falta CORS: el `<video>` no usa `crossOrigin`.
   - La web no tiene CSP que bloquee el dominio.
5. **Comprobar desde un terminal** (sin navegador):
   - `curl -I https://media.<dominio>/home/v1/home_web_1920x1080_av1.mp4` debe dar `200`, `content-type: video/mp4`, el `cache-control` anterior y `accept-ranges: bytes`.
   - `curl -s -o /dev/null -w "%{http_code}" -H "Range: bytes=0-1023" <misma URL>` debe dar `206` (peticiones por rangos: el vídeo empieza antes de descargarse entero y se puede saltar).
   - La segunda petición debe mostrar `cf-cache-status: HIT`.
6. **Vercel Preview**
   - Project → Settings → Environment Variables:
     - Variable: `HOME_HERO_VIDEO_BASE_URL=https://media.<dominio>/home/v1`
     - Ámbito: solo **Preview** (después, Production).
     - Es solo de servidor; no lleva `NEXT_PUBLIC_`.
   - Desplegar la rama en Preview.
   - La Home es estática: un cambio en esta variable necesita un nuevo despliegue.
7. **Alternativa gestionada desde Sanity (sin variable de entorno)**
   - En `homePage.hero.media`, elegir «Vídeo externo» y rellenar las cuatro URL de R2 (H.264, AV1, móvil H.264, móvil AV1) y «Encaje del vídeo en móvil: Completo, sin recortar».
   - Sanity tiene prioridad sobre la variable.
   - Con ISR, el cambio aparece en ≤ 60 s sin desplegar.
   - Hacerlo solo cuando se autorice escribir en el dataset.
8. **Verificar el Preview antes de producción**
   - Escritorio y móvil:
     - el póster se ve al instante;
     - el vídeo entra con fundido;
     - en DevTools → Red solo hay **un** MP4, con estado `206`.
   - Safari / iPhone: debe cargar el H.264 si no hay AV1 por hardware.
   - Con «Detener vídeo de portada» en el pie: no se descarga ningún MP4.
   - Con la URL rota a propósito (en un Preview aparte): se queda la foto, nunca un fondo negro.

### Por qué la Home no falla aunque el vídeo falle

- El póster lo pinta el servidor dentro del HTML y es la imagen principal (LCP).
- El vídeo es una capa encima que solo aparece cuando realmente se reproduce.
- Si no hay URL, o fallan AV1 y H.264, queda la foto.
- Si R2 no responde, la página carga y navega igual: el vídeo no bloquea nada.

## 5. Archivos tocados en esta fase

- `components/sections/home/HeroBackgroundVideo.tsx`: sin botón; preferencia del pie; pausa fuera de pantalla.
- `lib/motionPreference.ts` (nuevo): preferencia guardada y evento.
- `components/ui/MotionPreferenceToggle.tsx` (nuevo) y `components/Footer.tsx`: la opción en el pie.
- `components/sections/home/HomeHero.tsx`: `<picture>` con un póster por pantalla; quitado el `label` del vídeo.
- `lib/sanity/client.ts`: import desde `@sanity/client`.
- `app/layout.tsx`: `revalidate = 60` (ISR).
- `docs/fase-cinematica/VIDEO_HOME_INTEGRACION.md`: actualizado.
