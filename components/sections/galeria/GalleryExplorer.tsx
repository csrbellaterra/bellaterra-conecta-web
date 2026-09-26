"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { GalleryCategory, GalleryItem } from "@/types/content";
import Container from "@/components/ui/Container";
import Media from "@/components/ui/Media";
import { mediaFieldFromV2 } from "@/lib/media";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  finca: "La finca",
  empresas: "Empresas",
  eventos: "Eventos",
  estancias: "Estancias",
  comunidad: "Comunidad",
  pickleball: "Pickleball",
};

const CATEGORY_ORDER: GalleryCategory[] = ["finca", "empresas", "eventos", "estancias", "comunidad", "pickleball"];

type FilterValue = "todos" | GalleryCategory;

/**
 * /galeria (Fase 5) — filtros + masonry + lightbox, todo en un único
 * componente cliente porque comparten estado (categoría activa,
 * elemento abierto en el lightbox). Los elementos se piden UNA vez en
 * el servidor (ver app/galeria/page.tsx, getGalleryItems() sin
 * categoría) y el filtrado ocurre aquí, en el navegador — evita
 * refetch en cada clic de filtro.
 *
 * Aquí SÍ tiene sentido un masonry (a diferencia del resto del sitio,
 * ver CLAUDE.md): la Galería es un archivo fotográfico, no
 * storytelling. Cada foto se muestra sin marco de card, con columnas
 * CSS nativas (sin librería de masonry).
 *
 * Solo se muestran como filtro las categorías que tienen al menos un
 * elemento publicado — nunca un filtro roto que lleve a una galería
 * vacía.
 */
export default function GalleryExplorer({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<FilterValue>("todos");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const availableCategories = useMemo(() => {
    const present = new Set(items.map((item) => item.category));
    return CATEGORY_ORDER.filter((category) => present.has(category));
  }, [items]);

  const filteredItems = useMemo(
    () => (filter === "todos" ? items : items.filter((item) => item.category === filter)),
    [items, filter]
  );

  useEffect(() => {
    // Si cambia el filtro con el lightbox abierto, ciérralo: los
    // índices ya no coinciden con la lista visible.
    setLightboxIndex(null);
  }, [filter]);

  if (items.length === 0) {
    return (
      <Container className="pb-24">
        <p className="font-sans text-base text-muted">Todavía no hay fotografías publicadas en la galería.</p>
      </Container>
    );
  }

  return (
    <>
      <Container className="pb-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar galería por categoría">
          <FilterButton active={filter === "todos"} onClick={() => setFilter("todos")}>
            Todos
          </FilterButton>
          {availableCategories.map((category) => (
            <FilterButton key={category} active={filter === category} onClick={() => setFilter(category)}>
              {CATEGORY_LABELS[category]}
            </FilterButton>
          ))}
        </div>
      </Container>

      <Container className="pb-24">
        {filteredItems.length === 0 ? (
          <p className="font-sans text-base text-muted">No hay fotografías todavía en esta categoría.</p>
        ) : (
          <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
            {filteredItems.map((item, index) => {
              const mediaField = mediaFieldFromV2(item.media);
              const width = item.media.image?.width;
              const height = item.media.image?.height;
              const aspectRatio = width && height ? width / height : 4 / 5;

              return (
                <button
                  key={`${item.category}-${item.title ?? index}-${index}`}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="relative mb-3 block w-full overflow-hidden bg-surface transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive sm:mb-4"
                  style={{ aspectRatio }}
                  aria-label={item.title ? `Ver ${item.title} en grande` : "Ver fotografía en grande"}
                >
                  <Media media={mediaField} alt={item.title ?? item.caption ?? ""} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" />
                </button>
              );
            })}
          </div>
        )}
      </Container>

      {lightboxIndex !== null ? (
        <GalleryLightbox
          items={filteredItems}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      ) : null}
    </>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-pill border px-4 py-2 font-sans text-xs uppercase tracking-[0.15em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive",
        active ? "border-olive bg-olive text-white" : "border-border text-muted hover:border-olive hover:text-text"
      )}
    >
      {children}
    </button>
  );
}

function GalleryLightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const item = items[index];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onNavigate((index + 1) % items.length);
      if (event.key === "ArrowLeft") onNavigate((index - 1 + items.length) % items.length);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, items.length, onClose, onNavigate]);

  if (!item) return null;

  const mediaField = mediaFieldFromV2(item.media);
  const isVideo = mediaField.type === "video" || mediaField.type === "externalVideo";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title || "Fotografía de la galería"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4 sm:p-8"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        autoFocus
        aria-label="Cerrar"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:right-6 sm:top-6"
      >
        ✕
      </button>

      {items.length > 1 ? (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onNavigate((index - 1 + items.length) % items.length);
            }}
            aria-label="Fotografía anterior"
            className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:left-6"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onNavigate((index + 1) % items.length);
            }}
            aria-label="Fotografía siguiente"
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:right-6"
          >
            ›
          </button>
        </>
      ) : null}

      <div
        className="flex max-h-full max-w-4xl flex-col items-center gap-3"
        onClick={(event) => event.stopPropagation()}
      >
        {isVideo && (mediaField.videoUrl || mediaField.externalVideoUrl) ? (
          <video
            src={mediaField.videoUrl || mediaField.externalVideoUrl}
            controls
            autoPlay
            className="max-h-[80vh] max-w-full"
          />
        ) : mediaField.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaField.image.url}
            alt={item.title || item.caption || ""}
            className="max-h-[80vh] max-w-full object-contain"
          />
        ) : null}
        {item.caption ? <p className="max-w-xl text-center font-sans text-sm text-white/80">{item.caption}</p> : null}
      </div>
    </div>
  );
}
