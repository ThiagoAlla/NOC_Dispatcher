import React from 'react';
import { AlertCircle, Plus, X } from 'lucide-react';
import { SEVERITIES_MAP } from '../../constants/severities';
import { useIncidentStore } from '../../store/useIncidentStore';

export const IncidentSwitcher: React.FC = () => {
  const openIncidents = useIncidentStore((s) => s.openIncidents);
  const activeIncident = useIncidentStore((s) => s.activeIncident);
  const switchIncident = useIncidentStore((s) => s.switchIncident);
  const createNewIncident = useIncidentStore((s) => s.createNewIncident);
  const deleteIncident = useIncidentStore((s) => s.deleteIncident);

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-thin">
      <button
        type="button"
        onClick={createNewIncident}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shrink-0 active:scale-95 ${
          !activeIncident
            ? 'bg-noc-signal text-noc-textDark border-noc-signal shadow-sm shadow-noc-signal/30'
            : 'bg-noc-surface2 text-noc-textDim border-noc-border hover:border-noc-signal/60 hover:text-white'
        }`}
      >
        <Plus className="w-3.5 h-3.5 stroke-[3]" />
        <span>Novo Evento</span>
      </button>

      {openIncidents.map((inc) => {
        const isSelected = activeIncident?.id === inc.id;
        const sev = SEVERITIES_MAP[inc.severity];
        const locations = inc.affectedLocations.join(', ') || 'Sem localidade';

        return (
          <div
            key={inc.id}
            onClick={() => switchIncident(inc.id)}
            className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all shrink-0 cursor-pointer select-none active:scale-[0.98] ${
              isSelected
                ? 'bg-noc-surface2 border-noc-signal/80 text-white shadow-md shadow-black/40 ring-1 ring-noc-signal/30'
                : 'bg-noc-surface2/50 text-noc-textDim border-noc-border/60 hover:border-noc-borderLight hover:text-noc-text'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
              style={{
                backgroundColor: sev.colorCss,
                boxShadow: isSelected ? `0 0 8px ${sev.colorCss}` : 'none',
              }}
            />
            <span className="font-mono font-black text-noc-text group-hover:text-white">
              {inc.codeNumber}
            </span>
            <span className="truncate max-w-[130px] text-noc-textDim group-hover:text-noc-text">
              {locations}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-noc-surface3 border border-noc-border text-noc-textFaint group-hover:text-noc-textDim font-mono">
              #{inc.updateCount}
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Deseja encerrar e fechar o evento ${inc.codeNumber}?`)) {
                  deleteIncident(inc.id);
                }
              }}
              title="Fechar evento"
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-noc-red/20 hover:text-noc-red transition-all ml-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}

      {openIncidents.length === 0 && !activeIncident && (
        <span className="text-xs text-noc-textFaint flex items-center gap-1.5 ml-2 font-medium">
          <AlertCircle className="w-3.5 h-3.5 text-noc-signal" />
          Nenhum incidente ativo no momento. Preencha o formulário abaixo para registrar.
        </span>
      )}
    </div>
  );
};
