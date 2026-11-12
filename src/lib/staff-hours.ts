import type { WorkSegment } from "@/types/content";

export function calculateWorkHours(segments: WorkSegment[] = []): number {
  const totalMinutes = segments.reduce((total, segment) => {
    const [startHour, startMinute] = segment.startTime.split(":").map(Number);
    const [endHour, endMinute] = segment.endTime.split(":").map(Number);

    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;

    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      return total;
    }

    return total + end - start;
  }, 0);

  return totalMinutes / 60;
}

export function formatWorkHours(hours: number): string {
  const minutes = Math.round(hours * 60);
  const hour = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) return `${hour} giờ`;

  return `${hour} giờ ${remainingMinutes} phút`;
}
