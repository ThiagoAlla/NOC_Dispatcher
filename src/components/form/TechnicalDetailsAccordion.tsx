import React from 'react';
import { PRESET_TECHNICAL_CAUSES } from '../../constants/presets';
import { useIncidentStore } from '../../store/useIncidentStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';

export const TechnicalDetailsAccordion: React.FC = () => {
  const draft = useIncidentStore((s) => s.draft);
  const setDraftField = useIncidentStore((s) => s.setDraftField);
  const recentPops = useSettingsStore((s) => s.recentPops);

  if (draft.moment === 'at') {
    return null;
  }

  const isAttack = draft.severity === 'SA';

  const inputClasses =
    'w-full text-sm p-2.5 bg-[#0A0E14] border border-noc-border/80 rounded-lg text-noc-text placeholder:text-noc-textFaint focus:outline-none focus:border-noc-signal focus:ring-2 focus:ring-noc-signal/25 transition-all';
  const selectPresetClasses =
    'w-full text-xs p-2 bg-noc-surface border border-noc-border/70 rounded-lg text-noc-textDim focus:outline-none focus:border-noc-signal/60 mb-1.5 cursor-pointer';

  return (
    <Card
      id="card-tec"
      title="Detalhes Técnicos Internos"
      tag={{ text: 'Apenas Registro / NOC', variant: 'technical' }}
      isTechnicalVariant={true}
      subtitle="Dados restritos à documentação interna, planilha operacional e integração com Monday"
      defaultCollapsed={false}
    >
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-noc-signal uppercase tracking-wider">
              Causa Técnica
            </label>
            <span className="text-[11px] text-noc-textDim">pré-preenchida pela causa</span>
          </div>
          <select
            onChange={(e) => {
              const val = e.target.value;
              if (val === '__') setDraftField('techCause', '');
              else if (val) setDraftField('techCause', val);
              e.target.selectedIndex = 0;
            }}
            className={selectPresetClasses}
          >
            <option value="">Escolher uma causa técnica padrão…</option>
            {PRESET_TECHNICAL_CAUSES.map((tc) => (
              <option key={tc} value={tc}>{tc}</option>
            ))}
            <option value="__">— outra causa, vou escrever —</option>
          </select>
          <input
            type="text"
            value={draft.techCause}
            onChange={(e) => setDraftField('techCause', e.target.value)}
            placeholder="Ex: Falha de equipamento óptico / rompimento de fibra"
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-noc-signal mb-1.5 uppercase tracking-wider">
            Local Exato <span className="text-noc-textDim font-normal lowercase">(pop, olt, trecho de cabo ou ip)</span>
          </label>
          <input
            type="text"
            value={draft.techLocation}
            onChange={(e) => setDraftField('techLocation', e.target.value)}
            placeholder="Ex: POP Paragominas / bloco 177.54.x"
            className={inputClasses}
          />
          {recentPops.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <span className="text-[11px] text-noc-textFaint">Recentes:</span>
              {recentPops.map((pop) => (
                <Chip
                  key={pop}
                  label={pop}
                  onClick={() => setDraftField('techLocation', pop)}
                />
              ))}
            </div>
          )}
        </div>

        {isAttack && (
          <div className="border-t border-noc-purple/30 pt-4 space-y-3.5 bg-noc-purple/5 p-3.5 rounded-xl border">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-noc-purple animate-pulse" />
              <span className="font-bold text-xs uppercase tracking-wider text-noc-purple">
                Parâmetros do Ataque DDoS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-noc-purple mb-1.5">Tipo de Ataque</label>
                <select
                  value={draft.ddosType}
                  onChange={(e) => setDraftField('ddosType', e.target.value)}
                  className="w-full text-sm p-2.5 bg-[#0C0E17] border border-noc-purple/40 rounded-lg text-noc-text focus:outline-none focus:border-noc-purple focus:ring-2 focus:ring-noc-purple/20 transition-all"
                >
                  <option value="Ainda identificando">Ainda identificando</option>
                  <option value="Volumétrico (saturação de banda)">Volumétrico (saturação de banda)</option>
                  <option value="Amplificação (DNS, NTP, memcached)">Amplificação (DNS, NTP, memcached)</option>
                  <option value="Camada de aplicação (L7)">Camada de aplicação (L7)</option>
                  <option value="Ataque ao DNS recursivo">Ataque ao DNS recursivo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-noc-purple mb-1.5">Volume Observado</label>
                <input
                  type="text"
                  value={draft.ddosVolume}
                  onChange={(e) => setDraftField('ddosVolume', e.target.value)}
                  placeholder="Ex: 12 Gbps / 2 Mpps"
                  className="w-full text-sm p-2.5 bg-[#0C0E17] border border-noc-purple/40 rounded-lg text-noc-text placeholder:text-noc-textFaint focus:outline-none focus:border-noc-purple focus:ring-2 focus:ring-noc-purple/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-noc-purple mb-1.5">Mitigação Aplicada</label>
              <select
                value={draft.ddosMitigation}
                onChange={(e) => setDraftField('ddosMitigation', e.target.value)}
                className="w-full text-sm p-2.5 bg-[#0C0E17] border border-noc-purple/40 rounded-lg text-noc-text focus:outline-none focus:border-noc-purple focus:ring-2 focus:ring-noc-purple/20 transition-all"
              >
                <option value="Filtro no upstream">Filtro no upstream</option>
                <option value="Blackhole do IP alvo junto à operadora">Blackhole do IP alvo junto à operadora</option>
                <option value="Scrubbing acionado">Scrubbing acionado</option>
                <option value="Rate limit e bloqueio de origem">Rate limit e bloqueio de origem</option>
                <option value="Em avaliação com a operadora">Em avaliação com a operadora</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
