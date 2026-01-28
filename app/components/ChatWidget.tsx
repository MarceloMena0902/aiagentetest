"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function PremiumChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    { text: "¡Hola! Soy tu asistente de IA. 👋", isAi: true },
    { text: "¿Cómo puedo ayudarte hoy?", isAi: true }
  ]);
  
  // Referencias para Audio
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      setMessages(prev => [...prev, { text: data.output || "Procesado.", isAi: true }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Error de conexión.", isAi: true }]);
    }
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    const msg = inputText;
    setMessages(prev => [...prev, { text: msg, isAi: false }]);
    setInputText("");
    sendToN8n(msg);
  };

  // Lógica de Grabación Mejorada
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorder.start();
      setIsRecording(true);
    } catch (e) { alert("Acceso al micrófono denegado."); }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = null; // Evita el envío
      setIsRecording(false);
    }
  };

  const confirmAndSendAudio = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const fd = new FormData();
        fd.append('data', audioBlob, 'voice.webm');
        sendToN8n(fd);
      };
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} style={bubbleStyle}>{isOpen ? '✕' : '💬'}</button>

      {isOpen && (
        <div style={windowStyle}>
          <div style={headerStyle}>
            <div style={{fontWeight: '600'}}>Asistente IA</div>
            <div style={{fontSize: '11px', opacity: 0.7}}>En línea 24/7</div>
          </div>
          
          <div style={chatBodyStyle} ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} style={m.isAi ? aiMsgStyle : userMsgStyle}>{m.text}</div>
            ))}
          </div>

          <div style={inputAreaStyle}>
            {!isRecording ? (
              <>
                <input 
                  value={inputText} 
                  onChange={(e) => setInputText(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
                  placeholder="Escribe o graba un audio..." 
                  style={inputStyle} 
                />
                <button onClick={startRecording} style={iconStyle}>🎤</button>
                <button onClick={handleSendText} style={{...iconStyle, color: '#0042da'}}>➤</button>
              </>
            ) : (
              <div style={recordingContainerStyle}>
                <div style={waveAnimateStyle}>● Graba tu mensaje...</div>
                <div style={{display: 'flex', gap: '10px'}}>
                  <button onClick={cancelRecording} style={cancelButtonStyle}>✕</button>
                  <button onClick={confirmAndSendAudio} style={confirmButtonStyle}>✓</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ESTILOS MEJORADOS
const bubbleStyle: React.CSSProperties = { position: 'fixed', bottom: '25px', right: '25px', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#0042da', color: 'white', border: 'none', cursor: 'pointer', zIndex: 1000, boxShadow: '0 4px 15px rgba(0,0,0,0.2)' };
const windowStyle: React.CSSProperties = { position: 'fixed', bottom: '100px', right: '25px', width: '380px', height: '550px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', zIndex: 1000, overflow: 'hidden' };
const headerStyle: React.CSSProperties = { padding: '20px', backgroundColor: '#0b1437', color: 'white' };
const chatBodyStyle: React.CSSProperties = { flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f9f9fb' };
const aiMsgStyle: React.CSSProperties = { alignSelf: 'flex-start', backgroundColor: 'white', padding: '12px', borderRadius: '12px 12px 12px 0', maxWidth: '80%', fontSize: '14px', border: '1px solid #eee' };
const userMsgStyle: React.CSSProperties = { alignSelf: 'flex-end', backgroundColor: '#0042da', color: 'white', padding: '12px', borderRadius: '12px 12px 0 12px', maxWidth: '80%', fontSize: '14px' };
const inputAreaStyle: React.CSSProperties = { padding: '15px', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', backgroundColor: 'white', minHeight: '60px' };
const inputStyle: React.CSSProperties = { flex: 1, border: 'none', outline: 'none', fontSize: '14px' };
const iconStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', padding: '5px' };

// ESTILOS DE GRABACIÓN (Camino B mejorado)
const recordingContainerStyle: React.CSSProperties = { flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f0f2f5', padding: '8px 15px', borderRadius: '30px' };
const waveAnimateStyle: React.CSSProperties = { fontSize: '13px', color: '#ff4d4d', fontWeight: 'bold' };
const cancelButtonStyle: React.CSSProperties = { backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' };
const confirmButtonStyle: React.CSSProperties = { backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' };