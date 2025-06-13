import React from 'react';
import { Message } from '../../types/chat';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  // Función para procesar texto con markdown básico
  const processText = (text: string) => {
    // Procesar texto en negrita **texto**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return (
          <span 
            key={index} 
            className="font-bold text-primary-light"
            style={{
              background: 'linear-gradient(135deg, #20BDAA 0%, #1AA192 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 20px rgba(32, 189, 170, 0.3)',
              fontSize: '1.05em',
              letterSpacing: '0.02em'
            }}
          >
            {boldText}
          </span>
        );
      }
      return part;
    });
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
        <div style={{ whiteSpace: 'pre-line', color: 'inherit' }}>
          {message.sender === 'bot' ? processText(message.text) : message.text}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;