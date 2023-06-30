import React, { FC } from "react";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";

import { useAppSelector } from "@/shared/hooks/redux";

import { RoutePath } from "@/routes/config/RouterConfig";

import styles from "./ConfirmEmailPage.module.scss";

const ConfirmEmailPage: FC = () => {
    const { email } = useAppSelector((state) => state.register);

    return (
        <SignLayout cancelText="Отменить" cancelPath={RoutePath.sign_up}>
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
