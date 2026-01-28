import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; style-src 'self' 'unsafe-inline'; media-src 'self' blob:; connect-src 'self' https://marcelomena.app.n8n.cloud;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
