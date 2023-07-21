export function formatToW3CDate(date: Date) {
  return date.toISOString().slice(0, -5) + 'Z';
}