import { FC } from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";

import { AuthByEmail } from "@/features/AuthByEmail";

import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import Preloader from "@/shared/ui/Preloader/Preloader";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";

import styles from "./SignInPage.module.scss";

const SignInPage: FC = () => {
    const { locale } = useLocale();
    const { ready, t } = useTranslation();

    if (!ready) {
        return <Preloader />;
    }

    return (
        <SignLayout cancelPath={getMainPageUrl(locale)} cancelText={t("login.Отменить")}>
            <div className={styles.wrapper}>
                <AuthByEmail />
            </div>
        </SignLayout>
    );
};

export default SignInPage;
