export type IncidentId = string;
export type TimelineEntryId = string;
export type SeverityId = 'SA' | 'S1' | 'S2' | 'S3' | 'S4';
export type MomentType = 'ab' | 'at' | 'nr' | 'en';
export type CauseId = 'energia' | 'fibra' | 'obra' | 'equip' | 'operadora' | 'ataque' | 'manut' | 'sistema' | 'nsei';
export type ProgressStatusId = 'procurando' | 'achou' | 'campo' | 'voltando' | 'semnov' | 'piorou' | 'prazo' | 'quase';
export type ActionPackageId = 'igual' | 'nada' | 'avisar' | 'agenda' | 'tudo';

export type IncidentLifecycleStatus = 'OPEN' | 'MONITORING' | 'RESOLVED' | 'CLOSED';

export interface TechnicalDetails {
  popOrSegment: string;
  technicalCause: string;
  ddosInfo?: {
    attackType: string;
    observedVolume: string;
    appliedMitigation: string;
  };
}

export interface Incident {
  id: IncidentId;
  codeNumber: string;
  status: IncidentLifecycleStatus;
  severity: SeverityId;
  causeId: CauseId;
  affectedLocations: string[];
  clientCountEstimate: string;
  detectedAt: string;
  incidentStartedAt: string;
  firstAnnouncementAt?: string;
  nextDeadlineAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  totalDurationFormatted?: string;
  updateCount: number;
  technicalDetails: TechnicalDetails;
  customerFacingGuidance?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEntry {
  id: TimelineEntryId;
  incidentId: IncidentId;
  moment: MomentType;
  sequenceNumber: number;
  severitySnapshot: SeverityId;
  progressStatusId?: ProgressStatusId;
  actionPackageId: ActionPackageId;
  compiledMarkdown: string;
  internalNotes?: string;
  operatorName: string;
  dispatchedAt: string;
  dispatchedVia: 'CLIPBOARD' | 'MONDAY_BRIDGE' | 'SPREADSHEET_TSV';
  nextCadencePromisedAt?: string;
}

export interface DispatchDraft {
  incidentId?: IncidentId;
  moment: MomentType;
  severity: SeverityId;
  causeId: CauseId;
  progressStatusId: ProgressStatusId;
  actionPackageId: ActionPackageId;
  citiesRaw: string;
  whatIsHappening: string;
  whatWeAreDoing: string;
  estimatedReturn: string;
  whatChanged: string;
  recoveredPortion: string;
  whatReturned: string;
  clientInstructions: string;
  whatWeDid: string;
  whatChangesForFuture: string;
  extraOrientation: string;
  customerScript: string;
  incidentStartedTime: string;
  recoveryTime: string;
  manualDuration: string;
  nextAnnouncementTime: string;
  operatorName: string;
  techCause: string;
  techLocation: string;
  ddosType: string;
  ddosVolume: string;
  ddosMitigation: string;
  spreadsheetEndedAt: string;
}

export interface SettingItem {
  key: string;
  value: unknown;
  updatedAt: string;
}
