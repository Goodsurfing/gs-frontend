import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";

import SignUpContainer from "@/containers/SignUpContainer/SignUpContainer";

import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import Preloader from "@/shared/ui/Preloader/Preloader";
import styles from "./SignUpPage.module.scss";

const SignUpPage: FC = () => {
    const { locale } = useLocale();
    const { t, ready } = useTranslation();

    if (!ready) {
        return <Preloader />;
    }

    return (
        <SignLayout cancelPath={getMainPageUrl(locale)} cancelText={t("login.Отменить")}>
            <div className={styles.wrapper}>
                <SignUpContainer />
            </div>
        </SignLayout>
    );
};

export default SignUpPage;
