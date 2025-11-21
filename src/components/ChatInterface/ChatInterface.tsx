import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatOptions from './ChatOptions';
import TypingIndicator from './TypingIndicator';
import { Message, Option } from '../../types/chat';
import { classifyAssistantMessage } from './classifyAssistantMessage';
import HowToWidget from './widgets/HowToWidget';
import TimeSavingsWidget from './widgets/TimeSavingsWidget';
import DemoConfirmationWidget from './widgets/DemoConfirmationWidget';
import TimeSavingsFormWidget from './widgets/TimeSavingsFormWidget';
import DemoFormWidget from './widgets/DemoFormWidget';
import UserContextWidget from './widgets/UserContextWidget';
import './ChatInterface.css';

type WidgetSubmitHandler = (widgetId: string, payload: any) => void;

type UserSegment = 'solo_clinician' | 'small_practice' | 'clinic_enterprise' | 'other';
type UserRole = 'clinician' | 'rbt' | 'supervisor' | 'clinical_director' | 'other';
type ConversationLanguage = 'en' | 'es';

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

const detectLanguage = (text: string): ConversationLanguage => {
  const lower = text.toLowerCase();

  // crude but effective heuristic for ES vs EN
  const hasSpanishAccent = /[áéíóúñü]/.test(lower);
  const spanishHints = [' hola', ' clínica', ' clinica', ' notas', ' semana', ' equipo', 'documentación', 'documentacion', 'gracias'];

  if (hasSpanishAccent || spanishHints.some((w) => lower.includes(w))) {
    return 'es';
  }

  return 'en';
};

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showSuggestionsButton, setShowSuggestionsButton] = useState(false);
  const [askedQuestionsIds, setAskedQuestionsIds] = useState<Set<string>>(new Set());

  const [userSegment, setUserSegment] = useState<UserSegment | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [contextWidgetMessageId, setContextWidgetMessageId] = useState<string | null>(null);
  const [conversationLanguage, setConversationLanguage] = useState<ConversationLanguage>('en');

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleWidgetSubmit: WidgetSubmitHandler = (widgetId, payload) => {
    const structuredText =
      `WidgetInput: ${widgetId}\n` + JSON.stringify(payload);

    void handleSend(structuredText);
  };

  const handleContextSubmit = (context: {
    segment: UserSegment;
    role: UserRole;
    customSegment?: string;
    customRole?: string;
  }) => {
    setUserSegment(context.segment);
    setUserRole(context.role);
    setContextWidgetMessageId(null);
  };

  const handleContextSkip = () => {
    setContextWidgetMessageId(null);
  };

  const handleSend = async (messageToSend?: string, optionId?: string) => {
    const messageText = messageToSend || input.trim();
    if (!messageText) return;

    // Track user message count and language (only for real user messages, not WidgetInput)
    const isWidgetInput = messageText.trim().startsWith('WidgetInput:');
    if (!isWidgetInput) {
      setUserMessageCount((prev) => prev + 1);
      setConversationLanguage(detectLanguage(messageText));
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);
    setShowSuggestions(false);
    setShowSuggestionsButton(true);

    // Mark question as asked if it came from a suggestion
    if (optionId) {
      setAskedQuestionsIds(prev => new Set([...prev, optionId]));
    }

    try {
      // Limit history to last 12 messages to manage tokens
      const MAX_HISTORY = 12;
      const slicedMessages = newMessages.slice(-MAX_HISTORY);

      // Convert to API format (role + content)
      const historyForAPI = slicedMessages
        .filter(msg => msg.sender === 'user' || msg.sender === 'bot')
        .map(msg => {
          let content = msg.text;

          // Add metadata to the last user message if we have context
          if (msg.sender === 'user' && msg.id === userMessage.id && (userSegment || userRole)) {
            const metaLines: string[] = [];
            if (userSegment) {
              metaLines.push(`UserSegment: ${userSegment}`);
            }
            if (userRole) {
              metaLines.push(`UserRole: ${userRole}`);
            }
            content = `${metaLines.join('\n')}\n${content}`;
          }

          return {
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content
          };
        });

      const res = await fetch('/.netlify/functions/onklinic-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyForAPI
        }),
      });

      const data = await res.json();

      if (data.reply) {
        const botMessage: Message = {
          id: Date.now().toString() + '_bot',
          text: data.reply,
          sender: 'bot',
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMessage]);

        // Show UserContextWidget after the second user message's response
        // if we don't have segment/role yet and haven't shown it already
        if (
          userMessageCount + 1 >= 2 && // +1 because we just incremented
          !userSegment &&
          !userRole &&
          !contextWidgetMessageId &&
          !isWidgetInput
        ) {
          setContextWidgetMessageId(botMessage.id);
        }
      } else {
        throw new Error("No reply received from agent.");
      }

      setIsTyping(false);

    } catch (error) {
      console.error('Agent error:', error);
      setMessages((prev) => [...prev, {
        id: Date.now().toString() + '_bot_error',
        text: 'Sorry, I could not process your request.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      }]);
      setIsTyping(false);
    }
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
        {messages.map((msg) => {
          // Do not render synthetic structured-input messages
          if (
            msg.sender === 'user' &&
            msg.text.trim().startsWith('WidgetInput:')
          ) {
            return null;
          }

          const widgetType = msg.sender === 'bot' ? classifyAssistantMessage(msg.text) : 'none';

          const textLower = msg.text.toLowerCase();
          const showTimeSavingsForm =
            msg.sender === 'bot' && textLower.includes('[[time_savings_form]]');
          const showDemoForm =
            msg.sender === 'bot' && textLower.includes('[[schedule_demo_form]]');

          return (
            <React.Fragment key={msg.id}>
              <ChatMessage message={msg} />

              {/* Output widgets (result) */}
              {widgetType === 'howto' && <HowToWidget />}
              {widgetType === 'time_savings' && (
                <TimeSavingsWidget messageText={msg.text} />
              )}
              {widgetType === 'demo_confirmation' && (
                <DemoConfirmationWidget messageText={msg.text} />
              )}

              {/* Input widgets (forms) */}
              {showTimeSavingsForm && (
                <TimeSavingsFormWidget onSubmitStructured={handleWidgetSubmit} />
              )}
              {showDemoForm && (
                <DemoFormWidget onSubmitStructured={handleWidgetSubmit} />
              )}

              {/* User context widget */}
              {contextWidgetMessageId === msg.id && (
                <UserContextWidget
                  language={conversationLanguage}
                  onSubmitContext={handleContextSubmit}
                  onSkip={handleContextSkip}
                />
              )}
            </React.Fragment>
          );
        })}
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