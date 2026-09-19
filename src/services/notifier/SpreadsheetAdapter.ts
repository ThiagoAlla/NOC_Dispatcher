import { CAUSES_MAP } from '../../constants/causes';
import { SEVERITIES_MAP } from '../../constants/severities';
import { DispatchDraft, Incident } from '../../types/domain';

export class SpreadsheetTsvAdapter {
  readonly channelName = 'SPREADSHEET_TSV';

  generateTsvRow(draft: DispatchDraft, incident?: Incident | null): string {
    const now = new Date();
    const dI = incident?.detectedAt
      ? `${new Date(incident.detectedAt).getDate().toString().padStart(2, '0')}/${(new Date(incident.detectedAt).getMonth() + 1).toString().padStart(2, '0')}/${new Date(incident.detectedAt).getFullYear()}`
      : `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    let dF = '';
    let hF = '';
    if (draft.spreadsheetEndedAt) {
      dF = `${draft.spreadsheetEndedAt.slice(8, 10)}/${draft.spreadsheetEndedAt.slice(5, 7)}/${draft.spreadsheetEndedAt.slice(0, 4)}`;
      hF = draft.spreadsheetEndedAt.slice(11, 16);
    }

    const ini = incident?.incidentStartedAt || draft.incidentStartedTime;
    const cli = incident?.clientCountEstimate || '';
    const cleanCli = cli.replace(/[^\d]/g, '');

    const sev = SEVERITIES_MAP[draft.severity];
    const causaDef = CAUSES_MAP[draft.causeId];
    let cau = draft.techCause || causaDef.technicalCause;

    if (draft.severity === 'SA') {
      const atkType = draft.ddosType || 'Volumétrico';
      const mit = draft.ddosMitigation ? `. Mitigação: ${draft.ddosMitigation}` : '';
      cau = `Ataque — ${atkType}${mit}${cau ? `. ${cau}` : ''}`;
    }

    const firstAnnouncement = incident?.firstAnnouncementAt || '';
    const updateCount = incident?.updateCount !== undefined ? String(incident.updateCount) : '0';
    const ddosTarget = draft.severity === 'SA' ? draft.techLocation : '';
    const ddosVol = draft.severity === 'SA' ? draft.ddosVolume : '';

    const columns = [
      '', // Coluna vazia de margem
      dI,
      ini,
      dF,
      hF,
      '',
      sev.code,
      causaDef.category,
      draft.citiesRaw,
      draft.techLocation,
      cleanCli,
      'Internet',
      cau,
      firstAnnouncement,
      '',
      '',
      updateCount,
      '',
      ddosTarget,
      ddosVol,
      '',
    ];

    return columns.join('\t');
  }
}

export const spreadsheetAdapter = new SpreadsheetTsvAdapter();
