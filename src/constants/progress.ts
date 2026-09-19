import { ProgressStatusConfig } from '../types/catalog';
import { ProgressStatusId } from '../types/domain';

export const PROGRESS_STATUSES: readonly ProgressStatusConfig[] = [
  {
    id: 'procurando',
    icon: '🔍',
    label: 'Diagnóstico em Andamento',
    sentence: 'Engenharia de rede em telemetria para isolamento do ponto de falha.',
  },
  {
    id: 'achou',
    icon: '🎯',
    label: 'Causa Raiz Identificada',
    sentence: 'Ponto de falha isolado. Procedimentos de correção e manobras já em execução.',
  },
  {
    id: 'campo',
    icon: '🚚',
    label: 'Equipe Técnica no Local',
    sentence: 'Equipe de campo posicionada no ponto de falha realizando os reparos necessários.',
  },
  {
    id: 'voltando',
    icon: '📈',
    label: 'Restabelecimento Gradual',
    sentence: 'Serviços em restabelecimento progressivo. Monitorando estabilidade do tráfego.',
  },
  {
    id: 'semnov',
    icon: '⏳',
    label: 'Sem Alteração de Cenário',
    sentence: 'Cenário operacional inalterado desde o último aviso. Equipes mantêm atuação contínua.',
  },
  {
    id: 'piorou',
    icon: '⚠️',
    label: 'Expansão de Impacto',
    sentence: 'Abrangência do incidente ampliada. Recursos adicionais alocados para contenção.',
  },
  {
    id: 'prazo',
    icon: '🕐',
    label: 'Previsão Reprogramada',
    sentence: 'Complexidade técnica exige revisão de prazo. Nova estimativa informada abaixo.',
  },
  {
    id: 'quase',
    icon: '🏁',
    label: 'Fase Final de Testes',
    sentence: 'Manobras concluídas. Conexões em fase final de validação antes da liberação total.',
  },
] as const;

export const PROGRESS_STATUSES_MAP: Record<ProgressStatusId, ProgressStatusConfig> = PROGRESS_STATUSES.reduce((acc, p) => {
  acc[p.id] = p;
  return acc;
}, {} as Record<ProgressStatusId, ProgressStatusConfig>);
