import React from 'react';
import { Message } from '../../types/chat';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  // Función para procesar texto con markdown básico, hipervínculos y menciones de marca
  const processText = (text: string) => {
    let processedText = text;
    
    // 1. Procesar texto en negrita **texto** con el color verde del logo
    processedText = processedText.replace(/\*\*(.*?)\*\*/g, '<span class="chat-message-bold">$1</span>');
    
    // 2. Procesar hipervínculos [texto](url) con estilo verde
    processedText = processedText.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g, 
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-hyperlink">$1</a>'
    );
    
    // 3. Procesar URLs directas (http/https) con estilo verde
    processedText = processedText.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="chat-hyperlink">$1</a>'
    );
    
    // 4. Procesar menciones de "OnKlinic" y "OK" (pero no dentro de enlaces ya procesados)
    // Usamos una función de reemplazo más sofisticada para evitar procesar texto dentro de tags HTML
    processedText = processedText.replace(
      /(?<!<[^>]*)\b(OnKlinic|OK)\b(?![^<]*>)/g,
      '<span class="brand-mention">$1</span>'
    );
    
    return { __html: processedText };
  };

  return (
    <div className={`message ${message.sender === 'bot' ? 'bot-message' : 'user-message'}`}>
     {message.sender === 'bot' && (
  <div className="avatar">
    <img
      src="/images/chat-avatar.svg"
      alt="On Klinic bot"
      className="chat-avatar"
    />
  </div>
)}
      <div className="message-content">
        {/* Renderizar con HTML para soportar el texto resaltado, hipervínculos y menciones */}
        <div 
          style={{ whiteSpace: 'pre-line', color: 'inherit' }}
          dangerouslySetInnerHTML={processText(message.text)}
        />
      </div>
    </div>
  );
};

export default ChatMessage;