import React from 'react';
import { AlertTriangle, Check, CheckCheck, Copy, Lock, MessageSquare, RotateCcw, Users } from 'lucide-react';
import { validateChecklist } from '../../rules/checklistValidator';
import { compileWhatsAppMessage } from '../../rules/templateCompiler';
import { useIncidentStore } from '../../store/useIncidentStore';
import { SlaCountdownWidget } from '../incident/SlaCountdownWidget';

export const LiveWhatsAppPreview: React.FC = () => {
  const draft = useIncidentStore((s) => s.draft);
  const activeIncident = useIncidentStore((s) => s.activeIncident);
  const dispatchActiveMessage = useIncidentStore((s) => s.dispatchActiveMessage);
  const clearDraft = useIncidentStore((s) => s.clearDraft);
  const isDispatching = useIncidentStore((s) => s.isDispatching);
  const copyFeedback = useIncidentStore((s) => s.copyFeedbackMessage);

  const { text } = compileWhatsAppMessage(draft, activeIncident);
  const { title: checklistTitle, items, urgentAlert } = validateChecklist(draft);

  const filledCount = items.filter((i) => i.isFilled).length;
  const totalCount = items.length;
  const checklistPercent = totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 100;

  const now = new Date();
  const timeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    <div className="space-y-4">
      {/* Moldura WhatsApp Web Mockup */}
      <div className="rounded-2xl border border-noc-border/90 bg-[#111B21] shadow-2xl overflow-hidden">
        {/* Topo do WhatsApp Web */}
        <div className="bg-[#202C33] px-3.5 py-2.5 flex items-center justify-between border-b border-[#2A3942]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-[#E9EDEF] leading-tight truncate max-w-[200px]">
                  Avisos - Eventos Massivos
                </span>
                <Lock className="w-2.5 h-2.5 text-[#8696A0]" />
              </div>
              <p className="text-[10px] text-[#8696A0] truncate max-w-[220px]">
                NOC, Engenharia, Lojas, Atendimento...
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#111B21] text-noc-signal border border-noc-signal/30">
              PREVIEW REAL
            </span>
          </div>
        </div>

        {/* Corpo do Chat com textura escura e balão de mensagem */}
        <div className="p-3.5 sm:p-4 bg-[#0B141A] min-h-[260px] max-h-[46vh] overflow-y-auto scrollbar-thin">
          {/* Mensagem Informativa de Criptografia do WhatsApp */}
          <div className="text-center mb-3">
            <span className="inline-flex items-center gap-1 text-[10px] bg-[#182229] text-[#8696A0] px-2.5 py-1 rounded-lg border border-[#222E35]">
              <Lock className="w-2.5 h-2.5 text-[#00A884]" />
              Canal interno oficial de incidentes de rede
            </span>
          </div>

          {/* Balão de Mensagem Estilo WhatsApp */}
          <div className="relative max-w-full bg-[#202C33] rounded-lg rounded-tl-none p-3.5 shadow-md border border-[#2A3942]/60 selection:bg-noc-signal selection:text-noc-textDark">
            {/* Cauda da bolha de mensagem */}
            <div className="absolute -top-[1px] -left-2 w-0 h-0 border-t-[8px] border-t-[#202C33] border-l-[8px] border-l-transparent" />

            {/* Conteúdo formatado */}
            <pre className="text-xs sm:text-[12.5px] font-sans text-[#E9EDEF] whitespace-pre-wrap break-words leading-relaxed font-normal">
              {text || '—'}
            </pre>

            {/* Rodapé da bolha: hora e tique duplo azul */}
            <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-[#8696A0]">
              <span>{timeFormatted}</span>
              <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB]" />
            </div>
          </div>
        </div>

        {/* Barra de Ação de Despacho */}
        <div className="p-3 bg-[#202C33] border-t border-[#2A3942] flex items-center gap-2">
          <button
            type="button"
            disabled={isDispatching}
            onClick={() => dispatchActiveMessage()}
            className="btn-shimmer flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {isDispatching ? (
              <span className="animate-spin w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full" />
            ) : copyFeedback ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : (
              <Copy className="w-4 h-4 stroke-[2.5]" />
            )}
            <span>{copyFeedback ? 'Copiado para o Grupo ✓' : 'Copiar Comunicado'}</span>
            <span className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950/20 text-slate-900 border border-slate-950/20">
              Ctrl+Enter
            </span>
          </button>

          <button
            type="button"
            onClick={clearDraft}
            title="Resetar e iniciar novo comunicado"
            className="p-3 rounded-xl bg-[#111B21] text-[#8696A0] hover:text-white border border-[#2A3942] hover:border-[#8696A0] transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Alerta de campo faltante crítico */}
      {urgentAlert && (
        <div className="bg-noc-redDim border border-noc-red/80 text-noc-red rounded-xl p-3.5 text-xs font-semibold flex items-start gap-2.5 shadow-noc-red-glow">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 animate-pulse" />
          <span>{urgentAlert}</span>
        </div>
      )}

      {/* Checklist com Progresso Percentual */}
      <div className="glass-panel rounded-xl p-3.5 text-xs">
        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-noc-border/40">
          <span className="font-black text-noc-signal uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            {checklistTitle}
          </span>
          <span
            className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded ${
              checklistPercent === 100
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-noc-amberDim text-noc-amber border border-noc-amber/30'
            }`}
          >
            {checklistPercent}%
          </span>
        </div>

        <div className="w-full bg-noc-surface3 h-1 rounded-full overflow-hidden mb-2.5">
          <div
            className="h-full bg-gradient-to-r from-noc-signal to-emerald-400 transition-all duration-300"
            style={{ width: `${checklistPercent}%` }}
          />
        </div>

        <ul className="space-y-1">
          {items.map((it) => (
            <li
              key={it.id}
              className={`flex items-center gap-2 text-[11.5px] ${
                it.isFilled ? 'text-noc-text' : 'text-noc-textFaint'
              }`}
            >
              <span>{it.isFilled ? '✅' : '⬜'}</span>
              <span className={it.isFilled ? 'font-medium' : 'font-normal'}>{it.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Relógio de SLA */}
      <SlaCountdownWidget />
    </div>
  );
};
