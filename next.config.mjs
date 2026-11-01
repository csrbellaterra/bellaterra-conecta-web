/** @type {import('next').NextConfig} */
const nextConfig = {
  // Carpeta de compilación configurable (por defecto .next) para poder
  // ejecutar una verificación o un build sin pisar el .next de un
  // `next dev` en marcha: NEXT_DIST_DIR=.next-verify pnpm build
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  eslint: {
    // El linteo se ejecuta aparte con `pnpm lint`; no bloquea el build.
    ignoreDuringBuilds: false,
  },
  // V2: /nuestra-historia ya existe como página funcional (Fase 4B,
  // StoryPageTemplate) y verificada — /la-finca (documento `page`
  // antiguo, sin tocar) redirige de forma permanente a la nueva URL.
  async redirects() {
    return [
      {
        source: "/la-finca",
        destination: "/nuestra-historia",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
