import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getPage, getSiteSettings } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("contacto");
  return {
    title: page?.seo.title ?? "Contacto",
    description: page?.seo.description,
  };
}

/**
 * Página de contacto. Deliberadamente sin formulario que "envíe a
 * ningún sitio": mientras no haya un servicio de envío de correo
 * conectado (ver README.md, sección "Añadir un formulario real"),
 * mostramos los canales de contacto directos (email, Instagram,
 * dirección) para no simular una funcionalidad que no existe.
 */
export default async function ContactoPage() {
  const { isEnabled: preview } = draftMode();
  const [page, settings] = await Promise.all([getPage("contacto", preview), getSiteSettings(preview)]);

  return (
    <>
      <Header variant="solid" />
      <main className="min-h-[60vh] pb-24 pt-32 sm:pt-40">
        <Container>
          <AnimatedIn className="mx-auto flex max-w-2xl flex-col gap-6 text-center">
            <h1 className="font-serif text-4xl text-text sm:text-5xl">{page?.title ?? "Contacto"}</h1>
            <p className="font-sans text-lg text-muted">
              Cuéntanos qué puerta te interesa y te contestamos lo antes posible.
            </p>

            <div className="mx-auto mt-6 flex flex-col items-center gap-4">
              {settings.email ? (
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-center gap-2 rounded-pill bg-olive px-7 py-3 font-sans text-sm font-medium tracking-wide text-white transition-colors hover:bg-olive-dark"
                >
                  {settings.email}
                </a>
              ) : null}
              {settings.instagramUrl ? (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-sans text-sm text-muted underline underline-offset-4 hover:text-text"
                >
                  Síguenos en Instagram
                </a>
              ) : null}
              {settings.address ? <p className="font-sans text-sm text-muted">{settings.address}</p> : null}
            </div>
          </AnimatedIn>
        </Container>
      </main>
      <Footer />
    </>
  );
}
