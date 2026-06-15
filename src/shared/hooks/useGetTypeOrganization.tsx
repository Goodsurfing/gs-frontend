import { useTranslation } from "react-i18next";
import { OrganizationType } from "@/features/HostDescription/model/types/hostDescription";

interface TypeData {
    value: OrganizationType;
    text: string;
}

export const useGetTypeOrganization = () => {
    const { t } = useTranslation("host");

    const hostTypes: TypeData[] = [
        {
            text: t("hostDescription.Другое"),
            value: "Другое",
        },
        {
            text: t("hostDescription.ИП"),
            value: "ИП",
        },
        {
            text: t("hostDescription.ОАО"),
            value: "ОАО",
        },
        {
            text: t("hostDescription.ООО"),
            value: "ООО",
        },
        {
            text: t("hostDescription.ООПТ"),
            value: "ООПТ",
        },
        {
            text: t("hostDescription.НКО"),
            value: "НКО",
        },
    ];

    const getTranslate = (type: string) => {
        const translations: Record<string, string> = {
            ИП: t("hostDescription.ИП"),
            ОАО: t("hostDescription.ОАО"),
            ООО: t("hostDescription.ООО"),
            ООПТ: t("hostDescription.ООПТ"),
            НКО: t("hostDescription.НКО"),
        };

        return translations[type] ?? type;
    };
    return { getTranslate, hostTypes };
};
