import React, { useState } from 'react';
import { Check, Copy, Eye, X } from 'lucide-react';
import { validateChecklist } from '../../rules/checklistValidator';
import { useIncidentStore } from '../../store/useIncidentStore';
import { LiveWhatsAppPreview } from '../preview/LiveWhatsAppPreview';

export const MobileBottomBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const draft = useIncidentStore((s) => s.draft);
  const dispatchActiveMessage = useIncidentStore((s) => s.dispatchActiveMessage);
  const copyFeedback = useIncidentStore((s) => s.copyFeedbackMessage);
  const isDispatching = useIncidentStore((s) => s.isDispatching);

  const { missingCount } = validateChecklist(draft);

  return (
    <>
      {/* Barra fixa na base do mobile com Glassmorphism flutuante */}
      <div className="lg:hidden fixed left-0 right-0 bottom-0 z-40 bg-[#0A0E14]/90 backdrop-blur-lg border-t border-noc-border/80 p-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] flex gap-2 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex-1 py-2.5 px-3 rounded-xl border border-noc-signal/40 bg-noc-surface2/80 text-noc-signal font-bold text-xs flex flex-col items-center justify-center leading-tight active:scale-95 transition-all shadow-sm"
        >
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Mensagem</span>
          </span>
          <span className="text-[10px] font-normal opacity-80 mt-0.5 font-mono">
            {missingCount === 0
              ? 'Checklist 100% ✓'
              : `${missingCount} ${missingCount === 1 ? 'pendência' : 'pendências'}`}
          </span>
        </button>

        <button
          type="button"
          disabled={isDispatching}
          onClick={() => dispatchActiveMessage()}
          className="flex-1 py-2.5 px-3 rounded-xl bg-noc-signal text-noc-textDark font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-[0_0_15px_rgba(53,209,184,0.3)] disabled:opacity-50 btn-shimmer"
        >
          {copyFeedback ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4 stroke-[2.5]" />}
          <span className="uppercase tracking-wide">{copyFeedback ? 'Copiado!' : 'Despachar'}</span>
        </button>
      </div>

      {/* Drawer deslizante no mobile */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Fundo escurecido */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Conteúdo do drawer */}
          <div className="relative bg-[#0E1520] border-t border-noc-border rounded-t-2xl p-4 max-h-[88vh] overflow-y-auto z-10 shadow-2xl pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-noc-border/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-noc-signal animate-pulse" />
                <span className="font-bold text-sm text-noc-text">Pré-visualização do Comunicado</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-noc-textDim hover:text-white bg-noc-surface2 border border-noc-border/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <LiveWhatsAppPreview />

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full mt-4 py-2.5 rounded-xl border border-noc-border bg-noc-surface2 text-noc-text font-bold text-xs uppercase tracking-wider"
            >
              Fechar Visualização
            </button>
          </div>
        </div>
      )}
    </>
  );
};
