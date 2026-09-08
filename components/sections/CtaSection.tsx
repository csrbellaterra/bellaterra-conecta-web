import Link from "next/link";
import type { CtaBlock } from "@/types/content";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";

export default function CtaSection({ block }: { block: CtaBlock }) {
  return (
    <section className="bg-surface py-20 sm:py-24">
      <Container className="flex flex-col items-center gap-6 text-center">
        <AnimatedIn className="flex flex-col items-center gap-6">
          <h2 className="max-w-xl font-serif text-3xl text-text sm:text-4xl">{block.heading}</h2>
          <Link
            href={block.ctaUrl}
            className="inline-flex items-center gap-2 rounded-pill bg-olive px-7 py-3 font-sans text-sm font-medium tracking-wide text-white transition-colors hover:bg-olive-dark"
          >
            {block.ctaLabel} <span aria-hidden>→</span>
          </Link>
        </AnimatedIn>
      </Container>
    </section>
  );
}
