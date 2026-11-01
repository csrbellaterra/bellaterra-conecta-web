# Prototipo `/experimento-scroll`

Fecha: 31/10/2026 · Prototipo aislado. No se ha hecho commit. La Home y las demás páginas no se han modificado.

## Qué contiene

| Pieza | Archivo |
|---|---|
| Ruta (noindex, sin enlaces desde el menú ni el sitemap) | `app/experimento-scroll/page.tsx` |
| Película controlada por scroll | `components/experimento-scroll/ScrollFilm.tsx` |
| Dibujo de fotogramas en canvas | `components/experimento-scroll/FrameCanvas.tsx` |
| Precarga de secuencias | `components/experimento-scroll/useFrameSequence.ts` |
| Versión estática (sin movimiento) | `components/experimento-scroll/StaticFilm.tsx` |
| Escenas, guion del scroll y textos | `lib/experimento-scroll/scenes.ts` |
| Generador de derivados | `docs/fase-cinematica/make_frames.py` |

## Derivados multimedia (fuera de git)

Se generan con `make_frames.py` en `public/experimento-scroll-media/`, carpeta incluida en `.gitignore`. Los MP4 originales solo se leen y no se modifican.

| Escena | Origen | Desktop | Móvil | Pósters |
|---|---|---|---|---|
| ia1 | `IA-1_v1.mp4` completo | 121 WebP 1280×720, 10,8 MB | 61 WebP 540×720 (3:4, 12 fps), 2,4 MB | `poster-first.jpg` y `poster-last.jpg` |
| ia7 | primeros 84 fotogramas de `IA-7_v1.mp4` (0–3,5 s) | 84 WebP, 5,8 MB | 43 WebP, 1,0 MB | ídem |

- Los fotogramas de IA-7 se extraen directamente del original, no de `IA-7_v1_0-3.5s.mp4`, para evitar una segunda compresión.
- Ningún derivado tiene audio, y nada se ha escalado a 4K.

## Cómo probarlo en local

```bash
pnpm dev
```

Abre `http://localhost:3000/experimento-scroll`. En `next dev` la ruta siempre está activa.

Si hay que regenerar los derivados (por ejemplo, en otro equipo):

```bash
python docs/fase-cinematica/make_frames.py "."
```

Para probar el build de producción en local:

```bash
pnpm build
```

```bash
ENABLE_SCROLL_EXPERIMENT=true pnpm start
```

- La variable tiene que existir ya durante `pnpm build`, porque la página se genera de forma estática.
- Sin `ENABLE_SCROLL_EXPERIMENT=true`, en cualquier build la ruta devuelve 404.

## Cómo funciona el control por scroll

1. **Recorrido:** la ruta es un contenedor de 600svh en desktop y 460svh en móvil. Dentro hay un escenario `sticky` de 100svh.
2. **Progreso:** `useScroll` de Motion convierte la posición del scroll en un progreso de 0 a 1.
3. **Suavizado:** un `useSpring` corto absorbe los saltos de la rueda del ratón y del trackpad.
4. **Reparto del recorrido** (en `TIMELINE`):
   - 0–0,46: IA-1, fotograma 0 → 120, con un ligero acercamiento al final.
   - 0,44–0,60: velo crema con el titular "Las vistas forman parte de la experiencia.". Funciona como un cambio de mirada, no como un plano continuo: ambos vídeos se intercambian ocultos bajo el velo.
   - 0,54–0,96: IA-7, fotograma 0 → 83, asentándose de escala 1,06 a 1.
5. **Dibujo:** cada valor de progreso se traduce en un índice de fotograma, y `FrameCanvas` lo pinta en un `<canvas>` con ajuste *cover* y punto focal horizontal. No hay re-render de React por fotograma.
6. **Reversible:** subir el scroll rebobina exactamente, porque no hay reproducción de vídeo, solo fotogramas indexados.
7. **Carga progresiva:**
   - Primero llega el póster.
   - Después los fotogramas, de grueso a fino: 1 de cada 16, luego 8, 4, 2 y 1.
   - Si un fotograma aún no ha llegado, se pinta el cargado más cercano.
   - Una línea fina en el borde inferior indica el avance de la carga.
8. **Móvil y fallback:**
   - Por debajo de 768 px se usa la secuencia ligera de móvil.
   - Con `prefers-reduced-motion` o ahorro de datos se muestra `StaticFilm`: fotos fijas a sangre con los mismos textos, sin cargar ninguna secuencia.

### Por qué fotogramas y no `video.currentTime`

Mover un vídeo H.264 con el scroll depende de los fotogramas clave y del navegador. En Safari iOS suele dar tirones, y al ir hacia atrás es poco fiable. Las secuencias WebP en canvas cuestan más bytes, pero se comportan igual en todos los navegadores y en ambos sentidos.

## Vercel Preview: distribución de los derivados

No se suben a git ni los originales ni los derivados. Plan propuesto:

1. Generar los derivados en local con `make_frames.py`.
2. Subir `public/experimento-scroll-media/` con la misma estructura (`ia1/d/000.webp`…) a un almacenamiento público. Opciones: Vercel Blob o un bucket con CDN, como Cloudflare R2 o S3 + CloudFront. Configurar `Cache-Control: public, max-age=31536000, immutable`.
3. Definir en el entorno **Preview** de Vercel:
   - `ENABLE_SCROLL_EXPERIMENT=true`
   - `NEXT_PUBLIC_SCROLL_MEDIA_BASE=https://<cdn>/experimento-scroll-media`
4. En **Production** no se define ninguna de las dos variables, así que la ruta da 404.
5. Si se cambia algún clip, conviene versionar la carpeta (`.../v2/`) para no pelear con la caché inmutable.

## Antes de llevarlo a la Home

1. **Validación de contenido:** confirmar que el paisaje y los pinos de `_RA60746` (2024) siguen siendo representativos. Hasta entonces, IA-7 no es apto para producción.
2. **Resolución:** los dos clips son de 720p. Para un hero a pantalla completa hacen falta versiones 1080p o 4K (escalado o regeneración) y una segunda resolución de fotogramas para pantallas grandes.
3. **IA-7 hacia la derecha:** regenerarlo con el travelling a la derecha, para que el Tibidabo no quede tapado y poder usar el clip completo.
4. **Peso:**
   - Ahora son unos 16,7 MB en desktop y 3,3 MB en móvil.
   - Opciones para reducirlo: AVIF, una calidad algo menor, o 12 fps en desktop con interpolación por fundido.
   - El objetivo es menos de 6 MB en desktop.
   - La carga debería empezar solo cuando la sección se acerque a la vista.
5. **Color común:** aplicar un ajuste de color compartido a los derivados de IA-1 e IA-7. IA-1 está nublado y frío; IA-7 tiene una luz de tarde más cálida.
6. **Integración:**
   - Montarlo como bloque del hero, con Header y Footer y con el contenido de la Home a continuación.
   - Mover los textos a Sanity cuando la composición esté aprobada.
   - Medir el LCP: el póster debe servir como imagen LCP.
7. **Pruebas:**
   - Safari iOS real (barra de direcciones y `svh`).
   - Android de gama media.
   - Teclado (barra espaciadora / AvPág).
   - Navegación sin JavaScript (se ve el póster).
   - Lector de pantalla.
8. **Accesibilidad:** valorar un control discreto para saltarse la secuencia en recorridos largos.
