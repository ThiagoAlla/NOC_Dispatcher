import { ActionPackageId, CauseId, MomentType, ProgressStatusId, SeverityId } from './domain';

export interface SeverityConfig {
  id: SeverityId;
  code: SeverityId;
  ico: string;
  label: string;
  description: string;
  cadenceMinutes: number;
  colorCss: string;
  isAttack?: boolean;
}

export interface MomentConfig {
  id: MomentType;
  icon: string;
  title: string;
  description: string;
}

export interface CauseDefinition {
  id: CauseId;
  icon: string;
  label: string;
  category: string;
  textFullOutage: string;
  textSlowDegraded: string;
  immediateAction: string;
  technicalCause: string;
  finalReportSummary: string;
}

export interface ProgressStatusConfig {
  id: ProgressStatusId;
  icon: string;
  label: string;
  sentence: string;
}

export interface ActionPackageConfig {
  id: ActionPackageId;
  icon: string;
  title: string;
  description: string;
  lines: readonly string[] | null;
  onlyForMoment?: MomentType;
}
