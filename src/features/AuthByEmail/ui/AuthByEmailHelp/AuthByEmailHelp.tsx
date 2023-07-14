import { memo } from "react";
import { getResetPasswordPageUrl, useLocale } from "@/routes";
import Checkbox from "@/components/Checkbox/Checkbox";
import LocaleLink from "@/components/LocaleLink/LocaleLink";
import { useCheckbox } from "@/shared/hooks/useCheckbox";

import styles from "./AuthByEmailHelp.module.scss";

export const AuthByEmailHelp = memo(() => {
    const { locale } = useLocale();

    const { handleToggle, isChecked } = useCheckbox();

    return (
        <div className={styles.help}>
            <Checkbox
                isChecked={isChecked}
                onChange={handleToggle}
                text="Запомнить меня"
            />
            <LocaleLink
                to={getResetPasswordPageUrl(locale)}
                className={styles.forget}
            >
                Забыли пароль?
            </LocaleLink>
        </div>
    );
});
