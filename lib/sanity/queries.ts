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
  "poster": poster ${imageProjection}
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
  "seo": seo ${seoProjection}
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
    connectionSection{
      heading,
      "media": media ${mediaProjection}
    },
    "impactSection": impactSection ${blockProjection},
    "footerCta": footerCta ${blockProjection},
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
