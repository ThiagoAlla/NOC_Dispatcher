import React from 'react';
import { CAUSES } from '../../constants/causes';
import { useIncidentStore } from '../../store/useIncidentStore';
import { Card } from '../ui/Card';

export const CauseSelector: React.FC = () => {
  const currentCause = useIncidentStore((s) => s.draft.causeId);
  const currentMoment = useIncidentStore((s) => s.draft.moment);
  const setCause = useIncidentStore((s) => s.setCause);

  if (currentMoment !== 'ab' && currentMoment !== 'en') {
    return null;
  }

  return (
    <Card
      id="card-causa"
      stepNumber="3"
      title="Causa Provável / Diagnóstico"
      subtitle="Define os cenários e ações técnicas padronizadas do comunicado"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {CAUSES.map((c) => {
          const isSelected = currentCause === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCause(c.id)}
              className={`rounded-xl p-3 text-left font-medium text-xs sm:text-sm transition-all duration-150 flex items-center gap-3 active:scale-[0.98] border ${
                isSelected
                  ? 'border-noc-signal/80 bg-gradient-to-r from-noc-signal/15 to-noc-surface2/90 text-noc-signal shadow-[0_0_15px_-3px_rgba(53,209,184,0.3)] ring-1 ring-noc-signal/40'
                  : 'border-noc-border/80 bg-noc-surface2/60 text-noc-text hover:text-white hover:bg-noc-surface2 hover:border-noc-signal/40 hover:shadow-sm'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 transition-transform ${
                isSelected ? 'bg-noc-signal/20 text-noc-signal' : 'bg-noc-surface text-noc-textDim'
              }`}>
                {c.icon}
              </div>
              <span className="truncate flex-1 font-semibold">{c.label}</span>
              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-noc-signal animate-pulse" />}
            </button>
          );
        })}
      </div>
    </Card>
  );
};
