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
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { NavTab } from '../../types';
import { useTheme } from '../../context/ThemeContext';

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
  const { theme, setTheme } = useTheme();

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
            className="fixed top-0 bottom-0 left-0 w-[280px] max-w-[85vw] bg-[#111113] border-r border-[#27272A] flex flex-col justify-between shadow-2xl z-50 p-4 overflow-y-auto"
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
                    <p className="text-[10px] text-[#A1A1AA]">Interview Platform</p>
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

              {/* Theme Toggle Section */}
              <div className="mt-4 p-3 rounded-xl bg-[#151518] border border-[#27272A] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#71717A] uppercase tracking-wider px-0.5">
                  <span>Appearance</span>
                  <span className="capitalize text-[#8B5CF6] font-bold">{theme} Mode</span>
                </div>
                <div className="p-1 rounded-lg bg-[#111113] border border-[#27272A] flex items-center justify-between text-xs gap-1">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md font-medium transition-all min-h-[40px] ${
                      theme === 'light'
                        ? 'bg-[#8B5CF6] text-white shadow-sm'
                        : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#151518]'
                    }`}
                    aria-label="Switch to light mode"
                  >
                    <Sun className="w-4 h-4" />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md font-medium transition-all min-h-[40px] ${
                      theme === 'dark'
                        ? 'bg-[#8B5CF6] text-white shadow-sm'
                        : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#151518]'
                    }`}
                    aria-label="Switch to dark mode"
                  >
                    <Moon className="w-4 h-4" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-[#27272A] space-y-3 mt-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#151518] border border-[#27272A]">
                <div className="w-8 h-8 rounded-full bg-[#3F3F46] flex items-center justify-center text-xs font-semibold text-white">
                  IA
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-white truncate flex items-center gap-1">
                    Interview Agent
                    <ShieldCheck className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  </p>
                  <p className="text-[10px] text-[#A1A1AA] truncate">Interview Workspace</p>
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

