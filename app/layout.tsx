import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script"; // Importamos el cargador oficial

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Agent Demo",
  description: "Landing de práctica n8n",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Forzamos el CSS desde el CDN directamente */}
        <link href="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}

        {/* Script de carga directa */}
        <Script
          id="n8n-chat-loader"
          src="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js"
          type="module"
          strategy="afterInteractive"
          onLoad={() => {
            const n8nChat = (window as any).Chat;
            if (n8nChat) {
              n8nChat.createChat({
                webhookUrl: 'https://marcelomena.app.n8n.cloud/webhook/183180e2-0bfe-41a9-b48c-faac017ed657/chat',
                mode: 'window',
                showWelcomeScreen: true,
                allowFileUploads: true,
                allowedFilesMimeTypes: 'audio/*,image/*',
                i18n: {
                  en: {
                    title: 'Asistente IA',
                    inputPlaceholder: 'Escribe o envía un audio...',
                  }
                }
              });
            }
          }}
        />
      </body>
    </html>
  );
}