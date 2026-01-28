"use client";
import { useEffect } from 'react';
import '@n8n/chat/style.css';

export default function ChatWidget() {
  useEffect(() => {
    import('@n8n/chat').then(({ createChat }) => {
      createChat({
        webhookUrl: 'https://marcelomena.app.n8n.cloud/webhook/183180e2-0bfe-41a9-b48c-faac017ed657/chat',
        mode: 'window',
        showWelcomeScreen: true,
        allowFileUploads: true,
        allowVoiceMessages: true, // Habilita el micrófono para grabar directamente
        initialMessages: [
          '¡Hola! Soy tu asistente de IA. 👋',
          '¿Cómo puedo ayudarte hoy?'
        ],
        i18n: {
          en: {
            title: 'Asistente IA',
            subtitle: 'En línea 24/7',
            footer: '',
            getStarted: 'Empezar',
            inputPlaceholder: 'Escribe o graba un audio...',
            closeButtonTooltip: 'Cerrar',
            feedbackPlaceholder: 'Tu mensaje...',
            feedbackTitle: 'Feedback',
            feedbackSubmitButtonText: 'Enviar'
          },
        } as any, 
      } as any); 
    });
  }, []);

  return null;
}