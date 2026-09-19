/**
 * Calcula a diferença em minutos e formata amigavelmente em português
 * Suporta virada de dia (ex: 23:00 até 02:30 = 3h 30m)
 */
export function calculateDurationFromTimes(startTime: string, endTime: string): string {
  if (!startTime || !endTime) return '';

  const [h1, m1] = startTime.split(':').map(Number);
  const [h2, m2] = endTime.split(':').map(Number);

  if (h1 === undefined || m1 === undefined || h2 === undefined || m2 === undefined) {
    return '';
  }

  let totalMinutes = h2 * 60 + m2 - (h1 * 60 + m1);
  if (totalMinutes < 0) {
    totalMinutes += 1440; // 24 horas em minutos
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} minutos`;
  }
  if (minutes === 0) {
    return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }
  return `${hours} ${hours === 1 ? 'hora e ' : 'horas e '}${minutes} minutos`;
}

export function formatTimeHHMM(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function formatDateDDMM(date: Date): string {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
}
