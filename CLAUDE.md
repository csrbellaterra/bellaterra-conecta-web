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

- selector de las cinco puertas;
- Family Days;
- opciones de formularios;
- experiencias relacionadas cuando tenga sentido.

Si una colección de contenido puede mostrarse editorialmente, no convertirla automáticamente en un grid de cards.

## Content policy — PLASTY / Impacto

Las cifras y textos de aportación PLASTY (por puerta, por noche, por jornada, etc.) son contenido editable desde Sanity (`plastyContributionText`, `plastyContributionEnabled` y equivalentes), no constantes de negocio inmutables en el código. El modelo todavía se está definiendo. Si existe un campo Sanity para ese texto, es siempre la fuente principal; el fallback en código es solo texto descriptivo de referencia, nunca un cálculo automático. No implementar cálculos automáticos derivados de estas cifras salvo instrucción explícita futura.

**Estancias**: referencia actual (contenido, no regla técnica): habitación individual / Airbnb → 2 kg por noche; alquiler de la casa entera (3 habitaciones + cocina + espacios) → 30 kg por experiencia. Ambos casos conviven como texto editable, no como una única cifra fija.

**Pickleball**: la escuela, la matrícula, los programas de aprendizaje y la contribución PLASTY asociada a la escuela quedan eliminados conceptualmente — ya no existen. Pickleball es: reserva de pistas, Family Days, encuentros y actividades para grupos. No mostrar ninguna cifra PLASTY específica de Pickleball hasta que se defina el nuevo modelo. (Pendiente de aplicar en el contenido/página real en la Fase 4B — a fecha de esta nota, `app/pickleball` y su contenido en Sanity todavía no se han tocado.)

**Impacto**: no implementar públicamente la sección "Transparencia" por ahora. Las cifras PLASTY por puerta siguen siendo administrables desde Sanity como contenido, no como constantes.

**Futuro — Hall of Fame**: prevista conceptualmente una futura sección dentro de Impacto (nombre provisional "Hall of Fame") para mostrar personas/empresas/eventos/miembros que hayan contribuido al impacto PLASTY y autorizado aparecer públicamente. Si en el futuro hace falta preparar arquitectura de datos, se puede contemplar un tipo Sanity `impactContributor` con campos: nombre, tipo (persona/empresa/evento/comunidad), imagen/logo, kg asociados, fecha, texto corto, puerta relacionada, autorización para publicar, featured. NO crear este schema ni su UI hasta que la fase correspondiente lo requiera explícitamente.
