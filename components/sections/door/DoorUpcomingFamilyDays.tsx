import Link from "next/link";
import type { Event } from "@/types/content";
import Container from "@/components/ui/Container";
import Media from "@/components/ui/Media";
import AnimatedIn from "@/components/ui/AnimatedIn";
import { mediaFieldFromV2 } from "@/lib/media";

/**
 * "Próximos Family Days" — usada por Comunidad (Fase 4A) y Pickleball
 * (Fase 4B). Es la excepción a la regla "no cards por defecto" de
 * CLAUDE.md: son elementos funcionales/eventos, no storytelling.
 *
 * Lee los `event` de tipo "familyDay" con fecha >= hoy directamente de
 * Sanity (lib/content.ts → getUpcomingEvents), pasados aquí ya
 * resueltos desde la page.tsx correspondiente. Cada tarjeta enlaza al
 * formulario de inscripción de ese Family Day (event.registrationForm)
 * con la fecha ya preseleccionada — el usuario no debe tener que
 * volver a elegirla. El id, el título y la fecha del evento también
 * viajan en la URL (eventId/eventTitle/eventDate) para que
 * FormRenderer los incluya en el envío como metadata de seguimiento,
 * sin necesidad de crear preguntas nuevas en el formulario — ver
 * components/forms/FormRenderer.tsx.
 */
const DATE_FORMATTER = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" });

function formatDate(isoDate: string): string {
  try {
    return DATE_FORMATTER.format(new Date(`${isoDate}T00:00:00`));
  } catch {
    return isoDate;
  }
}

export default function DoorUpcomingFamilyDays({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return (
      <section className="bg-surface py-16 sm:py-24 lg:py-28">
        <Container>
          <AnimatedIn>
            <h2 className="max-w-lg font-serif text-3xl text-text sm:text-4xl">Próximos Family Days</h2>
            <p className="mt-4 max-w-md font-sans text-base text-muted">
              Estamos preparando el calendario. Anunciaremos las próximas fechas muy pronto.
            </p>
          </AnimatedIn>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-surface py-16 sm:py-24 lg:py-28">
      <Container>
        <AnimatedIn>
          <h2 className="max-w-lg font-serif text-3xl text-text sm:text-4xl">Próximos Family Days</h2>
        </AnimatedIn>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => {
            const dateLabel = formatDate(event.date);
            const scheduleSummary = event.schedule
              .slice(0, 2)
              .map((item) => item.activity)
              .join(" · ");
            const formSlug = event.registrationForm || "family-day";
            const params = new URLSearchParams({
              fecha_family_day: dateLabel,
              eventId: event.slug,
              eventTitle: event.title,
              eventDate: event.date,
            });
            const href = `/solicitud/${formSlug}?${params.toString()}`;

            return (
              <AnimatedIn
                key={event.slug}
                delay={index * 0.06}
                className="flex flex-col overflow-hidden rounded-card bg-background"
              >
                {event.media ? (
                  <div className="relative aspect-[4/3] w-full">
                    <Media media={mediaFieldFromV2(event.media)} alt={event.title} sizes="(min-width: 1024px) 30vw, 100vw" />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <span className="font-sans text-xs uppercase tracking-[0.2em] text-olive">{dateLabel}</span>
                  <h3 className="font-serif text-xl text-text">{event.title}</h3>
                  {scheduleSummary ? <p className="font-sans text-sm text-muted">{scheduleSummary}</p> : null}
                  {event.priceText ? <p className="font-sans text-sm text-muted">{event.priceText}</p> : null}
                  <Link
                    href={href}
                    className="mt-3 inline-flex w-fit items-center gap-2 font-sans text-sm font-medium text-text underline decoration-olive decoration-2 underline-offset-4 transition-colors hover:text-olive"
                  >
                    Apúntate <span aria-hidden>→</span>
                  </Link>
                </div>
              </AnimatedIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
