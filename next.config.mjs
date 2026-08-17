/** @type {import('next').NextConfig} */
const isProd = process.env.GITHUB_ACTIONS === "true";

const nextConfig = {
  ...(isProd && { output: "export" }),
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
