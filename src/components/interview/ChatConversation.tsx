import React, { useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from '../../types';
import { ChatMessage } from './ChatMessage';
import { Sparkles } from 'lucide-react';

interface ChatConversationProps {
  messages: ChatMessageType[];
  isThinking?: boolean;
  onSelectSuggestion?: (suggestion: string) => void;
  sessionId?: string;
}

export const ChatConversation: React.FC<ChatConversationProps> = ({
  messages,
  isThinking = false,
  onSelectSuggestion,
  sessionId,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 scroll-smooth"
    >
      {/* Session Banner */}
      <div className="text-center py-3 my-2 border-b border-[#27272A]/60">
        <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider bg-[#111113] px-3 py-1 rounded-full border border-[#27272A]">
          Session ID: {sessionId || 'INT-2026-COHORT4'} · Adaptive AI Evaluator
        </span>
      </div>

      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          onSelectSuggestion={onSelectSuggestion}
        />
      ))}

      {/* AI Thinking / Evaluating animation state */}
      {isThinking && (
        <div className="flex items-center gap-3 my-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center text-white shrink-0 shadow-md">
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
          <div className="bg-[#1A1A1F] border border-[#27272A] px-4 py-3 rounded-2xl flex items-center gap-2 text-xs text-[#A1A1AA]">
            <span className="font-medium text-[#F4F4F5]">The Interview Agent is analyzing your reasoning</span>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
