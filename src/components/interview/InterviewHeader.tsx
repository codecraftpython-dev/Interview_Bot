import React from 'react';
import { Clock, Pause, Play, LogOut, Sliders } from 'lucide-react';
import { Button } from '../common/Button';
import appLogo from '../../assets/images/regenerated_image_1786262072506.png';

interface InterviewHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  focusTopic: string;
  elapsedSeconds: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onExit: () => void;
  onToggleContextMobile?: () => void;
  showContextMobileBtn?: boolean;
}

export const InterviewHeader: React.FC<InterviewHeaderProps> = ({
  currentQuestion,
  totalQuestions,
  focusTopic,
  elapsedSeconds,
  isPaused,
  onTogglePause,
  onExit,
  onToggleContextMobile,
  showContextMobileBtn = false,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round((currentQuestion / totalQuestions) * 100);

  return (
    <header className="bg-[#111113] border-b border-[#27272A] px-4 sm:px-6 py-3 sticky top-0 z-20 shadow-md">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Brand & Topic */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onExit}
            className="p-2 -ml-2 text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#151518] rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Exit Interview"
          >
            <LogOut className="w-4 h-4 text-[#71717A]" />
            <span className="hidden sm:inline">Exit</span>
          </button>

          <div className="h-4 w-[1px] bg-[#27272A] hidden sm:block" />

          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 shadow-sm shadow-purple-500/20">
              <img 
                src={appLogo} 
                alt="IntervViewForge logo" 
                className="w-full h-full object-cover scale-[1.30]" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-[#F4F4F5] truncate leading-tight">
                IntervViewForge
              </h2>
              <p className="text-[10px] sm:text-[11px] text-[#475569] dark:text-[#A1A1AA] truncate font-medium flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></span>
                <span className="truncate">{focusTopic}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Center: Progress Counter (Desktop Dots vs Mobile Text) */}
        <div className="flex flex-col items-center shrink-0">
          {/* Desktop dot indicators */}
          <div className="hidden sm:flex items-center gap-1.5 mb-1">
            {Array.from({ length: totalQuestions }).map((_, idx) => {
              const qNum = idx + 1;
              const isDone = qNum < currentQuestion;
              const isCurrent = qNum === currentQuestion;

              return (
                <span
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    isDone
                      ? 'bg-[#22C55E]'
                      : isCurrent
                      ? 'bg-[#8B5CF6] ring-4 ring-[#8B5CF6]/20 scale-110'
                      : 'bg-[#27272A]'
                  }`}
                  title={`Question ${qNum}`}
                />
              );
            })}
          </div>

          <div className="text-xs font-medium text-[#F4F4F5] flex items-center gap-1.5">
            <span className="text-[#8B5CF6] font-semibold sm:hidden">
              Q{currentQuestion}/{totalQuestions}
            </span>
            <span className="hidden sm:inline text-[#A1A1AA]">
              Question <strong className="text-[#F4F4F5]">{currentQuestion}</strong> of {totalQuestions}
            </span>
          </div>

          {/* Mobile thin progress bar */}
          <div className="w-20 sm:hidden h-1 bg-[#1A1A1F] rounded-full overflow-hidden mt-1 border border-[#27272A]">
            <div
              className="h-full bg-[#8B5CF6] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right: Timer & Pause / Mobile Context Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#151518] border border-[#27272A] text-xs font-mono text-[#D4D4D8]">
            <Clock className="w-3.5 h-3.5 text-[#A1A1AA]" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <button
            onClick={onTogglePause}
            className={`p-2 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 ${
              isPaused
                ? 'bg-[#F59E0B]/20 text-[#FDE68A] border-[#F59E0B]/40'
                : 'bg-[#151518] text-[#A1A1AA] hover:text-[#F4F4F5] border-[#27272A]'
            }`}
            aria-label={isPaused ? "Resume Session" : "Pause Session"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          {showContextMobileBtn && (
            <button
              onClick={onToggleContextMobile}
              className="lg:hidden p-2 text-[#A1A1AA] hover:text-white rounded-lg bg-[#151518] border border-[#27272A]"
              title="Toggle Interview Context"
            >
              <Sliders className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
