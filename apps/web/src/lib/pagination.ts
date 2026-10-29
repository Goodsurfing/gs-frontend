/** Пункты пагинации как у MUI Pagination (boundaryCount 1, siblingCount 1) — так выглядела пагинация старого фронта. */
export type PageItem = number | "start-ellipsis" | "end-ellipsis";

const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

export function pageItems(page: number, count: number, boundary = 1, siblings = 1): PageItem[] {
    const startPages = range(1, Math.min(boundary, count));
    const endPages = range(Math.max(count - boundary + 1, boundary + 1), count);
    const siblingsStart = Math.max(
        Math.min(page - siblings, count - boundary - siblings * 2 - 1),
        boundary + 2,
    );
    const siblingsEnd = Math.min(
        Math.max(page + siblings, boundary + siblings * 2 + 2),
        endPages.length > 0 ? endPages[0]! - 2 : count - 1,
    );

    return [
        ...startPages,
        ...(siblingsStart > boundary + 2 ? ["start-ellipsis" as const] : boundary + 1 < count - boundary ? [boundary + 1] : []),
        ...range(siblingsStart, siblingsEnd),
        ...(siblingsEnd < count - boundary - 1 ? ["end-ellipsis" as const] : count - boundary > boundary ? [count - boundary] : []),
        ...endPages,
    ];
}
