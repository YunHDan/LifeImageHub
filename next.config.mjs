import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["mdx", "ts", "tsx"],
  reactStrictMode: false,
  // 允许局域网 IP 访问开发资源，解决 cross origin dev 访问提示
  allowedDevOrigins: ["http://26.66.249.97:3000"],
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "img.drhlife.top",
        port: "",
      },
    ],
  },
  serverExternalPackages: ["twitter-api-v2"],
  async redirects() {
    return [
      {
        source: "/.well-known/host-meta/:slug*",
        destination: "https://fed.brid.gy/.well-known/host-meta/:slug*",
        permanent: true,
      },
      {
        source: "/.well-known/webfinger:slug*",
        destination: "https://fed.brid.gy/.well-known/webfinger:slug*",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
