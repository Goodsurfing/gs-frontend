import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
// import SocialAuthContainer from "@/containers/SocialAuthContainer/SocialAuthContainer";
import SignUpForm from "@/containers/SignUpContainer/SignUpForm/SignUpForm";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getPrivacyPolicyPageUrl, getProfileInfoPageUrl } from "@/shared/config/routes/AppUrls";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";

import { AuthByVk } from "@/features/AuthByVk";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import styles from "./SignUpContainer.module.scss";

const SignUpContainer: FC = () => {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { refetchProfile, profileDataIsFethcing } = useAuth();

    const onSuccess = useCallback(() => {
        refetchProfile();
        navigate(getProfileInfoPageUrl(locale));
    }, [locale, navigate, refetchProfile]);

    if (profileDataIsFethcing) {
        return (
            <MiniLoader />
        );
    }

    return (
        <div className={styles.wrapper}>
            <SignTitle>{t("login.Регистрация пользователя")}</SignTitle>
            <SignUpForm />
            <div className={styles.confirm}>
                {t("login.Нажимая кнопку «Зарегистрироваться», я принимаю")}
                {" "}
                <Link to={getPrivacyPolicyPageUrl(locale)}>
                    {t("login.Политику конфеденциальности ГудСёрфинга")}
                </Link>
                .
            </div>
            <AuthByVk redirect="signup" onSuccess={onSuccess} />
            {/* <div className={styles.socials}>
                <SocialAuthContainer />
            </div> */}
            <p className={styles.attention}>
                {t("login.Мы не постим ничего без вашего ведома")}
            </p>
        </div>
    );
};

export default SignUpContainer;
