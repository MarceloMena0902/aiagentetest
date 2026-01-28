"use client";

import Script from "next/script";
import "@n8n/chat/style.css";

export default function ChatWidget() {
  return (
    <Script
      id="n8n-chat-widget"
      src="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js"
      type="module"
      strategy="afterInteractive"
      onLoad={() => {
        const n8nChat = (window as any).Chat;
        if (n8nChat) {
          n8nChat.createChat({
            webhookUrl: 'https://marcelomena.app.n8n.cloud/webhook/183180e2-0bfe-41a9-b48c-faac017ed657/chat',
            showWelcomeScreen: true,
            title: 'Asistente IA',
            i18n: {
              en: {
                inputPlaceholder: 'Escribe o graba un audio...',
                sendButtonText: 'Enviar'
              }
            }
          });
        }
      }}
    />
  );
}