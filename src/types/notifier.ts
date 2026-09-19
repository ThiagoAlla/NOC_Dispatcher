import { Incident, MomentType, TimelineEntry } from './domain';

export interface NotificationPayload {
  incidentId: string;
  moment: MomentType;
  compiledMarkdown: string;
  targetGroupName?: string;
  operatorName: string;
  metadata: {
    severity: string;
    cities: string[];
    updateCount: number;
    nextDeadline?: string;
  };
}

export interface NotificationResult {
  success: boolean;
  channel: string;
  timestamp: string;
  messageId?: string;
  errorMessage?: string;
}

export interface MondayItemPayload {
  itemName: string;
  columnValues: Record<string, unknown>;
  updateBody?: string;
}

export interface INotifierAdapter {
  readonly channelName: string;
  send(payload: NotificationPayload): Promise<NotificationResult>;
}

export interface ISpreadsheetExporter {
  generateRow(incident: Incident): string;
}

export interface IMondayExporter {
  exportIncidentAsMondayItem(incident: Incident, timeline: TimelineEntry[]): MondayItemPayload;
}
