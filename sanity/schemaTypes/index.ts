import type { SchemaTypeDefinition } from "sanity";

// Objetos reutilizables
import imageWithAlt from "./objects/imageWithAlt";
import mediaField from "./objects/mediaField";
import seoFields from "./objects/seoFields";
import plastyContribution from "./objects/plastyContribution";
import navLink from "./objects/navLink";

// Bloques del page builder
import heroSection from "./blocks/heroSection";
import doorSelectorSection from "./blocks/doorSelectorSection";
import imageTextSection from "./blocks/imageTextSection";
import experienceSection from "./blocks/experienceSection";
import gallerySection from "./blocks/gallerySection";
import impactSection from "./blocks/impactSection";
import textSection from "./blocks/textSection";
import ctaSection from "./blocks/ctaSection";
import fullWidthMediaSection from "./blocks/fullWidthMediaSection";

// Documentos
import siteSettings from "./documents/siteSettings";
import homePage from "./documents/homePage";
import door from "./documents/door";
import page from "./documents/page";
import impact from "./documents/impact";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documentos
  siteSettings,
  homePage,
  door,
  page,
  impact,
  // Bloques
  heroSection,
  doorSelectorSection,
  imageTextSection,
  experienceSection,
  gallerySection,
  impactSection,
  textSection,
  ctaSection,
  fullWidthMediaSection,
  // Objetos
  imageWithAlt,
  mediaField,
  seoFields,
  plastyContribution,
  navLink,
];
