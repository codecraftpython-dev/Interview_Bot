import React from 'react';
import { Target, CheckCircle2, Clock, Sparkles, Layers, Sliders, ChevronRight, X } from 'lucide-react';
import { Badge } from '../common/Badge';

interface ContextPanelProps {
  currentFocus: string;
  difficulty: string;
  coveredTopics: { title: string; completed: boolean; active?: boolean }[];
  learningSignals: string[];
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const ContextPanel: React.FC<ContextPanelProps> = ({
  currentFocus,
  difficulty,
  coveredTopics,
  learningSignals,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const content = (
    <div className="space-y-5 text-left">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#8B5CF6]" />
          <h3 className="text-sm font-semibold text-[#F4F4F5]">Interview Context</h3>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 text-[#A1A1AA] hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Focus & Difficulty Specs */}
      <div className="space-y-2.5">
        <div className="bg-[#1A1A1F] p-3 rounded-xl border border-[#27272A] space-y-1">
          <span className="text-[10px] font-semibold text-[#71717A] uppercase tracking-wider block">
            Current Focus Topic
          </span>
          <p className="text-xs font-semibold text-[#F4F4F5] flex items-center justify-between">
            <span>{currentFocus}</span>
            <Badge variant="purple" size="sm">Active</Badge>
          </p>
        </div>

        <div className="bg-[#1A1A1F] p-3 rounded-xl border border-[#27272A] space-y-1">
          <span className="text-[10px] font-semibold text-[#71717A] uppercase tracking-wider block">
            Calibrated Difficulty
          </span>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#F4F4F5]">{difficulty}</span>
            <span className="text-[10px] font-medium text-[#22C55E] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              Adaptive Calibrated
            </span>
          </div>
        </div>
      </div>

      {/* Topics Matrix */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-[#71717A] uppercase tracking-wider block">
          Curriculum Coverage
        </span>
        <div className="space-y-1.5">
          {coveredTopics.map((topic, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                topic.completed
                  ? 'bg-[#151518] text-[#D4D4D8] border-[#27272A]'
                  : topic.active
                  ? 'bg-[#8B5CF6]/15 text-[#F4F4F5] border-[#8B5CF6]/40'
                  : 'bg-[#111113] text-[#71717A] border-[#1F1F24]'
              }`}
            >
              <span className="truncate pr-2">{topic.title}</span>
              {topic.completed ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
              ) : topic.active ? (
                <ChevronRight className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
              ) : (
                <span className="text-[10px] text-[#52525B]">Pending</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Learning Signals Detected */}
      <div className="space-y-2 pt-2 border-t border-[#27272A]">
        <span className="text-[11px] font-semibold text-[#71717A] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
          <span>Observed Learning Signals</span>
        </span>
        <div className="space-y-2">
          {learningSignals.map((signal, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-[#111113] border border-[#27272A] text-[11px] text-[#A1A1AA] leading-relaxed"
            >
              {signal}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Context Panel */}
      <aside className="hidden lg:block w-[280px] xl:w-[320px] shrink-0 bg-[#111113] border-l border-[#27272A] p-4 h-full overflow-y-auto">
        {content}
      </aside>

      {/* Mobile Modal Drawer Context Panel */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="fixed top-0 bottom-0 right-0 w-[300px] max-w-[85vw] bg-[#111113] border-l border-[#27272A] p-4 overflow-y-auto z-50 shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
