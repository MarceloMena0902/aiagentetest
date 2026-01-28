import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import ChatInitializer from "./components/ChatInitializer"; // Lo crearemos ahora

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
        <link href="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        
        {/* Cargamos el script sin funciones onLoad aquí para evitar el error de build */}
        <Script
          id="n8n-chat-script"
          src="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js"
          type="module"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

        {/* Este componente activará el chat una vez cargado el script */}
        <ChatInitializer />
      </body>
    </html>
  );
}