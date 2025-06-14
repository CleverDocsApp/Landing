import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatOptions from './ChatOptions';
import { Message, Option } from '../../types/chat';
import './ChatInterface.css';

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Have questions about OK?\n\nAsk how it can support your documentation, how it compares to other tools, or anything else you need to know.\n\n**There's nothing like OK on the market today** and we're here to show you why.\n\nNo jargon. No sales pitch. Just clear, honest answers.",
    sender: 'bot',
    timestamp: new Date().toISOString(),
  },
];

const exampleQuestions: Option[] = [
  {
    id: 'q1',
    text: 'How does OK help with compliance?',
    value: 'How does OK help with compliance?'
  },
  {
    id: 'q2',
    text: 'Does OK support Joint Commission documentation standards?',
    value: 'Does OK support Joint Commission documentation standards?'
  },
  {
    id: 'q3',
    text: 'What makes OK different from other AI tools?',
    value: 'What makes OK different from other AI tools?'
  },
  {
    id: 'q4',
    text: 'Is OK suitable for solo providers or only for clinics?',
    value: 'Is OK suitable for solo providers or only for clinics?'
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

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (messageToSend?: string) => {
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
    setShowSuggestions(false); // Hide suggestions after sending a message

    try {
      const res = await fetch('/.netlify/functions/chatbot', {
        method: 'POST',
        body: JSON.stringify({ message: messageText }),
      });

      const data = await res.json();

      const botMessage: Message = {
        id: Date.now().toString() + '_bot',
        text: data.reply || 'Sorry, I had trouble understanding that.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleOptionSelect = (option: Option) => {
    handleSend(option.text);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    // Hide suggestions when user starts typing
    if (e.target.value.trim() && showSuggestions) {
      setShowSuggestions(false);
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
        {isTyping && (
          <div className="chat-message bot">
            🟢 OK is typing...
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
        <button onClick={() => handleSend()}>
          <Send size={18} />
        </button>
      </div>

      {showSuggestions && (
        <ChatOptions 
          options={exampleQuestions} 
          onSelect={handleOptionSelect} 
        />
      )}
    </div>
  );
};

export default ChatInterface;