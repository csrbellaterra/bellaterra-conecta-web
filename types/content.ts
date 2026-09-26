/**
 * Formas de contenido compartidas entre Sanity (lib/sanity/queries.ts)
 * y los datos locales de respaldo (lib/sanity/seed-data.ts). Mantener
 * esto sincronizado con sanity/schemaTypes/*.ts — son la misma forma
 * de datos vista desde dos sitios distintos.
 */

export type SanityImage = {
  /** URL ya resuelta (Sanity Image o ruta local en /public) */
  url: string;
  alt: string;
  width?: number;
  height?: number;
  /** Posición del hotspot en % (para object-position) */
  hotspot?: { x: number; y: number };
};

export type MediaField = {
  type: "image" | "video" | "externalVideo";
  image?: SanityImage;
  /** vídeo subido, ya resuelto a URL */
  videoUrl?: string;
  /** URL de un vídeo externo (ej. Mux/Cloudinary/YouTube) */
  externalVideoUrl?: string;
  poster?: SanityImage;
  /** ---------- Campos V2 (aditivos, opcionales) ---------- */
  /** sustituye a `image` en pantallas estrechas; si no está, se usa `image` */
  mobileImage?: SanityImage;
  /** sustituye al vídeo principal en pantallas estrechas; si no está, se usa el vídeo principal */
  mobileVideoUrl?: string;
  autoplay?: boolean;
  loop?: boolean;
};

export type SeoFields = {
  title?: string;
  description?: string;
  ogImage?: SanityImage;
};

export type DoorId = "empresas" | "eventos" | "estancias" | "comunidad" | "pickleball";

export type PlastyContribution = {
  /** ej. "Por evento reservado", "Por cada noche reservada" */
  label: string;
  amountEur: number;
  kg: number;
  /** texto libre para matices (ej. "vinculación voluntaria anual, 12 meses") */
  note?: string;
};

export type Door = {
  id: DoorId;
  slug: DoorId;
  order: number;
  name: string;
  /** nombre corto para el selector, ej. "Empresas" */
  eyebrow: string;
  shortDescription: string;
  icon: DoorIconName;
  selectorImage: SanityImage;
  heroMedia: MediaField;
  headline: string;
  introduction: string;
  contentBlocks: PageBlock[];
  gallery: SanityImage[];
  ctaLabel: string;
  ctaUrl: string;
  plastyContribution?: PlastyContribution;
  seo: SeoFields;
  /** ---------- Campos V2 (aditivos, opcionales) ---------- */
  heroMobileMedia?: Media;
  featureSections?: (FeatureItem | TimelineItem)[];
  spacesGallery?: SpaceItem[];
  relatedExperiences?: RelatedExperience[];
  /** slug del formulario principal de esta puerta (ver FormDoc) */
  primaryForm?: string;
  /** desactivado por defecto para Pickleball: no hay modelo PLASTY nuevo definido todavía */
  plastyContributionEnabled?: boolean;
  plastyContributionText?: string;
  /** ---------- Teaser en la Home (V2, aditivo, opcional) ---------- */
  homeEyebrow?: string;
  homeHeadline?: string;
  homeDescription?: string;
  homeCtaLabel?: string;
  homeMedia?: Media;
};

export type DoorIconName = "briefcase" | "party" | "bed" | "community" | "pickleball";

/** ---------- Bloques del page builder ---------- */

export type HeroBlock = {
  _type: "heroSection";
  eyebrow?: string;
  title: string;
  subtitle?: string;
  location?: string;
  media: MediaField;
  ctaLabel?: string;
  ctaUrl?: string;
};

export type DoorSelectorBlock = {
  _type: "doorSelectorSection";
  heading: string;
  subheading?: string;
};

export type ImageTextBlock = {
  _type: "imageTextSection";
  eyebrow: string;
  headline: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
  media: MediaField;
  /** qué lado ocupa la imagen en desktop */
  imageSide: "left" | "right";
};

export type ExperienceBlock = Omit<ImageTextBlock, "_type"> & { _type: "experienceSection"; doorId?: DoorId };

export type GalleryBlock = {
  _type: "gallerySection";
  heading?: string;
  images: SanityImage[];
};

