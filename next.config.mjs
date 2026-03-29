/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dominios permitidos para next/image (remotePatterns es más seguro que domains)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      // Agrega aquí el bucket de Supabase Storage cuando lo configures:
      // { protocol: "https", hostname: "xxxxxxxxxxxxxxxxxxxx.supabase.co" },
    ],
  },

  // Headers de seguridad para producción
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        ],
      },
    ];
  },
};

export default nextConfig;

