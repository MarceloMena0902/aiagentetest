"use client";

import { useEffect } from "react";
import "@n8n/chat/style.css";

export default function ChatWidget() {
  useEffect(() => {
    const scriptId = 'n8n-chat-script';
    
    // Evitar duplicados si el script ya existe
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
    script.type = 'module';
    script.crossOrigin = 'anonymous';

    script.onload = () => {
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

    document.body.appendChild(script);
  }, []);

  return <div id="n8n-chat"></div>;
}