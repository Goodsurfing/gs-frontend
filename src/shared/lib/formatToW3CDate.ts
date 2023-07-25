export function formatToW3CDate(date: Date): string {
    const isoString = date.toISOString();
    const w3cFormat = isoString.replace(/\.\d+Z$/, "+03:00");
    return w3cFormat;
}
