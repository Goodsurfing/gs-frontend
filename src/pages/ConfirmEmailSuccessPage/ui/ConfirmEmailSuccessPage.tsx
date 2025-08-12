import { FC } from "react";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";

import { getSignInPageUrl, getSignUpPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./ConfirmEmailSuccessPage.module.scss";
import { useAppSelector } from "@/shared/hooks/redux";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useTranslation } from "react-i18next";

const ConfirmEmailSuccessPage: FC = () => {
    const { locale } = useLocale();
    const { email } = useAppSelector((state) => state.register);
    const {t} = useTranslation();

    return (
        <SignLayout cancelText={t("login.Отменить")} cancelPath={getSignUpPageUrl(locale)}>
            <div className={styles.wrapper}>
                <SignTitle>{t("login.Регистрация пользователя")}</SignTitle>
                <div className={styles.content}>
                    <div className={styles.notification}>
                        {t("login.Спасибо! Ваш адрес электронной почты")}
                        <span>{email}</span>
                        {" "}
                        {t("login.был подтверждён.")}
                    </div>
                    <ButtonLink
                        className={styles.btn}
                        path={getSignInPageUrl(locale)}
                        type="outlined"
                    >
                        {t("login.Войти в свой аккаунт")}
                    </ButtonLink>
                </div>
            </div>
        </SignLayout>
    );
};

export default ConfirmEmailSuccessPage;
