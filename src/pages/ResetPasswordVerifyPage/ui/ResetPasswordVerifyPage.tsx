import React, { FC } from "react";

import { AppRoutes } from "app/router";

// eslint-disable-next-line max-len
import ResetPasswordThirdStep from "widgets/ResetPasswordContainer/ResetPasswordThirdStep/ResetPasswordThirdStep";

import SignLayout from "shared/ui/SignLayout/SignLayout";
import SignTitle from "shared/ui/SignTitle/SignTitle";

import styles from "./ResetPasswordVerifyPage.module.scss";

const ResetPasswordVerifyPage: FC = () => (
    <SignLayout cancelText="Отменить" cancelPath={AppRoutes.SIGN_IN}>
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <SignTitle>Восстановление пароля</SignTitle>
                <ResetPasswordThirdStep />
            </div>
        </div>
    </SignLayout>
);

export default ResetPasswordVerifyPage;
