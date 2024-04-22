export const filterOutQuotes = (data: string | null): string | null => {
    if (!data) return null;
    const dataWithoutQuotes = data.replace(/^"(.*)"$/, "$1");
    return dataWithoutQuotes;
};
