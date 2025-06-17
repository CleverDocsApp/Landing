import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
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
  const [threadId, setThreadId] = useState<string | null>(localStorage.getItem('onklinicThreadId'));

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!threadId) {
      fetch('/.netlify/functions/create-thread')
        .then(res => res.json())
        .then(data => {
          if (data.thread_id) {
            setThreadId(data.thread_id);
            localStorage.setItem('onklinicThreadId', data.thread_id);
          }
        })
        .catch(err => console.error('Error creating thread:', err));
    }
  }, [threadId]);

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
    setShowSuggestions(false);

    if (!threadId) {
      console.error("Thread ID is missing, cannot send message.");
      setIsTyping(false);
      return;
    }

    try {
      const res = await fetch('/.netlify/functions/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          thread_id: threadId
        }),
      });

      const data = await res.json();

      if (data.thread_id && data.run_id) {
        await pollForResponse(data.thread_id, data.run_id);
      } else {
        throw new Error("Could not start chat run.");
      }

    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages((prev) => [...prev, {
        id: Date.now().toString() + '_bot_error',
        text: 'Sorry, I could not process your request.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      }]);
      setIsTyping(false);
    }
  };

  const pollForResponse = async (threadId: string, runId: string) => {
    let completed = false;

    while (!completed) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Polling cada 1 segundo

      const res = await fetch('/.netlify/functions/check-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thread_id: threadId,
          run_id: runId
        }),
      });

      const data = await res.json();

      if (data.status === 'completed') {
        const botMessage: Message = {
          id: Date.now().toString() + '_bot',
          text: data.reply,
          sender: 'bot',
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
        completed = true;
      }
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