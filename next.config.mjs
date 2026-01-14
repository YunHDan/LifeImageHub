import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";

const IPOPTION = "" // 请修改为你的局域网 IP 地址和端口，如 http://26.66.249.97:9000
const PROTOCOL = "" // 请修改为你的站点使用的协议 http 或 https
const IMAGESDOMAIN = "" // 请修改为你的图片域名

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["mdx", "ts", "tsx"],
  reactStrictMode: false,
  // 如果要允许局域网 IP 访问开发资源，以解决 cross origin dev 访问提示，
  // 要恢复allowedDevOrigins: [IPOPTION]的注释
  // allowedDevOrigins: [IPOPTION],
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
        protocol: PROTOCOL,
        hostname: IMAGESDOMAIN,
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
