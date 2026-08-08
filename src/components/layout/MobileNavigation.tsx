import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  MessageSquareCode, 
  Users, 
  Award, 
  Settings, 
  X, 
  Sparkles, 
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { NavTab } from '../../types';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  activeInterviewCount?: number;
  onLogout?: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  currentTab,
  onTabChange,
  activeInterviewCount = 1,
  onLogout,
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'interviews' as NavTab, label: 'Interviews', icon: MessageSquareCode, badge: activeInterviewCount ? 'Live' : undefined },
    { id: 'candidates' as NavTab, label: 'Candidates', icon: Users },
    { id: 'feedback' as NavTab, label: 'Feedback', icon: Award },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  const handleSelect = (tab: NavTab) => {
    onTabChange(tab);
    onClose();
  };

  const handleLogout = () => {
    onClose();
    if (onLogout) onLogout();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed top-0 bottom-0 left-0 w-[280px] max-w-[85vw] bg-[#111113] border-r border-[#27272A] flex flex-col justify-between shadow-2xl z-50 p-4"
          >
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-[#27272A] mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center text-white shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-[#F4F4F5]">InterviewForge</h2>
                    <p className="text-[10px] text-[#A1A1AA]">AI Technical Cohort</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-[#A1A1AA] hover:text-white rounded-lg hover:bg-[#151518] min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links */}
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                        isActive
                          ? 'bg-[#8B5CF6]/20 text-white border border-[#8B5CF6]/40'
                          : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#151518]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-5 h-5 ${
                            isActive ? 'text-[#8B5CF6]' : 'text-[#71717A]'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/40">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-[#27272A] space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#151518] border border-[#27272A]">
                <div className="w-8 h-8 rounded-full bg-[#3F3F46] flex items-center justify-center text-xs font-semibold text-white">
                  AC
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-white truncate flex items-center gap-1">
                    AI Cohort #4
                    <ShieldCheck className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  </p>
                  <p className="text-[10px] text-[#A1A1AA] truncate">Enterprise Evaluation</p>
                </div>
              </div>

              {onLogout && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-[#A1A1AA] hover:text-white bg-[#151518] rounded-lg border border-[#27272A] min-h-[44px]"
                >
                  <LogOut className="w-4 h-4 text-[#71717A]" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
