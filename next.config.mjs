/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Comentado para permitir API routes
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
    ],
  },
};

export default nextConfig;
