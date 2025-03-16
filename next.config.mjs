/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**", // Barcha HTTP domenlarga ruxsat
      },
      {
        protocol: "https",
        hostname: "**", // Barcha HTTPS domenlarga ruxsat
      },
    ],
  },
};

export default nextConfig;
