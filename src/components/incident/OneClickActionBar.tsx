import React from 'react';
import { Zap } from 'lucide-react';
import { useIncidentStore } from '../../store/useIncidentStore';
import { ProgressStatusId } from '../../types/domain';

const QUICK_ACTIONS: { id: ProgressStatusId; icon: string; label: string }[] = [
  { id: 'semnov', icon: '⏳', label: 'Sem alteração' },
  { id: 'campo', icon: '🚚', label: 'Equipe no local' },
  { id: 'achou', icon: '🎯', label: 'Causa identificada' },
  { id: 'voltando', icon: '📈', label: 'Em restabelecimento' },
];

export const OneClickActionBar: React.FC = () => {
  const activeIncident = useIncidentStore((s) => s.activeIncident);
  const oneClickUpdate = useIncidentStore((s) => s.oneClickUpdate);
  const isDispatching = useIncidentStore((s) => s.isDispatching);

  if (!activeIncident || activeIncident.status === 'RESOLVED' || activeIncident.status === 'CLOSED') {
    return null;
  }

  return (
    <div className="bg-noc-surface3/40 border border-noc-border/80 p-2 sm:p-2.5 rounded-xl flex flex-wrap items-center gap-2.5 mt-3.5 backdrop-blur-md">
      <div className="flex items-center gap-1.5 text-[11px] font-black text-noc-signal uppercase tracking-wider pl-1">
        <Zap className="w-3.5 h-3.5 text-noc-signal animate-bounce" />
        <span>Atualização em 1 Clique:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 flex-1">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            disabled={isDispatching}
            onClick={() => oneClickUpdate(action.id)}
            className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-noc-surface2/90 hover:bg-noc-signalDim text-noc-text hover:text-noc-signal border border-noc-border hover:border-noc-signal/50 transition-all duration-150 active:scale-95 shadow-sm disabled:opacity-50"
          >
            <span className="group-hover:scale-110 transition-transform">{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
