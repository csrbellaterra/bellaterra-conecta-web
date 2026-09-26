import { BookIcon, CalendarIcon, CogIcon, EnvelopeIcon, HomeIcon, ImagesIcon } from "@sanity/icons";
import type { StructureResolver } from "sanity/structure";

/**
 * Estructura personalizada del Studio: siteSettings, homePage e
 * impact son documentos únicos (singleton) — se abren directamente,
 * sin pasar por una lista donde se podrían crear duplicados por
 * error. door y page son colecciones normales.
 *
 * Este archivo se llama `structure.config.ts` (no `structure.ts`) a
 * propósito, para no colisionar con el subpath del paquete
 * `sanity/structure` (de donde sale `structureTool`) bajo el
 * `baseUrl: "."` de tsconfig.json — ver el comentario en
 * sanity.config.ts.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Página de inicio")
        .icon(HomeIcon)
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("Configuración del sitio")
        .icon(CogIcon)
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.listItem()
        .title("Puertas / experiencias")
        .child(S.documentTypeList("door").title("Puertas / experiencias")),
      S.listItem()
        .title("Páginas")
        .child(S.documentTypeList("page").title("Páginas")),
      S.listItem()
        .title("Nuestra Historia")
        .icon(BookIcon)
        .child(S.document().schemaType("storyPage").documentId("storyPage")),
      S.divider(),
      S.listItem()
        .title("Eventos (Family Days)")
        .icon(CalendarIcon)
        .child(S.documentTypeList("event").title("Eventos (Family Days)")),
      S.listItem()
        .title("Formularios")
        .icon(EnvelopeIcon)
        .child(S.documentTypeList("form").title("Formularios")),
      S.listItem()
        .title("Galería")
        .icon(ImagesIcon)
        .child(S.documentTypeList("galleryItem").title("Galería")),
      S.divider(),
      S.listItem()
        .title("Impacto (PLASTY)")
        .child(S.document().schemaType("impact").documentId("impact")),
    ]);
