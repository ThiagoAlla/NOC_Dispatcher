import { MomentConfig } from '../types/catalog';
import { MomentType } from '../types/domain';

export const MOMENTS: readonly MomentConfig[] = [
  {
    id: 'ab',
    icon: '🚨',
    title: 'Abertura de Incidente',
    description: 'Envio em até 10 minutos após detecção, mesmo em fase de diagnóstico.',
  },
  {
    id: 'at',
    icon: '🔄',
    title: 'Atualização Periódica',
    description: 'Envio no prazo acordado de cadência, garantindo previsibilidade ao time.',
  },
  {
    id: 'nr',
    icon: '✅',
    title: 'Restabelecimento de Serviço',
    description: 'Envio imediato após confirmação técnica e estabilização de tráfego.',
  },
  {
    id: 'en',
    icon: '📋',
    title: 'Relatório de Fechamento',
    description: 'Consolidação pós-incidente com causa raiz e ações preventivas.',
  },
] as const;

export const MOMENTS_MAP: Record<MomentType, MomentConfig> = MOMENTS.reduce((acc, m) => {
  acc[m.id] = m;
  return acc;
}, {} as Record<MomentType, MomentConfig>);
