function plural(n: number, one: string, few: string, many: string): string {
    const abs = Math.abs(n) % 100;
    const n1 = abs % 10;
    if (abs > 10 && abs < 20) return many;
    if (n1 > 1 && n1 < 5) return few;
    if (n1 === 1) return one;
    return many;
}

export function formatDuration(minDays?: number, maxDays?: number): string {
    if (!minDays && !maxDays) return "";
    const min = minDays ?? 0;
    const max = maxDays ?? min;

    if (max >= 30) {
        const minM = Math.round(min / 30);
        const maxM = Math.round(max / 30);
        const label = plural(maxM, "месяц", "месяца", "месяцев");
        if (minM === maxM || minM === 0) return `${maxM} ${label}`;
        return `${minM}–${maxM} ${label}`;
    }

    const label = plural(max, "день", "дня", "дней");
    if (min === max || min === 0) return `${max} ${label}`;
    return `${min}–${max} ${label}`;
}

export function getOfferBadge(
    updated: string,
    averageRating: number,
    reviewsCount: number,
    applicationEndDate?: string,
): "new" | "popular" | "urgent" | null {
    const now = Date.now();
    const updatedDate = new Date(updated).getTime();

    const twoWeeks = 14 * 24 * 60 * 60 * 1000;
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    if (applicationEndDate) {
        const endDate = new Date(applicationEndDate).getTime();
        if (endDate > now && endDate - now < twoWeeks) return "urgent";
    }
    if (averageRating >= 4.7 && reviewsCount >= 20) return "popular";
    if (now - updatedDate < thirtyDays) return "new";
    return null;
}
