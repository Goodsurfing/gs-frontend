import { FC } from "react";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";

import { useAppSelector } from "@/shared/hooks/redux";

import { getSignUpPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./ConfirmEmailPage.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

const ConfirmEmailPage: FC = () => {
    const { email } = useAppSelector((state) => state.register);
    const { locale } = useLocale();

    return (
        <SignLayout cancelText="Отменить" cancelPath={getSignUpPageUrl(locale)}>
            <div className={styles.wrapper}>
                <SignTitle>Регистрация пользователя</SignTitle>
                <div className={styles.content}>
                    <div className={styles.notification}>
                        На
                        {" "}
                        <span>{email}</span>
                        {" "}
                        было отправлено письмо со
                        ссылкой для подтверждения почты.
                    </div>
                    <p>
                        Если вы не видите письмо, проверьте, не попало ли оно в
                        папку «Спам».
                    </p>
                </div>
            </div>
        </SignLayout>
    );
};

export default ConfirmEmailPage;
