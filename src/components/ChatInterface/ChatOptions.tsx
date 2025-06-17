import React from 'react';
import { Option } from '../../types/chat';

interface ChatOptionsProps {
  options: Option[];
  onSelect: (option: Option) => void;
  askedQuestionsIds: Set<string>;
}

const ChatOptions: React.FC<ChatOptionsProps> = ({ options, onSelect, askedQuestionsIds }) => {
  return (
    <div className="chat-options">
      {options.map((option) => {
        const isAsked = askedQuestionsIds.has(option.id);
        return (
          <button 
            key={option.id} 
            className={`option-button ${isAsked ? 'asked-question' : ''}`}
            onClick={() => !isAsked && onSelect(option)}
            disabled={isAsked}
            title={isAsked ? 'Already asked' : option.text}
          >
            {option.text}
          </button>
        );
      })}
    </div>
  );
};

export default ChatOptions;