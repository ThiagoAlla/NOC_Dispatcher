import { Incident, TimelineEntry } from '../../types/domain';
import { NotificationPayload, NotificationResult } from '../../types/notifier';
import { clipboardAdapter } from './ClipboardAdapter';
import { mondayBridgeAdapter } from './MondayBridgeAdapter';
import { spreadsheetAdapter } from './SpreadsheetAdapter';

export class NotifierService {
  async copyCompiledMessage(payload: NotificationPayload): Promise<NotificationResult> {
    return clipboardAdapter.send(payload);
  }

  async copySpreadsheetTsv(draft: any, incident?: Incident | null): Promise<NotificationResult> {
    const tsvText = spreadsheetAdapter.generateTsvRow(draft, incident);
    return clipboardAdapter.send({
      incidentId: incident?.id || 'temp',
      moment: draft.moment,
      compiledMarkdown: tsvText,
      operatorName: draft.operatorName,
      metadata: {
        severity: draft.severity,
        cities: [draft.citiesRaw],
        updateCount: incident?.updateCount || 0,
      },
    });
  }

  exportToMondayPayload(incident: Incident, timeline: TimelineEntry[] = []) {
    return mondayBridgeAdapter.exportIncidentAsMondayItem(incident, timeline);
  }

  async copyMondayJson(incident: Incident, timeline: TimelineEntry[] = []): Promise<NotificationResult> {
    const payload = this.exportToMondayPayload(incident, timeline);
    const jsonStr = JSON.stringify(payload, null, 2);
    return clipboardAdapter.send({
      incidentId: incident.id,
      moment: 'en',
      compiledMarkdown: jsonStr,
      operatorName: 'NOC',
      metadata: {
        severity: incident.severity,
        cities: incident.affectedLocations,
        updateCount: incident.updateCount,
      },
    });
  }
}

export const notifierService = new NotifierService();
