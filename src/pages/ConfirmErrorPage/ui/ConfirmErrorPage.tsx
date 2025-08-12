import { FC } from "react";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";

import { getSignInPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./ConfirmErrorPage.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useTranslation } from "react-i18next";

const ConfirmErrorPage: FC = () => {
    const { locale } = useLocale();
    const {t} = useTranslation();

    return (
        <SignLayout cancelText={t("login.Отменить")} cancelPath={getSignInPageUrl(locale)}>
            <div className={styles.wrapper}>
                <SignTitle>{t("login.Произошла неизвестная ошибка!")}</SignTitle>
                <div className={styles.content}>
                    <div className={styles.notification}>
                        <a href={getSignInPageUrl(locale)}>{t("login.Попробуйте ещё раз.")}</a>
                    </div>
                </div>
            </div>
        </SignLayout>
    );
};

export default ConfirmErrorPage;
