import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";

import Container from "@/components/ui/Container";
import FormRenderer from "@/components/forms/FormRenderer";
import { getEvent, getForm, getUpcomingEvents } from "@/lib/content";

/**
 * Cada formulario V2 es accesible en su propia URL, además de poder
 * abrirse como modal/panel desde cualquier CTA (ver objects/cta.ts).
 * Esto permite compartir el enlace directo de un formulario concreto
 * (ej. /solicitud/family-day-17-octubre) por email, redes o el propio
 * flyer de un Family Day.
 *
 * Fase 6: esta página resuelve server-side todo lo que antes
 * dependía de que el propio navegador leyera la URL dentro de
 * FormRenderer — el origen del CTA (?ctaSource=) y, para
 * /solicitud/family-day, el evento al que el usuario se apunta
 * (?eventId=, que por convención es el slug del evento — ver
 * components/sections/door/DoorUpcomingFamilyDays.tsx). Si no llega
 * ningún eventId, se resuelven los próximos Family Days publicados
 * para que el usuario elija uno explícitamente — nunca un campo de
 * texto libre como fuente principal de identificación del evento.
 */

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const form = await getForm(params.slug);
  if (!form) return {};
  return {
    title: form.seo?.title || form.title,
    description: form.seo?.description || form.introText,
  };
}

export default async function SolicitudPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { isEnabled: preview } = draftMode();
  const form = await getForm(params.slug, preview);
  if (!form || form.active === false) notFound();

  const ctaSource = typeof searchParams.ctaSource === "string" ? searchParams.ctaSource : undefined;
  const eventId = typeof searchParams.eventId === "string" ? searchParams.eventId : undefined;

  let familyDayPreselected: { id: string; title: string; date: string } | null = null;
  let familyDayUpcoming: Awaited<ReturnType<typeof getUpcomingEvents>> | undefined;

  if (params.slug === "family-day") {
    if (eventId) {
      // eventId es en realidad el slug del evento (ver convención en
      // DoorUpcomingFamilyDays) — se resuelve al evento real para no
      // confiar en el título/fecha que pudieran venir sueltos en la URL.
      const event = await getEvent(eventId, preview);
      if (event) familyDayPreselected = { id: event.slug, title: event.title, date: event.date };
    }
    if (!familyDayPreselected) {
      familyDayUpcoming = await getUpcomingEvents("familyDay", preview);
    }
  }

  return (
    <Container as="section" className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl">
        {form.introTitle && <h1 className="font-serif text-3xl text-ink sm:text-4xl">{form.introTitle}</h1>}
        {form.introText && <p className="mt-4 text-muted">{form.introText}</p>}
        <div className="mt-10">
          <FormRenderer
            form={form}
            pageSource={`/solicitud/${params.slug}`}
            ctaSource={ctaSource}
            familyDayPreselected={familyDayPreselected}
            familyDayUpcoming={familyDayUpcoming}
          />
        </div>
      </div>
    </Container>
  );
}
