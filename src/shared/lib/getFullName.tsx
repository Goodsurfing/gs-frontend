import { useTranslation } from "react-i18next";

export const useGetFullName = () => {
    const { t } = useTranslation();

    const getFullName = (
        firstName?: string,
        lastName?: string,
    ) => {
        if (!firstName && !lastName) return t("Анонимный пользователь");

        const renderFullName = `${lastName || ""} ${firstName || ""}`.trim();
        return (renderFullName);
    };

    return { getFullName };
};

export const getFullAddress = (city?: string, country?: string): string => {
    if (country && city) return `${country}, ${city}`;
    return country || city || "";
};
