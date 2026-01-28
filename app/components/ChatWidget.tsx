"use client";
import React, { useState, useRef, useEffect } from 'react';

// Definimos la estructura del mensaje para evitar errores de TypeScript
interface Message {
  text?: string;
  audioUrl?: string;
  isAi: boolean;
}

export default function UltimateChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { text: "¡Hola! Soy tu asistente de IA. 👋", isAi: true },
    { text: "¿Cómo puedo ayudarte hoy?", isAi: true }
  ]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final cuando hay mensajes nuevos
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
      // Añadimos la respuesta de la IA al chat
      setMessages(prev => [...prev, { text: data.output || "Procesado correctamente.", isAi: true }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Error de conexión con el asistente.", isAi: true }]);
    }
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    const userText = inputText;
    setMessages(prev => [...prev, { text: userText, isAi: false }]);
    sendToN8n(userText);
    setInputText("");
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
    } catch (e) { 
      alert("Acceso al micrófono denegado. Verifica los permisos de tu navegador."); 
    }
  };

const confirmAndSendAudio = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = () => {
        // 1. Forzamos el tipo de audio a webm con códec opus para que el reproductor funcione
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        
        // 2. Generamos la URL de previsualización
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // 3. Añadimos el mensaje al chat (TypeScript ya no dará error con la interfaz Message)
        setMessages(prev => [...prev, { 
          audioUrl: audioUrl, 
          isAi: false, 
          text: "" 
        }]);
        
        // 4. Enviamos el binario a n8n
        const fd = new FormData();
        fd.append('data', audioBlob, 'voice.webm'); // n8n lo recibe como data0
        sendToN8n(fd);
      };

      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <>
      {/* Botón de Burbuja */}
      <button onClick={() => setIsOpen(!isOpen)} style={bubbleStyle}>
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Ventana de Chat */}
      {isOpen && (
        <div style={windowStyle}>
          <div style={headerStyle}>
            <div style={{fontWeight: '700', fontSize: '16px'}}>Asistente IA</div>
            <div style={{fontSize: '11px', opacity: 0.8}}>En línea 24/7</div>
          </div>
          
          <div style={chatBodyStyle} ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} style={m.isAi ? aiMsgStyle : userMsgStyle}>
                {m.audioUrl ? (
                  <audio src={m.audioUrl} controls style={{maxWidth: '220px'}} />
                ) : (
                  <span style={{color: m.isAi ? '#000' : '#fff'}}>{m.text}</span>
                )}
              </div>
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
                <div style={{fontSize: '13px', color: '#d32f2f', fontWeight: 'bold'}}>🔴 Grabando...</div>
                <div style={{display: 'flex', gap: '8px'}}>
                  <button onClick={() => setIsRecording(false)} style={cancelButtonStyle}>✕</button>
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

// ESTILOS PROFESIONALES (ALTO CONTRASTE)
const bubbleStyle: React.CSSProperties = { position: 'fixed', bottom: '25px', right: '25px', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#0042da', color: 'white', border: 'none', cursor: 'pointer', zIndex: 1000, fontSize: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' };
const windowStyle: React.CSSProperties = { position: 'fixed', bottom: '100px', right: '25px', width: '380px', height: '550px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', zIndex: 1000, overflow: 'hidden', border: '1px solid #ddd' };
const headerStyle: React.CSSProperties = { padding: '15px 20px', backgroundColor: '#0b1437', color: 'white' };
const chatBodyStyle: React.CSSProperties = { flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#f9f9fb' };

const aiMsgStyle: React.CSSProperties = { alignSelf: 'flex-start', backgroundColor: 'white', padding: '12px', borderRadius: '14px 14px 14px 0', maxWidth: '85%', fontSize: '14px', border: '1px solid #eee', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' };
const userMsgStyle: React.CSSProperties = { alignSelf: 'flex-end', backgroundColor: '#0042da', color: 'white', padding: '12px', borderRadius: '14px 14px 0 14px', maxWidth: '85%', fontSize: '14px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };

const inputAreaStyle: React.CSSProperties = { padding: '10px 15px', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', backgroundColor: 'white', minHeight: '60px' };
const inputStyle: React.CSSProperties = { flex: 1, border: 'none', outline: 'none', fontSize: '15px', color: '#000000', padding: '10px' }; // Negro sólido para legibilidad
const iconStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', padding: '5px' };

const recordingContainerStyle: React.CSSProperties = { flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff0f0', padding: '8px 15px', borderRadius: '25px', border: '1px solid #ffcdd2' };
const cancelButtonStyle: React.CSSProperties = { backgroundColor: '#ff5252', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const confirmButtonStyle: React.CSSProperties = { backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };