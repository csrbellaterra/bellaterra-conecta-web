# Configuración de Airtable — Bellaterra Conecta

Este documento explica cómo preparar Airtable para recibir los envíos de los 7 formularios de la web (`/solicitud/[slug]`, vía `app/api/forms/submit/route.ts`). No incluye ningún token real — cada persona debe crear el suyo.

## 1. Crear la Base

1. Entra en [airtable.com](https://airtable.com) con la cuenta que va a gestionar las solicitudes de Bellaterra Conecta.
2. Crea una Base nueva y vacía. Nómbrala, por ejemplo, "Bellaterra Conecta — Solicitudes".

## 2. Crear la tabla `Submissions`

Dentro de la Base, crea (o renombra la tabla por defecto a) una tabla llamada exactamente **`Submissions`** — el nombre debe coincidir con la variable de entorno `AIRTABLE_SUBMISSIONS_TABLE` (por defecto es `Submissions`, pero puede cambiarse si se prefiere otro nombre, siempre que la variable de entorno coincida).

## 3. Campos necesarios

Crea estos campos en la tabla `Submissions`. El nombre del campo debe coincidir exactamente con la columna de la izquierda (mayúsculas/minúsculas incluidas).

| Campo | Tipo recomendado en Airtable | Notas |
|---|---|---|
| `submissionId` | Texto de una línea | UUID generado por el servidor, único por envío |
| `createdAt` | Fecha (con hora) | ISO 8601, generado por el servidor |
| `status` | Selección única | Opciones: `New`, `Contacted`, `Proposal sent`, `Won`, `Lost`. Todos los envíos nuevos llegan como `New` |
| `formSlug` | Texto de una línea | ej. `empresas`, `eventos`, `family-day` |
| `formTitle` | Texto de una línea | Título legible del formulario en el momento del envío |
| `pageSource` | Texto de una línea | Ruta desde la que se envió (ej. `/solicitud/empresas`) |
| `ctaSource` | Texto de una línea | Origen del CTA cuando viene informado (ej. `visita`, `contacto-general`) |
| `sourceUrl` | URL | URL completa (con query string) desde la que se envió |
| `name` | Texto de una línea | Resuelto por alias desde las respuestas (`nombre`/`name`) |
| `email` | Email | |
| `phone` | Teléfono o texto de una línea | |
| `company` | Texto de una línea | Solo relevante en Empresas |
| `eventId` | Texto de una línea | Solo Family Day: slug del evento (ver convención en `DoorUpcomingFamilyDays`) |
| `eventTitle` | Texto de una línea | Solo Family Day |
| `eventDate` | Fecha | Family Day, o fecha aproximada/de entrada de otros formularios |
| `peopleCount` | Texto de una línea o número | Puede venir como texto si el campo de origen no era estrictamente numérico |
| `selectedOptions` | Texto largo | Todas las respuestas de tipo lista (multiSelect/optionCards), unidas por comas, legibles |
| `message` | Texto largo | |
| `answersJson` | Texto largo | **Todas** las respuestas, siempre, como `[{questionId, questionLabel, answer}]` — es la fuente de verdad si algún día cambian las preguntas del formulario en Sanity y las columnas de arriba quedan desactualizadas |
| `utmSource` | Texto de una línea | |
| `utmMedium` | Texto de una línea | |
| `utmCampaign` | Texto de una línea | |
| `privacyAccepted` | Casilla (checkbox) | Siempre `true` — el servidor rechaza el envío si no lo es |
| `marketingAccepted` | Casilla (checkbox) | Opcional, nunca viene premarcado desde el formulario |

No es necesario crear estos campos en un orden concreto ni añadir más de los listados arriba — el servidor solo envía los campos con valor (nunca sobrescribe con vacío un default de Airtable), así que campos adicionales que tengas en la tabla no se tocan.

## 4. Crear el Personal Access Token (PAT)

1. En Airtable, ve a tu cuenta → **Developer hub** → **Personal access tokens** → **Create new token**.
2. Nombre sugerido: `bellaterra-conecta-web`.
3. **Scopes** mínimos necesarios:
   - `data.records:read`
   - `data.records:write`
4. **Access**: concede acceso únicamente a la Base creada en el paso 1 (no a todas las bases de la cuenta).
5. Genera el token y cópialo — Airtable solo lo muestra una vez.

## 5. Variables de entorno en Vercel (y en `.env.local` para local)

Añade estas tres variables, **nunca con el prefijo `NEXT_PUBLIC_`** (eso las expondría al navegador):

```
AIRTABLE_PAT=pat_xxxxxxxxxxxxxxxx
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_SUBMISSIONS_TABLE=Submissions
```

- `AIRTABLE_BASE_ID` se ve en la URL de la Base cuando la tienes abierta (empieza por `app...`).
- En Vercel: **Project Settings → Environment Variables**, añádelas para los entornos que corresponda (Production y, si se quiere probar antes, Preview).
- En local: cópialas a `.env.local` (nunca se sube a GitHub, ver `.gitignore`).

## 6. Cómo probarlo

Dos formas, de menos a más invasiva:

1. **Sin escribir nada**: ejecuta `pnpm airtable:check`. Comprueba que las tres variables existen, que el PAT tiene acceso a la Base, y que la tabla configurada existe — no crea ninguna fila.
2. **Envío real de prueba**: rellena y envía cualquiera de los formularios en `/solicitud/[slug]` (en local o en un Preview de Vercel) y comprueba que aparece una fila nueva en `Submissions` con `status = New`.

## 7. Cómo rotar el token

Si el PAT se ha filtrado, ha caducado, o simplemente toca rotarlo por buena práctica:

1. Crea un token nuevo siguiendo el paso 4 (puedes darle el mismo nombre con un sufijo, ej. `bellaterra-conecta-web-2026`).
2. Actualiza `AIRTABLE_PAT` en Vercel (y en tu `.env.local` si lo usas para probar) con el valor nuevo.
3. Verifica con `pnpm airtable:check` que el nuevo token funciona.
4. Vuelve a Airtable → Developer hub → Personal access tokens y **revoca** el token antiguo.

No hace falta cambiar `AIRTABLE_BASE_ID` ni `AIRTABLE_SUBMISSIONS_TABLE` al rotar el token — esas dos variables no cambian salvo que se cambie de Base o de nombre de tabla.

## Fuera de alcance (por ahora)

Este documento cubre solo la puesta en marcha de Airtable como almacén de solicitudes. Explícitamente NO cubre (ver Fase 6): emails automáticos de confirmación, integración con un CRM, ni automatizaciones dentro de la propia Airtable (ej. Zapier/Make) — nada de eso se ha construido todavía.
