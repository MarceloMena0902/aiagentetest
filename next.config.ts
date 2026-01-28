import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            // Agregamos 'unsafe-eval' para el funcionamiento interno del widget 
            // y permitimos el dominio de jsdelivr para cargar el script y estilos.
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; object-src 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
