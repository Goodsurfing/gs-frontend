import { memo } from "react";
import { useTranslation } from "react-i18next";
import { getResetPasswordPageUrl } from "@/shared/config/routes/AppUrls";
import Checkbox from "@/components/Checkbox/Checkbox";
import LocaleLink from "@/components/LocaleLink/LocaleLink";
import { useCheckbox } from "@/shared/hooks/useCheckbox";

import styles from "./AuthByEmailHelp.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

export const AuthByEmailHelp = memo(() => {
    const { locale } = useLocale();
    const { t } = useTranslation();

    const { handleToggle, isChecked } = useCheckbox();

    return (
        <div className={styles.help}>
            <Checkbox
                isChecked={isChecked}
                onChange={handleToggle}
                text={t("login.Запомнить меня")}
            />
            {" "}
            <LocaleLink
                to={getResetPasswordPageUrl(locale)}
                className={styles.forget}
            >
                {t("login.Забыли пароль?")}
            </LocaleLink>
        </div>
    );
});
