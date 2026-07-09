import { useTranslation } from "react-i18next";

export const useGetFullName = () => {
    const { t } = useTranslation();

    const getFullName = (
        firstName?: string | null,
        lastName?: string | null,
    ) => {
        if (!firstName && !lastName) return t("Анонимный пользователь");

        const renderFullName = `${firstName || ""} ${lastName || ""}`.trim();
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

    // Порядок «Имя Фамилия» — как в useGetFullName() выше. Раньше здесь был
    // обратный порядок «Фамилия Имя», из-за чего одно и то же ФИО выглядело
    // по-разному в зависимости от того, через хук или эту функцию рендерилось
    // (row 103 — блог/видео/новости/админ-таблицы vs отзывы/чат/команда).
    const renderFullName = `${firstName || ""} ${lastName || ""}`.trim();
    return (renderFullName);
};

export const getFullAddress = (city?: string | null, country?: string | null): string => {
    if (country && city) return `${country}, ${city}`;
    return country || city || "";
};
