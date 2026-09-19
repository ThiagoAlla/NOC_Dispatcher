import { create } from 'zustand';
import { CAUSES_MAP } from '../constants/causes';
import { SEVERITY_PACKAGE_DEFAULTS } from '../constants/packages';
import { PRESET_CUSTOMER_SCRIPTS } from '../constants/presets';
import { PROGRESS_STATUSES_MAP } from '../constants/progress';
import { SEVERITIES_MAP } from '../constants/severities';
import { incidentRepository } from '../db/repositories/incidentRepository';
import { timelineRepository } from '../db/repositories/timelineRepository';
import { calculateDurationFromTimes, formatTimeHHMM } from '../rules/durationCalculator';
import { calculateSuggestedNextDeadline } from '../rules/slaCalculator';
import { compileWhatsAppMessage } from '../rules/templateCompiler';
import { notifierService } from '../services/notifier/NotifierService';
import { ActionPackageId, CauseId, DispatchDraft, Incident, IncidentId, MomentType, ProgressStatusId, SeverityId, TimelineEntry } from '../types/domain';
import { useSettingsStore } from './useSettingsStore';
import { useTimerStore } from './useTimerStore';

interface IncidentState {
  activeIncident: Incident | null;
  openIncidents: Incident[];
  activeTimeline: TimelineEntry[];
  draft: DispatchDraft;
  isDispatching: boolean;
  copyFeedbackMessage: string | null;

  // Lifecycle & Init
  init: () => Promise<void>;
  loadOpenIncidents: () => Promise<void>;
  createNewIncident: () => void;
  switchIncident: (id: IncidentId) => Promise<void>;
  deleteIncident: (id: IncidentId) => Promise<void>;

  // Form Handlers
  setDraftField: <K extends keyof DispatchDraft>(field: K, value: DispatchDraft[K]) => void;
  setMoment: (moment: MomentType) => void;
  setSeverity: (severity: SeverityId) => void;
  setCause: (causeId: CauseId) => void;
  setProgress: (progressId: ProgressStatusId) => void;
  setActionPackage: (pkgId: ActionPackageId) => void;

  // Actions
  dispatchActiveMessage: () => Promise<boolean>;
  oneClickUpdate: (progressId: ProgressStatusId) => Promise<boolean>;
  normalizeIncident: () => void;
  finalizeIncident: () => void;
  copySpreadsheetRow: () => Promise<boolean>;
  copyMondayPayload: () => Promise<boolean>;
  clearDraft: () => void;
}

function createInitialDraft(operator: string = ''): DispatchDraft {
  const now = new Date();
  const timeNow = formatTimeHHMM(now);
  const defaultSev: SeverityId = 'S1';
  const defaultCause: CauseId = 'nsei';
  const defaultProgress: ProgressStatusId = 'procurando';
  const defaultPkg: ActionPackageId = 'tudo';
  const causaDef = CAUSES_MAP[defaultCause];
  const { suggestedTimeHHMM } = calculateSuggestedNextDeadline(defaultSev, 'ab', now);

  return {
    moment: 'ab',
    severity: defaultSev,
    causeId: defaultCause,
    progressStatusId: defaultProgress,
    actionPackageId: defaultPkg,
    citiesRaw: '',
    whatIsHappening: causaDef.textFullOutage,
    whatWeAreDoing: causaDef.immediateAction,
    estimatedReturn: '',
    whatChanged: '',
    recoveredPortion: '',
    whatReturned: 'Serviços de internet 100% restabelecidos na região.',
    clientInstructions: 'Nenhuma ação necessária. Conexão estabilizada.',
    whatWeDid: causaDef.technicalCause,
    whatChangesForFuture: 'Incidente isolado e tratado; sem alterações estruturais imediatas.',
    extraOrientation: '',
    customerScript: PRESET_CUSTOMER_SCRIPTS[0] ?? '',
    incidentStartedTime: timeNow,
    recoveryTime: timeNow,
    manualDuration: '',
    nextAnnouncementTime: suggestedTimeHHMM,
    operatorName: operator,
    techCause: causaDef.technicalCause,
    techLocation: '',
    ddosType: 'Ainda identificando',
    ddosVolume: '',
    ddosMitigation: 'Filtro no upstream',
    spreadsheetEndedAt: '',
  };
}

