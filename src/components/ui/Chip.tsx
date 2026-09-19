import React from 'react';

interface ChipProps {
  label: string;
  onClick: (value: string) => void;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({ label, onClick, className = '' }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(label)}
      className={`border border-noc-border/80 bg-noc-surface text-noc-signal hover:text-white text-xs px-2.5 py-1 rounded-md transition-all duration-150 hover:border-noc-signal/60 hover:bg-noc-signal/15 hover:shadow-[0_0_10px_rgba(53,209,184,0.15)] active:scale-95 cursor-pointer font-medium ${className}`}
    >
      + {label}
    </button>
  );
};
