const DAY_MS = 86_400_000;

export function formatIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: string, days: number) {
  const result = new Date(`${date}T00:00:00.000Z`);
  result.setUTCDate(result.getUTCDate() + days);
  return formatIsoDate(result);
}

export function weekStartFor(date = new Date()) {
  const result = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = result.getUTCDay() || 7;
  result.setUTCDate(result.getUTCDate() - day + 1);
  return formatIsoDate(result);
}

export function weekDates(weekStart: string) {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

export function dateFromToday(days: number) {
  return formatIsoDate(new Date(Date.now() + days * DAY_MS));
}
