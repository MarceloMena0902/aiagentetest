"use client";
import React, { useState, useRef } from 'react';

export default function ProfessionalChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([{ text: "¿Cómo puedo ayudarte hoy?", isAi: true }]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const sendToN8n = async (body: FormData | string) => {
    const isAudio = typeof body !== 'string';
    const formData = isAudio ? body : new FormData();
    if (!isAudio) formData.append('chatInput', body); // Envía el campo exacto que busca el Switch

    try {
      const res = await fetch('https://marcelomena.app.n8n.cloud/webhook/183180e2-0bfe-41a9-b48c-faac017ed657/chat', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setMessages(prev => [...prev, { text: data.output || "Sin respuesta", isAi: true }]);
    } catch (err) { console.error("Error:", err); }
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, { text: inputText, isAi: false }]);
    sendToN8n(inputText);
    setInputText("");
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];
    mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const fd = new FormData();
      fd.append('data', audioBlob, 'voice.webm'); // Campo 'data' para el Switch
      sendToN8n(fd);
    };
    mediaRecorder.start();
    setIsRecording(true);
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} style={bubbleStyle}>{isOpen ? '✕' : '💬'}</button>
      {isOpen && (
        <div style={windowStyle}>
          <div style={headerStyle}>Asistente IA</div>
          <div style={chatBodyStyle}>
            {messages.map((m, i) => (
              <div key={i} style={m.isAi ? aiMsgStyle : userMsgStyle}>{m.text}</div>
            ))}
          </div>
          <div style={inputAreaStyle}>
            <input 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
              placeholder="Escribe..." style={inputStyle} 
            />
            <button onMouseDown={startRecording} onMouseUp={() => mediaRecorderRef.current?.stop()} style={micButtonStyle}>
              {isRecording ? '🔴' : '🎤'}
            </button>
            <button onClick={handleSendText} style={sendButtonStyle}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}

// Estilos rápidos para simular el widget oficial
const bubbleStyle: React.CSSProperties = { position: 'fixed', bottom: '20px', right: '20px', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#0042da', color: 'white', border: 'none', cursor: 'pointer', zIndex: 1000 };
const windowStyle: React.CSSProperties = { position: 'fixed', bottom: '90px', right: '20px', width: '350px', height: '500px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', zIndex: 1000, overflow: 'hidden', border: '1px solid #eee' };
const headerStyle: React.CSSProperties = { padding: '15px', backgroundColor: '#0042da', color: 'white', fontWeight: 'bold' };
const chatBodyStyle: React.CSSProperties = { flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' };
const aiMsgStyle: React.CSSProperties = { alignSelf: 'flex-start', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '10px', maxWidth: '80%', fontSize: '14px' };
const userMsgStyle: React.CSSProperties = { alignSelf: 'flex-end', backgroundColor: '#0042da', color: 'white', padding: '10px', borderRadius: '10px', maxWidth: '80%', fontSize: '14px' };
const inputAreaStyle: React.CSSProperties = { padding: '10px', borderTop: '1px solid #eee', display: 'flex', gap: '5px' };
const inputStyle: React.CSSProperties = { flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '5px' };
const micButtonStyle: React.CSSProperties = { padding: '8px', cursor: 'pointer', border: 'none', backgroundColor: 'transparent', fontSize: '18px' };
const sendButtonStyle: React.CSSProperties = { padding: '8px', cursor: 'pointer', border: 'none', backgroundColor: 'transparent', fontSize: '18px', color: '#0042da' };