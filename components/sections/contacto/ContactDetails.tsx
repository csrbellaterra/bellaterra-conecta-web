import type { ContactPage, SiteSettings } from "@/types/content";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";

/**
 * Datos de contacto secundarios — deliberadamente por debajo del
 * router de intención y con menos peso visual: aquí NO son el
 * protagonista de la página (a diferencia del /contacto antiguo, que
 * era solo esto).
 *
 * Prioridad campo a campo: contactPage.email/instagramUrl/locationText
 * (Sanity) → siteSettings.email/instagramUrl/address (ya existente,
 * usado en el resto del sitio) → nada (el bloque correspondiente no
 * se muestra). mapsUrl es enteramente nuevo: solo viene de
 * contactPage, no existía ningún campo equivalente antes.
 */
export default function ContactDetails({ contact, settings }: { contact: ContactPage; settings: SiteSettings }) {
  const email = contact.email || settings.email;
  const instagramUrl = contact.instagramUrl || settings.instagramUrl;
  const address = contact.locationText || settings.address;
  const mapsUrl = contact.mapsUrl;

  if (!address && !email && !instagramUrl && !mapsUrl) return null;

  return (
    <section className="border-t border-border bg-surface py-14 sm:py-16">
      <Container>
        <AnimatedIn className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-10 sm:gap-y-3">
          {email ? (
            <a href={`mailto:${email}`} className="font-sans text-sm text-muted hover:text-text">
              {email}
            </a>
          ) : null}
          {instagramUrl ? (
            <a href={instagramUrl} target="_blank" rel="noreferrer" className="font-sans text-sm text-muted hover:text-text">
              Instagram
            </a>
          ) : null}
          {address ? <span className="font-sans text-sm text-muted">{address}</span> : null}
          {mapsUrl ? (
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="font-sans text-sm text-muted hover:text-text">
              Cómo llegar
            </a>
          ) : null}
        </AnimatedIn>
      </Container>
    </section>
  );
}
