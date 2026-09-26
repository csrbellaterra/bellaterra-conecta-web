/**
 * Consultas GROQ. Se usan solo cuando isSanityConfigured === true (ver
 * lib/content.ts). La forma de los datos que devuelven debe coincidir
 * con types/content.ts y con lib/sanity/seed-data.ts, para que el
 * resto de la app no tenga que saber de dónde viene el contenido.
 *
 * Proyectan explícitamente los campos de imagen a { url, alt, hotspot }
 * usando el helper de GROQ para asset->url, en vez de devolver la
 * referencia cruda, para no acoplar los componentes a la forma nativa
 * de Sanity.
 */

const imageProjection = `{
  "url": asset->url,
  "alt": coalesce(alt, ""),
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  hotspot { "x": hotspot.x * 100, "y": hotspot.y * 100 }
}`;

const mediaProjection = `{
  type,
  "image": image ${imageProjection},
  "videoUrl": video.asset->url,
  externalVideoUrl,
  "poster": poster ${imageProjection},
  "mobileImage": mobileImage ${imageProjection},
  "mobileVideoUrl": mobileVideo.asset->url,
  autoplay,
  loop
}`;

const seoProjection = `{
  title,
  description,
  "ogImage": ogImage ${imageProjection}
}`;

const blockProjection = `{
  _type,
  eyebrow,
  heading,
  headline,
  subheading,
  subtitle,
  title,
  location,
  body,
  ctaLabel,
  ctaUrl,
  imageSide,
  doorId,
  caption,
  overlayText,
  "media": media ${mediaProjection},
  "images": images[] ${imageProjection}
}`;

const plastyProjection = `{
  label,
  amountEur,
  kg,
  note
}`;

/**
 * Proyección del objeto "media" V2 (sanity/schemaTypes/objects/media.ts),
 * más completo que mediaProjection (que sigue usándose para el campo
 * mediaField original ya publicado). Se usa en todo el contenido
 * nuevo de la V2: event, galleryItem, featureItem, timelineItem, etc.
 */
const media2Projection = `{
  mediaType,
  "image": image ${imageProjection},
  "videoUrl": videoFile.asset->url,
  externalVideoUrl,
  "poster": poster ${imageProjection},
  "mobileImage": mobileImage ${imageProjection},
  "mobileVideoUrl": mobileVideo.asset->url,
  caption,
  autoplay,
  loop
}`;

const featureItemProjection = `{
  _type,
  eyebrow,
  title,
  body,
  "media": media ${media2Projection},
  ctaLabel,
  ctaUrl
}`;

const timelineItemProjection = `{
  _type,
  label,
  title,
  body,
  "media": media ${media2Projection}
}`;

const spaceItemProjection = `{
  "media": media ${media2Projection},
  caption
}`;

const relatedExperienceProjection = `{
  "door": door->slug.current,
  note
}`;

const formOptionProjection = `{
  value,
  label,
  description,
  "media": media ${media2Projection}
}`;

const formQuestionProjection = `{
  id,
  type,
  label,
  helpText,
  placeholder,
  required,
  "options": options[] ${formOptionProjection},
  step,
  width,
  conditionalLogic
}`;

export const doorFieldsProjection = `{
  "id": slug.current,
  "slug": slug.current,
  order,
  name,
  eyebrow,
  shortDescription,
  icon,
  "selectorImage": selectorImage ${imageProjection},
  "heroMedia": heroMedia ${mediaProjection},
  headline,
  introduction,
  "contentBlocks": contentBlocks[] ${blockProjection},
  "gallery": gallery[] ${imageProjection},
  ctaLabel,
  ctaUrl,
  "plastyContribution": plastyContribution ${plastyProjection},
  "seo": seo ${seoProjection},
  "heroMobileMedia": heroMobileMedia ${media2Projection},
  "featureSections": featureSections[]{
    _type == "featureItem" => ${featureItemProjection},
    _type == "timelineItem" => ${timelineItemProjection}
  },
  "spacesGallery": spacesGallery[] ${spaceItemProjection},
  "relatedExperiences": relatedExperiences[] ${relatedExperienceProjection},
  "primaryForm": primaryForm->slug.current,
  plastyContributionEnabled,
  plastyContributionText,
  homeEyebrow,
  homeHeadline,
  homeDescription,
  homeCtaLabel,
  "homeMedia": homeMedia ${media2Projection},
  heroEyebrow,
  heroHeadline,
  heroDescription,
  primaryCtaLabel,
  featuresTitle,
  timelineTitle,
  "timelineItems": timelineItems[] ${timelineItemProjection},
  spacesTitle,
  finalCtaHeadline,
  finalCtaBody,
  finalCtaLabel,
  "finalCtaForm": finalCtaForm->slug.current
}`;

