import { useTranslation } from "react-i18next";

export const useGetFullName = () => {
    const { t } = useTranslation();

    const getFullName = (
        firstName?: string | null,
        lastName?: string | null,
    ) => {
        if (!firstName && !lastName) return t("Анонимный пользователь");

        const renderFullName = `${lastName || ""} ${firstName || ""}`.trim();
        return (renderFullName);
    };

    const getOrganizationName = (organizationName?: string | null) => {
        if (!organizationName) return t("Анонимная организация");
        return organizationName;
    };

    return { getFullName, getOrganizationName };
};

export const getFullName = (
    firstName?: string | null,
    lastName?: string | null,
) => {
    if (!firstName && !lastName) return "Не указан";

    const renderFullName = `${lastName || ""} ${firstName || ""}`.trim();
    return (renderFullName);
};

export const getFullAddress = (city?: string | null, country?: string | null): string => {
    if (country && city) return `${country}, ${city}`;
    return country || city || "";
};
