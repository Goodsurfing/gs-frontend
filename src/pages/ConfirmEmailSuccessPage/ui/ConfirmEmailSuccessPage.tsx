import React, { FC } from "react";
import SignLayout from "sharead/ui/SignLayout/SignLayout";
import SignTitle from "sharted/ui/SignTitle/SignTitle";

import { AppRoutes } from "app/router";

import ButtonLink from "shared/ui/ButtonLink/ButtonLink";

import styles from "./ConfirmEmailSuccessPage.module.scss";

const ConfirmEmailSuccessPage: FC = () => (
    <SignLayout cancelText="Отменить" cancelPath={AppRoutesEnum.SIGNUP}>
        <div className={styles.wrapper}>
            <SignTitle>Регистрация пользователя</SignTitle>
            <div className={styles.content}>
                <div className={styles.notification}>
                    Спасибо! Ваш адрес электронной почты
                    {" "}
                    <span>space-cowboy1982@bk.ru</span>
                    {" "}
                    был подтверждён.
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

export default ConfirmEmailSuccessPage;
