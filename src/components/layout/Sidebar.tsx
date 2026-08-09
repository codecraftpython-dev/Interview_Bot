import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquareCode, 
  Users, 
  Award, 
  Settings, 
  Sparkles, 
  ShieldCheck,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { NavTab } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import appLogo from '../../assets/images/regenerated_image_1786262072506.png';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  activeInterviewCount?: number;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
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

  return (
    <aside 
      className="hidden md:flex flex-col w-[250px] shrink-0 h-screen bg-white dark:bg-[#111113] border-r border-slate-200 dark:border-[#27272A] select-none z-30 overflow-hidden"
      aria-label="Desktop Sidebar Navigation"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200 dark:border-[#27272A]/80">
        <button 
          onClick={() => onTabChange('dashboard')}
          className="flex items-center gap-3 text-left w-full focus:outline-none group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <img 
              src={appLogo} 
              alt="IntervViewForge logo" 
              className="w-full h-full object-cover scale-[1.30]" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-[#0F172A] dark:text-[#F4F4F5] tracking-tight leading-snug truncate">
              IntervViewForge
            </h1>
            <p className="text-[11px] text-[#475569] dark:text-[#A1A1AA] flex items-center gap-1 font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
              Interview Platform
            </p>
          </div>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold text-[#64748B] dark:text-[#71717A] uppercase tracking-wider">
          Platform
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 group ${
                isActive
                  ? 'bg-[#8B5CF6]/15 text-[#7C3AED] dark:text-white border border-[#8B5CF6]/40 shadow-sm'
                  : 'text-[#334155] dark:text-[#A1A1AA] hover:text-[#0F172A] dark:hover:text-[#F4F4F5] hover:bg-[#F1F5F9] dark:hover:bg-[#151518]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive 
                      ? 'text-[#7C3AED] dark:text-[#8B5CF6]' 
                      : 'text-[#64748B] dark:text-[#71717A] group-hover:text-[#0F172A] dark:group-hover:text-[#A1A1AA]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#7C3AED] dark:text-[#C4B5FD] border border-[#8B5CF6]/40">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Theme Toggle Section */}
      <div className="px-3 py-2.5 mx-3 rounded-xl bg-slate-50 dark:bg-[#151518] border border-slate-200 dark:border-[#27272A] space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-bold text-[#64748B] dark:text-[#71717A] uppercase tracking-wider px-1">
          <span>Appearance</span>
          <span className="capitalize text-[#7C3AED] dark:text-[#8B5CF6] font-extrabold">{theme} Mode</span>
        </div>
        <div className="p-1 rounded-lg bg-white dark:bg-[#111113] border border-slate-200 dark:border-[#27272A] flex items-center justify-between text-xs gap-1">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md font-semibold transition-all ${
              theme === 'light'
                ? 'bg-[#8B5CF6] text-white shadow-sm'
                : 'text-[#475569] dark:text-[#A1A1AA] hover:text-[#0F172A] dark:hover:text-[#F4F4F5] hover:bg-[#F1F5F9] dark:hover:bg-[#151518]'
            }`}
            aria-label="Switch to light mode"
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light</span>
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md font-semibold transition-all ${
              theme === 'dark'
                ? 'bg-[#8B5CF6] text-white shadow-sm'
                : 'text-[#475569] dark:text-[#A1A1AA] hover:text-[#0F172A] dark:hover:text-[#F4F4F5] hover:bg-[#F1F5F9] dark:hover:bg-[#151518]'
            }`}
            aria-label="Switch to dark mode"
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark</span>
          </button>
        </div>
      </div>

      {/* Bottom Profile Footer */}
      <div className="p-3.5 m-3 rounded-xl bg-slate-50 dark:bg-[#151518] border border-slate-200 dark:border-[#27272A] space-y-2.5">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3F3F46] to-[#71717A] flex items-center justify-center text-xs font-semibold text-white border border-[#3F3F46]">
              IA
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#22C55E] ring-2 ring-white dark:ring-[#151518]" />
          </div>
          <div className="overflow-hidden min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-[#0F172A] dark:text-[#F4F4F5] truncate">Interview Agent</span>
              <ShieldCheck className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
            </div>
            <p className="text-[11px] text-[#475569] dark:text-[#71717A] font-medium truncate">Interview Workspace</p>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full pt-2 border-t border-slate-200 dark:border-[#27272A] flex items-center gap-2 text-xs font-semibold text-[#334155] dark:text-[#A1A1AA] hover:text-[#0F172A] dark:hover:text-[#F4F4F5] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-[#64748B] dark:text-[#71717A]" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
};

