import React from 'react';
import { useIncidentStore } from '../../store/useIncidentStore';
import { Card } from '../ui/Card';

export const OperatorFooterStep: React.FC = () => {
  const draft = useIncidentStore((s) => s.draft);
  const setDraftField = useIncidentStore((s) => s.setDraftField);

  const isClosed = draft.moment === 'nr' || draft.moment === 'en';

  const inputClasses =
    'w-full text-sm p-2.5 bg-[#0C1219] border border-noc-border/80 rounded-lg text-noc-text placeholder:text-noc-textFaint focus:outline-none focus:border-noc-signal focus:ring-2 focus:ring-noc-signal/25 transition-all';

  return (
    <Card
      id="card-quem"
      stepNumber="6"
      title="Identificação do Despacho"
      subtitle="Responsável pelo envio e compromisso de horário com o próximo comunicado"
    >
      <div className={`grid gap-3.5 ${!isClosed ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
        <div>
          <label className="block text-xs font-bold text-noc-signal mb-1.5 uppercase tracking-wider">
            Operador NOC
          </label>
          <input
            type="text"
            value={draft.operatorName}
            onChange={(e) => setDraftField('operatorName', e.target.value)}
            placeholder="Ex: Mayko / Plantonista"
            className={inputClasses}
          />
        </div>

        {!isClosed && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-noc-signal uppercase tracking-wider">
                Próximo Aviso Até
              </label>
              <span className="text-[11px] text-noc-textDim">calculado pelo SLA</span>
            </div>
            <input
              type="time"
              value={draft.nextAnnouncementTime}
              onChange={(e) => setDraftField('nextAnnouncementTime', e.target.value)}
              className={inputClasses}
            />
          </div>
        )}
      </div>
    </Card>
  );
};
