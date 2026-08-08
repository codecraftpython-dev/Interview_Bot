import React, { useState } from 'react';
import { Sparkles, User, Copy, Check, MessageSquare, Tag } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types';

interface ChatMessageProps {
  message: ChatMessageType;
  onSelectSuggestion?: (suggestion: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onSelectSuggestion,
}) => {
  const [copied, setCopied] = useState(false);
  const isAI = message.sender === 'ai';

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3 sm:gap-4 my-4 sm:my-6 ${isAI ? 'justify-start' : 'justify-end'}`}>
      {/* AI Avatar */}
      {isAI && (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center text-white shrink-0 shadow-md shadow-purple-500/20 mt-1">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      )}

      {/* Message Content Container */}
      <div className={`max-w-[92%] sm:max-w-[85%] lg:max-w-[78%] space-y-3 ${isAI ? 'text-left' : 'text-left'}`}>
        {/* Header Metadata */}
        <div className={`flex items-center gap-2 text-[11px] text-[#71717A] ${isAI ? '' : 'justify-end'}`}>
          <span className="font-semibold text-[#D4D4D8]">
            {isAI ? 'AI Technical Interviewer' : 'Sarah Johnson'}
          </span>
          <span>•</span>
          <span>{message.timestamp}</span>

          {message.topicTag && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#1F1F24] border border-[#27272A] text-[10px] text-[#A1A1AA] font-mono">
              <Tag className="w-2.5 h-2.5 text-[#8B5CF6]" />
              {message.topicTag}
            </span>
          )}
        </div>

        {/* Message Box */}
        <div
          className={`p-4 sm:p-5 rounded-2xl text-sm sm:text-base leading-relaxed border transition-all ${
            isAI
              ? 'bg-[#1A1A1F] text-[#F4F4F5] border-[#27272A] shadow-md'
              : 'bg-[#151518] text-[#F4F4F5] border-[#8B5CF6]/30 shadow-md shadow-purple-950/20'
          }`}
        >
          {/* Main Body Paragraphs */}
          <div className="space-y-3 whitespace-pre-line text-[#F4F4F5] font-normal">
            {message.text}
          </div>

          {/* Optional Embedded Code Snippet */}
          {message.codeSnippet && (
            <div className="mt-4 rounded-xl bg-[#09090B] border border-[#27272A] overflow-hidden text-xs font-mono">
              <div className="bg-[#111113] px-3 py-2 border-b border-[#27272A] flex items-center justify-between text-[#A1A1AA]">
                <span className="text-[11px] font-semibold text-[#8B5CF6] uppercase tracking-wider">
                  {message.codeSnippet.language}
                </span>
                <button
                  onClick={() => handleCopyCode(message.codeSnippet!.code)}
                  className="flex items-center gap-1 hover:text-white transition-colors text-[11px]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy code'}</span>
                </button>
              </div>
              <pre className="p-3.5 overflow-x-auto text-[#E4E4E7] leading-normal">
                <code>{message.codeSnippet.code}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Follow-up Suggestion Chips for AI messages */}
        {isAI && message.followUpSuggestions && message.followUpSuggestions.length > 0 && (
          <div className="pt-1">
            <p className="text-[11px] font-medium text-[#71717A] mb-2 flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-[#8B5CF6]" />
              <span>Suggested angles to answer:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {message.followUpSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectSuggestion && onSelectSuggestion(suggestion)}
                  className="px-3 py-1.5 rounded-lg bg-[#151518] hover:bg-[#1A1A1F] border border-[#27272A] hover:border-[#8B5CF6]/40 text-xs text-[#A1A1AA] hover:text-[#F4F4F5] transition-all text-left shadow-sm active:scale-[0.98]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Candidate Avatar */}
      {!isAI && (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#27272A] border border-[#3F3F46] flex items-center justify-center text-xs font-semibold text-white shrink-0 mt-1">
          SJ
        </div>
      )}
    </div>
  );
};
