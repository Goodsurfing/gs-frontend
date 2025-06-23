import { useTranslation } from "react-i18next";
import { FormApplicationStatus } from "@/entities/Application";

export const useApplicationStatus = () => {
    const { t } = useTranslation();

    const applicationStatusList: Record<FormApplicationStatus, string> = {
        new: t("notes.new"),
        accepted: t("notes.accepted"),
        canceled: t("notes.canceled"),
    };

    const getApplicationStatus = (applicationStatus:
    FormApplicationStatus) => applicationStatusList[applicationStatus];

    return { getApplicationStatus };
};
