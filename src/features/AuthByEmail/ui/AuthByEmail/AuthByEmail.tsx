import {
    memo, useCallback, useEffect, useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getProfileInfoPageUrl, getSignUpPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./AuthByEmail.module.scss";
import LocaleLink from "@/components/LocaleLink/LocaleLink";
import SocialAuthContainer from "@/containers/SocialAuthContainer/SocialAuthContainer";
import { AuthByEmailForm } from "../AuthByEmailForm/AuthByEmailForm";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType } from "@/shared/ui/HintPopup/HintPopup.interface";

export const AuthByEmail = memo(() => {
    const [error, setError] = useState("");
    const { locale } = useLocale();
    const navigate = useNavigate();
    const onSuccess = useCallback(() => {
        navigate(getProfileInfoPageUrl(locale));
    }, [locale, navigate]);
    const { t, ready } = useTranslation();

    const onError = useCallback((errorText: string) => {
        setError(errorText);
    }, []);

    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => setError(""), 4000);
            return () => clearTimeout(timeout);
        }
    }, [error]);

    if (!ready) {
        return null;
    }

    return (
        <div className={styles.wrapper}>
            {error && <HintPopup text={t(`login.${error}`)} type={HintType.Error} />}
            <h2 className={styles.title}>{t("login.Вход")}</h2>
            <AuthByEmailForm
                className={styles.form}
                onSuccess={onSuccess}
                onError={onError}
            />
            <div className={styles.socials}>
                <SocialAuthContainer />
            </div>
            <div className={styles.redirect}>
                {t("login.Не зарегистрированы на Гудсерфинге?")}
                {" "}
                <LocaleLink to={getSignUpPageUrl(locale)}>
                    {t("login.Зарегистрироваться")}
                </LocaleLink>
            </div>
        </div>
    );
});
