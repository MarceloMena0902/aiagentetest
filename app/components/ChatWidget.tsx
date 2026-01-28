"use client";

import Script from "next/script";
import "@n8n/chat/style.css";

export default function ChatWidget() {
  return (
    <>
      {/* Añadimos un div con el ID por defecto que busca n8n */}
      <div id="n8n-chat"></div> 
      
      <Script
        id="n8n-chat-widget"
        src="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js"
        type="module"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        onLoad={() => {
          const n8nChat = (window as any).Chat;
          if (n8nChat) {
            n8nChat.createChat({
              webhookUrl: 'https://marcelomena.app.n8n.cloud/webhook/183180e2-0bfe-41a9-b48c-faac017ed657/chat',
              mode: 'window', // Asegura que se use la burbuja flotante
              target: '#n8n-chat', // Forzamos el anclaje al div de arriba
              showWelcomeScreen: true,
              allowFileUploads: true,
              allowedFilesMimeTypes: 'audio/*,image/*',
              i18n: {
                en: {
                  title: 'Asistente IA',
                  inputPlaceholder: 'Escribe o envía un audio...',
                  sendButtonText: 'Enviar'
                }
              }
            });
          }
        }}
      />
    </>
  );
}