import React from 'react';
import { Message } from '../../types/chat';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`message ${message.sender === 'bot' ? 'bot-message' : 'user-message'}`}>
      {message.sender === 'bot' && (
        <div className="avatar">
          <span>OK</span>
        </div>
      )}
      <div className="message-content">
        {/* Esta línea es clave: asegura que los saltos de línea y el contenido completo se muestren */}
        <div style={{ whiteSpace: 'pre-line', color: 'inherit' }}>
          {message.text}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
