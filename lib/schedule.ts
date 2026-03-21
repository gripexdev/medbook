import { siteConfig } from "@/config/site";

export function isValidTime(value: string) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

export function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function minutesToTime(value: number) {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function generateWindowStartTimes(
  startTime: string,
  endTime: string,
  durationMinutes: number,
  intervalMinutes = siteConfig.slotIntervalMinutes
) {
  const slots: string[] = [];
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  for (let cursor = start; cursor + durationMinutes <= end; cursor += intervalMinutes) {
    slots.push(minutesToTime(cursor));
  }

  return slots;
}

export function getOccupiedSlotTimes(
  startTime: string,
  durationMinutes: number,
  intervalMinutes = siteConfig.slotIntervalMinutes
) {
  const slots: string[] = [];
  const start = timeToMinutes(startTime);

  for (let cursor = start; cursor < start + durationMinutes; cursor += intervalMinutes) {
    slots.push(minutesToTime(cursor));
  }

  return slots;
}

export function getWeekdayLabel(weekday: number) {
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][weekday] || "Unknown";
}

export function getDateTimeFromBooking(date: string, time: string) {
  return new Date(`${date}T${time}:00`);
}

export function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}
