export const getFullName = (
    firstName?: string,
    lastName?: string,
): string => {
    if (!firstName && !lastName) return "Анонимный пользователь";

    const renderFullName = `${lastName || ""} ${firstName || ""}`.trim();
    return (renderFullName);
};

export const getFullAddress = (city?: string, country?: string): string => {
    if (country && city) return `${country}, ${city}`;
    return country || city || "";
};
