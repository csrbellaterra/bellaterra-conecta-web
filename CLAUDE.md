# Instrucciones persistentes del proyecto — Bellaterra Conecta

Este archivo recoge decisiones de dirección/design system que deben respetarse en cualquier trabajo futuro sobre este repositorio (Claude u otra persona), aunque no se repitan en cada prompt.

## Design principle — editorial vs functional UI

Bellaterra Conecta debe evitar cards como recurso visual por defecto.

Para storytelling, experiencias, espacios, historia y contenido emocional:

- fotografía grande;
- listas editoriales;
- composición asimétrica;
- alternancia imagen/texto;
- full-width media;
- ritmo de revista/hospitality premium.

Las cards se reservan principalmente para elementos funcionales:

- portales de las cuatro experiencias (paneles fotográficos editoriales, no cards SaaS);
- Family Days;
- opciones de formularios;
- experiencias relacionadas cuando tenga sentido.

Si una colección de contenido puede mostrarse editorialmente, no convertirla automáticamente en un grid de cards.

## Content policy — PLASTY / Impacto

Las cifras y textos de aportación PLASTY (por puerta, por noche, por jornada, etc.) son contenido editable desde Sanity (`plastyContributionText`, `plastyContributionEnabled` y equivalentes), no constantes de negocio inmutables en el código. El modelo todavía se está definiendo. Si existe un campo Sanity para ese texto, es siempre la fuente principal; el fallback en código es solo texto descriptivo de referencia, nunca un cálculo automático. No implementar cálculos automáticos derivados de estas cifras salvo instrucción explícita futura.

**Estancias**: referencia actual (contenido, no regla técnica): habitación individual / Airbnb → 2 kg por noche; alquiler de la casa entera (3 habitaciones + cocina + espacios) → 30 kg por experiencia. Ambos casos conviven como texto editable, no como una única cifra fija.

**Pickleball**: desde la Web V2 (31/10/2026) ya no es una de las puertas principales; ver "Estructura V2". La escuela, la matrícula, los programas de aprendizaje y la contribución PLASTY asociada a la escuela quedan eliminados conceptualmente — ya no existen. Pickleball es: reserva de pistas, Family Days, encuentros y actividades para grupos. No mostrar ninguna cifra PLASTY específica de Pickleball hasta que se defina y valide el nuevo modelo. Ya implementado: `app/pickleball` usa `components/DoorPageTemplatePickleball.tsx` y la aportación PLASTY se desactivó en Sanity (`scripts/disable-pickleball-plasty.ts`). No reintroducir escuela, matrícula ni cifras PLASTY de Pickleball.

**Impacto**: no implementar públicamente la sección "Transparencia" por ahora. Las cifras PLASTY por puerta siguen siendo administrables desde Sanity como contenido, no como constantes.

**Hall of Fame (preparado, no visible sin contenido)**: el tipo Sanity `impactContributor` ya existe (`sanity/schemaTypes/documents/impactContributor.ts`), junto con `impactContributorsQuery`, `getImpactContributors` y `components/sections/impacto/ImpactCommunity.tsx`. La sección solo se muestra si está activada en `impact` y hay al menos un `impactContributor` con `publicationConsent == true`. No mostrarla nunca sin contenido autorizado ni rellenarla con datos de ejemplo.

## Imágenes y experiencia cinematográfica

- Trabajar siempre con imágenes reales de la finca. Las fotografías actuales (`Fotos Actual 2026`) tienen prioridad; las anteriores (`FOTOS CASA`) solo sirven si siguen representando fielmente el estado actual.
- No inventar arquitectura ni modificar la distribución, volúmenes, aberturas o materiales de la finca mediante IA. La IA solo puede añadir movimiento de cámara, luz o transiciones sobre lo que existe.
- No usar la habitación marcada como "ACTUALMENTE NO DISPONIBLE".
- No publicar fotografías con personas reconocibles sin autorización de publicación confirmada.
- No modificar, mover ni comprimir los originales. Cualquier derivado (web, vídeo) se genera aparte.
- Antes de cambiar imágenes en la web o en Sanity, presentar la selección para aprobación.
- La experiencia cinematográfica no tiene sonido.
- Mantener el stack actual: Next.js, Sanity, formularios y Airtable.
- El scroll cinematográfico (controlado por scroll) es para la introducción de las páginas de experiencia, no para la Home. Su base es el prototipo aislado `/experimento-scroll`; se integrará como un único componente reutilizable configurado desde los datos de cada puerta (Sanity), no como cuatro soluciones distintas.

## Estructura V2 (decisión definitiva, 31/10/2026)

- Cuatro experiencias principales: **Empresas, Eventos, Estancias y Comunidad**. Titular de marca: "Una finca. Cuatro formas de vivirla."
- **Pickleball deja de ser puerta**: no aparece en el selector, en los portales de la Home ni en el desplegable Experiencias. No borrar `app/pickleball`, sus componentes ni sus documentos de Sanity.
- **Reservar pista** es una entrada propia del menú principal (`/reservar-pista`). Mientras no exista el sistema de reservas, es una página provisional honesta: sin calendarios simulados, precios ni reservas confirmadas.
- Menú: Experiencias (4) · Reservar pista · Nuestra historia · Impacto · Galería · Contacto.
- **Home** corta: hero con vídeo de fondo (autoplay, muted, loop, playsInline, sin audio, con póster, pausa discreta, respeta `prefers-reduced-motion` y ahorro de datos) → cuatro portales visuales → cierre de identidad + PLASTY → CTA de contacto → footer. Las secciones largas por puerta no van en la Home; pertenecen a cada página de experiencia.
- **Vídeo de la Home**: se monta a partir de las 13 fotografías numeradas de `Fotos Casa\Fotos Video Landing General` (storyboard en `docs/fase-cinematica/STORYBOARD_VIDEO_HOME.md`). Fidelidad a la finca real por encima de la continuidad: no inventar espacios para encadenar planos. Se sube a Sanity (`homePage.hero.media`), no al repositorio.
- **Páginas de experiencia**: bloque A (introducción cinematográfica por scroll, 3–4 escenas, con opción de saltar) → bloque B (información comercial editorial) → bloque C (conversión hacia los formularios existentes que envían a Airtable). CTAs: Empresas → "Solicitar una propuesta"; Eventos → "Organizar mi evento"; Estancias → "Consultar disponibilidad"; Comunidad → "Participar en la comunidad". Mantener las rutas de formulario existentes.
- **Impacto**: conservar la arquitectura existente (contador, PLASTY, Hall of Fame con consentimiento). El rediseño visual llegará más adelante, solo con cifras reales y verificadas.
