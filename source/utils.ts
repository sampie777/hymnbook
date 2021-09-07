export function dateFrom(date: Date | string): Date {
  if (typeof date === "string") {
    return new Date(date);
  }
  return date;
}
