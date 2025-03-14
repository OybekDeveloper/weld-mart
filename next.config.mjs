// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ["https://fakestoreapi.com"],
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "fakestoreapi.com",
//       },
//       {
//         protocol: "https",
//         hostname: "cdn.dummyjson.com",
//       },
//       {
//         protocol: "https",
//         hostname: "example.com",
//       },
//       {
//         protocol: "https",
//         hostname: "weldmart-server.onrender.com",
//       },
//       {
//         protocol: "http",
//         hostname: "127.0.0.1",
//       },
//     ],
//   },
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
