import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'indigo' | 'success' | 'warning' | 'danger' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px] font-medium gap-1 leading-none',
    md: 'px-2.5 py-1 text-xs font-medium gap-1.5',
  };

  const variantStyles = {
    purple: 'bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30',
    indigo: 'bg-[#6366F1]/15 text-[#A5B4FC] border border-[#6366F1]/30',
    success: 'bg-[#22C55E]/15 text-[#86EFAC] border border-[#22C55E]/30',
    warning: 'bg-[#F59E0B]/15 text-[#FDE68A] border border-[#F59E0B]/30',
    danger: 'bg-[#EF4444]/15 text-[#FCA5A5] border border-[#EF4444]/30',
    neutral: 'bg-[#1A1A1F] text-[#A1A1AA] border border-[#27272A]',
    outline: 'bg-transparent text-[#D4D4D8] border border-[#27272A]',
  };

  return (
    <span className={`inline-flex items-center rounded-md whitespace-nowrap ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
