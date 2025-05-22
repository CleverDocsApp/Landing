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
        <p>{message.text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;