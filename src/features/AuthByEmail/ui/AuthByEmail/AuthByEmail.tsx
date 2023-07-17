import { memo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfileInfoPageUrl, getSignUpPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./AuthByEmail.module.scss";
import LocaleLink from "@/components/LocaleLink/LocaleLink";
import SocialAuthContainer from "@/containers/SocialAuthContainer/SocialAuthContainer";
import { AuthByEmailForm } from "../AuthByEmailForm/AuthByEmailForm";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType } from "@/shared/ui/HintPopup/HintPopup.interface";

export const AuthByEmail = memo(() => {
    const [error, setError] = useState(false);
    const { locale } = useLocale();
    const navigate = useNavigate();
    const onSuccess = useCallback(() => {
        navigate(getProfileInfoPageUrl(locale));
    }, [locale, navigate]);

    const onError = useCallback(() => {
        setError(true);
    }, []);

    return (
        <div className={styles.wrapper}>
            {error && <HintPopup text="Ошибка авторизации" type={HintType.Error} />}
            <h2 className={styles.title}>Вход</h2>
            <AuthByEmailForm
                className={styles.form}
                onSuccess={onSuccess}
                onError={onError}
            />
            <div className={styles.socials}>
                <SocialAuthContainer />
            </div>
            <div className={styles.redirect}>
                Не зарегистрированы на Гудсерфинге?
                <LocaleLink to={getSignUpPageUrl(locale)}>
                    Зарегистрироваться.
                </LocaleLink>
            </div>
        </div>
    );
});
