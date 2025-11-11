import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./VerifyEmailHashPage.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { getProfileInfoPageUrl, getSignUpPageUrl } from "@/shared/config/routes/AppUrls";

const VerifyEmailHashPage = () => {
    const { locale } = useLocale();
    const { t } = useTranslation();

    return (
        <SignLayout cancelText={t("login.Отменить")} cancelPath={getSignUpPageUrl(locale)}>
            <div className={styles.wrapper}>
                <SignTitle>{t("login.Подтверждение почты")}</SignTitle>
                <div className={styles.content}>
                    <div className={styles.notification}>
                        {t("login.Спасибо! Ваш адрес электронной почты")}
                        {" "}
                        <span>email</span>
                        {" "}
                        {t("login.был подтверждён.")}
                    </div>
                    <ButtonLink
                        className={styles.btn}
                        path={getProfileInfoPageUrl(locale)}
                        type="outlined"
                    >
                        {t("login.Перейти в профиль")}
                    </ButtonLink>
                </div>
            </div>
        </SignLayout>
    );
};

export default VerifyEmailHashPage;