export const allDoorsQuery = `
  *[_type == "door"] | order(order asc) ${doorFieldsProjection}
`;

export const doorBySlugQuery = `
  *[_type == "door" && slug.current == $slug][0] ${doorFieldsProjection}
`;

export const siteSettingsQuery = `
  *[_type == "siteSettings"][0]{
    siteTitle,
    "logo": logo ${imageProjection},
    languages,
    showLanguageSwitcher,
    navigation,
    address,
    email,
    phone,
    instagramUrl,
    linkedinUrl,
    footerMessage,
    footerLinks,
    legalLinks
  }
`;

export const impactSettingsQuery = `
  *[_type == "impact"][0]{
    impactEnabled,
    impactKg,
    impactUpdatedAt,
    impactMethodology,
    impactMethodologyUrl
  }
`;

export const homePageQuery = `
  *[_type == "homePage"][0]{
    "hero": hero ${blockProjection},
    selectorHeading,
    selectorSubheading,
    selectorIntroduction,
    connectionSection{
      heading,
      "media": media ${mediaProjection}
    },
    connectionEyebrow,
    connectionHeadline,
    "impactSection": impactSection ${blockProjection},
    plastyEyebrow,
    plastyHeadline,
    plastyBody,
    plastyCtaLabel,
    plastyCtaUrl,
    "footerCta": footerCta ${blockProjection},
    finalCtaEyebrow,
    finalCtaHeadline,
    finalCtaBody,
    finalCtaLabel,
    "finalCtaForm": finalCtaForm->slug.current,
    finalCtaUrl,
    "seo": seo ${seoProjection}
  }
`;

export const storyPageQuery = `
  *[_type == "storyPage"][0]{
    "heroMedia": heroMedia ${media2Projection},
    heroEyebrow,
    heroHeadline,
    heroDetail,
    originTitle,
    originBody,
    "originMedia": originMedia ${media2Projection},
    identityTitle,
    identityBody,
    "identityItems": identityItems[] ${timelineItemProjection},
    statement,
    "statementMedia": statementMedia ${media2Projection},
    futureTitle,
    futureBody,
    "futureMedia": futureMedia ${media2Projection},
    timelineEnabled,
    "timelineItems": timelineItems[] ${timelineItemProjection},
    finalCtaHeadline,
    finalCtaBody,
    finalCtaLabel,
    "finalCtaForm": finalCtaForm->slug.current,
    finalCtaUrl,
    "seo": seo ${seoProjection}
  }
`;

export const pageBySlugQuery = `
  *[_type == "page" && slug.current == $slug][0]{
    "slug": slug.current,
    title,
    "blocks": blocks[] ${blockProjection},
    "seo": seo ${seoProjection}
  }
`;

export const allPageSlugsQuery = `
  *[_type == "page" && defined(slug.current)][].slug.current
`;

/** ---------- Eventos (Family Days) V2 ---------- */

export const eventFieldsProjection = `{
  "slug": slug.current,
  title,
  type,
  date,
  startTime,
  endTime,
  status,
  priceText,
  shortDescription,
  "media": media ${media2Projection},
  "mobileMedia": mobileMedia ${media2Projection},
  schedule,
  "registrationForm": registrationForm->slug.current,
  registrationOpen,
  capacity,
  featured,
  "seo": seo ${seoProjection}
}`;

/** Próximos eventos (fecha >= hoy), ordenados por fecha ascendente. Pasa $type para filtrar por tipo (ej. "familyDay"), o null para todos. */
export const upcomingEventsQuery = `
  *[_type == "event" && date >= now() && (!defined($type) || type == $type)] | order(date asc) ${eventFieldsProjection}
`;

export const allEventsQuery = `
  *[_type == "event"] | order(date asc) ${eventFieldsProjection}
`;

export const eventBySlugQuery = `
  *[_type == "event" && slug.current == $slug][0] ${eventFieldsProjection}
`;

/** ---------- Formularios V2 ---------- */

export const formFieldsProjection = `{
  "slug": slug.current,
  title,
  internalName,
  active,
  introTitle,
  introText,
  successTitle,
  successText,
  submitLabel,
  "questions": questions[] ${formQuestionProjection},
  "seo": seo ${seoProjection}
}`;

export const formBySlugQuery = `
  *[_type == "form" && slug.current == $slug && active == true][0] ${formFieldsProjection}
`;

/** ---------- Galería V2 ---------- */

export const galleryItemFieldsProjection = `{
  title,
  "media": media ${media2Projection},
  category,
  caption,
  featured,
  order
}`;

/** Pasa $category para filtrar (ej. "empresas"), o null para todas las categorías. */
export const galleryItemsQuery = `
  *[_type == "galleryItem" && (!defined($category) || category == $category)] | order(order asc) ${galleryItemFieldsProjection}
`;
