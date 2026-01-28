import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; connect-src 'self' https://marcelomena.app.n8n.cloud https://cdn.jsdelivr.net; img-src 'self' data: https://cdn.jsdelivr.net; worker-src 'self' blob:; object-src 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
