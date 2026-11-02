import { getImageProps } from "next/image";
import { PORTRAIT_MEDIA, type IntroScene } from "@/lib/cinematic";

/**
 * Foto a sangre de una escena (escritorio y recorte vertical), común a la
 * introducción animada, su versión estática y la portada editorial.
 *
 * Las fotos de código llevan srcset de derivados estáticos (sin optimizador
 * de Next); las de Sanity pasan por next/image. Si la escena trae marcador,
 * se pinta debajo una miniatura difuminada inline, de modo que la portada
 * nunca se ve negra mientras llega la foto real.
 */
export default function ScenePicture({ scene, priority }: { scene: IntroScene; priority?: boolean }) {
  const alt = scene.image.alt;
  const loading = priority ? ("eager" as const) : ("lazy" as const);
  const { desktop, mobile } = scene.srcSet
    ? {
        desktop: { src: scene.image.url, srcSet: scene.srcSet.desktop, sizes: "100vw" },
        mobile: scene.srcSet.mobile ? { srcSet: scene.srcSet.mobile, sizes: "100vw" } : null,
      }
    : nextImageSources(scene, loading);

  return (
    <>
      {scene.placeholder ? (
        <picture aria-hidden>
          {scene.placeholder.mobile ? <source media={PORTRAIT_MEDIA} srcSet={scene.placeholder.mobile} /> : null}
          <img src={scene.placeholder.desktop} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl" />
        </picture>
      ) : null}
      <picture>
        {mobile ? <source media={PORTRAIT_MEDIA} srcSet={mobile.srcSet} sizes={mobile.sizes} /> : null}
        <img
          src={desktop.src}
          srcSet={desktop.srcSet}
          sizes={desktop.sizes}
          alt={alt}
          loading={loading}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>
    </>
  );
}

function nextImageSources(scene: IntroScene, loading: "eager" | "lazy") {
  const common = { alt: scene.image.alt, fill: true, sizes: "100vw", loading } as const;
  const { props } = getImageProps({ ...common, src: scene.image.url });
  const mobile = scene.mobileImage ? getImageProps({ ...common, src: scene.mobileImage.url }).props : null;
  return {
    desktop: { src: props.src, srcSet: props.srcSet, sizes: props.sizes },
    mobile: mobile ? { srcSet: mobile.srcSet ?? mobile.src, sizes: mobile.sizes } : null,
  };
}
