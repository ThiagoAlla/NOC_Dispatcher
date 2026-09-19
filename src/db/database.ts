import Dexie, { type Table } from 'dexie';
import { Incident, SettingItem, TimelineEntry } from '../types/domain';

export class NocDatabase extends Dexie {
  incidents!: Table<Incident, string>;
  timeline_entries!: Table<TimelineEntry, string>;
  settings!: Table<SettingItem, string>;

  constructor() {
    super('NocIncidentDispatcherDB');
    this.version(1).stores({
      incidents: 'id, status, severity, causeId, detectedAt, nextDeadlineAt, createdAt, updatedAt',
      timeline_entries: 'id, incidentId, moment, sequenceNumber, dispatchedAt',
      settings: 'key, updatedAt',
    });
  }
}

export const db = new NocDatabase();
