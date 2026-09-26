import type { SchemaTypeDefinition } from "sanity";

// Objetos reutilizables
import imageWithAlt from "./objects/imageWithAlt";
import mediaField from "./objects/mediaField";
import seoFields from "./objects/seoFields";
import plastyContribution from "./objects/plastyContribution";
import navLink from "./objects/navLink";

// Objetos reutilizables V2
import media from "./objects/media";
import featureItem from "./objects/featureItem";
import timelineItem from "./objects/timelineItem";
import stat from "./objects/stat";
import cta from "./objects/cta";
import relatedExperience from "./objects/relatedExperience";
import formOption from "./objects/formOption";
import formQuestion from "./objects/formQuestion";

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

// Documentos V2
import event from "./documents/event";
import form from "./documents/form";
import galleryItem from "./documents/galleryItem";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documentos
  siteSettings,
  homePage,
  door,
  page,
  impact,
  // Documentos V2
  event,
  form,
  galleryItem,
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
  // Objetos V2
  media,
  featureItem,
  timelineItem,
  stat,
  cta,
  relatedExperience,
  formOption,
  formQuestion,
];
