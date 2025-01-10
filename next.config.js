/** @type {import('next').NextConfig} */
const nextConfig = {
output: 'standalone',
outputFileTracing: true,
experimental: {
    outputStandalone: true,
},
distDir: '.next',
eslint: {
    ignoreDuringBuilds: true,
},
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
