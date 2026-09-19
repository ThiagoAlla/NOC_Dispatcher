import { db } from '../database';
import { Incident, IncidentId } from '../../types/domain';

export const incidentRepository = {
  async getById(id: IncidentId): Promise<Incident | undefined> {
    return db.incidents.get(id);
  },

  async getAllOpen(): Promise<Incident[]> {
    return db.incidents
      .where('status')
      .anyOf(['OPEN', 'MONITORING'])
      .reverse()
      .sortBy('updatedAt');
  },

  async getAll(): Promise<Incident[]> {
    return db.incidents.orderBy('createdAt').reverse().toArray();
  },

  async save(incident: Incident): Promise<string> {
    incident.updatedAt = new Date().toISOString();
    return db.incidents.put(incident);
  },

  async delete(id: IncidentId): Promise<void> {
    await db.transaction('rw', db.incidents, db.timeline_entries, async () => {
      await db.timeline_entries.where('incidentId').equals(id).delete();
      await db.incidents.delete(id);
    });
  },

  async clearAll(): Promise<void> {
    await db.transaction('rw', db.incidents, db.timeline_entries, async () => {
      await db.timeline_entries.clear();
      await db.incidents.clear();
    });
  }
};
