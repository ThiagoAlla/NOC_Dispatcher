import React from 'react';
import { CheckCircle2, FileSpreadsheet, Share2, Trash2 } from 'lucide-react';
import { SEVERITIES_MAP } from '../../constants/severities';
import { useIncidentStore } from '../../store/useIncidentStore';
import { OneClickActionBar } from './OneClickActionBar';

export const ActiveIncidentBanner: React.FC = () => {
  const activeIncident = useIncidentStore((s) => s.activeIncident);
  const normalizeIncident = useIncidentStore((s) => s.normalizeIncident);
  const copySpreadsheetRow = useIncidentStore((s) => s.copySpreadsheetRow);
  const copyMondayPayload = useIncidentStore((s) => s.copyMondayPayload);
  const deleteIncident = useIncidentStore((s) => s.deleteIncident);

  if (!activeIncident) {
    return null;
  }

  const sev = SEVERITIES_MAP[activeIncident.severity];
  const isResolved = activeIncident.status === 'RESOLVED';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-noc-border/80 bg-gradient-to-b from-noc-surface2/80 to-noc-surface/95 backdrop-blur-xl p-4 sm:p-5 mb-5 shadow-2xl">
      {/* Luz de fundo sutil baseada na cor da severidade */}
      <div
        className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: sev.colorCss }}
      />

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
        {/* Lado Esquerdo: Identificação & KPIs */}
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <span
              className="w-4 h-4 rounded-full block"
              style={{
                backgroundColor: sev.colorCss,
                boxShadow: `0 0 16px ${sev.colorCss}`,
              }}
            />
            <span
              className="absolute -inset-1 rounded-full animate-ping opacity-25"
              style={{ backgroundColor: sev.colorCss }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono font-black text-lg sm:text-xl text-white tracking-tight">
                {activeIncident.codeNumber}
              </span>
              <span
                className="text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                style={{
                  backgroundColor: `${sev.colorCss}20`,
                  color: sev.colorCss,
                  border: `1px solid ${sev.colorCss}50`,
                }}
              >
                {sev.code} · {sev.label}
              </span>

              {isResolved ? (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                  NORMALIZADO
                </span>
              ) : (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-noc-signalDim text-noc-signal border border-noc-signal/30 uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-noc-signal animate-pulse" />
                  EM MONITORAMENTO
                </span>
              )}
            </div>

            {/* Micro KPIs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-noc-textDim mt-1.5">
              <span>
                Início: <strong className="text-noc-text font-mono">{activeIncident.incidentStartedAt}</strong>
              </span>
              <span className="text-noc-borderLight">•</span>
              <span>
                1º Aviso: <strong className="text-noc-text font-mono">{activeIncident.firstAnnouncementAt || '--:--'}</strong>
              </span>
              <span className="text-noc-borderLight">•</span>
              <span>
                Atualizações:{' '}
                <strong className="text-noc-signal font-mono font-bold">
                  {activeIncident.updateCount}
                </strong>
              </span>
              {activeIncident.totalDurationFormatted && (
                <>
                  <span className="text-noc-borderLight">•</span>
                  <span>
                    Duração Total: <strong className="text-noc-amber font-mono">{activeIncident.totalDurationFormatted}</strong>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Lado Direito: Ações Rápidas de Gestão */}
        <div className="flex items-center gap-2 flex-wrap">
          {!isResolved ? (
            <button
              type="button"
              onClick={normalizeIncident}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600/30 to-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30 transition-all active:scale-95 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Normalizar Incidente</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={copyMondayPayload}
              title="Copiar dados formatados para documentação no Monday.com"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-noc-purple/30 to-indigo-500/20 text-noc-purple border border-noc-purple/50 hover:bg-noc-purple/30 transition-all active:scale-95 shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Monday Sync</span>
            </button>
          )}

          <button
            type="button"
            onClick={copySpreadsheetRow}
            title="Copiar linha tabulada (TSV) para a aba REGISTRO da Planilha oficial"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-noc-surface3 text-noc-textDim border border-noc-border hover:border-noc-signal hover:text-noc-signal transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Linha Planilha</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Tem certeza que deseja excluir o registro deste evento?')) {
                deleteIncident(activeIncident.id);
              }
            }}
            title="Excluir este evento"
            className="p-2 text-noc-textDim hover:text-noc-red rounded-xl hover:bg-noc-red/10 border border-transparent hover:border-noc-red/30 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Barra de Ações Rápidas de 1 Clique */}
      <OneClickActionBar />
    </div>
  );
};
