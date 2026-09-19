import { ActionPackageConfig } from '../types/catalog';
import { ActionPackageId, SeverityId } from '../types/domain';

export const ACTION_PACKAGES: readonly ActionPackageConfig[] = [
  {
    id: 'igual',
    icon: '🔁',
    title: 'Manter Diretrizes Anteriores',
    description: 'Permanecem inalteradas as orientações emitidas no comunicado anterior.',
    lines: null,
    onlyForMoment: 'at',
  },
  {
    id: 'nada',
    icon: '🟢',
    title: 'Operação em Fluxo Normal',
    description: 'Sem restrições operacionais. Equipes seguem atividades regulares.',
    lines: [],
  },
  {
    id: 'avisar',
    icon: '🔵',
    title: 'Alinhamento com Clientes (Fluxo Normal)',
    description: 'Atendimento informa clientes; lojas e campo mantêm operações normais.',
    lines: [
      '_Atendimento:_ Informar instabilidade sem abertura de chamados técnicos individuais.',
      '_Lojas e Vendas:_ Agendamentos e ativações mantidos normalmente.',
      '_Equipes de Campo:_ Rotina de ordens de serviço mantida sem restrições.',
    ],
  },
  {
    id: 'agenda',
    icon: '🟠',
    title: 'Suspensão de Agendamentos e Instalações',
    description: 'Bloqueio de novas instalações e visitas para as cidades/bairros afetados.',
    lines: [
      '_Atendimento:_ Informar previsão sem abertura de chamados técnicos.',
      '_Lojas e Vendas:_ Suspender agendamento de novas instalações nas cidades afetadas.',
      '_Equipes de Campo:_ Não realizar visitas ou deslocamentos na área afetada.',
    ],
  },
  {
    id: 'tudo',
    icon: '🔴',
    title: 'Suspensão Total de Operações e Visitas de Campo',
    description: 'Paralisação completa de deslocamentos, ativações e visitas na localidade.',
    lines: [
      '_Atendimento:_ Informar interrupção sem abertura de chamados técnicos.',
      '_Lojas e Vendas:_ Não agendar visitas, instalações ou ativações na região.',
      '_Equipes de Campo:_ Paralisação imediata de deslocamentos na área afetada.',
    ],
  },
] as const;

export const ACTION_PACKAGES_MAP: Record<ActionPackageId, ActionPackageConfig> = ACTION_PACKAGES.reduce((acc, p) => {
  acc[p.id] = p;
  return acc;
}, {} as Record<ActionPackageId, ActionPackageConfig>);

export const SEVERITY_PACKAGE_DEFAULTS: Record<SeverityId, ActionPackageId> = {
  SA: 'agenda',
  S1: 'tudo',
  S2: 'agenda',
  S3: 'avisar',
  S4: 'avisar',
};
