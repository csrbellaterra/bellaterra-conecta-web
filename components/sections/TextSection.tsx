import type { TextBlock } from "@/types/content";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";

export default function TextSection({ block }: { block: TextBlock }) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <AnimatedIn className="mx-auto flex max-w-2xl flex-col gap-4">
          {block.eyebrow ? (
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-olive">{block.eyebrow}</span>
          ) : null}
          {block.heading ? <h2 className="font-serif text-3xl text-text sm:text-4xl">{block.heading}</h2> : null}
          <p className="whitespace-pre-line font-sans text-base leading-relaxed text-muted">{block.body}</p>
        </AnimatedIn>
      </Container>
    </section>
  );
}
