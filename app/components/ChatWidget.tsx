"use client";

import { useEffect } from 'react';
import '@n8n/chat/style.css';

export default function ChatWidget() {
  useEffect(() => {
    // Importamos la librería dinámicamente solo en el cliente
    import('@n8n/chat').then(({ createChat }) => {
      createChat({
        webhookUrl: 'https://marcelomena.app.n8n.cloud/webhook/183180e2-0bfe-41a9-b48c-faac017ed657/chat',
        mode: 'window',
        showWelcomeScreen: true,
        allowFileUploads: true,
        allowedFilesMimeTypes: 'audio/*,image/*',
        i18n: {
          en: {
            title: 'Asistente IA 👋',
            subtitle: "En línea 24/7",
            footer: '',
            getStarted: 'Nueva conversación',
            inputPlaceholder: 'Escribe o envía un audio...',
            closeButtonTooltip: 'Cerrar chat',
            feedbackPlaceholder: '¿Cómo fue tu experiencia?',
            feedbackTitle: 'Danos tu opinión',
            feedbackSubmitButtonText: 'Enviar'
          },
        },
      });
    });
  }, []);

  return null;
}