export type ImpactBlock = {
  _type: "impactSection";
  heading?: string;
  body?: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

export type TextBlock = {
  _type: "textSection";
  eyebrow?: string;
  heading?: string;
  body: string;
};

export type CtaBlock = {
  _type: "ctaSection";
  heading: string;
  ctaLabel: string;
  ctaUrl: string;
};

export type FullWidthMediaBlock = {
  _type: "fullWidthMediaSection";
  media: MediaField;
  caption?: string;
  overlayText?: string;
};

export type PageBlock =
  | HeroBlock
  | DoorSelectorBlock
  | ImageTextBlock
  | ExperienceBlock
  | GalleryBlock
  | ImpactBlock
  | TextBlock
  | CtaBlock
  | FullWidthMediaBlock;

/** ---------- Páginas ---------- */

export type Page = {
  slug: string;
  title: string;
  blocks: PageBlock[];
  seo: SeoFields;
};

export type HomePage = {
  hero: HeroBlock;
  selectorHeading: string;
  /** heredado — usar selectorIntroduction en su lugar cuando exista */
  selectorSubheading: string;
  connectionSection: {
    /** heredado — usar connectionHeadline en su lugar cuando exista */
    heading: string;
    media: MediaField;
  };
  impactSection: ImpactBlock;
  /** heredado — usar los campos finalCta* en su lugar cuando existan */
  footerCta?: CtaBlock;
  seo: SeoFields;
  /** ---------- Copy editorial V2 (aditivo, opcional) ---------- */
  selectorIntroduction?: string;
  connectionEyebrow?: string;
  connectionHeadline?: string;
  plastyEyebrow?: string;
  plastyHeadline?: string;
  plastyBody?: string;
  plastyCtaLabel?: string;
  plastyCtaUrl?: string;
  finalCtaEyebrow?: string;
  finalCtaHeadline?: string;
  finalCtaBody?: string;
  finalCtaLabel?: string;
  /** slug del formulario referenciado; tiene prioridad sobre finalCtaUrl */
  finalCtaForm?: string;
  finalCtaUrl?: string;
};

export type ImpactSettings = {
  impactEnabled: boolean;
  impactKg?: number;
  impactUpdatedAt?: string;
  impactMethodology?: string;
  impactMethodologyUrl?: string;
};

export type NavLink = {
  label: string;
  url: string;
};

export type SiteSettings = {
  siteTitle: string;
  logo?: SanityImage;
  languages: { code: "es" | "ca" | "en"; label: string; enabled: boolean }[];
  showLanguageSwitcher: boolean;
  navigation: NavLink[];
  address?: string;
  email?: string;
  phone?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  footerMessage?: string;
  footerLinks: NavLink[];
  legalLinks: NavLink[];
};

/** ---------- Objetos reutilizables V2 ---------- */

/**
 * Objeto de media "V2" (sanity/schemaTypes/objects/media.ts), más
 * completo que MediaField: soporta variantes de móvil, poster y
 * control de autoplay/loop. Nuevo, no sustituye a MediaField (que
 * sigue usándose en heroMedia/contentBlocks ya publicados).
 */
export type Media = {
  mediaType: "image" | "uploadedVideo" | "externalVideo";
  image?: SanityImage;
  videoUrl?: string;
  externalVideoUrl?: string;
  poster?: SanityImage;
  mobileImage?: SanityImage;
  mobileVideoUrl?: string;
  caption?: string;
  autoplay?: boolean;
  loop?: boolean;
};

export type FeatureItem = {
  _type: "featureItem";
  eyebrow?: string;
  title: string;
  body?: string;
  media?: Media;
  ctaLabel?: string;
  ctaUrl?: string;
};

export type TimelineItem = {
  _type: "timelineItem";
  label?: string;
  title: string;
  body?: string;
  media?: Media;
};

export type SpaceItem = {
  media: Media;
  caption?: string;
};

export type Stat = {
  value: string;
  label: string;
  note?: string;
};

export type Cta = {
  label: string;
  actionType: "url" | "form";
  url?: string;
  /** slug del formulario referenciado, cuando actionType es "form" */
  form?: string;
};

export type RelatedExperience = {
  door: DoorId;
  note?: string;
};

/** ---------- Sistema de formularios V2 ---------- */

export type FormOption = {
  value: string;
  label: string;
  description?: string;
  media?: Media;
};

export type FormQuestionType =
  | "shortText"
  | "longText"
  | "email"
  | "phone"
  | "number"
  | "date"
  | "select"
  | "multiSelect"
  | "singleChoice"
  | "checkbox"
  | "yesNo"
  | "peopleCount"
  | "optionCards";

export type FormQuestionConditionalLogic = {
  dependsOnQuestionId?: string;
  condition?: "equals" | "notEquals";
  value?: string;
};

export type FormQuestion = {
  /** id estable, se usa como clave en answersJson al enviar */
  id: string;
  type: FormQuestionType;
  label: string;
  helpText?: string;
  placeholder?: string;
  required: boolean;
  options?: FormOption[];
  step?: number;
  width?: "full" | "half";
  conditionalLogic?: FormQuestionConditionalLogic;
};

export type FormDoc = {
  slug: string;
  title: string;
  internalName?: string;
  active: boolean;
  introTitle?: string;
  introText?: string;
  successTitle?: string;
  successText?: string;
  submitLabel: string;
  questions: FormQuestion[];
  seo?: SeoFields;
};

/** ---------- Eventos (Family Days) V2 ---------- */

export type EventStatus = "upcoming" | "open" | "full" | "closed" | "past";

export type EventScheduleItem = {
  time: string;
  activity: string;
};

export type Event = {
  slug: string;
  title: string;
  type: "familyDay";
  date: string;
  startTime?: string;
  endTime?: string;
  status: EventStatus;
  priceText?: string;
  shortDescription?: string;
  media?: Media;
  mobileMedia?: Media;
  schedule: EventScheduleItem[];
  /** slug del formulario de inscripción de este evento */
  registrationForm?: string;
  registrationOpen: boolean;
  capacity?: number;
  featured: boolean;
  seo?: SeoFields;
};

/** ---------- Galería V2 ---------- */

export type GalleryCategory = "finca" | "empresas" | "eventos" | "estancias" | "comunidad" | "pickleball";

export type GalleryItem = {
  title?: string;
  media: Media;
  category: GalleryCategory;
  caption?: string;
  featured: boolean;
  order?: number;
};
