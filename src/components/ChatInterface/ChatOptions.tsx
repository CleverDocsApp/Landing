import React from 'react';
import { Option } from '../../types/chat';

interface ChatOptionsProps {
  options: Option[];
  onSelect: (option: Option) => void;
}

const ChatOptions: React.FC<ChatOptionsProps> = ({ options, onSelect }) => {
  return (
    <div className="chat-options">
      {options.map((option) => (
        <button 
          key={option.id} 
          className="option-button"
          onClick={() => onSelect(option)}
        >
          {option.text}
        </button>
      ))}
    </div>
  );
};

export default ChatOptions;