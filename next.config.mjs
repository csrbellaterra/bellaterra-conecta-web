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
};

export default nextConfig;
