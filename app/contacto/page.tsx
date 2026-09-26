import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getContactPage, getPage, getSiteSettings } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactIntentRouter from "@/components/sections/contacto/ContactIntentRouter";
import ContactDetails from "@/components/sections/contacto/ContactDetails";
import { CONTACT_HERO_HEADLINE } from "@/lib/contactCopy";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("contacto");
  return {
    title: page?.seo.title ?? "Contacto — Bellaterra Conecta",
    description: page?.seo.description ?? CONTACT_HERO_HEADLINE,
  };
}

/**
 * /contacto (Fase 5) — router de intención: opciones grandes llevan
 * directamente al formulario de /solicitud/[slug] que corresponde, en
 * vez de un formulario genérico de nombre/email/mensaje. Copy y
 * opciones editables desde Sanity (documento `contactPage`, ver
 * lib/content.ts → getContactPage), con fallback a
 * lib/contactCopy.ts. Los datos de contacto directos (email,
 * Instagram, dirección, mapa) quedan como bloque secundario, no como
 * protagonista (ver ContactDetails).
 */
export default async function ContactoPage() {
  const { isEnabled: preview } = draftMode();
  const [page, settings, contact] = await Promise.all([
    getPage("contacto", preview),
    getSiteSettings(preview),
    getContactPage(preview),
  ]);

  return (
    <>
      <Header variant="solid" />
      <main>
        <ContactIntentRouter contact={contact} legacyTitle={page?.title} />
        <ContactDetails contact={contact} settings={settings} />
      </main>
      <Footer />
    </>
  );
}
