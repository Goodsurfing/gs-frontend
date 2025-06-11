import { useTranslation } from "react-i18next";

export const useGetFullName = (
    firstName?: string,
    lastName?: string,
): string => {
    const { t } = useTranslation();

    if (!firstName && !lastName) return t("Анонимный пользователь");

    const renderFullName = `${lastName || ""} ${firstName || ""}`.trim();
    return (renderFullName);
};

export const getFullAddress = (city?: string, country?: string): string => {
    if (country && city) return `${country}, ${city}`;
    return country || city || "";
};
