/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.deutscherversandservice.de",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
