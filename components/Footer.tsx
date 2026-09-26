import Link from "next/link";
import { getSiteSettings } from "@/lib/content";
import Container from "@/components/ui/Container";

/**
 * Pie de página minimalista, tal y como pide la maqueta: el mensaje
 * de despedida ("Nos vemos en Bellaterra.") como elemento principal,
 * sin bloque corporativo pesado.
 */
export default async function Footer() {
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="flex flex-col gap-12 py-16 sm:py-20">
        <p className="max-w-lg font-serif text-3xl leading-tight text-text sm:text-4xl">{settings.footerMessage}</p>

        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between sm:gap-16">
          <div className="flex flex-col gap-1.5">
            {settings.address ? <p className="font-sans text-sm text-muted">{settings.address}</p> : null}
            {settings.email ? (
              <a href={`mailto:${settings.email}`} className="font-sans text-sm text-muted transition-colors hover:text-text">
                {settings.email}
              </a>
            ) : null}
          </div>

          <nav aria-label="Enlaces del pie de página">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2.5 sm:flex sm:flex-wrap sm:gap-x-7 sm:gap-y-2">
              {settings.footerLinks.map((link) => (
                <li key={link.url}>
                  <Link href={link.url} className="font-sans text-sm text-muted transition-colors hover:text-text">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col-reverse gap-4 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-xs text-muted">
            © {year} {settings.siteTitle}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {settings.legalLinks.map((link) => (
              <li key={link.url}>
                <Link href={link.url} className="font-sans text-xs text-muted transition-colors hover:text-text">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
