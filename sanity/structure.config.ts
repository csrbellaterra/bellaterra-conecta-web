import { CogIcon, HomeIcon } from "@sanity/icons";
import type { StructureResolver } from "sanity/structure";

/**
 * Estructura personalizada del Studio: siteSettings, homePage e
 * impact son documentos únicos (singleton) — se abren directamente,
 * sin pasar por una lista donde se podrían crear duplicados por
 * error. door y page son colecciones normales.
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
      S.divider(),
      S.listItem()
        .title("Impacto (PLASTY)")
        .child(S.document().schemaType("impact").documentId("impact")),
    ]);
