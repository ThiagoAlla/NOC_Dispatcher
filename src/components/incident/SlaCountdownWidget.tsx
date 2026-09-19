import React, { useEffect } from 'react';
import { Bell, BellOff, Clock, ShieldAlert } from 'lucide-react';
import { useTimerStore } from '../../store/useTimerStore';
import { useIncidentStore } from '../../store/useIncidentStore';

export const SlaCountdownWidget: React.FC = () => {
  const {
    targetDeadlineDate,
    totalCadenceMinutes,
    remainingSeconds,
    formattedRemaining,
    alertLevel,
    isAudioAlertEnabled,
    toggleAudioAlert,
    tick,
  } = useTimerStore();

  const nextAnnouncementTime = useIncidentStore((s) => s.draft.nextAnnouncementTime);
  const severity = useIncidentStore((s) => s.draft.severity);
  const moment = useIncidentStore((s) => s.draft.moment);

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  const isMaintenance = severity === 'S4';
  const isClosed = moment === 'nr' || moment === 'en';

  if (isClosed) {
    return null;
  }

  // Progresso percentual para a barra
  const totalSeconds = (totalCadenceMinutes || 30) * 60;
  const progressPercent = targetDeadlineDate
    ? Math.max(0, Math.min(100, ((totalSeconds - remainingSeconds) / totalSeconds) * 100))
    : 0;

  const alertStyles = {
    NORMAL: {
      border: 'border-noc-border/80',
      bg: 'bg-gradient-to-br from-noc-surface2/90 to-noc-surface',
      glow: 'shadow-noc-card',
      text: 'text-noc-signal',
      bar: 'bg-gradient-to-r from-teal-500 to-noc-signal',
      badge: 'bg-noc-signalDim text-noc-signal border-noc-signal/30',
    },
    WARNING: {
      border: 'border-noc-amber/80',
      bg: 'bg-gradient-to-br from-noc-amber/10 to-noc-surface',
      glow: 'shadow-noc-amber-glow',
      text: 'text-noc-amber',
      bar: 'bg-gradient-to-r from-amber-500 to-noc-amber animate-pulse',
      badge: 'bg-noc-amberDim text-noc-amber border-noc-amber/40 animate-pulse',
    },
    CRITICAL: {
      border: 'border-noc-red/90',
      bg: 'bg-gradient-to-br from-noc-red/15 to-noc-surface',
      glow: 'shadow-noc-red-glow',
      text: 'text-noc-red',
      bar: 'bg-gradient-to-r from-red-600 to-noc-red animate-pulse',
      badge: 'bg-noc-redDim text-noc-red border-noc-red/50 animate-pulse',
    },
    EXPIRED: {
      border: 'border-noc-red',
      bg: 'bg-gradient-to-br from-noc-red/25 to-noc-surface',
      glow: 'shadow-noc-red-glow',
      text: 'text-noc-red font-black',
      bar: 'bg-noc-red',
      badge: 'bg-noc-red text-white font-black animate-bounce',
    },
  }[alertLevel];

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-200 backdrop-blur-md ${alertStyles.border} ${alertStyles.bg} ${alertStyles.glow}`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-noc-border/40">
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${alertStyles.text}`} />
          <span className="text-xs font-black uppercase tracking-wider text-noc-text">
            Cronômetro de SLA
          </span>
        </div>

        <div className="flex items-center gap-2">
          {alertLevel !== 'NORMAL' && (
            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-noc-red">
              <ShieldAlert className="w-3 h-3" />
              SLA Crítico
            </span>
          )}

          <button
            type="button"
            onClick={toggleAudioAlert}
            title={isAudioAlertEnabled ? 'Desativar alarme sonoro' : 'Ativar alarme sonoro'}
            className="p-1 rounded-md text-noc-textDim hover:text-white bg-noc-surface3 border border-noc-border transition-colors"
          >
            {isAudioAlertEnabled ? (
              <Bell className="w-3.5 h-3.5 text-noc-signal" />
            ) : (
              <BellOff className="w-3.5 h-3.5 opacity-50" />
            )}
          </button>
        </div>
      </div>

      {/* Relógio Principal e Contagem */}
      <div className="flex items-baseline justify-between mt-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-noc-textDim block">
            Próximo Comunicado Até
          </span>
          <div className="text-3xl font-black font-mono tracking-tight text-white mt-0.5">
            {nextAnnouncementTime || '--:--'}
          </div>
        </div>

        {targetDeadlineDate && (
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-noc-textDim block">
              {alertLevel === 'EXPIRED' ? 'Atraso Operacional' : 'Tempo Restante'}
            </span>
            <div
              className={`text-xl font-black font-mono tracking-tight mt-0.5 px-2.5 py-1 rounded-lg border ${alertStyles.badge}`}
            >
              {alertLevel === 'EXPIRED' ? `+${formattedRemaining}` : formattedRemaining}
            </div>
          </div>
        )}
      </div>

      {/* Barra de Progresso do SLA */}
      {targetDeadlineDate && !isMaintenance && (
        <div className="mt-3">
          <div className="w-full bg-noc-surface3 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${alertStyles.bar}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      <p className="text-[11px] text-noc-textDim mt-2.5 leading-snug">
        {nextAnnouncementTime
          ? 'Regra inegociável: envie o comunicado no horário previsto, mesmo sem alteração de cenário.'
          : isMaintenance
          ? 'Manutenção programada: avisos no início e conclusão da janela técnica.'
          : 'Informe o horário do próximo comunicado para iniciar a contagem de SLA.'}
      </p>
    </div>
  );
};
