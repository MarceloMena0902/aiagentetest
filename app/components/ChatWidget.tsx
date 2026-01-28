"use client";

import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

export default function ChatWidget() {
  useEffect(() => {
    createChat({
      webhookUrl: 'https://marcelomena.app.n8n.cloud/webhook/183180e2-0bfe-41a9-b48c-faac017ed657/chat',
      mode: 'window',
      showWelcomeScreen: true,
      allowFileUploads: true,
      allowedFilesMimeTypes: 'audio/*,image/*',
      i18n: {
        en: {
          title: 'Asistente IA 👋',
          subtitle: "Start a chat. We're here to help you 24/7.", // Añadido para quitar error
          footer: '', // Añadido para quitar error
          getStarted: 'Nueva conversación',
          inputPlaceholder: 'Escribe o envía un audio...',
          closeButtonTooltip: 'Close chat', // Añadido para quitar error
        },
      },
    });
  }, []);

  return null;
}