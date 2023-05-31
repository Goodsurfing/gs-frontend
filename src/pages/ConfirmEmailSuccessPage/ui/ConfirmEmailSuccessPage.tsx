import React, { FC } from "react";

import { AppRoutes } from "app/router";

import { SignLayout } from "widgets/SignLayout";

import { ButtonLink } from "shared/ui/ButtonLink";
import { SignTitle } from "shared/ui/SignTitle";

import styles from "./ConfirmEmailSuccessPage.module.scss";

const ConfirmEmailSuccessPage: FC = () => (
    <SignLayout cancelText="Отменить" cancelPath={AppRoutes.SIGN_UP}>
        <div className={styles.wrapper}>
            <SignTitle>Регистрация пользователя</SignTitle>
            <div className={styles.content}>
                <div className={styles.notification}>
                    Спасибо! Ваш адрес электронной почты
                    <span>space-cowboy1982@bk.ru</span>
                    был подтверждён.
                </div>
                <ButtonLink
                    className={styles.btn}
                    path={AppRoutes.SIGN_IN}
                    type="outlined"
                >
                    Войти в свой аккаунт
                </ButtonLink>
            </div>
        </div>
    </SignLayout>
);

export default ConfirmEmailSuccessPage;
