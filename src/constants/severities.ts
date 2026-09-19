import { SeverityConfig } from '../types/catalog';
import { SeverityId } from '../types/domain';

export const SEVERITIES: readonly SeverityConfig[] = [
  {
    id: 'SA',
    code: 'SA',
    ico: '🟣',
    label: 'Incidente de Segurança (DDoS)',
    description: 'Ataque volumétrico externo gerando sobrecarga de enlaces e instabilidade.',
    cadenceMinutes: 30,
    colorCss: '#A78BFA',
    isAttack: true,
  },
  {
    id: 'S1',
    code: 'S1',
    ico: '🔴',
    label: 'Indisponibilidade',
    description: 'Interrupção generalizada de serviços em uma ou mais cidades/POPs.',
    cadenceMinutes: 30,
    colorCss: '#EF5B5B',
  },
  {
    id: 'S2',
    code: 'S2',
    ico: '🟠',
    label: 'Indisponibilidade Parcial',
    description: 'Interrupção concentrada em bairro, anel óptico ou concentrador específico.',
    cadenceMinutes: 60,
    colorCss: '#F0A742',
  },
  {
    id: 'S3',
    code: 'S3',
    ico: '🟡',
    label: 'Instabilidade',
    description: 'Serviço operacional com degradação de desempenho, oscilação ou latência.',
    cadenceMinutes: 120,
    colorCss: '#F0A742',
  },
  {
    id: 'S4',
    code: 'S4',
    ico: '🔵',
    label: 'Manutenção Programada',
    description: 'Intervenção técnica preventiva ou corretiva previamente planejada.',
    cadenceMinutes: 0,
    colorCss: '#35D1B8',
  },
] as const;

export const SEVERITIES_MAP: Record<SeverityId, SeverityConfig> = SEVERITIES.reduce((acc, s) => {
  acc[s.id] = s;
  return acc;
}, {} as Record<SeverityId, SeverityConfig>);
