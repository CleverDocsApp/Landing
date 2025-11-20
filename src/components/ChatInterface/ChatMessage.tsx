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
    // Normalizar URLs sin protocolo en markdown a URLs completas
    processedText = processedText.replace(
      /\[([^\]]+)\]\((?!https?:\/\/)([^)]+)\)/g,
      '<a href="https://$2" target="_blank" rel="noopener noreferrer" class="chat-hyperlink">$1</a>'
    );
    processedText = processedText.replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-hyperlink">$1</a>'
    );

    // 3. Proteger URLs que ya están en atributos href para evitar doble procesamiento
    // Marcar temporalmente las URLs que están en href
    const hrefPlaceholders: string[] = [];
    processedText = processedText.replace(/href="([^"]+)"/g, (match, url) => {
      const placeholder = `HREF_PLACEHOLDER_${hrefPlaceholders.length}`;
      hrefPlaceholders.push(url);
      return `href="${placeholder}"`;
    });

    // 4. Procesar URLs directas con protocolo primero
    processedText = processedText.replace(
      /(?<!href=")(https?:\/\/[^\s<"]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="chat-hyperlink">$1</a>'
    );

    // 5. Procesar URLs sin protocolo (onklinic.com/path)
    processedText = processedText.replace(
      /(?<![@/])(?<!href=")\b((?:www\.)?[a-z0-9][-a-z0-9]*\.[a-z]{2,}(?:\/[^\s<"]*)?)\b/gi,
      (match, domain) => {
        // Evitar procesar si parece un email o ya está dentro de una etiqueta
        if (match.includes('@')) return match;
        return `<a href="https://${domain}" target="_blank" rel="noopener noreferrer" class="chat-hyperlink">${domain}</a>`;
      }
    );

    // 6. Restaurar las URLs originales en los atributos href
    hrefPlaceholders.forEach((url, index) => {
      const placeholder = `HREF_PLACEHOLDER_${index}`;
      processedText = processedText.replace(placeholder, url);
    });

    // 7. Procesar menciones de "OnKlinic" y "OK" (pero no dentro de enlaces ya procesados)
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