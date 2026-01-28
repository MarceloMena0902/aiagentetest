"use client";
import React, { useState, useRef } from 'react';

export default function VoiceChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState("¡Hola! Mantén presionado el botón para hablar.");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
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
    } catch (err) { alert("Error al acceder al micrófono"); }
  };

  const stopRecording = () => { mediaRecorderRef.current?.stop(); setIsRecording(false); };

  const sendToN8n = async (blob: Blob) => {
    setResponse("Procesando audio...");
    const formData = new FormData();
    formData.append('data', blob, 'voice.webm');
    try {
      const res = await fetch('https://marcelomena.app.n8n.cloud/webhook/183180e2-0bfe-41a9-b48c-faac017ed657/chat', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResponse(data.output || "No recibí respuesta del agente.");
    } catch (err) { setResponse("Error de conexión con el asistente."); }
  };

  return (
    <>
      {/* Botón Flotante (Burbuja) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: '20px', right: '20px',
          width: '60px', height: '60px', borderRadius: '50%',
          backgroundColor: '#0042da', color: 'white', border: 'none',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)', cursor: 'pointer', fontSize: '24px', zIndex: 1000
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Ventana del Chat */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '20px',
          width: '320px', backgroundColor: 'white', borderRadius: '15px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)', padding: '20px',
          zIndex: 1000, fontFamily: 'sans-serif', border: '1px solid #eee'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Asistente de Voz</h4>
          <p style={{ fontSize: '14px', color: '#666', minHeight: '60px', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '8px' }}>
            {response}
          </p>
          <button 
            onMouseDown={startRecording} 
            onMouseUp={stopRecording}
            onMouseLeave={isRecording ? stopRecording : undefined}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
              backgroundColor: isRecording ? '#ff4d4d' : '#0042da',
              color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s'
            }}
          >
            {isRecording ? '🔴 Grabando...' : '🎤 Mantener para hablar'}
          </button>
        </div>
      )}
    </>
  );
}