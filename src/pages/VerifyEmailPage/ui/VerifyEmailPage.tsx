import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getMainPageUrl, getProfilePageUrl } from "@/shared/config/routes/AppUrls";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { VerifyEmailWidget } from "@/widgets/VerifyEmailWidget";
import styles from "./VerifyEmailPage.module.scss";
import { useAuth } from "@/routes/model/guards/AuthProvider";

const VerifyEmailPage = () => {
    const { locale } = useLocale();
    const { t, ready } = useTranslation();
    const navigate = useNavigate();
    const { isAuth } = useAuth();

    useEffect(() => {
        if (!isAuth) {
            navigate(getMainPageUrl(locale));
        }
    }, [isAuth, locale, navigate]);

    if (!ready) {
        return (
            <Preloader />
        );
    }

    return (
        <SignLayout disableRedirectIfIsAuth cancelPath={getProfilePageUrl(locale)} cancelText={t("login.Отменить")}>
            <div className={styles.wrapper}>
                <VerifyEmailWidget />
            </div>
        </SignLayout>
    );
};

export default VerifyEmailPage;
