import { db } from '../database';
import { IncidentId, TimelineEntry } from '../../types/domain';

export const timelineRepository = {
  async getByIncidentId(incidentId: IncidentId): Promise<TimelineEntry[]> {
    return db.timeline_entries
      .where('incidentId')
      .equals(incidentId)
      .sortBy('sequenceNumber');
  },

  async addEntry(entry: TimelineEntry): Promise<string> {
    return db.timeline_entries.add(entry);
  },

  async deleteByIncidentId(incidentId: IncidentId): Promise<number> {
    return db.timeline_entries.where('incidentId').equals(incidentId).delete();
  }
};
