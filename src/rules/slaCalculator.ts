import { SEVERITIES_MAP } from '../constants/severities';
import { MomentType, SeverityId } from '../types/domain';
import { formatTimeHHMM } from './durationCalculator';

export type SlaAlertLevel = 'NORMAL' | 'WARNING' | 'CRITICAL' | 'EXPIRED';

export interface SlaCalculationResult {
  suggestedTimeHHMM: string;
  targetDate: Date | null;
}

export function calculateSuggestedNextDeadline(
  severityId: SeverityId,
  moment: MomentType,
  baseDate: Date = new Date()
): SlaCalculationResult {
  if (moment === 'nr' || moment === 'en') {
    return { suggestedTimeHHMM: '', targetDate: null };
  }

  const severity = SEVERITIES_MAP[severityId];
  if (!severity || !severity.cadenceMinutes) {
    return { suggestedTimeHHMM: '', targetDate: null };
  }

  const target = new Date(baseDate.getTime() + severity.cadenceMinutes * 60000);
  // Arredonda para o próximo múltiplo de 5 minutos
  target.setMinutes(Math.ceil(target.getMinutes() / 5) * 5, 0, 0);

  return {
    suggestedTimeHHMM: formatTimeHHMM(target),
    targetDate: target,
  };
}

export function evaluateSlaAlertStatus(
  targetDate: Date | null,
  totalCadenceMinutes: number
): { remainingSeconds: number; alertLevel: SlaAlertLevel; formattedRemaining: string } {
  if (!targetDate) {
    return { remainingSeconds: 0, alertLevel: 'NORMAL', formattedRemaining: '--:--' };
  }

  const now = Date.now();
  const diffMs = targetDate.getTime() - now;
  const remainingSeconds = Math.floor(diffMs / 1000);

  if (remainingSeconds <= 0) {
    const overdueSeconds = Math.abs(remainingSeconds);
    const m = Math.floor(overdueSeconds / 60);
    const s = overdueSeconds % 60;
    return {
      remainingSeconds,
      alertLevel: 'EXPIRED',
      formattedRemaining: `+${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
    };
  }

  const m = Math.floor(remainingSeconds / 60);
  const s = remainingSeconds % 60;
  const formatted = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  const remainingPercent = (remainingSeconds / (totalCadenceMinutes * 60)) * 100;

  if (remainingSeconds <= 300 || remainingPercent <= 20) {
    return { remainingSeconds, alertLevel: 'CRITICAL', formattedRemaining: formatted };
  }

  if (remainingSeconds <= 600 || remainingPercent <= 35) {
    return { remainingSeconds, alertLevel: 'WARNING', formattedRemaining: formatted };
  }

  return { remainingSeconds, alertLevel: 'NORMAL', formattedRemaining: formatted };
}
