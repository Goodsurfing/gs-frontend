import React, { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
// import { SocialAuthContainer } from "@/features/SocialAuthContainer";
import SignUpForm from "@/features/SignUpContainer/ui/SignUpForm/SignUpForm";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getPrivacyPolicyPageUrl, getProfileInfoPageUrl } from "@/shared/config/routes/AppUrls";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";

import { AuthByVk } from "@/features/AuthByVk";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import { useUpdateMarketingConsentMutation } from "@/entities/Profile";
import {
    hasMarketingConsentIntent,
    saveMarketingConsentIntent,
    takeMarketingConsentIntent,
} from "../../lib/marketingConsentIntent";
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
    // Чекбокс согласия на рассылку (GS-203): по умолчанию снят; для входа
    // через VK отметка переживает уход на сайт VK (sessionStorage)
    const [marketingConsent, setMarketingConsent] = useState(hasMarketingConsentIntent);
    const [updateMarketingConsent] = useUpdateMarketingConsentMutation();

    const changeMarketingConsent = useCallback((value: boolean) => {
        setMarketingConsent(value);
        saveMarketingConsentIntent(value);
    }, []);

    const onSuccess = useCallback(async () => {
        setToast(undefined);
        if (takeMarketingConsentIntent()) {
            await updateMarketingConsent({ consent: true, source: "registration" }).unwrap().catch(() => undefined);
        }
        refetchProfile();
        navigate(getProfileInfoPageUrl(locale));
    }, [locale, navigate, refetchProfile, updateMarketingConsent]);

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
            <SignUpForm
                marketingConsent={marketingConsent}
                onMarketingConsentChange={changeMarketingConsent}
            />
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
