import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatOptions from './ChatOptions';
import TypingIndicator from './TypingIndicator';
import { Message, Option } from '../../types/chat';
import './ChatInterface.css';

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Have questions about OnKlinic?\n\nAsk how it can support your documentation, how it compares to other tools, or anything else you need to know.\n\n<span class=\"initial-message-special-highlight\">There's nothing like OnKlinic on the market today</span> and we're here to show you why.\n\nNo jargon. No sales pitch. Just clear, honest answers.",
    sender: 'bot',
    timestamp: new Date().toISOString(),
  },
];

const exampleQuestions: Option[] = [
  {
    id: 'q1',
    text: 'How does OnKlinic help with compliance?',
    value: 'How does OnKlinic help with compliance?'
  },
  {
    id: 'q2',
    text: 'Does OnKlinic support Joint Commission documentation standards?',
    value: 'Does OnKlinic support Joint Commission documentation standards?'
  },
  {
    id: 'q3',
    text: 'What makes OnKlinic different from other AI tools?',
    value: 'What makes OnKlinic different from other AI tools?'
  },
  {
    id: 'q4',
    text: 'Is OnKlinic suitable for solo providers or only for clinics?',
    value: 'Is OnKlinic suitable for solo providers or only for clinics?'
  },
  {
    id: 'q5',
    text: 'How does it support prior authorizations?',
    value: 'How does it support prior authorizations?'
  }
];

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showSuggestionsButton, setShowSuggestionsButton] = useState(false);
  const [askedQuestionsIds, setAskedQuestionsIds] = useState<Set<string>>(new Set());
  const [threadId, setThreadId] = useState<string | null>(localStorage.getItem('onklinicThreadId'));

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Create a mock thread ID for development
    if (!threadId) {
      const mockThreadId = 'dev-thread-' + Date.now();
      setThreadId(mockThreadId);
      localStorage.setItem('onklinicThreadId', mockThreadId);
    }
  }, [threadId]);

  const handleSend = async (messageToSend?: string, optionId?: string) => {
    const messageText = messageToSend || input.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setShowSuggestions(false);
    setShowSuggestionsButton(true);

    // Mark question as asked if it came from a suggestion
    if (optionId) {
      setAskedQuestionsIds(prev => new Set([...prev, optionId]));
    }

    // Simulate bot response for development
    setTimeout(() => {
      const responses = [
        "OnKlinic helps mental health professionals save time on documentation while maintaining clinical quality and compliance standards.",
        "Our AI assistant is specifically trained on mental health terminology, DSM-V criteria, and documentation requirements.",
        "With OnKlinic, you can reduce documentation time by 50-70% while improving insurance approval rates.",
        "We ensure your documentation meets HIPAA, Joint Commission, and payer requirements automatically.",
        "OnKlinic adapts to your writing style and clinical approach, making documentation feel natural and authentic."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        id: Date.now().toString() + '_bot',
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  const handleOptionSelect = (option: Option) => {
    handleSend(option.text, option.id);
  };

  const handleShowSuggestions = () => {
    setShowSuggestions(true);
    setShowSuggestionsButton(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (e.target.value.trim() && showSuggestions) {
      setShowSuggestions(false);
      setShowSuggestionsButton(true);
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="chat-header-content">
          <div className="chat-header-title-enhanced">
            Ask Anything. Get Real Answers.
          </div>
        </div>
      </div>

      <div className="chat-messages" ref={messagesContainerRef}>
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
        />
        {showSuggestionsButton && (
          <button 
            className="show-suggestions-button"
            onClick={handleShowSuggestions}
            title="Show suggested questions"
          >
            <MessageSquare size={16} />
          </button>
        )}
        <button onClick={() => handleSend()}>
          <Send size={18} />
        </button>
      </div>

      {showSuggestions && (
        <ChatOptions 
          options={exampleQuestions} 
          onSelect={handleOptionSelect}
          askedQuestionsIds={askedQuestionsIds}
        />
      )}
    </div>
  );
};

export default ChatInterface;