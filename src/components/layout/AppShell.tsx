import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useIncidentStore } from '../../store/useIncidentStore';
import { ActiveIncidentBanner } from '../incident/ActiveIncidentBanner';
import { ActionPackageStep } from '../form/ActionPackageStep';
import { CauseSelector } from '../form/CauseSelector';
import { DynamicFieldsStep } from '../form/DynamicFieldsStep';
import { MomentSelector } from '../form/MomentSelector';
import { OperatorFooterStep } from '../form/OperatorFooterStep';
import { ProgressSelector } from '../form/ProgressSelector';
import { SeveritySelector } from '../form/SeveritySelector';
import { TechnicalDetailsAccordion } from '../form/TechnicalDetailsAccordion';
import { LiveWhatsAppPreview } from '../preview/LiveWhatsAppPreview';
import { IncidentTimeline } from '../timeline/IncidentTimeline';
import { MobileBottomBar } from './MobileBottomBar';
import { Navbar } from './Navbar';
import { ReferenceCards } from './ReferenceCards';

export const AppShell: React.FC = () => {
  const [showProtocolBanner, setShowProtocolBanner] = useState(true);
  const init = useIncidentStore((s) => s.init);
  const dispatchActiveMessage = useIncidentStore((s) => s.dispatchActiveMessage);

  useEffect(() => {
    init();
  }, [init]);

  // Atalho de teclado: Ctrl+Enter / Cmd+Enter para disparar / copiar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        dispatchActiveMessage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatchActiveMessage]);

  return (
    <div className="min-h-screen bg-noc-bg bg-tech-grid text-noc-text flex flex-col pb-24 lg:pb-10 relative selection:bg-noc-signal selection:text-black">
      {/* Luz ambiente de fundo no topo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-noc-signal/5 via-transparent to-transparent pointer-events-none -z-10" />

      <Navbar />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 w-full flex-1">
        {/* Protocolo de Cadência Operacional - Ribbon Minimalista e Sofisticado */}
        {showProtocolBanner && (
          <div className="relative mb-4 rounded-xl border border-white/[0.08] bg-[#0C1118]/80 backdrop-blur-md px-3.5 py-2.5 shadow-sm transition-all duration-200 hover:border-amber-400/30">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5 text-xs leading-relaxed min-w-0">
                <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/25 text-amber-300 font-mono text-[10.5px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  <span>Diretriz de Cadência</span>
                </div>

                <span className="hidden sm:inline text-white/20">|</span>

                <p className="text-noc-text text-[12px] sm:text-xs">
                  Todo comunicado encerra obrigatoriamente com o <b>horário do próximo aviso</b> — enviado mesmo sem novas alterações.{' '}
                  <span className="text-amber-300/95 font-medium">“Sem novidade” já é uma resposta técnica.</span>{' '}
                  <span className="text-noc-textDim hidden md:inline">O silêncio desorienta as operações de ponta.</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowProtocolBanner(false)}
                title="Ocultar lembrete de cadência"
                className="text-noc-textFaint hover:text-noc-text p-1 rounded-md hover:bg-white/5 transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Command Center: Banner do Incidente Ativo */}
        <ActiveIncidentBanner />

        {/* Layout Grid: 2 Colunas no Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_430px] gap-5 items-start">
          {/* Coluna Esquerda: Formulário Wizard */}
          <div className="space-y-4">
            <MomentSelector />
            <SeveritySelector />
            <CauseSelector />
            <ProgressSelector />
            <DynamicFieldsStep />
            <ActionPackageStep />
            <TechnicalDetailsAccordion />
            <OperatorFooterStep />
          </div>

          {/* Coluna Direita: Preview Fixo no Desktop */}
          <div className="hidden lg:block sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin pr-1">
            <LiveWhatsAppPreview />
          </div>
        </div>

        {/* Histórico e Timeline de Despachos */}
        <IncidentTimeline />

        {/* Tabelas de Referência e Cadência */}
        <ReferenceCards />

        {/* Rodapé Premium */}
        <footer className="mt-10 pt-5 border-t border-noc-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-noc-textFaint gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-noc-signal animate-pulse" />
            <span className="text-noc-textDim font-medium">NOC Incident Dispatcher</span>
            <span>·</span>
            <span>Grupo IBL</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-noc-surface2 border border-noc-border text-noc-signal font-mono">
              IndexedDB v2.0
            </span>
            <span>Atalho: <kbd className="px-1.5 py-0.5 bg-noc-surface2 border border-noc-border rounded text-noc-text font-mono">Ctrl+Enter</kbd></span>
          </div>
        </footer>
      </main>

      {/* Dock Mobile */}
      <MobileBottomBar />
    </div>
  );
};
