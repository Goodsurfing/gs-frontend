export const getCategoryIdsFromUrlParam = (categoryParam: string): number[] => (
    categoryParam
        .split(",")
        .map((item) => item.trim())
        .map(Number)
        .filter((id) => !Number.isNaN(id) && id > 0)
);

export const getCategoryUrlParamFromIds = (
    category: number | Array<number | undefined> | undefined,
): string => {
    let categoryIds: number[] = [];

    if (Array.isArray(category)) {
        categoryIds = category.filter((id): id is number => typeof id === "number");
    } else if (category) {
        categoryIds = [category];
    }

    return categoryIds.join(",");
};
