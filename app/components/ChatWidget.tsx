"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function ProfessionalChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState(""); // Control total del input
  const [messages, setMessages] = useState([
    { text: "¡Hola! Soy tu asistente de IA. 👋", isAi: true },
    { text: "¿Cómo puedo ayudarte hoy?", isAi: true }
  ]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final cuando llega un mensaje
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  const sendToN8n = async (body: FormData | string) => {
    const isAudio = typeof body !== 'string';
    const formData = isAudio ? body : new FormData();
    if (!isAudio) formData.append('chatInput', body);

    try {
      const res = await fetch('https://marcelomena.app.n8n.cloud/webhook/183180e2-0bfe-41a9-b48c-faac017ed657/chat', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setMessages(prev => [...prev, { text: data.output || "No hay respuesta", isAi: true }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Error de conexión.", isAi: true }]);
    }
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    const textToSend = inputText;
    setMessages(prev => [...prev, { text: textToSend, isAi: false }]);
    setInputText(""); // Limpia el input inmediatamente
    sendToN8n(textToSend);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const fd = new FormData();
        fd.append('data', audioBlob, 'voice.webm');
        sendToN8n(fd);
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (e) { alert("Permite el acceso al micrófono"); }
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} style={bubbleStyle}>
        {isOpen ? '✕' : <span style={{fontSize: '30px'}}>💬</span>}
      </button>

      {isOpen && (
        <div style={windowStyle}>
          <div style={headerStyle}>
            <div style={{fontWeight: 'bold', fontSize: '18px'}}>Asistente IA</div>
            <div style={{fontSize: '12px', opacity: 0.8}}>En línea 24/7</div>
          </div>
          
          <div style={chatBodyStyle} ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} style={m.isAi ? aiMsgStyle : userMsgStyle}>
                {m.text}
              </div>
            ))}
          </div>

          <div style={inputAreaStyle}>
            <input 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} // Corregido: renderiza mientras escribes
              onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
              placeholder="Escribe o graba un audio..." 
              style={inputStyle} 
            />
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <button 
                onMouseDown={startRecording} 
                onMouseUp={() => mediaRecorderRef.current?.stop()} 
                style={{...iconButtonStyle, color: isRecording ? 'red' : '#666'}}
              >
                {isRecording ? '🛑' : '🎤'}
              </button>
              <button onClick={handleSendText} style={{...iconButtonStyle, color: '#0042da'}}>
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ESTILOS PRO (Basados en el diseño oficial de n8n)
const bubbleStyle: React.CSSProperties = { position: 'fixed', bottom: '20px', right: '20px', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#0042da', color: 'white', border: 'none', cursor: 'pointer', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const windowStyle: React.CSSProperties = { position: 'fixed', bottom: '100px', right: '20px', width: '380px', height: '600px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', zIndex: 1000, overflow: 'hidden', border: '1px solid #f0f0f0' };
const headerStyle: React.CSSProperties = { padding: '20px', backgroundColor: '#071135', color: 'white' };
const chatBodyStyle: React.CSSProperties = { flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#f8f9fa' };
const aiMsgStyle: React.CSSProperties = { alignSelf: 'flex-start', backgroundColor: 'white', padding: '12px 16px', borderRadius: '12px 12px 12px 0', maxWidth: '85%', fontSize: '14px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', color: '#333', border: '1px solid #ebebeb' };
const userMsgStyle: React.CSSProperties = { alignSelf: 'flex-end', backgroundColor: '#0042da', color: 'white', padding: '12px 16px', borderRadius: '12px 12px 0 12px', maxWidth: '85%', fontSize: '14px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };
const inputAreaStyle: React.CSSProperties = { padding: '15px', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', backgroundColor: 'white' };
const inputStyle: React.CSSProperties = { flex: 1, padding: '12px', border: 'none', outline: 'none', fontSize: '14px', color: '#333' };
const iconButtonStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', padding: '5px', display: 'flex', alignItems: 'center' };