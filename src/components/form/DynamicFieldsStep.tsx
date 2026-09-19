import React from 'react';
import {
  PRESET_ACTIONS,
  PRESET_CLIENT_INSTRUCTIONS,
  PRESET_CLIENTS,
  PRESET_FUTURE_CHANGES,
  PRESET_PREVISIONS,
  PRESET_RECOVERED,
  PRESET_WHAT_IS_HAPPENING,
  PRESET_WHAT_RETURNED,
  PRESET_WHAT_WAS_DONE,
} from '../../constants/presets';
import { PROGRESS_STATUSES } from '../../constants/progress';
import { useIncidentStore } from '../../store/useIncidentStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';

export const DynamicFieldsStep: React.FC = () => {
  const draft = useIncidentStore((s) => s.draft);
  const setDraftField = useIncidentStore((s) => s.setDraftField);
  const recentCities = useSettingsStore((s) => s.recentCities);

  const { moment, severity } = draft;

  const handlePresetSelect = (
    field: keyof typeof draft,
    val: string
  ) => {
    if (val === '__') {
      setDraftField(field, '' as never);
    } else if (val) {
      setDraftField(field, val as never);
    }
  };

  const inputClasses =
    'w-full text-sm p-2.5 bg-[#0C1219] border border-noc-border/80 rounded-lg text-noc-text placeholder:text-noc-textFaint focus:outline-none focus:border-noc-signal focus:ring-2 focus:ring-noc-signal/25 transition-all';
  const selectPresetClasses =
    'w-full text-xs p-2 bg-noc-surface border border-noc-border/70 rounded-lg text-noc-textDim focus:outline-none focus:border-noc-signal/60 mb-1.5 cursor-pointer';

  return (
    <Card
      id="card-detalhes"
      stepNumber="4"
      title="Detalhamento do Comunicado"
      tag={{ text: 'Vai para o Grupo', variant: 'group' }}
    >
      {/* Campo comum: Localidades */}
      <div className="mb-4">
        <label className="block text-xs font-bold text-noc-signal mb-1.5 uppercase tracking-wider">
          Localidades Afetadas <span className="text-noc-textDim font-normal lowercase">(cidades, bairros ou pops)</span>
        </label>
        <input
          type="text"
          value={draft.citiesRaw}
          onChange={(e) => setDraftField('citiesRaw', e.target.value)}
          placeholder="Ex: Paragominas e Ulianópolis"
          className={inputClasses}
        />
        {recentCities.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span className="text-[11px] text-noc-textFaint">Sugestões:</span>
            {recentCities.map((city) => (
              <Chip
                key={city}
                label={city}
                onClick={() => setDraftField('citiesRaw', city)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ABERTURA DE INCIDENTE (ab) */}
      {moment === 'ab' && (
        <div className="space-y-4 border-t border-noc-border/40 pt-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-noc-signal uppercase tracking-wider">
                Cenário do Incidente
              </label>
              <span className="text-[11px] text-noc-textDim">pré-preenchido pela causa</span>
            </div>
            <select
              onChange={(e) => {
                handlePresetSelect('whatIsHappening', e.target.value);
                e.target.selectedIndex = 0;
              }}
              className={selectPresetClasses}
            >
              <option value="">Selecionar frase padrão…</option>
              {PRESET_WHAT_IS_HAPPENING.map((ph) => (
                <option key={ph} value={ph}>{ph}</option>
              ))}
              <option value="__">— digitar texto customizado —</option>
            </select>
            <textarea
              rows={2}
              value={draft.whatIsHappening}
              onChange={(e) => setDraftField('whatIsHappening', e.target.value)}
              placeholder="Descreva o cenário técnico de forma direta e objetiva."
              className={inputClasses}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-noc-signal mb-1.5 uppercase tracking-wider">
                Impacto Estimado
              </label>
              <select
                value={draft.recoveredPortion}
                onChange={(e) => setDraftField('recoveredPortion', e.target.value)}
                className={inputClasses}
              >
                <option value="">Selecione...</option>
                {PRESET_CLIENTS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-noc-signal mb-1.5 uppercase tracking-wider">
                Horário de Início
              </label>
              <input
                type="time"
                value={draft.incidentStartedTime}
                onChange={(e) => setDraftField('incidentStartedTime', e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-noc-signal uppercase tracking-wider">
                Ação Técnica em Andamento
              </label>
              <span className="text-[11px] text-noc-textDim">pré-preenchida pela causa</span>
            </div>
            <select
              onChange={(e) => {
                handlePresetSelect('whatWeAreDoing', e.target.value);
                e.target.selectedIndex = 0;
              }}
              className={selectPresetClasses}
            >
              <option value="">Selecionar ação padrão…</option>
              {PRESET_ACTIONS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
              <option value="__">— digitar ação customizada —</option>
            </select>
            <textarea
              rows={2}
              value={draft.whatWeAreDoing}
              onChange={(e) => setDraftField('whatWeAreDoing', e.target.value)}
              placeholder="Ação que a engenharia ou campo está executando neste momento."
              className={inputClasses}
            />
          </div>

          {severity !== 'SA' && (
            <div>
              <label className="block text-xs font-bold text-noc-signal mb-1.5 uppercase tracking-wider">
                Previsão de Normalização
              </label>
              <select
                value={draft.estimatedReturn}
                onChange={(e) => setDraftField('estimatedReturn', e.target.value)}
                className={inputClasses}
              >
                <option value="">Selecione a previsão técnica...</option>
                {PRESET_PREVISIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* ATUALIZAÇÃO PERIÓDICA (at) */}
      {moment === 'at' && (
        <div className="space-y-4 border-t border-noc-border/40 pt-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-noc-signal uppercase tracking-wider">
                Status Técnico do Andamento
              </label>
              <span className="text-[11px] text-noc-textDim">pré-preenchido pelo status</span>
            </div>
            <select
              onChange={(e) => {
                handlePresetSelect('whatChanged', e.target.value);
                e.target.selectedIndex = 0;
              }}
              className={selectPresetClasses}
            >
              <option value="">Selecionar frase padrão…</option>
              {PROGRESS_STATUSES.map((ps) => (
                <option key={ps.id} value={ps.sentence}>{ps.label}</option>
              ))}
              <option value="__">— digitar status customizado —</option>
            </select>
            <textarea
              rows={2}
              value={draft.whatChanged}
              onChange={(e) => setDraftField('whatChanged', e.target.value)}
              placeholder="Descreva o status atual da atuação da equipe."
              className={inputClasses}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-noc-signal mb-1.5 uppercase tracking-wider">
                Progresso de Restabelecimento
              </label>
              <select
                value={draft.recoveredPortion}
                onChange={(e) => setDraftField('recoveredPortion', e.target.value)}
                className={inputClasses}
              >
                <option value="">Selecione...</option>
                {PRESET_RECOVERED.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {severity !== 'SA' && (
              <div>
                <label className="block text-xs font-bold text-noc-signal mb-1.5 uppercase tracking-wider">
                  Previsão de Normalização
                </label>
                <select
                  value={draft.estimatedReturn}
                  onChange={(e) => setDraftField('estimatedReturn', e.target.value)}
                  className={inputClasses}
                >
                  <option value="">Selecione...</option>
                  {PRESET_PREVISIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RESTABELECIMENTO (nr) */}
      {moment === 'nr' && (
        <div className="space-y-4 border-t border-noc-border/40 pt-4">
          <div>
            <label className="block text-xs font-bold text-noc-signal mb-1.5 uppercase tracking-wider">
              Cenário Concluído
            </label>
            <select
              onChange={(e) => {
                handlePresetSelect('whatReturned', e.target.value);
                e.target.selectedIndex = 0;
              }}
              className={selectPresetClasses}
            >
              <option value="">Selecionar frase padrão…</option>
              {PRESET_WHAT_RETURNED.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
              <option value="__">— digitar texto customizado —</option>
            </select>
            <textarea
              rows={2}
              value={draft.whatReturned}
              onChange={(e) => setDraftField('whatReturned', e.target.value)}
              className={inputClasses}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-noc-signal mb-1.5 uppercase tracking-wider">
                Horário de Início
              </label>
              <input
                type="time"
                value={draft.incidentStartedTime}
                onChange={(e) => setDraftField('incidentStartedTime', e.target.value)}
                className={inputClasses}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-noc-signal mb-1.5 uppercase tracking-wider">
                Horário de Normalização
              </label>
              <input
                type="time"
                value={draft.recoveryTime}
                onChange={(e) => setDraftField('recoveryTime', e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-noc-signal uppercase tracking-wider">
                Tempo Total de Indisponibilidade (MTTR)
              </label>
              <span className="text-[11px] text-noc-textDim">calculado automaticamente</span>
            </div>
            <input
              type="text"
              value={draft.manualDuration}
              onChange={(e) => setDraftField('manualDuration', e.target.value)}
              placeholder="Ex: 1 hora e 20 minutos"
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-noc-signal mb-1.5 uppercase tracking-wider">
              Orientação ao Cliente / Ação Residual
            </label>
            <select
              onChange={(e) => {
                handlePresetSelect('clientInstructions', e.target.value);
                e.target.selectedIndex = 0;
              }}
              className={selectPresetClasses}
            >
              <option value="">Selecionar instrução padrão…</option>
              {PRESET_CLIENT_INSTRUCTIONS.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
              <option value="__">— digitar instrução customizada —</option>
            </select>
            <textarea
              rows={2}
              value={draft.clientInstructions}
              onChange={(e) => setDraftField('clientInstructions', e.target.value)}
              className={inputClasses}
            />
          </div>
        </div>
      )}

      {/* RELATÓRIO DE FECHAMENTO (en) */}
      {moment === 'en' && (
        <div className="space-y-4 border-t border-noc-border/40 pt-4">
          <div>
            <label className="block text-xs font-bold text-noc-signal mb-1.5 uppercase tracking-wider">
              Causa Raiz Identificada
            </label>
            <textarea
              rows={2}
              value={draft.whatIsHappening}
              onChange={(e) => setDraftField('whatIsHappening', e.target.value)}
              className={inputClasses}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-noc-signal mb-1.5 uppercase tracking-wider">
                Tempo Total de Indisponibilidade
              </label>
              <input
                type="text"
                value={draft.manualDuration}
                onChange={(e) => setDraftField('manualDuration', e.target.value)}
                placeholder="Ex: 1 hora e 20 minutos"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-noc-signal mb-1.5 uppercase tracking-wider">
                Clientes Impactados
              </label>
              <select
                value={draft.recoveredPortion}
                onChange={(e) => setDraftField('recoveredPortion', e.target.value)}
                className={inputClasses}
              >
                <option value="">Selecione...</option>
                {PRESET_CLIENTS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-noc-signal mb-1.5 uppercase tracking-wider">
              Ação Corretiva Executada
            </label>
            <select
              onChange={(e) => {
                handlePresetSelect('whatWeDid', e.target.value);
                e.target.selectedIndex = 0;
              }}
              className={selectPresetClasses}
            >
              <option value="">Selecionar ação padrão…</option>
              {PRESET_WHAT_WAS_DONE.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
              <option value="__">— digitar ação customizada —</option>
            </select>
            <textarea
              rows={2}
              value={draft.whatWeDid}
              onChange={(e) => setDraftField('whatWeDid', e.target.value)}
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-noc-signal mb-1.5 uppercase tracking-wider">
              Ação Preventiva / Melhoria Estrutural
            </label>
            <select
              onChange={(e) => {
                handlePresetSelect('whatChangesForFuture', e.target.value);
                e.target.selectedIndex = 0;
              }}
              className={selectPresetClasses}
            >
              <option value="">Selecionar melhoria padrão…</option>
              {PRESET_FUTURE_CHANGES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
              <option value="__">— digitar melhoria customizada —</option>
            </select>
            <textarea
              rows={2}
              value={draft.whatChangesForFuture}
              onChange={(e) => setDraftField('whatChangesForFuture', e.target.value)}
              className={inputClasses}
            />
          </div>
        </div>
      )}
    </Card>
  );
};
