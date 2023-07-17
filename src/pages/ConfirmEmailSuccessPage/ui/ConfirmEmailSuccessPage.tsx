import { FC } from "react";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";

import { getSignUpPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./ConfirmEmailSuccessPage.module.scss";
import { useAppSelector } from "@/shared/hooks/redux";
import { useLocale } from "@/app/providers/LocaleProvider";

const ConfirmEmailSuccessPage: FC = () => {
    const { locale } = useLocale();
    const { email } = useAppSelector((state) => state.register);
    return (
        <SignLayout cancelText="Отменить" cancelPath={getSignUpPageUrl(locale)}>
            <div className={styles.wrapper}>
                <SignTitle>Регистрация пользователя</SignTitle>
                <div className={styles.content}>
                    <div className={styles.notification}>
                        Спасибо! Ваш адрес электронной почты
                        <span>{email}</span>
                        {" "}
                        был подтверждён.
                    </div>
                    <ButtonLink
                        className={styles.btn}
                        path={RoutePath.sign_in}
                        type="outlined"
                    >
                        Войти в свой аккаунт
                    </ButtonLink>
                </div>
            </div>
        </SignLayout>
    );
};

export default ConfirmEmailSuccessPage;
