import type { NextConfig } from "next";

const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.apicdn.sanity.io https://challenges.cloudflare.com",
  "connect-src 'self' https://challenges.cloudflare.com https://cdn.sanity.io https://*.apicdn.sanity.io https://*.cloudflare.com wss://*.cloudflare.com",
  "frame-src 'self' https://challenges.cloudflare.com",
  "worker-src 'self' blob: https://challenges.cloudflare.com",
  "child-src 'self' blob: https://challenges.cloudflare.com",
  "script-src-elem 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const permissionsPolicy = [
  "camera=()",
  "microphone=()",
  "geolocation=()",
  "xr-spatial-tracking=()",
  "payment=()",
  "usb=()",
  "magnetometer=()",
  "gyroscope=()",
  "accelerometer=()",
  "display-capture=()",
  "fullscreen=(self)",
].join(", ");

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
          {
            key: "Permissions-Policy",
            value: permissionsPolicy,
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;