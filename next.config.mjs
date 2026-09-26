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
  // V2: el redirect /la-finca -> /nuestra-historia se retira
  // TEMPORALMENTE — /nuestra-historia todavía no existe como página
  // (se construye en Fase 4) y con el redirect activo /la-finca daba
  // 404. /la-finca sigue funcionando con su contenido actual mientras
  // tanto. Cuando Nuestra Historia esté lista, se reactiva este
  // redirect (ver next.config.mjs.bak más abajo si se prefiere
  // recuperar el bloque exacto):
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
