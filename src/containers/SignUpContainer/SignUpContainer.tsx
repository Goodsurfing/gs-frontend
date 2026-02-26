import React, { FC, useCallback, useState } from "react";
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
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";

const SignUpContainer: FC = () => {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { refetchProfile, profileDataIsFethcing } = useAuth();
    const [toast, setToast] = useState<ToastAlert>();

    const onSuccess = useCallback(() => {
        setToast(undefined);
        refetchProfile();
        navigate(getProfileInfoPageUrl(locale));
    }, [locale, navigate, refetchProfile]);

    const onError = useCallback((error: string) => {
        setToast({
            text: error,
            type: HintType.Error,
        });
    }, []);

    if (profileDataIsFethcing) {
        return (
            <MiniLoader />
        );
    }

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
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
            <AuthByVk redirect="signup" onSuccess={onSuccess} onError={onError} />
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
