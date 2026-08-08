import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft, Code2, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

interface AnswerInputProps {
  onSendMessage: (text: string) => void;
  isThinking?: boolean;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
  onSendMessage,
  isThinking = false,
}) => {
  const [input, setInput] = useState('');
  const [emptyWarning, setEmptyWarning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea up to max-height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (isThinking) return;
    if (!input.trim()) {
      setEmptyWarning(true);
      setTimeout(() => setEmptyWarning(false), 3000);
      return;
    }
    setEmptyWarning(false);
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertSnippetPlaceholder = () => {
    setInput((prev) => prev + '\n```typescript\n// Explain code or architecture trade-offs here\n```\n');
  };

  return (
    <div className="bg-[#111113] border-t border-[#27272A] p-3 sm:p-4 sticky bottom-0 z-20">
      <div className="max-w-5xl mx-auto space-y-2">
        {/* Warning if user attempts empty submission */}
        {emptyWarning && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#F87171] text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Please enter a technical answer before submitting.</span>
          </div>
        )}

        {/* Quick Toolbar / Helper Badges */}
        <div className="flex items-center justify-between text-xs text-[#71717A] px-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={insertSnippetPlaceholder}
              disabled={isThinking}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#1A1A1F] border border-[#27272A] hover:border-[#3F3F46] text-[11px] text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors disabled:opacity-50"
            >
              <Code2 className="w-3 h-3 text-[#8B5CF6]" />
              <span>Insert Code Snippet</span>
            </button>
          </div>
          <span className="hidden sm:inline-block text-[11px] text-[#71717A]">
            Technical responses are evaluated for architectural depth
          </span>
        </div>

        {/* Input Textarea & Send Control Box */}
        <div className="relative rounded-xl bg-[#151518] border border-[#27272A] focus-within:border-[#8B5CF6] focus-within:ring-1 focus-within:ring-[#8B5CF6]/50 transition-all p-2 sm:p-3 shadow-inner">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (emptyWarning && e.target.value.trim()) setEmptyWarning(false);
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              isThinking
                ? 'Evaluating engineering reasoning and generating next probe question...'
                : "Explain your approach... (e.g., 'I would investigate Maximal Marginal Relevance (MMR) re-ranking or Parent Document retrieval...')"
            }
            disabled={isThinking}
            rows={2}
            className="w-full bg-transparent text-[#F4F4F5] text-sm sm:text-base placeholder-[#71717A] focus:outline-none resize-none leading-relaxed min-h-[50px] max-h-[180px] disabled:opacity-50"
          />

          {/* Footer inside Input Box */}
          <div className="flex items-center justify-between pt-2 border-t border-[#27272A]/50 mt-1">
            <div className="flex items-center gap-2 text-[11px] text-[#71717A]">
              <span className="hidden sm:inline-flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-[#1A1A1F] border border-[#27272A] font-mono text-[10px]">Enter</kbd>
                to send
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Shift + Enter for new line</span>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleSend}
              disabled={!input.trim() || isThinking}
              icon={
                isThinking ? (
                  <Sparkles className="w-4 h-4 animate-spin text-[#A78BFA]" />
                ) : (
                  <Send className="w-4 h-4" />
                )
              }
              className="min-w-[100px]"
            >
              {isThinking ? 'Evaluating...' : 'Send'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
