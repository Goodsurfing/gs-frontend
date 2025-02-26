export const getFullName = (
    firstName?: string,
    lastName?: string,
): string => `${lastName || ""} ${firstName || ""}`.trim();

export const getFullAddress = (city?: string, country?: string): string => {
    if (country && city) return `${country}, ${city}`;
    return country || city || "";
};
