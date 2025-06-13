import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { Message } from '../../types/chat';
import './ChatInterface.css';

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Have questions about OnKlinic?\nAsk how it can support your documentation, how it compares to other tools, or anything else you need to know.\n\nThere's nothing like OnKlinic on the market today—and we're here to show you why.\n\nNo jargon. No sales pitch. Just clear, honest answers.",
    sender: 'bot',
    timestamp: new Date().toISOString(),
  },
];

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/.netlify/functions/chatbot', {
        method: 'POST',
        body: JSON.stringify({ message: input }),
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
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
            🟢 On Klinic is typing...
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Describe a case, ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSend}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;