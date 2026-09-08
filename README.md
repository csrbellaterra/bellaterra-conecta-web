# Bellaterra Conecta — sitio web

Web de producción de Bellaterra Conecta: Next.js + React + TypeScript + Tailwind CSS + Motion, con Sanity como CMS visual. Código en GitHub, despliegue automático en Vercel.

Este documento son instrucciones paso a paso para que puedas instalar, editar, compilar y publicar el proyecto sin depender de un desarrollador. Si algo no queda claro o da un error, pégame el mensaje exacto y lo resolvemos.

Para aprender a **editar contenido sin tocar código** (textos, fotos, puertas, impacto, etc.), consulta **`EDITOR_GUIDE.md`** — este README es sobre todo para la parte técnica (instalar, compilar, publicar).

---

## 1. Qué es este proyecto

- **Next.js 14 (App Router) + React + TypeScript**: el código de la web.
- **Tailwind CSS**: los estilos.
- **Motion** (`motion/react`): las animaciones (entradas suaves, contador de impacto, etc.).
- **Sanity**: el gestor de contenido visual, embebido en la propia web en `/studio`. Desde ahí editas textos, fotos, puertas, páginas, etc. sin tocar código.
- **pnpm**: el gestor de paquetes (como npm, pero más rápido y estricto).
- Mientras no tengas un proyecto de Sanity configurado, la web funciona igualmente con **datos de ejemplo locales** (ver `lib/sanity/seed-data.ts`), así que puedes instalar y ver la web funcionando antes de tocar Sanity.

## 2. Requisitos previos

Instala en tu ordenador (una sola vez):

