import { ACTION_PACKAGES_MAP } from '../constants/packages';
import { SEVERITIES_MAP } from '../constants/severities';
import { DispatchDraft, Incident } from '../types/domain';
import { formatDateDDMM, formatTimeHHMM } from './durationCalculator';

export interface CompilationResult {
  text: string;
}

export function compileWhatsAppMessage(draft: DispatchDraft, incident?: Incident | null): CompilationResult {
  const lines: string[] = [];
  const sevConfig = SEVERITIES_MAP[draft.severity];
  const isMaintenance = draft.severity === 'S4';
  const now = new Date();
  const dateFormatted = formatDateDDMM(now);
  const timeFormatted = formatTimeHHMM(now);

  // 1. Título Executivo do Comunicado
  let title = 'COMUNICADO DE INCIDENTE';
  let icon = isMaintenance ? '🔵' : sevConfig.ico;

  if (isMaintenance) {
    if (draft.moment === 'ab') title = 'MANUTENÇÃO PROGRAMADA';
    if (draft.moment === 'at') title = 'ATUALIZAÇÃO DA MANUTENÇÃO';
    if (draft.moment === 'nr') title = 'MANUTENÇÃO CONCLUÍDA';
  } else {
    if (draft.moment === 'at') {
      title = 'ATUALIZAÇÃO DE INCIDENTE';
      icon = '🔄';
    } else if (draft.moment === 'nr') {
      title = 'RESTABELECIMENTO DE SERVIÇO';
      icon = '✅';
    } else if (draft.moment === 'en') {
      title = 'RELATÓRIO DE FECHAMENTO DE INCIDENTE';
      icon = '📋';
    }
  }

  lines.push(`${icon} *${title}*`);

  // Metadados Essenciais do Cabeçalho
  lines.push(`*Severidade:* ${sevConfig.code} — ${sevConfig.label}`);
  if (draft.citiesRaw.trim()) {
    lines.push(`*Localidade:* ${draft.citiesRaw.trim()}`);
  }

  // 2. Detalhes Conforme o Momento

  // ABERTURA DE INCIDENTE (ab)
  if (draft.moment === 'ab') {
    if (draft.incidentStartedTime) {
      lines.push(`*Início do Evento:* ${draft.incidentStartedTime}`);
    }
    lines.push('');

    if (draft.whatIsHappening) {
      lines.push(`*Cenário:* ${draft.whatIsHappening}`);
    }
    if (incident?.clientCountEstimate && incident.clientCountEstimate !== 'Ainda em levantamento') {
      lines.push(`*Impacto Estimado:* ${incident.clientCountEstimate}`);
    }
    if (draft.whatWeAreDoing) {
      lines.push(`*Ação Técnica:* ${draft.whatWeAreDoing}`);
    }

    if (draft.severity === 'SA') {
      lines.push('*Previsão:* Mitigações ativas em andamento com reestabilização progressiva do tráfego.');
    } else if (draft.estimatedReturn) {
      lines.push(`*Previsão:* ${draft.estimatedReturn}`);
    }
  }

  // ATUALIZAÇÃO PERIÓDICA (at)
  if (draft.moment === 'at') {
    const updateCount = incident?.updateCount !== undefined ? incident.updateCount + 1 : 1;
    const startInfo = draft.incidentStartedTime ? `*Início:* ${draft.incidentStartedTime} · ` : '';
    lines.push(`${startInfo}*Atualização:* #${updateCount}`);
    lines.push('');

    if (draft.whatChanged) {
      lines.push(`*Status:* ${draft.whatChanged}`);
    }
    if (draft.recoveredPortion) {
      lines.push(`*Progresso:* ${draft.recoveredPortion}`);
    }

    if (draft.severity === 'SA') {
      lines.push('*Previsão:* Mitigações ativas em andamento com reestabilização progressiva do tráfego.');
    } else if (draft.estimatedReturn) {
      lines.push(`*Previsão:* ${draft.estimatedReturn}`);
    }
  }

  // RESTABELECIMENTO (nr)
  if (draft.moment === 'nr') {
    if (draft.recoveryTime) {
      lines.push(`*Horário de Retorno:* ${draft.recoveryTime}`);
    }
    if (draft.manualDuration) {
      lines.push(`*Tempo Total Fora:* ${draft.manualDuration}`);
    }
    lines.push('');

    if (draft.whatReturned) {
      lines.push(`*Cenário Concluído:* ${draft.whatReturned}`);
    }
    if (draft.clientInstructions) {
      lines.push(`*Orientação ao Cliente:* ${draft.clientInstructions}`);
    }
  }

  // RELATÓRIO DE FECHAMENTO (en)
  if (draft.moment === 'en') {
    if (draft.manualDuration) {
      lines.push(`*Duração Total:* ${draft.manualDuration}`);
    }
    lines.push('');

    if (draft.whatIsHappening) {
      lines.push(`*Causa Raiz:* ${draft.whatIsHappening}`);
    }
    if (draft.whatWeDid) {
      lines.push(`*Ação Corretiva Executada:* ${draft.whatWeDid}`);
    }
    if (draft.whatChangesForFuture) {
      lines.push(`*Ação Preventiva / Melhoria:* ${draft.whatChangesForFuture}`);
    }
  }

  // 3. Diretrizes Operacionais para as Equipes
  if (draft.moment === 'ab' || draft.moment === 'at') {
    const pkg = ACTION_PACKAGES_MAP[draft.actionPackageId];
    lines.push('');
    if (!pkg || pkg.id === 'igual') {
      lines.push('*Diretrizes:* Seguem inalteradas as orientações anteriores.');
    } else if (pkg.lines && pkg.lines.length > 0) {
      lines.push(`*Diretrizes para as Equipes (${pkg.title}):*`);
      pkg.lines.forEach((l) => lines.push(`• ${l}`));
    } else {
      lines.push('*Diretrizes:* Operação mantida em fluxo regular.');
    }

    if (draft.extraOrientation.trim()) {
      lines.push(`• _Atenção:_ ${draft.extraOrientation.trim()}`);
    }

    if (draft.customerScript.trim() && !(draft.moment === 'at' && draft.actionPackageId === 'igual')) {
      lines.push('');
      lines.push('*Posicionamento ao Cliente:*');
      lines.push(`"${draft.customerScript.trim()}"`);
    }
  }

  if (draft.moment === 'nr') {
    lines.push('');
    lines.push('*Diretrizes para as Equipes:*');
    lines.push('• _Atendimento:_ Atendimento normalizado.');
    lines.push('• _Comercial / Lojas:_ Agendamentos e rotina liberados.');
    lines.push('• _Equipes de Campo:_ Rotina regular restabelecida.');
    if (draft.extraOrientation.trim()) {
      lines.push(`• _Atenção:_ ${draft.extraOrientation.trim()}`);
    }
  }

  // 4. Rodapé e Próxima Cadência
  lines.push('');
  if (draft.moment === 'nr') {
    lines.push(
      isMaintenance
        ? '✅ *Manutenção concluída com sucesso.* Serviços operacionais.'
        : '✅ *Incidente normalizado.* Telemetria em monitoramento de estabilidade.'
    );
  } else if (draft.moment === 'en') {
    lines.push('📋 *Incidente finalizado e documentado.* Dúvidas, contatar o NOC.');
  } else if (draft.nextAnnouncementTime) {
    lines.push(`⏱️ *Próxima Atualização:* até ${draft.nextAnnouncementTime}`);
  } else if (isMaintenance) {
    lines.push('⏱️ *Aviso no início e na conclusão da manutenção.*');
  } else {
    lines.push('⏱️ *Próxima Atualização: a definir*');
  }

  const operatorTag = draft.operatorName.trim() ? `${draft.operatorName.trim()} · NOC Grupo IBL` : 'NOC Grupo IBL';
  lines.push(`_${operatorTag} · ${dateFormatted} ${timeFormatted}_`);
  lines.push('');
  lines.push('🔒 *USO INTERNO — NÃO ENCAMINHAR*');

  return {
    text: lines.join('\n').replace(/\n{3,}/g, '\n\n'),
  };
}
