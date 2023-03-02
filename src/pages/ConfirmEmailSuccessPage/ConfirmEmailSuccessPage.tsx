import React, { FC } from "react";

import ButtonLink from "@/components/ui/ButtonLink/ButtonLink";
import SignLayout from "@/components/ui/SignLayout/SignLayout";
import SignTitle from "@/components/ui/SignTitle/SignTitle";

import { AppRoutesEnum } from "@/routes/types";

import styles from "./ConfirmEmailSuccessPage.module.scss";

const ConfirmEmailSuccessPage: FC = () => {
    return (
        <SignLayout cancelText="Отменить" cancelPath={AppRoutesEnum.SIGNUP}>
            <div className={styles.wrapper}>
                <SignTitle>Регистрация пользователя</SignTitle>
                <div className={styles.content}>
                    <div className={styles.notification}>
                        Спасибо! Ваш адрес электронной почты{" "}
                        <span>space-cowboy1982@bk.ru</span> был подтверждён.
                    </div>
                    <ButtonLink
                        className={styles.btn}
                        path={AppRoutesEnum.SIGNIN}
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
