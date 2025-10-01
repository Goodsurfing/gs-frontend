import { useTranslation } from "react-i18next";

export const useErrorTranslate = () => {
    const { t } = useTranslation("offer");

    const errorsLib: Record<string, string> = {
        "Поле название вакансии не может быть пустымы": t("description.Поле название вакансии не может быть пустымы"),
        "Это поле является обязательным": t("description.Это поле является обязательным"),
    };

    const translate = (errorMessage: string | undefined): string => {
        if (!errorMessage) return "";

        const key = errorsLib[errorMessage];
        if (key) {
            return key;
        }

        return errorMessage;
    };

    return { translate };
};
