"use client";

import { useEffect } from "react";

export default function ChatInitializer() {
  useEffect(() => {
    const initChat = () => {
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
              sendButtonText: 'Enviar'
            }
          }
        });
      }
    };

    // Intentamos inicializar cada segundo hasta que window.Chat esté disponible
    const interval = setInterval(() => {
      if ((window as any).Chat) {
        initChat();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return null; // No renderiza nada visualmente
}