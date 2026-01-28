"use client";
import React, { useState, useRef, useEffect } from 'react';
import './ChatWidget.css'; // Asegúrate de que el nombre coincida con tu archivo

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
      if (!res.ok) throw new Error('Error 500');
      const data = await res.json();
      setMessages(prev => [...prev, { text: data.output || "Procesado.", isAi: true }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Error de conexión con n8n.", isAi: true }]);
    }
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, { text: inputText, isAi: false }]);
    sendToN8n(inputText);
    setInputText("");
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorder.start();
      setIsRecording(true);
    } catch (e) { alert("Acceso al micrófono denegado."); }
  };

  const confirmAndSendAudio = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setMessages(prev => [...prev, { audioUrl, isAi: false, text: "" }]);
        const fd = new FormData();
        fd.append('data', audioBlob, 'voice.webm');
        sendToN8n(fd);
      };
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="chat-bubble">
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="header-title">Asistente IA</div>
            <div className="header-status">En línea 24/7</div>
          </div>
          
          <div className="chat-body" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={m.isAi ? "ai-msg" : "user-msg"}>
                {m.audioUrl ? (
                  <audio src={m.audioUrl} controls className="audio-player" />
                ) : (
                  <span>{m.text}</span>
                )}
              </div>
            ))}
          </div>

          <div className="input-area">
            {!isRecording ? (
              <>
                <input 
                  value={inputText} 
                  onChange={(e) => setInputText(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
                  placeholder="Escribe un mensaje..." 
                  className="chat-input" 
                />
                <button onClick={startRecording} className="icon-btn">🎤</button>
                <button onClick={handleSendText} className="icon-btn send-btn">➤</button>
              </>
            ) : (
              <div className="recording-container">
                <div className="recording-text">🔴 Grabando...</div>
                <div className="recording-actions">
                  <button onClick={() => setIsRecording(false)} className="cancel-btn">✕</button>
                  <button onClick={confirmAndSendAudio} className="confirm-btn">✓</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}