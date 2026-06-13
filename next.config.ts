import type { NextConfig } from "next";
import path from "path";

function getCanonicalUrl(): string | null {
  const raw = process.env.NEXTAUTH_URL?.trim();
  if (!raw) {
    return null;
  }

  return raw.replace(/\/$/, "");
}

const canonicalUrl = getCanonicalUrl();
const canonicalHost = canonicalUrl ? new URL(canonicalUrl).host : null;

const alternateHosts = (
  process.env.CANONICAL_REDIRECT_HOSTS ??
  "lab-13-web-cyan.vercel.app,lab-13-web-git-master-ander-s-projects2.vercel.app"
)
  .split(",")
  .map((host) => host.trim())
  .filter((host) => host && host !== canonicalHost);

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  async redirects() {
    if (!canonicalUrl || !canonicalHost) {
      return [];
    }

    return alternateHosts.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: `${canonicalUrl}/:path*`,
      permanent: false,
    }));
  },
};

export default nextConfig;
