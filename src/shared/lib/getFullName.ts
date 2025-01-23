export const getFullName = (
    firstName?: string,
    lastName?: string,
): string => `${lastName || ""} ${firstName || ""}`.trim();
