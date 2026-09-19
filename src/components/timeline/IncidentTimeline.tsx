import React, { useState } from 'react';
import { Check, ChevronDown, Copy, History, User } from 'lucide-react';
import { MOMENTS_MAP } from '../../constants/moments';
import { SEVERITIES_MAP } from '../../constants/severities';
import { useIncidentStore } from '../../store/useIncidentStore';
import { TimelineEntry } from '../../types/domain';

export const IncidentTimeline: React.FC = () => {
  const activeTimeline = useIncidentStore((s) => s.activeTimeline);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!activeTimeline || activeTimeline.length === 0) {
    return null;
  }

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopySnapshot = async (e: React.MouseEvent, entry: TimelineEntry) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(entry.compiledMarkdown);
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="glass-panel rounded-xl p-4 md:p-5 mt-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-noc-border/60">
        <div className="flex items-center gap-2.5 text-xs font-bold text-noc-signal uppercase tracking-wider">
          <div className="w-6 h-6 rounded-md bg-noc-signal/15 border border-noc-signal/30 flex items-center justify-center text-noc-signal">
            <History className="w-3.5 h-3.5" />
          </div>
          <span>Linha do Tempo de Despachos</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-noc-surface2 border border-noc-border text-noc-textDim font-mono">
            {activeTimeline.length} {activeTimeline.length === 1 ? 'registro' : 'registros'}
          </span>
        </div>
      </div>

      <div className="relative pl-6 space-y-3.5 before:content-[''] before:absolute before:left-2.5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-gradient-to-b before:from-noc-signal before:via-noc-border before:to-noc-border/20">
        {activeTimeline.map((entry: TimelineEntry, idx: number) => {
          const isExpanded = expandedIds[entry.id] ?? (idx === activeTimeline.length - 1); // Último aberto por padrão
          const momentConfig = MOMENTS_MAP[entry.moment];
          const sev = SEVERITIES_MAP[entry.severitySnapshot];
          const timeFormatted = entry.dispatchedAt.slice(11, 16);
          const isLatest = idx === activeTimeline.length - 1;

          return (
            <div key={entry.id} className="relative group">
              {/* Marcador na linha com glow */}
              <div
                className={`absolute -left-6 top-2.5 w-3.5 h-3.5 rounded-full border-2 border-noc-surface shrink-0 transition-transform ${
                  isLatest ? 'radar-dot' : ''
                }`}
                style={{
                  backgroundColor: sev.colorCss,
                  boxShadow: isLatest ? `0 0 12px ${sev.colorCss}` : 'none',
                }}
              />

              <div className="bg-noc-surface2/80 hover:bg-noc-surface2 border border-noc-border/80 rounded-lg p-3.5 text-xs transition-all duration-150">
                <div
                  onClick={() => toggleExpand(entry.id)}
                  className="cursor-pointer flex items-center justify-between select-none gap-2"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-noc-text text-sm flex items-center gap-1.5">
                      <span>{momentConfig.icon}</span>
                      <span>{entry.sequenceNumber}º Aviso</span>
                    </span>
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${sev.colorCss}20`,
                        color: sev.colorCss,
                        border: `1px solid ${sev.colorCss}40`,
                      }}
                    >
                      {sev.code} · {momentConfig.title}
                    </span>
                    <span className="text-noc-textDim flex items-center gap-1 text-[11px]">
                      <User className="w-3 h-3 text-noc-textFaint" />
                      {entry.operatorName} · {timeFormatted}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      title="Copiar texto deste despacho"
                      onClick={(e) => handleCopySnapshot(e, entry)}
                      className="p-1.5 rounded-md text-noc-textDim hover:text-noc-signal hover:bg-noc-surface border border-noc-border/50 hover:border-noc-signal/40 transition-colors"
                    >
                      {copiedId === entry.id ? (
                        <Check className="w-3.5 h-3.5 text-noc-signal stroke-[3]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <ChevronDown
                      className={`w-4 h-4 text-noc-signal transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-noc-border/50 animate-fade-in">
                    <div className="flex items-center justify-between text-[10px] text-noc-textFaint mb-1.5 uppercase font-mono">
                      <span>Texto Despachado ao Grupo:</span>
                      <span>{entry.compiledMarkdown.length} caracteres</span>
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-noc-text bg-[#090D12] p-3 rounded-lg border border-noc-border/70 text-[11px] leading-relaxed select-all">
                      {entry.compiledMarkdown}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
