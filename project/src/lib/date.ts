
export function dateToYearMonthDay(date: Date|string) {
  if(typeof date === 'string')
    date = new Date(date);
  return (
    `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  )
}

export function dateToHourMinuteSeconds(date: Date|string) {
  if(typeof date === 'string')
    date = new Date(date);
  return (
    `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
  )
}

export function timeBetween(start: Date | string, end: Date | string): string {
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const endDate = typeof end === 'string' ? new Date(end) : end;

  const diffMs = endDate.getTime() - startDate.getTime();
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = (totalSeconds % 3600) / 60;
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours} h`);
    if(minutes > 0)
      parts.push(`${(Math.ceil(minutes))} min`);
  }
  else {
    if (minutes > 0) parts.push(`${(minutes)} min`);
    if (seconds > 0) parts.push(`${seconds} sec`);
  }

  return parts.join(' ');
}
