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
  async redirects() {
    return [
      // V2: "La finca" pasa a llamarse "Nuestra Historia". Redirect
      // permanente para no romper enlaces antiguos (compartidos,
      // indexados en buscadores, etc.).
      {
        source: "/la-finca",
        destination: "/nuestra-historia",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
