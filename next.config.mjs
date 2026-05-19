/** @type {import('next').NextConfig} */
const isProd = process.env.GITHUB_ACTIONS === "true";

const nextConfig = {
  output: "export",
  basePath: isProd ? "/jfcr-portfolio" : "",
  assetPrefix: isProd ? "/jfcr-portfolio" : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? "/jfcr-portfolio" : "",
  },
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
