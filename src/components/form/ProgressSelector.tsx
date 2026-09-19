import React from 'react';
import { PROGRESS_STATUSES } from '../../constants/progress';
import { useIncidentStore } from '../../store/useIncidentStore';
import { Card } from '../ui/Card';

export const ProgressSelector: React.FC = () => {
  const currentMoment = useIncidentStore((s) => s.draft.moment);
  const currentProgress = useIncidentStore((s) => s.draft.progressStatusId);
  const setProgress = useIncidentStore((s) => s.setProgress);

  if (currentMoment !== 'at') {
    return null;
  }

  return (
    <Card
      id="card-and"
      stepNumber="3"
      title="Status do Andamento Técnico"
      subtitle="Selecione o estado operacional para esta atualização"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {PROGRESS_STATUSES.map((a) => {
          const isSelected = currentProgress === a.id;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => setProgress(a.id)}
              className={`rounded-xl p-3 text-left font-medium text-xs sm:text-sm transition-all duration-150 flex items-center gap-3 active:scale-[0.98] border ${
                isSelected
                  ? 'border-noc-signal/80 bg-gradient-to-r from-noc-signal/15 to-noc-surface2/90 text-noc-signal shadow-[0_0_15px_-3px_rgba(53,209,184,0.3)] ring-1 ring-noc-signal/40'
                  : 'border-noc-border/80 bg-noc-surface2/60 text-noc-text hover:text-white hover:bg-noc-surface2 hover:border-noc-signal/40 hover:shadow-sm'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 transition-transform ${
                isSelected ? 'bg-noc-signal/20 text-noc-signal' : 'bg-noc-surface text-noc-textDim'
              }`}>
                {a.icon}
              </div>
              <span className="truncate flex-1 font-semibold">{a.label}</span>
              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-noc-signal animate-pulse" />}
            </button>
          );
        })}
      </div>
    </Card>
  );
};
