import { create } from 'zustand';
import { evaluateSlaAlertStatus, SlaAlertLevel } from '../rules/slaCalculator';

interface TimerState {
  targetDeadlineDate: Date | null;
  totalCadenceMinutes: number;
  remainingSeconds: number;
  alertLevel: SlaAlertLevel;
  formattedRemaining: string;
  isAudioAlertEnabled: boolean;
  hasPlayedWarningAlert: boolean;
  hasPlayedCriticalAlert: boolean;

  setDeadline: (target: Date | null, cadenceMinutes: number) => void;
  clearDeadline: () => void;
  toggleAudioAlert: () => void;
  tick: () => void;
}

function playBeep(frequency: number, durationMs: number) {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch {
    // Silencioso se bloqueado por permissão do navegador
  }
}

export const useTimerStore = create<TimerState>((set, get) => ({
  targetDeadlineDate: null,
  totalCadenceMinutes: 30,
  remainingSeconds: 0,
  alertLevel: 'NORMAL',
  formattedRemaining: '--:--',
  isAudioAlertEnabled: true,
  hasPlayedWarningAlert: false,
  hasPlayedCriticalAlert: false,

  setDeadline: (target, cadenceMinutes) => {
    if (!target) {
      set({
        targetDeadlineDate: null,
        remainingSeconds: 0,
        alertLevel: 'NORMAL',
        formattedRemaining: '--:--',
        hasPlayedWarningAlert: false,
        hasPlayedCriticalAlert: false,
      });
      return;
    }

    const { remainingSeconds, alertLevel, formattedRemaining } = evaluateSlaAlertStatus(target, cadenceMinutes);

    set({
      targetDeadlineDate: target,
      totalCadenceMinutes: cadenceMinutes,
      remainingSeconds,
      alertLevel,
      formattedRemaining,
      hasPlayedWarningAlert: false,
      hasPlayedCriticalAlert: false,
    });
  },

  clearDeadline: () => {
    set({
      targetDeadlineDate: null,
      remainingSeconds: 0,
      alertLevel: 'NORMAL',
      formattedRemaining: '--:--',
      hasPlayedWarningAlert: false,
      hasPlayedCriticalAlert: false,
    });
  },

  toggleAudioAlert: () => {
    set((state) => ({ isAudioAlertEnabled: !state.isAudioAlertEnabled }));
  },

  tick: () => {
    const { targetDeadlineDate, totalCadenceMinutes, isAudioAlertEnabled, hasPlayedWarningAlert, hasPlayedCriticalAlert } = get();
    if (!targetDeadlineDate) return;

    const { remainingSeconds, alertLevel, formattedRemaining } = evaluateSlaAlertStatus(targetDeadlineDate, totalCadenceMinutes);

    // Alerta sonoro quando entra em WARNING (<= 10m) ou CRITICAL/EXPIRED (<= 5m)
    if (isAudioAlertEnabled) {
      if (alertLevel === 'WARNING' && !hasPlayedWarningAlert) {
        playBeep(440, 300); // Tom suave (A4)
        set({ hasPlayedWarningAlert: true });
      } else if ((alertLevel === 'CRITICAL' || alertLevel === 'EXPIRED') && !hasPlayedCriticalAlert) {
        playBeep(880, 500); // Tom agudo (A5)
        set({ hasPlayedCriticalAlert: true });
      }
    }

    set({ remainingSeconds, alertLevel, formattedRemaining });
  },
}));
