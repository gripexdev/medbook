export function formatBookingDate(value: string) {
  if (!value) {
    return "Select a date";
  }

  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

export function formatBookingTime(value: string) {
  if (!value) {
    return "Select a time";
  }

  const [hours, minutes] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(hours || 0, minutes || 0, 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

export function getLocalDateInputValue(referenceDate = new Date()) {
  const localDate = new Date(referenceDate.getTime() - referenceDate.getTimezoneOffset() * 60000);
  return localDate.toISOString().split("T")[0];
}