1. **Node.js** 18.18 o superior — descárgalo de [nodejs.org](https://nodejs.org) (versión LTS).
2. **pnpm** — abre una terminal y ejecuta:
   ```
   corepack enable
   corepack prepare pnpm@latest --activate
   ```
   Si `corepack` no existe, instala pnpm con `npm install -g pnpm`.
3. **Git** — normalmente ya lo tienes si hemos trabajado con la web anterior. Si no, [git-scm.com](https://git-scm.com).

## 3. Instalación

Abre una terminal, entra en la carpeta del proyecto y ejecuta:

```
cd ruta/a/bellaterra-web
pnpm install
```

Esto descarga todas las dependencias. Puede tardar 1–2 minutos.

## 4. Variables de entorno

Copia `.env.example` a un archivo nuevo llamado `.env.local` (en la misma carpeta raíz del proyecto):

```
cp .env.example .env.local
```

En Windows (PowerShell): `copy .env.example .env.local`

De momento puedes dejar `.env.local` con los valores por defecto (vacíos) — la web funcionará con los datos de ejemplo. Los rellenaremos en el paso 5.

**Nunca subas `.env.local` a GitHub** — ya está excluido en `.gitignore`, no hace falta que hagas nada para eso.

## 5. Crear tu proyecto de Sanity (para poder editar contenido)

1. Ve a [sanity.io](https://www.sanity.io) y crea una cuenta gratuita (puedes usar tu email).
2. Dentro de este proyecto, ejecuta:
   ```
   npx sanity init
   ```
   Elige "Create new project", ponle un nombre (ej. "Bellaterra Conecta"), dataset `production`, y cuando pregunte por el schema, dile que **no** sobreescriba nada (ya está todo hecho en `sanity/schemaTypes`).
3. Al terminar, la CLI te da un **Project ID**. Ábrelo y pégalo en `.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=tu-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
4. Crea un token de lectura: en [sanity.io/manage](https://sanity.io/manage) → tu proyecto → API → Tokens → "Add API token", nombre "Preview", permisos "Viewer". Copia el token y pégalo en `.env.local`:
   ```
   SANITY_API_READ_TOKEN=tu-token
   ```
5. Reinicia el servidor si lo tenías abierto (`Ctrl+C` y vuelve a arrancarlo, ver paso 6).

### 5.1 Rellenar el contenido inicial (seed)

Con el proyecto de Sanity recién creado, el dataset está vacío — verás "Untitled" y "No documents" en `/studio`. Para rellenarlo automáticamente con el mismo contenido de partida que ya ves en la web (textos, fotos, las 5 puertas en su orden, páginas de La finca y Contacto), sin escribir nada a mano:

1. Crea un **token de escritura**: en [sanity.io/manage](https://sanity.io/manage) → tu proyecto → API → Tokens → "Add API token", nombre "Seed", permisos **"Editor"** (importante: "Viewer" no sirve, este token necesita poder crear contenido). Copia el token.
2. Pégalo en `.env.local` (variable nueva, distinta del token de lectura del paso 4):
   ```
   SANITY_API_WRITE_TOKEN=tu-token-de-escritura
   ```
3. Ejecuta:
   ```
   pnpm sanity:seed
   ```

Verás en la terminal cómo sube las fotos y crea cada documento (Página de inicio, Configuración del sitio, las 5 puertas, Impacto, La finca, Contacto). Al terminar, recarga `/studio` — ya no estará vacío.

Puedes ejecutar `pnpm sanity:seed` más de una vez sin miedo a duplicar nada: usa IDs fijos y siempre actualiza el mismo documento en vez de crear uno nuevo. Ojo: si para entonces ya has editado esos documentos a mano desde `/studio`, volver a ejecutar el seed **sobrescribe** esos cambios con el contenido de partida — no lo ejecutes por rutina, solo la primera vez o si quieres resetear a propósito.

La cifra total de impacto (PLASTY) **nunca** se rellena por el seed con un número — siempre deja `impactEnabled` desactivado, tal y como se explica en el punto 17 más abajo. Ese token de escritura, una vez hecho el seed inicial, no hace falta guardarlo activo — puedes revocarlo desde sanity.io/manage si prefieres no dejarlo por ahí.

## 6. Arrancar la web en tu ordenador

```
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) — ahí ves la web. El panel de edición de contenido está en [http://localhost:3000/studio](http://localhost:3000/studio).

## 7. Editar contenido

Ver **`EDITOR_GUIDE.md`** — ahí explico paso a paso cómo cambiar textos, fotos, añadir una puerta, activar la cifra de impacto real, etc., todo desde `/studio`, sin tocar código.

## 8. Comprobar que todo compila antes de publicar

Antes de subir cambios importantes, ejecuta siempre:

```
pnpm lint
pnpm typecheck
pnpm build
```

Si algo falla, el mensaje de error te dirá el archivo y la línea exacta — pégamelo y lo arreglamos.

## 9. Subir el proyecto a GitHub

Si es la primera vez:

1. Crea un repositorio vacío en GitHub (sin README, sin licencia — vacío del todo).
2. En la terminal, dentro de la carpeta del proyecto:
   ```
   git init
   git add .
   git commit -m "Primera versión de la web"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
   git push -u origin main
   ```

Para publicar cambios futuros, siempre desde la carpeta del proyecto:

```
git add .
git commit -m "Describe brevemente el cambio"
git push
```

## 10. Conectar con Vercel (para que la web esté en internet)

1. Ve a [vercel.com](https://vercel.com) y crea una cuenta (puedes entrar directamente con tu cuenta de GitHub).
2. "Add New" → "Project" → elige el repositorio de GitHub que acabas de subir.
3. Vercel detecta automáticamente que es un proyecto Next.js — no cambies nada de la configuración de build.
4. Antes de darle a "Deploy", añade las variables de entorno (las mismas de tu `.env.local`): `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_READ_TOKEN`, y `NEXT_PUBLIC_SITE_URL` (pon aquí la URL que te dé Vercel, o tu dominio final).
5. Dale a "Deploy". En 1–2 minutos tienes la web publicada con una URL tipo `bellaterra-conecta.vercel.app`.

A partir de aquí, **cada vez que hagas `git push` a la rama `main`, Vercel publica automáticamente la nueva versión**. No hace falta hacer nada más.

## 11. Vista previa de cambios antes de publicar (Pull Requests)

Si quieres probar un cambio grande antes de que sea público: crea una rama nueva (`git checkout -b mi-cambio`), haz `git push`, y abre un Pull Request en GitHub. Vercel genera automáticamente una URL de previsualización para ese PR, distinta de la web pública, para que puedas revisarlo antes de fusionarlo a `main`.

## 12. Dominio propio (ej. bellaterraconecta.com)

En Vercel: tu proyecto → Settings → Domains → añade tu dominio y sigue las instrucciones para apuntar los DNS desde donde tengas comprado el dominio. Actualiza también `NEXT_PUBLIC_SITE_URL` en las variables de entorno de Vercel al dominio final y vuelve a desplegar.

## 13. Cómo cambiar una foto o un vídeo

Desde `/studio` (ver `EDITOR_GUIDE.md`), sin tocar código: abre el documento correspondiente (una puerta, la home, etc.) y sustituye la imagen o el vídeo desde el propio campo. Los cambios se publican automáticamente en la web en cuanto los guardas en Sanity — no hace falta hacer `git push` para esto.

## 14. Cómo añadir una sección nueva a una página

Cada página está construida con "bloques" reutilizables (Hero, ImagenTexto, Galería, CTA, etc. — ver `components/sections/`). Desde `/studio`, en el documento de tipo "Página" (o en el campo `contentBlocks` de una puerta), puedes añadir, quitar y reordenar estos bloques libremente, sin tocar código.

## 15. Cómo añadir una página nueva

1. En `/studio`, crea un nuevo documento de tipo "Página", ponle un título y un slug (la URL, ej. `nuestra-historia`).
2. Añade los bloques que quieras.
3. En código, crea el archivo `app/nuestra-historia/page.tsx` copiando el patrón de `app/la-finca/page.tsx` (solo cambia `getPage("la-finca")` por `getPage("nuestra-historia")`).
4. Súbelo con `git push` — Vercel publica la ruta nueva automáticamente.

## 16. Estructura del proyecto

```
app/                 rutas de Next.js (una carpeta por página)
components/           componentes de React
  sections/            los bloques del page builder (Hero, Galería, CTA...)
  ui/                  piezas pequeñas reutilizables (Container, Media, DoorCard...)
lib/
  content.ts           capa única de datos (decide Sanity vs. datos locales)
  sanity/              cliente de Sanity, consultas GROQ, datos de ejemplo
sanity/
  schemaTypes/         definición de los tipos de contenido en Sanity Studio
types/content.ts       formas de datos compartidas por todo el proyecto
public/images/         fotos (marcador temporal — sustituir por las reales desde Sanity)
scripts/seed-sanity.ts  script de `pnpm sanity:seed` (ver punto 5.1) — rellena Sanity con el contenido inicial
```

## 17. Nota importante sobre el impacto (PLASTY)

La cifra total de kg de plástico recuperado **no se publica hasta que sea un dato real y verificado**. Por defecto está desactivada (`impactEnabled: false` en el documento "Impacto" de Sanity) y la web muestra un texto genérico en su lugar. Actívala solo cuando tengas la cifra confirmada — ver `EDITOR_GUIDE.md`.

---

## Solución de problemas frecuentes

- **`pnpm: command not found`** → repite el paso 2 (instalar pnpm).
- **La web no arranca / error de puerto ocupado** → cierra otras terminales con `pnpm dev` abierto, o cambia de puerto con `pnpm dev -- -p 3001`.
- **`/studio` da error o pantalla en blanco** → revisa que `NEXT_PUBLIC_SANITY_PROJECT_ID` esté bien puesto en `.env.local` y que hayas reiniciado `pnpm dev` después de cambiarlo.
- **Los cambios en GitHub no se reflejan en la web publicada** → asegúrate de estar en la carpeta correcta del proyecto (`cd` a la carpeta antes de cualquier comando `git`) y de haber hecho `git push` a la rama `main`. Comprueba también en el panel de Vercel que el despliegue terminó sin errores.
- **`pnpm sanity:seed` falla con "Falta SANITY_API_WRITE_TOKEN"** → crea el token de escritura (ver punto 5.1) y pégalo en `.env.local`, no en ningún otro archivo.
- **`pnpm sanity:seed` falla con un error de permisos ("Insufficient permissions" o similar)** → el token no tiene permisos de escritura; vuelve a crearlo en sanity.io/manage eligiendo "Editor" en vez de "Viewer".
