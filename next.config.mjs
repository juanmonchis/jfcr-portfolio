/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/jfcr-portfolio",
  assetPrefix: "/jfcr-portfolio",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
