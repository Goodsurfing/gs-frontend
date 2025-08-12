import { FC } from "react";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";

import ResetPasswordContainer from "@/containers/ResetPasswordContainer/ResetPasswordContainer";

import { useLocale } from "@/app/providers/LocaleProvider";

import styles from "./ResetPasswordPage.module.scss";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { useTranslation } from "react-i18next";

const ResetPasswordPage: FC = () => {
    const { locale } = useLocale();
    const {t} = useTranslation();

    return (
        <SignLayout cancelText={t("login.Отменить")} cancelPath={getMainPageUrl(locale)}>
            <div className={styles.wrapper}>
                <ResetPasswordContainer />
            </div>
        </SignLayout>
    );
};

export default ResetPasswordPage;
