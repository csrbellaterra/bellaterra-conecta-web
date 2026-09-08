import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Política de privacidad",
};

/**
 * Contenido pendiente de redacción legal definitiva. NO se inventa
 * texto legal aquí — este marcador deja claro que hay que
 * sustituirlo antes de publicar la web en producción. Ver
 * EDITOR_GUIDE.md, sección "Páginas legales".
 */
export default function PrivacidadPage() {
  return (
    <>
      <Header variant="solid" />
      <main className="min-h-[50vh] pb-24 pt-32 sm:pt-40">
        <Container className="mx-auto max-w-2xl">
          <h1 className="mb-6 font-serif text-3xl text-text sm:text-4xl">Política de privacidad</h1>
          <p className="font-sans text-base leading-relaxed text-muted">
            Este texto está pendiente de redacción legal definitiva. Sustitúyelo por el contenido
            revisado por vuestra asesoría antes de publicar la web en producción.
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
