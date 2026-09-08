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
  selectorSubheading: string;
  connectionSection: {
    heading: string;
    media: MediaField;
  };
  impactSection: ImpactBlock;
  footerCta?: CtaBlock;
  seo: SeoFields;
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
