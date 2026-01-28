"use client";
import React, { useState, useRef } from 'react';

export default function VoiceChat() {
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Función para iniciar grabación
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
      await sendToN8n(audioBlob);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // Enviar audio a n8n
  const sendToN8n = async (blob: Blob) => {
    const formData = new FormData();
    formData.append('data', blob, 'voice.webm'); // n8n recibirá esto como binario

    try {
      const res = await fetch('https://marcelomena.app.n8n.cloud/webhook/183180e2-0bfe-41a9-b48c-faac017ed657/chat', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResponse(data.output || "Audio procesado"); // Muestra la respuesta del Agente
    } catch (err) {
      console.error("Error enviando audio:", err);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h3>Asistente de Voz</h3>
      <button 
        onMouseDown={startRecording} 
        onMouseUp={stopRecording}
        style={{ backgroundColor: isRecording ? 'red' : 'blue', color: 'white', padding: '10px' }}
      >
        {isRecording ? 'Grabando... Suelta para enviar' : 'Mantén presionado para hablar'}
      </button>
      <div style={{ marginTop: '20px' }}>
        <strong>Respuesta:</strong>
        <p>{response}</p>
      </div>
    </div>
  );
}