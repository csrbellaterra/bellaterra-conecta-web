import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";

import Container from "@/components/ui/Container";
import FormRenderer from "@/components/forms/FormRenderer";
import { getForm } from "@/lib/content";

/**
 * Cada formulario V2 es accesible en su propia URL, además de poder
 * abrirse como modal/panel desde cualquier CTA (ver objects/cta.ts).
 * Esto permite compartir el enlace directo de un formulario concreto
 * (ej. /solicitud/family-day-17-octubre) por email, redes o el propio
 * flyer de un Family Day.
 */

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const form = await getForm(params.slug);
  if (!form) return {};
  return {
    title: form.seo?.title || form.title,
    description: form.seo?.description || form.introText,
  };
}

export default async function SolicitudPage({ params }: { params: { slug: string } }) {
  const { isEnabled: preview } = draftMode();
  const form = await getForm(params.slug, preview);
  if (!form || form.active === false) notFound();

  return (
    <Container as="section" className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl">
        {form.introTitle && <h1 className="font-serif text-3xl text-ink sm:text-4xl">{form.introTitle}</h1>}
        {form.introText && <p className="mt-4 text-muted">{form.introText}</p>}
        <div className="mt-10">
          <FormRenderer form={form} pageSource={`/solicitud/${params.slug}`} />
        </div>
      </div>
    </Container>
  );
}
