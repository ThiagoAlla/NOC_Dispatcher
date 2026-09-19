import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CardProps {
  id?: string;
  stepNumber?: number | string;
  title: string;
  subtitle?: string;
  tag?: { text: string; variant: 'group' | 'technical' };
  isTechnicalVariant?: boolean;
  defaultCollapsed?: boolean;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  id,
  stepNumber,
  title,
  subtitle,
  tag,
  isTechnicalVariant = false,
  defaultCollapsed = false,
  headerRight,
  children,
  className = '',
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <div
      id={id}
      className={`rounded-xl transition-all duration-200 mb-4 border ${
        isTechnicalVariant
          ? 'bg-noc-surface2/50 border-dashed border-noc-border/80 hover:border-noc-borderLight'
          : 'glass-card border-noc-border/60 hover:border-noc-signal/40'
      } ${className}`}
    >
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="p-4 sm:p-4.5 cursor-pointer select-none flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          {stepNumber && (
            <span className="inline-flex items-center justify-center bg-gradient-to-br from-noc-signal to-teal-400 text-noc-textDark text-xs font-black rounded-lg w-6 h-6 shadow-sm shadow-noc-signal/20 group-hover:scale-105 transition-transform">
              {stepNumber}
            </span>
          )}
          <div>
            <h2 className="text-sm sm:text-base font-bold text-noc-text group-hover:text-white flex items-center gap-2 flex-wrap transition-colors">
              {title}
              {tag && (
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    tag.variant === 'group'
                      ? 'bg-noc-signalDim text-noc-signal border border-noc-signal/30'
                      : 'bg-noc-surface3 text-noc-textDim border border-noc-border'
                  }`}
                >
                  {tag.text}
                </span>
              )}
            </h2>
            {subtitle && (
              <p className="text-xs text-noc-textDim mt-0.5 leading-snug">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {headerRight && <div onClick={(e) => e.stopPropagation()}>{headerRight}</div>}
          <div
            className={`w-7 h-7 rounded-lg bg-noc-surface3/60 border border-noc-border/60 flex items-center justify-center transition-all duration-200 group-hover:bg-noc-surface3 ${
              collapsed ? 'rotate-0' : 'rotate-180 bg-noc-signalDim border-noc-signal/30'
            }`}
          >
            <ChevronDown
              className={`w-4 h-4 transition-colors ${
                collapsed ? 'text-noc-textDim group-hover:text-noc-text' : 'text-noc-signal'
              }`}
            />
          </div>
        </div>
      </div>

      {!collapsed && (
        <div className="px-4 pb-4 sm:px-4.5 sm:pb-4.5 pt-1 border-t border-noc-border/30 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};
