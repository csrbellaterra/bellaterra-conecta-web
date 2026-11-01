import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedIn from "@/components/ui/AnimatedIn";

export const metadata: Metadata = {
  title: "Reservar pista",
  description:
    "La reserva online de pistas de pickleball en Bellaterra Conecta estará disponible próximamente. Mientras tanto, puedes pedirnos información.",
};

/**
 * /reservar-pista (V2) — página provisional y honesta mientras no
 * exista el sistema de reservas: sin calendarios, precios ni
 * confirmaciones simuladas. Solo explica que llegará y ofrece pedir
 * información por el formulario existente (/solicitud/pickleball →
 * Airtable) o por contacto general. /pickleball se conserva aparte.
 */
export default function ReservarPistaPage() {
  return (
    <>
      <Header variant="solid" />
      <main className="bg-background">
        <section className="mx-auto grid w-full max-w-content grid-cols-1 gap-10 px-5 pb-20 pt-10 sm:px-8 sm:pt-14 lg:grid-cols-12 lg:gap-14 lg:px-12 lg:pb-28 lg:pt-20">
          <AnimatedIn className="relative aspect-[4/3] w-full overflow-hidden bg-ink lg:col-span-7 lg:aspect-auto lg:min-h-[560px]">
            <Image
              src="/images/reservar-pista/pistas.jpg"
              alt="Pistas de pickleball de la finca, entre pinos y con vistas a las colinas"
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
          </AnimatedIn>

          <AnimatedIn delay={0.1} className="flex flex-col justify-center gap-6 lg:col-span-5">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-olive">Reservar pista</span>
            <h1 className="font-serif text-4xl leading-[1.05] text-text sm:text-5xl lg:text-[3.5rem]">
              Muy pronto podrás reservar tu pista online.
            </h1>
            <p className="max-w-md font-sans text-base leading-relaxed text-muted">
              Estamos preparando el sistema de reservas de las pistas de pickleball de Bellaterra Conecta. Todavía no
              está operativo, así que por ahora no es posible reservar ni consultar disponibilidad desde la web.
            </p>
            <p className="max-w-md font-sans text-base leading-relaxed text-muted">
              Si quieres jugar, organizar una actividad para un grupo o que te avisemos cuando abramos las reservas,
              escríbenos y te responderemos personalmente.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href="/solicitud/pickleball" className="btn-primary">
                Solicitar información <span aria-hidden>→</span>
              </Link>
              <Link href="/contacto" className="link-editorial">
                Otras formas de contacto
              </Link>
            </div>
          </AnimatedIn>
        </section>
      </main>
      <Footer />
    </>
  );
}
