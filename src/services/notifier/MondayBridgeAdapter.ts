import { CAUSES_MAP } from '../../constants/causes';
import { SEVERITIES_MAP } from '../../constants/severities';
import { Incident, TimelineEntry } from '../../types/domain';
import { MondayItemPayload } from '../../types/notifier';

export class MondayBridgeAdapter {
  readonly channelName = 'MONDAY_BRIDGE';

  exportIncidentAsMondayItem(incident: Incident, timeline: TimelineEntry[] = []): MondayItemPayload {
    const sev = SEVERITIES_MAP[incident.severity];
    const causa = CAUSES_MAP[incident.causeId];

    const timelineSummary = timeline
      .map(
        (t) =>
          `[${t.sequenceNumber}º Aviso - ${t.moment.toUpperCase()}] ${t.dispatchedAt.slice(11, 16)} (${t.operatorName}):\n${t.compiledMarkdown}`
      )
      .join('\n\n---\n\n');

    return {
      itemName: `${incident.codeNumber} - ${incident.affectedLocations.join(', ')} (${sev.code})`,
      columnValues: {
        status: incident.status === 'RESOLVED' ? 'Resolvido' : 'Em Aberto',
        severity: sev.code,
        cause: causa.category,
        cities: incident.affectedLocations.join(', '),
        detected_at: incident.detectedAt,
        resolved_at: incident.resolvedAt || null,
        duration: incident.totalDurationFormatted || null,
        updates_count: incident.updateCount,
      },
      updateBody: timelineSummary,
    };
  }

  async syncToMondayGraphQL(
    payload: MondayItemPayload,
    apiKey: string,
    boardId: string
  ): Promise<{ success: boolean; itemId?: string; error?: string }> {
    if (!apiKey || !boardId) {
      return { success: false, error: 'API Key e Board ID do Monday são obrigatórios' };
    }

    const query = `
      mutation ($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
        create_item (board_id: $boardId, item_name: $itemName, column_values: $columnValues) {
          id
        }
      }
    `;

    try {
      const response = await fetch('https://api.monday.com/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: apiKey,
        },
        body: JSON.stringify({
          query,
          variables: {
            boardId,
            itemName: payload.itemName,
            columnValues: JSON.stringify(payload.columnValues),
          },
        }),
      });

      const data = await response.json();
      if (data.errors) {
        return { success: false, error: data.errors[0]?.message || 'Erro Monday GraphQL' };
      }

      return { success: true, itemId: data.data?.create_item?.id };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Falha na conexão com Monday' };
    }
  }
}

export const mondayBridgeAdapter = new MondayBridgeAdapter();
