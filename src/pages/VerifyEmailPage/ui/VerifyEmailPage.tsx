import React from "react";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getProfilePageUrl } from "@/shared/config/routes/AppUrls";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { VerifyEmailWidget } from "@/widgets/VerifyEmailWidget";
import styles from "./VerifyEmailPage.module.scss";

const VerifyEmailPage = () => {
    const { locale } = useLocale();
    const { t, ready } = useTranslation();

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
