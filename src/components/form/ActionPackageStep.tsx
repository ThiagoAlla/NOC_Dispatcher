import React from 'react';
import { ACTION_PACKAGES } from '../../constants/packages';
import { PRESET_CUSTOMER_SCRIPTS, PRESET_EXTRA_ORIENTATIONS } from '../../constants/presets';
import { useIncidentStore } from '../../store/useIncidentStore';
import { Card } from '../ui/Card';

export const ActionPackageStep: React.FC = () => {
  const draft = useIncidentStore((s) => s.draft);
  const setActionPackage = useIncidentStore((s) => s.setActionPackage);
  const setDraftField = useIncidentStore((s) => s.setDraftField);

  const { moment, actionPackageId, extraOrientation, customerScript } = draft;

  if (moment === 'en') {
    return null;
  }

  const isResolvedMoment = moment === 'nr';
  const cardTitle = isResolvedMoment ? 'Diretrizes de Normalização' : 'Diretrizes para as Equipes';

  const inputClasses =
    'w-full text-sm p-2.5 bg-[#0C1219] border border-noc-border/80 rounded-lg text-noc-text placeholder:text-noc-textFaint focus:outline-none focus:border-noc-signal focus:ring-2 focus:ring-noc-signal/25 transition-all';
  const selectPresetClasses =
    'w-full text-xs p-2 bg-noc-surface border border-noc-border/70 rounded-lg text-noc-textDim focus:outline-none focus:border-noc-signal/60 mb-1.5 cursor-pointer';

  return (
    <Card
      id="card-areas"
      stepNumber="5"
      title={cardTitle}
      tag={{ text: 'Vai para o Grupo', variant: 'group' }}
      subtitle="Orientações de postura para atendimento, lojas e equipes técnicas"
    >
      {!isResolvedMoment && (
        <div className="grid gap-2.5 mb-4">
          {ACTION_PACKAGES.map((p) => {
            if (p.onlyForMoment && p.onlyForMoment !== moment) {
              return null;
            }

            const isSelected = actionPackageId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActionPackage(p.id)}
                className={`rounded-xl p-3.5 text-left transition-all duration-150 flex items-start gap-3 w-full border active:scale-[0.99] relative overflow-hidden group ${
                  isSelected
                    ? 'border-noc-signal/80 bg-gradient-to-r from-noc-signal/15 to-noc-surface2/90 shadow-[0_0_18px_-4px_rgba(53,209,184,0.3)] ring-1 ring-noc-signal/40'
                    : 'border-noc-border/80 bg-noc-surface2/60 hover:bg-noc-surface2 hover:border-noc-signal/40 text-noc-text'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 transition-transform group-hover:scale-105 ${
                  isSelected ? 'bg-noc-signal/20 text-noc-signal' : 'bg-noc-surface text-noc-textDim'
                }`}>
                  {p.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-noc-text group-hover:text-white">
                      {p.title}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-noc-signal animate-pulse shrink-0" />
                    )}
                  </div>
                  <span className="text-xs text-noc-textDim block mt-1 leading-snug">
                    {p.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Orientação interna extra */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-bold text-noc-signal uppercase tracking-wider">
            Orientação Específica Adicional
          </label>
          <span className="text-[11px] text-noc-textDim">opcional</span>
        </div>
        <select
          onChange={(e) => {
            const val = e.target.value;
            if (val === '__') setDraftField('extraOrientation', '');
            else if (val) setDraftField('extraOrientation', val);
            e.target.selectedIndex = 0;
          }}
          className={selectPresetClasses}
        >
          <option value="">Selecionar orientação pronta…</option>
          {PRESET_EXTRA_ORIENTATIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
          <option value="__">— digitar orientação customizada —</option>
        </select>
        <input
          type="text"
          value={extraOrientation}
          onChange={(e) => setDraftField('extraOrientation', e.target.value)}
          placeholder="Ex: Priorizar restabelecimento de clientes corporativos."
          className={inputClasses}
        />
      </div>

      {/* Posicionamento padronizado ao cliente */}
      {!isResolvedMoment && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-noc-signal uppercase tracking-wider">
              Posicionamento Padronizado ao Cliente
            </label>
            <span className="text-[11px] text-noc-textDim">resposta uniforme para atendimento</span>
          </div>
          <select
            onChange={(e) => {
              const val = e.target.value;
              if (val === '__') setDraftField('customerScript', '');
              else if (val) setDraftField('customerScript', val);
              e.target.selectedIndex = 0;
            }}
            className={selectPresetClasses}
          >
            <option value="">Selecionar posicionamento padrão…</option>
            {PRESET_CUSTOMER_SCRIPTS.map((cs) => (
              <option key={cs} value={cs}>{cs}</option>
            ))}
            <option value="__">— digitar posicionamento customizado —</option>
          </select>
          <textarea
            rows={2}
            value={customerScript}
            onChange={(e) => setDraftField('customerScript', e.target.value)}
            className={inputClasses}
          />
        </div>
      )}
    </Card>
  );
};
