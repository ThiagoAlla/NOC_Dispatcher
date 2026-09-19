import { DispatchDraft, MomentType } from '../types/domain';

export interface ChecklistItem {
  id: string;
  label: string;
  isFilled: boolean;
}

export interface ChecklistValidationResult {
  title: string;
  items: ChecklistItem[];
  missingCount: number;
  urgentAlert: string | null;
}

const CHECKLIST_TITLES: Record<MomentType, string> = {
  ab: 'Checklist de Abertura de Incidente',
  at: 'Checklist de Atualização Periódica',
  nr: 'Checklist de Restabelecimento',
  en: 'Checklist de Fechamento de Incidente',
};

export function validateChecklist(draft: DispatchDraft): ChecklistValidationResult {
  const isMaintenance = draft.severity === 'S4';
  const items: ChecklistItem[] = [];

  if (draft.moment === 'ab') {
    items.push({ id: 'cidades', label: 'Localidade afetada', isFilled: Boolean(draft.citiesRaw.trim()) });
    items.push({ id: 'oque', label: 'Cenário do incidente', isFilled: Boolean(draft.whatIsHappening.trim()) });
    items.push({ id: 'inicio', label: 'Horário de início', isFilled: Boolean(draft.incidentStartedTime.trim()) });
    items.push({ id: 'acao', label: 'Ação técnica em andamento', isFilled: Boolean(draft.whatWeAreDoing.trim()) });
    items.push({
      id: 'proxima',
      label: 'Próxima atualização',
      isFilled: isMaintenance || Boolean(draft.nextAnnouncementTime.trim()),
    });
    items.push({ id: 'quem', label: 'Identificação do operador', isFilled: Boolean(draft.operatorName.trim()) });
  } else if (draft.moment === 'at') {
    items.push({ id: 'mudou', label: 'Status da atualização', isFilled: Boolean(draft.whatChanged.trim()) });
    items.push({ id: 'voltou', label: 'Progresso da normalização', isFilled: Boolean(draft.recoveredPortion.trim()) });
    items.push({
      id: 'proxima',
      label: 'Próxima atualização',
      isFilled: isMaintenance || Boolean(draft.nextAnnouncementTime.trim()),
    });
    items.push({ id: 'quem', label: 'Identificação do operador', isFilled: Boolean(draft.operatorName.trim()) });
  } else if (draft.moment === 'nr') {
    items.push({ id: 'n-oque', label: 'Cenário de restabelecimento', isFilled: Boolean(draft.whatReturned.trim()) });
    items.push({ id: 'cidades', label: 'Localidade', isFilled: Boolean(draft.citiesRaw.trim()) });
    items.push({ id: 'n-hora', label: 'Horário de retorno', isFilled: Boolean(draft.recoveryTime.trim()) });
    items.push({ id: 'n-dur', label: 'Tempo total de indisponibilidade', isFilled: Boolean(draft.manualDuration.trim()) });
    items.push({ id: 'quem', label: 'Identificação do operador', isFilled: Boolean(draft.operatorName.trim()) });
    items.push({ id: 'g-fim', label: 'Data/hora para registro na planilha', isFilled: Boolean(draft.spreadsheetEndedAt.trim()) });
  } else if (draft.moment === 'en') {
    items.push({ id: 'e-causa', label: 'Causa raiz do incidente', isFilled: Boolean(draft.whatIsHappening.trim()) });
    items.push({ id: 'e-feito', label: 'Ação corretiva executada', isFilled: Boolean(draft.whatWeDid.trim()) });
    items.push({ id: 'e-muda', label: 'Ação preventiva / melhoria', isFilled: Boolean(draft.whatChangesForFuture.trim()) });
    items.push({ id: 'quem', label: 'Identificação do operador', isFilled: Boolean(draft.operatorName.trim()) });
  }

  const missingCount = items.filter((it) => !it.isFilled).length;

  let urgentAlert: string | null = null;
  if ((draft.moment === 'ab' || draft.moment === 'at') && !isMaintenance && !draft.nextAnnouncementTime.trim()) {
    urgentAlert = 'Preencha o horário da próxima atualização para manter a equipe informada.';
  } else if (missingCount > 0) {
    urgentAlert = `${missingCount} ${missingCount === 1 ? 'campo essencial pendente' : 'campos essenciais pendentes'}.`;
  }

  return {
    title: CHECKLIST_TITLES[draft.moment],
    items,
    missingCount,
    urgentAlert,
  };
}
