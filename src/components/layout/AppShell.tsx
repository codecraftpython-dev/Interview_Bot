import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { MobileNavigation } from './MobileNavigation';
import { NavTab } from '../../types';

interface AppShellProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  children: React.ReactNode;
  isInterviewActive?: boolean;
  onLogout?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentTab,
  onTabChange,
  children,
  isInterviewActive = false,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#09090B] text-[#F4F4F5] flex flex-col md:flex-row antialiased selection:bg-[#8B5CF6]/30 selection:text-purple-200">
      {/* Desktop Sidebar (hidden on mobile) */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={onTabChange}
        activeInterviewCount={isInterviewActive ? 1 : 0}
        onLogout={onLogout}
      />

      {/* Mobile Header (hidden on desktop) */}
      <MobileHeader
        currentTab={currentTab}
        isMenuOpen={isMobileMenuOpen}
        onToggleMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        isInterviewActive={isInterviewActive}
      />

      {/* Mobile Drawer Navigation */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentTab={currentTab}
        onTabChange={onTabChange}
        activeInterviewCount={isInterviewActive ? 1 : 0}
        onLogout={onLogout}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto pb-12 md:pb-6">
        {children}
      </main>
    </div>
  );
};
