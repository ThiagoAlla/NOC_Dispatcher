import React from 'react';
import { SEVERITIES } from '../../constants/severities';
import { useIncidentStore } from '../../store/useIncidentStore';
import { Card } from '../ui/Card';

export const SeveritySelector: React.FC = () => {
  const currentSeverity = useIncidentStore((s) => s.draft.severity);
  const setSeverity = useIncidentStore((s) => s.setSeverity);

  return (
    <Card
      id="card-sev"
      stepNumber="2"
      title="Classificação da Severidade"
      subtitle="Define o nível de impacto e a cadência obrigatória de SLA"
    >
      <div className="grid gap-2.5">
        {SEVERITIES.map((s) => {
          const isSelected = currentSeverity === s.id;
          const cadenceText = s.cadenceMinutes
            ? `Cadência: a cada ${s.cadenceMinutes < 60 ? `${s.cadenceMinutes} min` : `${s.cadenceMinutes / 60}h`}`
            : 'Avisos no início e conclusão';

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSeverity(s.id)}
              className={`rounded-xl p-3.5 text-left transition-all duration-150 flex items-start gap-3.5 w-full relative overflow-hidden group active:scale-[0.99] border ${
                isSelected
                  ? 'border-noc-border bg-noc-surface2/90 shadow-lg ring-1'
                  : 'border-noc-border/80 bg-noc-surface2/60 hover:bg-noc-surface2 hover:border-noc-border text-noc-text hover:shadow-md'
              }`}
              style={{
                borderColor: isSelected ? s.colorCss : undefined,
                boxShadow: isSelected ? `0 0 24px -6px ${s.colorCss}30` : undefined,
                background: isSelected
                  ? `linear-gradient(90deg, ${s.colorCss}12 0%, rgba(22, 32, 44, 0.9) 100%)`
                  : undefined,
              }}
            >
              {/* Barra de acento lateral esquerda */}
              <div
                className="w-1 absolute left-0 top-0 bottom-0 transition-opacity"
                style={{
                  backgroundColor: s.colorCss,
                  opacity: isSelected ? 1 : 0.4,
                }}
              />

              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: `${s.colorCss}15`,
                  border: `1px solid ${s.colorCss}35`,
                }}
              >
                {s.ico}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm text-noc-text group-hover:text-white">
                    {s.code} — {s.label}
                  </span>
                  <span
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0"
                    style={{
                      backgroundColor: `${s.colorCss}18`,
                      color: s.colorCss,
                      border: `1px solid ${s.colorCss}35`,
                    }}
                  >
                    {cadenceText}
                  </span>
                </div>
                <span className="text-xs text-noc-textDim block mt-1 leading-snug">
                  {s.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
};
