import React, { FC } from "react";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";

import { RoutePath } from "@/routes/model/config/RouterConfig";

import styles from "./ConfirmEmailSuccessPage.module.scss";

const ConfirmEmailSuccessPage: FC = () => (
    <SignLayout cancelText="Отменить" cancelPath={RoutePath.sign_up}>
        <div className={styles.wrapper}>
            <SignTitle>Регистрация пользователя</SignTitle>
            <div className={styles.content}>
                <div className={styles.notification}>
                    Спасибо! Ваш адрес электронной почты
                    <span>space-cowboy1982@bk.ru</span>
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

export default ConfirmEmailSuccessPage;
