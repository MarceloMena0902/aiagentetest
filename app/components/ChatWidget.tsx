"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function UltimateChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    { text: "¡Hola! Soy tu asistente de IA. 👋", isAi: true },
    { text: "¿Cómo puedo ayudarte hoy?", isAi: true }
  ]);
  
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
      setMessages(prev => [...prev, { text: data.output || "Procesado correctamente.", isAi: true }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Error: No se pudo conectar con el servidor.", isAi: true }]);
    }
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    const msg = inputText;
    setMessages(prev => [...prev, { text: msg, isAi: false }]);
    setInputText("");
    sendToN8n(msg);
  };

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
      mediaRecorderRef.current.onstop = null; 
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
            <div style={{fontWeight: '700', fontSize: '16px'}}>Asistente IA</div>
            <div style={{fontSize: '11px', opacity: 0.8}}>En línea 24/7</div>
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
                  placeholder="Escribe un mensaje..." 
                  style={inputStyle} 
                />
                <button onClick={startRecording} style={iconStyle}>🎤</button>
                <button onClick={handleSendText} style={{...iconStyle, color: '#0042da'}}>➤</button>
              </>
            ) : (
              <div style={recordingContainerStyle}>
                <div style={waveAnimateStyle}>🔴 Grabando...</div>
                <div style={{display: 'flex', gap: '12px'}}>
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

// ESTILOS CORREGIDOS (ALTO CONTRASTE)
const bubbleStyle: React.CSSProperties = { position: 'fixed', bottom: '25px', right: '25px', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#0042da', color: 'white', border: 'none', cursor: 'pointer', zIndex: 1000, boxShadow: '0 4px 15px rgba(0,0,0,0.2)', fontSize: '24px' };
const windowStyle: React.CSSProperties = { position: 'fixed', bottom: '100px', right: '25px', width: '380px', height: '550px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 12px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', zIndex: 1000, overflow: 'hidden', border: '1px solid #ddd' };
const headerStyle: React.CSSProperties = { padding: '15px 20px', backgroundColor: '#0b1437', color: 'white' };
const chatBodyStyle: React.CSSProperties = { flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#f4f7f9' };

// Burbujas con texto legible
const aiMsgStyle: React.CSSProperties = { alignSelf: 'flex-start', backgroundColor: 'white', padding: '12px 16px', borderRadius: '14px 14px 14px 0', maxWidth: '85%', fontSize: '14px', color: '#1a1a1a', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0' };
const userMsgStyle: React.CSSProperties = { alignSelf: 'flex-end', backgroundColor: '#0042da', color: 'white', padding: '12px 16px', borderRadius: '14px 14px 0 14px', maxWidth: '85%', fontSize: '14px', fontWeight: '500' };

const inputAreaStyle: React.CSSProperties = { padding: '10px 15px', borderTop: '2px solid #eee', display: 'flex', alignItems: 'center', backgroundColor: 'white', minHeight: '70px' };

// Input con texto negro sólido para que se note
const inputStyle: React.CSSProperties = { flex: 1, border: 'none', outline: 'none', fontSize: '15px', color: '#000000', padding: '10px', backgroundColor: '#fff' };

const iconStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', padding: '8px' };

// Estilos de la interfaz de grabación
const recordingContainerStyle: React.CSSProperties = { flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff0f0', padding: '10px 20px', borderRadius: '30px', border: '1px solid #ffcccc' };
const waveAnimateStyle: React.CSSProperties = { fontSize: '14px', color: '#d32f2f', fontWeight: 'bold' };
const cancelButtonStyle: React.CSSProperties = { backgroundColor: '#ff5252', color: 'white', border: 'none', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const confirmButtonStyle: React.CSSProperties = { backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' };