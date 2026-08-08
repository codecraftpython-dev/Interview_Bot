import React from 'react';
import { Sparkles, Menu, X, Radio } from 'lucide-react';
import { NavTab } from '../../types';

interface MobileHeaderProps {
  currentTab: NavTab;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  isInterviewActive?: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  currentTab,
  isMenuOpen,
  onToggleMenu,
  isInterviewActive = false,
}) => {
  const getTabLabel = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard';
      case 'interviews': return 'Interview Session';
      case 'candidates': return 'Cohort Candidates';
      case 'feedback': return 'Evaluation Feedback';
      case 'settings': return 'Platform Settings';
    }
  };

  return (
    <header className="md:hidden sticky top-0 z-40 w-full bg-[#111113]/95 backdrop-blur-md border-b border-[#27272A] px-4 py-3 flex items-center justify-between min-h-[56px]">
      {/* Brand & Page Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center text-white shrink-0 shadow-sm shadow-purple-500/20">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xs font-semibold text-[#F4F4F5] truncate leading-tight">
            InterviewForge
          </h1>
          <p className="text-[10px] text-[#A1A1AA] truncate font-medium">
            {getTabLabel(currentTab)}
          </p>
        </div>
      </div>

      {/* Right Action & Menu Toggle */}
      <div className="flex items-center gap-2">
        {isInterviewActive && currentTab === 'interviews' && (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30 text-[10px] font-semibold">
            <Radio className="w-3 h-3 text-[#22C55E] animate-pulse" />
            Live Session
          </span>
        )}

        <button
          onClick={onToggleMenu}
          className="p-2.5 -mr-1.5 text-[#A1A1AA] hover:text-white rounded-lg hover:bg-[#151518] focus:outline-none focus:ring-2 focus:ring-purple-500/50 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};
