import { FC, memo } from "react";
import { useTranslation } from "react-i18next";
import { getResetPasswordPageUrl } from "@/shared/config/routes/AppUrls";
import Checkbox from "@/components/Checkbox/Checkbox";
import LocaleLink from "@/components/LocaleLink/LocaleLink";

import styles from "./AuthByEmailHelp.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

interface AuthByEmailHelpProps {
    value: boolean;
    onChange: (value: boolean) => void;
}

export const AuthByEmailHelp: FC<AuthByEmailHelpProps> = memo(
    (props: AuthByEmailHelpProps) => {
        const { value, onChange } = props;
        const { locale } = useLocale();
        const { t } = useTranslation();

        return (
            <div className={styles.help}>
                <Checkbox
                    isChecked={value}
                    onChange={() => onChange(!value)}
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
    },
);
