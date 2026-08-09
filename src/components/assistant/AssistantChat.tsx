import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCcw, Send, Bot, User, ArrowRight, Sparkles } from 'lucide-react';
import { NavTab, Candidate } from '../../types';
import assistantBotImage from '../../assets/images/regenerated_image_1786262072506.png';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AssistantChatProps {
  currentTab?: NavTab;
  activeCandidate?: Candidate;
}

const DEFAULT_GREETING = "Hi! I'm the IntervViewForge Assistant. I can explain how the platform works, guide you through the interview process, explain candidate data and feedback, or answer questions about the UI.";

const SUGGESTED_QUESTIONS = [
  "How does the AI interview work?",
  "What does mission progress mean?",
  "How is feedback generated?",
  "What can I do on this dashboard?",
  "How do I delete an interview?",
];

// Helper to render basic markdown formatting: bold (**text**), bullet points (- or *), newlines
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const paragraphs = text.split('\n\n');
  return (
    <div className="space-y-2">
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n');
        return (
          <div key={pIdx} className="space-y-1">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
              const cleanLine = isBullet ? trimmed.substring(2) : line;

              // Process **bold text**
              const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
              const renderedParts = parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <strong key={i} className="font-semibold text-purple-700 dark:text-purple-300">
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                return part;
              });

              if (isBullet) {
                return (
                  <div key={lIdx} className="flex items-start gap-1.5 pl-1">
                    <span className="text-purple-500 dark:text-purple-400 font-bold leading-tight">•</span>
                    <span className="leading-relaxed">{renderedParts}</span>
                  </div>
                );
              }

              return <p key={lIdx} className="leading-relaxed">{renderedParts}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
};

