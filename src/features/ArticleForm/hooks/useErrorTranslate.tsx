import { useTranslation } from "react-i18next";

export const useTranslateError = () => {
    const { t } = useTranslation("volunteer");

    const errorsLb: Record<string, string> = {
        "Заголовок слишком короткий": t("volunteer-create-article.Заголовок слишком короткий"),
        "Заголовок слишком большой": t("volunteer-create-article.Заголовок слишком большой"),
        "Описание статьи должно достигать как минимум 200 символов": t("volunteer-create-article.Описание статьи должно достигать как минимум 200 символов"),
        "Описание статьи может достигать не больше 30000 символов": t("volunteer-create-article.Описание статьи может достигать не больше 30000 символов"),
        "Введите корректную ссылку на заявку": t("volunteer-create-article.Введите корректную ссылку на заявку"),
    };

    const translate = (errorMessage: string | undefined): string => {
        if (!errorMessage) return "";

        const key = errorsLb[errorMessage];
        if (key) {
            return key;
        }

        return errorMessage;
    };

    return { translate };
};
