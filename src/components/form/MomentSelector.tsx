import React from 'react';
import { MOMENTS } from '../../constants/moments';
import { useIncidentStore } from '../../store/useIncidentStore';
import { Card } from '../ui/Card';

export const MomentSelector: React.FC = () => {
  const currentMoment = useIncidentStore((s) => s.draft.moment);
  const setMoment = useIncidentStore((s) => s.setMoment);

  return (
    <Card
      id="card-step1"
      stepNumber="1"
      title="Tipo de Comunicado"
      subtitle="Selecione a fase operacional em que o incidente se encontra"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {MOMENTS.map((m) => {
          const isSelected = currentMoment === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMoment(m.id)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between relative overflow-hidden group active:scale-[0.98] ${
                isSelected
                  ? 'border-noc-signal/80 bg-gradient-to-b from-noc-signal/15 to-noc-surface2/90 shadow-[0_0_20px_-5px_rgba(53,209,184,0.3)] ring-1 ring-noc-signal/50'
                  : 'border-noc-border/80 bg-noc-surface2/70 hover:bg-noc-surface2 hover:border-noc-signal/40 hover:shadow-lg'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-12 h-12 bg-noc-signal/10 rounded-bl-full pointer-events-none" />
              )}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-transform group-hover:scale-110 ${
                    isSelected ? 'bg-noc-signal/20 border border-noc-signal/40 text-noc-signal shadow-[0_0_10px_rgba(53,209,184,0.2)]' : 'bg-noc-surface border border-noc-border text-noc-text'
                  }`}>
                    {m.icon}
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-noc-signal animate-pulse" />
                  )}
                </div>
                <span
                  className={`font-bold text-sm block leading-tight ${
                    isSelected ? 'text-noc-signal' : 'text-noc-text group-hover:text-white'
                  }`}
                >
                  {m.title}
                </span>
                <span className="text-xs text-noc-textDim block mt-1.5 leading-snug">
                  {m.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
};