export const useIncidentStore = create<IncidentState>((set, get) => ({
  activeIncident: null,
  openIncidents: [],
  activeTimeline: [],
  draft: createInitialDraft(),
  isDispatching: false,
  copyFeedbackMessage: null,

  init: async () => {
    await useSettingsStore.getState().loadSettings();
    const defaultOp = useSettingsStore.getState().defaultOperator;
    if (defaultOp && !get().draft.operatorName) {
      set((s) => ({ draft: { ...s.draft, operatorName: defaultOp } }));
    }
    await get().loadOpenIncidents();
  },

  loadOpenIncidents: async () => {
    const list = await incidentRepository.getAllOpen();
    set({ openIncidents: list });

    // Se não há incidente ativo selecionado mas há incidentes abertos, seleciona o primeiro
    const currentActive = get().activeIncident;
    if (!currentActive && list.length > 0 && list[0]) {
      await get().switchIncident(list[0].id);
    }
  },

  createNewIncident: () => {
    const op = get().draft.operatorName || useSettingsStore.getState().defaultOperator;
    const initial = createInitialDraft(op);
    set({
      activeIncident: null,
      activeTimeline: [],
      draft: initial,
    });
    useTimerStore.getState().clearDeadline();
  },

  switchIncident: async (id: IncidentId) => {
    const inc = await incidentRepository.getById(id);
    if (!inc) return;

    const timeline = await timelineRepository.getByIncidentId(id);
    const op = get().draft.operatorName || useSettingsStore.getState().defaultOperator;
    const causaDef = CAUSES_MAP[inc.causeId];

    // Popula o draft com base no incidente carregado
    const updatedDraft: DispatchDraft = {
      ...createInitialDraft(op),
      incidentId: inc.id,
      severity: inc.severity,
      causeId: inc.causeId,
      citiesRaw: inc.affectedLocations.join(', '),
      incidentStartedTime: inc.incidentStartedAt,
      techLocation: inc.technicalDetails.popOrSegment,
      techCause: inc.technicalDetails.technicalCause,
      ddosType: inc.technicalDetails.ddosInfo?.attackType || 'Ainda identificando',
      ddosVolume: inc.technicalDetails.ddosInfo?.observedVolume || '',
      ddosMitigation: inc.technicalDetails.ddosInfo?.appliedMitigation || 'Filtro no upstream',
      whatIsHappening: inc.severity === 'S3' ? causaDef.textSlowDegraded : causaDef.textFullOutage,
      whatWeAreDoing: causaDef.immediateAction,
      operatorName: op,
    };

    // Se o evento está aberto, sugere o momento de Atualização
    if (inc.status === 'OPEN' || inc.status === 'MONITORING') {
      updatedDraft.moment = 'at';
      updatedDraft.actionPackageId = 'igual';
      const { suggestedTimeHHMM, targetDate } = calculateSuggestedNextDeadline(inc.severity, 'at');
      updatedDraft.nextAnnouncementTime = suggestedTimeHHMM;
      const sevConfig = SEVERITIES_MAP[inc.severity];
      useTimerStore.getState().setDeadline(targetDate, sevConfig.cadenceMinutes);
    }

    set({
      activeIncident: inc,
      activeTimeline: timeline,
      draft: updatedDraft,
    });
  },

  deleteIncident: async (id: IncidentId) => {
    await incidentRepository.delete(id);
    await get().loadOpenIncidents();
    if (get().activeIncident?.id === id) {
      get().createNewIncident();
    }
  },

  setDraftField: (field, value) => {
    set((state) => {
      const nextDraft = { ...state.draft, [field]: value };

      // Se mudou início ou término na tela de normalização, recalcula duração
      if (field === 'recoveryTime' || field === 'incidentStartedTime') {
        const calculated = calculateDurationFromTimes(
          nextDraft.incidentStartedTime,
          nextDraft.recoveryTime
        );
        if (calculated) {
          nextDraft.manualDuration = calculated;
        }
      }

      return { draft: nextDraft };
    });
  },

  setMoment: (moment) => {
    const state = get();
    const currentSev = state.draft.severity;
    let nextPkg: ActionPackageId = state.draft.actionPackageId;

    if (moment === 'at') {
      nextPkg = 'igual';
    } else if (moment === 'ab') {
      nextPkg = SEVERITY_PACKAGE_DEFAULTS[currentSev] || 'agenda';
    }

    const { suggestedTimeHHMM, targetDate } = calculateSuggestedNextDeadline(currentSev, moment);
    const sevConfig = SEVERITIES_MAP[currentSev];

    set((s) => ({
      draft: {
        ...s.draft,
        moment,
        actionPackageId: nextPkg,
        nextAnnouncementTime: suggestedTimeHHMM,
      },
    }));

    useTimerStore.getState().setDeadline(targetDate, sevConfig.cadenceMinutes);
  },

  setSeverity: (severity) => {
    const state = get();
    let nextCause = state.draft.causeId;
    let nextPkg = state.draft.actionPackageId;

    if (severity === 'SA') {
      nextCause = 'ataque';
      nextPkg = 'agenda';
    } else if (severity === 'S4') {
      nextCause = 'manut';
      nextPkg = 'avisar';
    } else if (state.draft.moment !== 'at') {
      nextPkg = SEVERITY_PACKAGE_DEFAULTS[severity] || 'agenda';
    }

    const causaDef = CAUSES_MAP[nextCause];
    const { suggestedTimeHHMM, targetDate } = calculateSuggestedNextDeadline(severity, state.draft.moment);
    const sevConfig = SEVERITIES_MAP[severity];

    set((s) => ({
      draft: {
        ...s.draft,
        severity,
        causeId: nextCause,
        actionPackageId: nextPkg,
        nextAnnouncementTime: suggestedTimeHHMM,
        whatIsHappening: severity === 'S3' ? causaDef.textSlowDegraded : causaDef.textFullOutage,
        whatWeAreDoing: causaDef.immediateAction,
        techCause: causaDef.technicalCause,
      },
    }));

    useTimerStore.getState().setDeadline(targetDate, sevConfig.cadenceMinutes);
  },

  setCause: (causeId) => {
    const state = get();
    let nextSev = state.draft.severity;
    let nextPkg = state.draft.actionPackageId;

    if (causeId === 'ataque' && nextSev !== 'SA') {
      nextSev = 'SA';
      nextPkg = 'agenda';
    } else if (causeId === 'manut' && nextSev !== 'S4') {
      nextSev = 'S4';
      nextPkg = 'avisar';
    }

    const causaDef = CAUSES_MAP[causeId];
    const scriptIndex = causeId === 'manut' ? 2 : causeId === 'operadora' ? 4 : 0;

    set((s) => ({
      draft: {
        ...s.draft,
        causeId,
        severity: nextSev,
        actionPackageId: nextPkg,
        whatIsHappening: nextSev === 'S3' ? causaDef.textSlowDegraded : causaDef.textFullOutage,
        whatWeAreDoing: causaDef.immediateAction,
        techCause: causaDef.technicalCause,
        customerScript: PRESET_CUSTOMER_SCRIPTS[scriptIndex] ?? PRESET_CUSTOMER_SCRIPTS[0] ?? '',
      },
    }));
  },

  setProgress: (progressId) => {
    const statusConfig = PROGRESS_STATUSES_MAP[progressId];
    set((s) => ({
      draft: {
        ...s.draft,
        progressStatusId: progressId,
        whatChanged: statusConfig ? statusConfig.sentence : '',
      },
    }));
  },

  setActionPackage: (pkgId) => {
    set((s) => ({ draft: { ...s.draft, actionPackageId: pkgId } }));
  },

  dispatchActiveMessage: async () => {
    const state = get();
    const { draft } = state;
    let incident = state.activeIncident;

    set({ isDispatching: true });

    try {
      const now = new Date();
      const nowIso = now.toISOString();
      const compiled = compileWhatsAppMessage(draft, incident);

      // 1. Grava ou atualiza a entidade de Incidente
      if (!incident) {
        const codeNum = `INC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${String(Math.floor(100 + Math.random() * 900))}`;
        const newIncident: Incident = {
          id: `inc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          codeNumber: codeNum,
          status: 'OPEN',
          severity: draft.severity,
          causeId: draft.causeId,
          affectedLocations: draft.citiesRaw
            .split(/[,e]/)
            .map((s) => s.trim())
            .filter(Boolean),
          clientCountEstimate: draft.recoveredPortion || 'Ainda em levantamento',
          detectedAt: nowIso,
          incidentStartedAt: draft.incidentStartedTime,
          firstAnnouncementAt: draft.moment === 'ab' ? formatTimeHHMM(now) : undefined,
          nextDeadlineAt: draft.nextAnnouncementTime,
          updateCount: 0,
          technicalDetails: {
            popOrSegment: draft.techLocation,
            technicalCause: draft.techCause,
            ddosInfo:
              draft.severity === 'SA'
                ? {
                    attackType: draft.ddosType,
                    observedVolume: draft.ddosVolume,
                    appliedMitigation: draft.ddosMitigation,
                  }
                : undefined,
          },
          customerFacingGuidance: draft.customerScript,
          createdAt: nowIso,
          updatedAt: nowIso,
        };
        await incidentRepository.save(newIncident);
        incident = newIncident;
      } else {
        const isUpdate = draft.moment === 'at';
        incident.severity = draft.severity;
        incident.causeId = draft.causeId;
        incident.affectedLocations = draft.citiesRaw
          .split(/[,e]/)
          .map((s) => s.trim())
          .filter(Boolean);
        incident.technicalDetails.popOrSegment = draft.techLocation;
        incident.technicalDetails.technicalCause = draft.techCause;
        incident.nextDeadlineAt = draft.nextAnnouncementTime;

        if (isUpdate) {
          incident.updateCount += 1;
        }

        if (draft.moment === 'nr') {
          incident.status = 'RESOLVED';
          incident.resolvedAt = nowIso;
          incident.totalDurationFormatted = draft.manualDuration;
        }

        if (draft.moment === 'en') {
          incident.status = 'CLOSED';
          incident.closedAt = nowIso;
        }

        await incidentRepository.save(incident);
      }

      // 2. Cria registro histórico na Timeline
      const timelineEntry: TimelineEntry = {
        id: `tl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        incidentId: incident.id,
        moment: draft.moment,
        sequenceNumber: (state.activeTimeline.length || 0) + 1,
        severitySnapshot: draft.severity,
        progressStatusId: draft.progressStatusId,
        actionPackageId: draft.actionPackageId,
        compiledMarkdown: compiled.text,
        operatorName: draft.operatorName,
        dispatchedAt: nowIso,
        dispatchedVia: 'CLIPBOARD',
        nextCadencePromisedAt: draft.nextAnnouncementTime,
      };

      await timelineRepository.addEntry(timelineEntry);
      const updatedTimeline = await timelineRepository.getByIncidentId(incident.id);

      // 3. Salva chips de cidades e POPs recentes
      if (draft.citiesRaw) {
        await useSettingsStore.getState().addRecentCity(draft.citiesRaw);
      }
      if (draft.techLocation) {
        await useSettingsStore.getState().addRecentPop(draft.techLocation);
      }
      if (draft.operatorName) {
        await useSettingsStore.getState().setDefaultOperator(draft.operatorName);
      }

      // 4. Copia para o Clipboard nativo
      await notifierService.copyCompiledMessage({
        incidentId: incident.id,
        moment: draft.moment,
        compiledMarkdown: compiled.text,
        operatorName: draft.operatorName,
        metadata: {
          severity: draft.severity,
          cities: incident.affectedLocations,
          updateCount: incident.updateCount,
          nextDeadline: draft.nextAnnouncementTime,
        },
      });

      // 5. Atualiza timer de SLA
      const sevConfig = SEVERITIES_MAP[draft.severity];
      const { targetDate } = calculateSuggestedNextDeadline(draft.severity, draft.moment);
      useTimerStore.getState().setDeadline(targetDate, sevConfig.cadenceMinutes);

      // 6. Atualiza lista de abertos
      await state.loadOpenIncidents();

      set({
        activeIncident: incident,
        activeTimeline: updatedTimeline,
        isDispatching: false,
        copyFeedbackMessage: 'Copiado para a área de transferência com sucesso!',
      });

      setTimeout(() => {
        set({ copyFeedbackMessage: null });
      }, 3500);

      return true;
    } catch {
      set({ isDispatching: false, copyFeedbackMessage: 'Erro ao despachar comunicado.' });
      return false;
    }
  },

  oneClickUpdate: async (progressId) => {
    const state = get();
    if (!state.activeIncident) return false;

    // Ajusta o draft para momento de atualização com o andamento selecionado
    state.setMoment('at');
    state.setProgress(progressId);
    state.setActionPackage('igual');

    // Despacha diretamente!
    return state.dispatchActiveMessage();
  },

  normalizeIncident: () => {
    const state = get();
    const now = new Date();
    const nowTime = formatTimeHHMM(now);

    const calculated = calculateDurationFromTimes(state.draft.incidentStartedTime, nowTime);

    set((s) => ({
      draft: {
        ...s.draft,
        moment: 'nr',
        recoveryTime: nowTime,
        manualDuration: calculated,
        spreadsheetEndedAt: new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16),
      },
    }));

    useTimerStore.getState().clearDeadline();
  },

  finalizeIncident: () => {
    set((s) => ({
      draft: {
        ...s.draft,
        moment: 'en',
      },
    }));
    useTimerStore.getState().clearDeadline();
  },

  copySpreadsheetRow: async () => {
    const state = get();
    const res = await notifierService.copySpreadsheetTsv(state.draft, state.activeIncident);
    if (res.success) {
      set({ copyFeedbackMessage: 'Linha da planilha copiada! Cole na aba REGISTRO.' });
      setTimeout(() => set({ copyFeedbackMessage: null }), 3500);
      return true;
    }
    return false;
  },

  copyMondayPayload: async () => {
    const state = get();
    if (!state.activeIncident) return false;
    const res = await notifierService.copyMondayJson(state.activeIncident, state.activeTimeline);
    if (res.success) {
      set({ copyFeedbackMessage: 'Payload estruturado do Monday copiado!' });
      setTimeout(() => set({ copyFeedbackMessage: null }), 3500);
      return true;
    }
    return false;
  },

  clearDraft: () => {
    get().createNewIncident();
  },
}));
