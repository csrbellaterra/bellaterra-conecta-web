import type { FullWidthMediaBlock } from "@/types/content";
import Media from "@/components/ui/Media";
import AnimatedIn from "@/components/ui/AnimatedIn";

export default function FullWidthMediaSection({ block }: { block: FullWidthMediaBlock }) {
  return (
    <section className="relative w-full">
      <AnimatedIn className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[21/9]">
        <Media media={block.media} sizes="100vw" />
        {block.overlayText ? (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/30">
            <p className="max-w-2xl px-6 text-center font-serif text-2xl text-white sm:text-4xl">
              {block.overlayText}
            </p>
          </div>
        ) : null}
      </AnimatedIn>
      {block.caption ? (
        <p className="mx-auto max-w-content px-5 py-3 font-sans text-xs text-muted sm:px-8 lg:px-12">
          {block.caption}
        </p>
      ) : null}
    </section>
  );
}
