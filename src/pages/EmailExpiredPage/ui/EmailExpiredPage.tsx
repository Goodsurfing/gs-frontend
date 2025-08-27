import { FC } from "react";
import { useTranslation } from "react-i18next";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";

import { getSignInPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./EmailExpiredPage.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

const EmailExpiredPage: FC = () => {
    const { locale } = useLocale();
    const { t } = useTranslation();

    return (
        <SignLayout cancelText={t("login.Отменить")} cancelPath={getSignInPageUrl(locale)}>
            <div className={styles.wrapper}>
                <SignTitle>{t("login.Истёк срок подтверждения почты")}</SignTitle>
                <div className={styles.content}>
                    <div className={styles.notification}>
                        {t("login.Ссылка для подтверждения больше недействительна — её срок истёк.")}
                        {t("login.Вы можете")}
                        {" "}
                        <a href={getSignInPageUrl(locale)}>{t("login.войти снова")}</a>
                        ,
                        {" "}
                        {t("login.чтобы получить новую.")}
                    </div>
                </div>
            </div>
        </SignLayout>
    );
};

export default EmailExpiredPage;
