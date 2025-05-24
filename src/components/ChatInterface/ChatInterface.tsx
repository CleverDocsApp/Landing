import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { Message } from '../../types/chat';
import './ChatInterface.css';

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Some still doubt that an AI can really assist with clinical documentation...\n\nLet's find out. You lead — I assist.\n\nDescribe a case — even in your own words. It doesn't need to be perfect — I've seen worse 😉",
    sender: 'bot',
    timestamp: new Date().toISOString(),
  },
];

const progressSteps = [
  { id: 'analyze', text: '🧠 Analyzing tone and case complexity...' },
  { id: 'check', text: '📋 Checking for clinical patterns and compliance markers...' },
  { id: 'draft', text: '✍️ Drafting your assistant-ready documentation...' },
];

const sampleNote = {
  title: 'Progress Note',
  content: `<div class="demo-content">
    <h4>Progress Note</h4>
    <div class="note-section">
      <h5>Subjective</h5>
      <p><span class="highlight">Client presents as a teenager experiencing anxiety symptoms</span>, with reported school attendance issues. Parents express significant concern about academic performance and social withdrawal. Client acknowledges feeling overwhelmed.</p>
    </div>
    
    <div class="note-section">
      <h5>Objective</h5>
      <p>Client displays physical symptoms of anxiety including restlessness and difficulty concentrating. <span class="highlight">Missed 3 out of last 5 scheduled sessions</span>. GAD-7 score: 15 (severe anxiety range).</p>
    </div>
    
    <div class="note-section">
      <h5>Assessment</h5>
      <p>Client meets criteria for <span class="highlight">F41.1 Generalized Anxiety Disorder</span> with academic and social impairment. Recent pattern of missed sessions suggests potential avoidance behavior requiring attention.</p>
    </div>
    
    <div class="note-section">
      <h5>Plan</h5>
      <p>1. Continue weekly CBT sessions with focus on school-related anxiety
      2. Implement gradual exposure hierarchy for school attendance
      3. Schedule parent consultation to address attendance support</p>
    </div>
    
    <div class="compliance-check">
      <p>✅ Medical necessity documented</p>
      <p>✅ Symptoms linked to diagnosis</p>
      <p>✅ Treatment plan aligned with presentation</p>
      <p>⚠️ Consider adding specific intervention effectiveness</p>
    </div>
  </div>`,
};

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showNote, setShowNote] = useState<boolean>(false);
  const [showFollowUp, setShowFollowUp] = useState<boolean>(false);
  const [showHumor, setShowHumor] = useState<boolean>(false);
  const [showCta, setShowCta] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      const { scrollHeight, clientHeight } = chatMessagesRef.current;
      const maxScroll = scrollHeight - clientHeight;
      const currentScroll = chatMessagesRef.current.scrollTop;
      const isNearBottom = maxScroll - currentScroll < 100;

      if (isNearBottom) {
        chatMessagesRef.current.scrollTo({
          top: scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showNote, showFollowUp, showHumor, showCta]);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date().toISOString(),
    }]);
  };

 const processInput = async () => {
  if (inputValue.trim() === '') return;
  addMessage(inputValue, 'user');
  setInputValue('');
  setIsProcessing(true);

  try {
    const res = await fetch("/.netlify/functions/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: inputValue })
    });
   const data = await res.json();
console.log("Respuesta del bot GPT:", data.reply);
addMessage(data.reply || '⚠️ Respuesta vacía', 'bot');
  } catch (error) {
    addMessage("Lo siento, hubo un error al contactar con el asistente.", 'bot');
  } finally {
    setIsProcessing(false);
  }
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    processInput();
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="chat-header-left">
          <Bot size={24} className="text-primary" />
          <div>
            <div className="chat-header-title">On Klinic AI Assistant</div>
            <div className="chat-header-subtitle">Your documentation partner</div>
          </div>
        </div>
      </div>
      
      <div className="chat-messages" ref={chatMessagesRef}>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isProcessing && (
          <div className="progress-indicator">
            {progressSteps[currentStep].text}
          </div>
        )}
        
        {showNote && (
          <div className="bot-message">
            <div dangerouslySetInnerHTML={{ __html: sampleNote.content }} />
          </div>
        )}
        
        {showFollowUp && (
          <ChatMessage
            message={{
              id: 'follow-up',
              text: "Of course, you can tweak anything — I'm just your assistant.\n\nAnd this is just the beginning — when we work together on real cases, I learn how you write, think, and document.\n\nThe more you use me, the better I assist — like a smart scribe who adapts to you. 💡",
              sender: 'bot',
              timestamp: new Date().toISOString(),
            }}
          />
        )}
        
        {showHumor && (
          <ChatMessage
            message={{
              id: 'humor',
              text: "🤖 P.S. I don't drink coffee, I don't take breaks, and I never complain about your handwriting.\nBut I'll still help you document like a pro.",
              sender: 'bot',
              timestamp: new Date().toISOString(),
            }}
          />
        )}
        
        {showCta && (
          <div className="cta-container">
            <button className="cta-button">Try it with a real case — Start Free Trial</button>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Teen with anxiety, skipped sessions, parents worried..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isProcessing}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={isProcessing}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
