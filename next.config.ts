/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; " +
                   "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " + // Permite que React/Next ejecuten scripts
                   "style-src 'self' 'unsafe-inline'; " + // Permite estilos
                   "media-src 'self' blob:; " + // Permite reproducir tus audios
                   "connect-src 'self' https://marcelomena.app.n8n.cloud wss://*.vercel.app;", // Permite n8n y WebSockets de Vercel
          },
        ],
      },
    ];
  },
};

export default nextConfig;