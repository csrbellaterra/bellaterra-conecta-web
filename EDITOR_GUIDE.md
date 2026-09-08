# Guía de edición — Bellaterra Conecta

Esta guía es para editar el contenido de la web (textos, fotos, puertas, impacto...) **sin tocar ningún código**. Todo se hace desde el panel de Sanity Studio, en `/studio` (por ejemplo `https://bellaterraconecta.com/studio` o, en local, `http://localhost:3000/studio`).

Necesitas que alguien haya seguido el `README.md` una vez para crear el proyecto de Sanity y darte acceso (Settings → Members, en [sanity.io/manage](https://sanity.io/manage)).

Los cambios que haces en `/studio` se publican en la web automáticamente en cuanto los guardas — no hace falta ningún paso técnico adicional.

---

## El panel, de un vistazo

Al entrar en `/studio` verás, en el menú de la izquierda:

- **Página de inicio** — el contenido de la home (hero, selector de puertas, sección de conexión, sección de impacto).
- **Configuración del sitio** — logo, menú de navegación, pie de página, redes sociales.
- **Puertas / experiencias** — las 5 puertas: Empresas, Eventos, Estancias, Comunidad, Pickleball.
- **Páginas** — páginas sueltas (La finca, Contacto, y cualquiera nueva que se añada).
- **Impacto (PLASTY)** — la cifra global de kg de plástico recuperado.

## Cambiar un texto

Abre el documento correspondiente (por ejemplo, "Puertas / experiencias" → "Empresas"), haz clic en el campo que quieras cambiar, edita el texto y listo — se guarda solo. En la esquina, un punto verde/gris te indica si hay cambios sin publicar; en Sanity, guardar y publicar suele ser automático, pero si ves un botón "Publish" pendiente, dale clic.

## Cambiar una foto o un vídeo

1. Abre el documento (puerta, home, página...).
2. Haz clic sobre la imagen o el campo de "Media".
3. Sube el archivo nuevo desde tu ordenador, o pégalo desde tu librería de Sanity si ya lo subiste antes.
4. Rellena siempre el **texto alternativo** (qué se ve en la foto) — es importante para accesibilidad y para que Google entienda el contenido.

Para poner un **vídeo** en el hero de la home o de una puerta: en el campo "Media", cambia el tipo de "Imagen" a "Vídeo subido" (o "Vídeo externo" si el vídeo está alojado en otro sitio, por ejemplo un enlace de Higgsfield/Mux/Cloudinary), y sube o pega el enlace.

## Añadir, quitar o reordenar bloques de una página

En los documentos de tipo "Página" (o en el campo "Bloques de contenido adicionales" de una puerta), verás una lista de bloques (texto, imagen+texto, galería, CTA...). Puedes:

- Añadir uno nuevo con el botón "+" y elegir el tipo de bloque.
- Arrastrar los bloques para reordenarlos.
- Eliminar uno con el icono de papelera.

## Las 5 puertas (Empresas, Eventos, Estancias, Comunidad, Pickleball)

Cada puerta tiene estos campos principales:

- **Nombre**, **descripción corta** (la que sale en la tarjeta del selector de la home).
- **Imagen de la tarjeta del selector** — la foto que se ve en la home.
- **Imagen/vídeo de portada** — la foto grande de la página propia de la puerta.
- **Titular** — la frase grande de la sección de esa puerta en la home (ej. "Salir de la oficina cambia la conversación.").
- **Introducción** — el texto explicativo de la página de la puerta.
- **Galería** — fotos adicionales al final de la página.
- **Aportación PLASTY** — el importe en € y los kg de plástico recuperado por esa puerta. **Estas cifras deben coincidir con el Documento Fundacional** — no las cambies sin confirmar antes el dato real.

**Importante:** el "slug" (la URL) de cada puerta debe seguir siendo exactamente `empresas`, `eventos`, `estancias`, `comunidad` o `pickleball` — si lo cambias, esa página deja de funcionar. No lo toques salvo que sepas lo que haces (y avisa antes).

## La cifra de impacto total (PLASTY)

Ve a **"Impacto (PLASTY)"** en el menú.

- Mientras el interruptor **"Publicar cifra de impacto"** esté desactivado, la web muestra un texto genérico (sin ningún número) en la sección de impacto de la home y en `/impacto`. Esto es así a propósito, para no publicar nunca una cifra inventada o de ejemplo.
- Cuando tengáis una cifra total **real y verificada**, actívalo, rellena "Kg de plástico recuperado (total)", la fecha de actualización y, si queréis, una nota explicando cómo se calcula (para que sea un dato verificable, no solo una cifra suelta).
- Las aportaciones PLASTY de cada puerta (€/kg por evento, por noche, etc.) son independientes de este interruptor y siempre se muestran, porque son datos ya confirmados del Documento Fundacional.

## Idiomas (catalán / inglés)

Por ahora la web solo tiene contenido en español. En "Configuración del sitio" → "Idiomas" puedes ver los tres idiomas previstos (ES/CAT/EN), pero CAT y EN están marcados como inactivos y el selector de idioma está oculto. Cuando tengáis las traducciones reales, avisad y se activa esa parte — no se debe activar con traducciones inventadas o automáticas sin revisar.

## Páginas legales (Aviso legal, Privacidad, Cookies)

Estas tres páginas (enlazadas desde el pie de página) tienen de momento un texto provisional que dice explícitamente "pendiente de redacción legal". Sustituidlo por el texto real que os prepare vuestra asesoría antes de publicar la web de cara al público — mientras tanto no es contenido real, es un aviso para no olvidarlo.

## Vista previa antes de publicar (Visual Editing)

Desde `/studio`, el botón de "Presentation" (o "Vista previa") te permite ver la web en directo mientras editas, con los cambios reflejándose al momento, incluso antes de publicarlos del todo — útil para revisar cómo queda un texto o una foto antes de confirmarlo.

## Si algo no está aquí

Si necesitas cambiar algo que no aparece en esta guía (por ejemplo, el orden de las puertas, añadir una sección completamente nueva de diseño, o conectar un formulario de contacto real), dímelo directamente — esas cosas sí requieren tocar código, y es mejor que lo revisemos juntos antes de que lo intentes desde el panel.
