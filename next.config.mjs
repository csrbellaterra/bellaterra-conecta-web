/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // V2 — Fase 4B: /nuestra-historia ya existe como página funcional,
  // pero el redirect /la-finca -> /nuestra-historia sigue
  // DELIBERADAMENTE desactivado hasta que llegue una instrucción
  // explícita de activarlo. /la-finca sigue funcionando con su
  // contenido actual (documento `page`, sin tocar) mientras tanto.
  // Para reactivar, descomentar el bloque redirects() de abajo:
  //
  // async redirects() {
  //   return [
  //     {
  //       source: "/la-finca",
  //       destination: "/nuestra-historia",
  //       permanent: true,
  //     },
  //   ];
  // },
};

export default nextConfig;
