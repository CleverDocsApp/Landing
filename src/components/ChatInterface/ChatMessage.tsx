import React from 'react';
import { Message } from '../../types/chat';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  // Función para procesar texto con markdown básico
  const processText = (text: string) => {
    // Procesar texto en negrita **texto**
    const processedText = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #20BDAA; font-weight: 700; text-shadow: 0 0 10px rgba(32, 189, 170, 0.3);">$1</strong>');
    
    return { __html: processedText };
  };

  return (
    <div className={`message ${message.sender === 'bot' ? 'bot-message' : 'user-message'}`}>
     {message.sender === 'bot' && (
  <div className="avatar">
    <img
      src="/images/chat-avatar-inverted.svg"
      alt="On Klinic bot"
      className="chat-avatar"
    />
  </div>
)}
      <div className="message-content">
        {/* Renderizar con HTML para soportar el texto en negrita */}
        <div 
          style={{ whiteSpace: 'pre-line', color: 'inherit' }}
          dangerouslySetInnerHTML={processText(message.text)}
        />
      </div>
    </div>
  );
};

export default ChatMessage;