export const AssistantChat: React.FC<AssistantChatProps> = ({ currentTab = 'dashboard', activeCandidate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-0',
      role: 'assistant',
      content: DEFAULT_GREETING,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    setInputMessage('');

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          pageContext: {
            currentTab,
            candidateName: activeCandidate?.name,
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const assistantReply = data.reply || "I'm sorry, I couldn't generate a response. Please try asking again.";

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: assistantReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Error sending message to assistant:', err);
      setErrorMessage('Sorry, I couldn\'t process that right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: DEFAULT_GREETING,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setErrorMessage(null);
  };

  const isInterviewTab = currentTab === 'interview';

  return (
    <>
      {/* Floating Launcher Button at Bottom-Right (Repositioned on Interview tab to avoid input bar) */}
      <div
        className={`fixed right-4 sm:right-6 z-50 transition-all duration-300 ${
          isInterviewTab ? 'bottom-36 sm:bottom-40' : 'bottom-6'
        }`}
      >
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle IntervViewForge Assistant"
          title="IntervViewForge Assistant"
          className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-full shadow-2xl shadow-purple-500/30 flex items-center justify-center transition-all duration-300 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-slate-900 dark:bg-[#18181B] border border-purple-500/40 hover:border-purple-400 hover:scale-105 ${
            isOpen ? 'scale-95 ring-2 ring-purple-500/60' : ''
          }`}
        >
          {/* Custom Chatbot Image Container */}
          <div className="w-full h-full p-1 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src={assistantBotImage}
              alt="IntervViewForge Assistant"
              className="w-full h-full object-contain rounded-full transition-transform duration-300 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Status badge / Close indicator overlay */}
          {isOpen ? (
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-purple-600 text-white border-2 border-[#09090B] flex items-center justify-center shadow-md animate-in fade-in zoom-in-75 duration-200">
              <X className="w-3.5 h-3.5" />
            </div>
          ) : (
            <>
              <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#09090B] animate-ping" />
              <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#09090B]" />
            </>
          )}
        </button>
      </div>

      {/* Compact Chat Panel Window */}
      {isOpen && (
        <div
          className={`fixed right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[390px] bg-white dark:bg-[#111113] border border-slate-200/90 dark:border-[#27272A] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900 dark:text-[#F4F4F5] ${
            isInterviewTab
              ? 'bottom-[200px] sm:bottom-[220px] h-[480px] max-h-[calc(100vh-240px)]'
              : 'bottom-22 h-[520px] max-h-[calc(100vh-110px)]'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-[#151518] border-b border-slate-200 dark:border-[#27272A] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-purple-500/30 overflow-hidden shrink-0 shadow-md shadow-purple-500/20 flex items-center justify-center p-0.5">
                <img
                  src={assistantBotImage}
                  alt="IntervViewForge Assistant Avatar"
                  className="w-full h-full object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-slate-900 dark:text-[#F4F4F5] truncate leading-tight flex items-center gap-1.5">
                  IntervViewForge Assistant
                </h3>
                <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium truncate">
                  Gemini AI Platform Guide
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Start new conversation"
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-[#F4F4F5] hover:bg-slate-200/60 dark:hover:bg-[#27272A] rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-[#F4F4F5] hover:bg-slate-200/60 dark:hover:bg-[#27272A] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400 dark:text-[#71717A]">
                  {msg.role === 'assistant' ? (
                    <>
                      <Bot className="w-3 h-3 text-purple-500" />
                      <span className="font-semibold text-slate-600 dark:text-[#A1A1AA]">Assistant</span>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">You</span>
                      <User className="w-3 h-3 text-purple-500" />
                    </>
                  )}
                  <span>• {msg.timestamp}</span>
                </div>

                <div
                  className={`px-3.5 py-2.5 rounded-2xl max-w-[88%] text-xs shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-[#7C3AED] text-white rounded-tr-xs font-medium'
                      : 'bg-slate-100 dark:bg-[#1E1E22] text-slate-800 dark:text-[#E4E4E7] border border-slate-200/80 dark:border-[#27272A] rounded-tl-xs'
                  }`}
                >
                  <FormattedText text={msg.content} />
                </div>
              </div>
            ))}

            {/* Suggested Questions Pills (shown when only greeting exists) */}
            {messages.length === 1 && !isLoading && (
              <div className="pt-2 space-y-2 animate-in fade-in duration-300">
                <p className="text-[11px] font-medium text-slate-500 dark:text-[#A1A1AA] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-500" /> Suggested Questions:
                </p>
                <div className="flex flex-col gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="text-left text-[11px] px-3 py-2 rounded-xl bg-purple-50 dark:bg-[#1A1A22] hover:bg-purple-100 dark:hover:bg-[#252532] text-purple-900 dark:text-purple-200 border border-purple-200/70 dark:border-purple-500/20 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <span className="truncate pr-2">{q}</span>
                      <ArrowRight className="w-3 h-3 text-purple-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex flex-col items-start animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400 dark:text-[#71717A]">
                  <Bot className="w-3 h-3 text-purple-500" />
                  <span className="font-semibold text-slate-600 dark:text-[#A1A1AA]">Assistant</span>
                </div>
                <div className="px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#1E1E22] border border-slate-200/80 dark:border-[#27272A] text-slate-500 dark:text-[#A1A1AA] rounded-tl-xs flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" />
                  </div>
                  <span className="text-[11px] font-medium">Thinking...</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center justify-between">
                <span>{errorMessage}</span>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 font-semibold underline text-[11px] cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-50 dark:bg-[#151518] border-t border-slate-200 dark:border-[#27272A] rounded-b-2xl shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about IntervViewForge..."
                disabled={isLoading}
                className="flex-1 bg-white dark:bg-[#1C1C20] border border-slate-200 dark:border-[#27272A] focus:border-purple-500 dark:focus:border-purple-500 text-slate-900 dark:text-[#F4F4F5] placeholder-slate-400 dark:placeholder-[#71717A] text-xs rounded-xl px-3.5 py-2.5 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 dark:disabled:bg-[#27272A] text-white disabled:text-slate-400 dark:disabled:text-[#71717A] transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
