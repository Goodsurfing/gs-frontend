import React, { FC } from "react";
import SignLayout from "@/UI/SignLayout/SignLayout";
import SignTitle from "@/UI/SignTitle/SignTitle";

import ResetPasswordThirdStep from "@/containers/ResetPasswordContainer/ResetPasswordThirdStep/ResetPasswordThirdStep";

import styles from "./ResetPasswordVerifyPage.module.scss";
import { AppRoutes } from "@/routes/config/RouterConfig";

const ResetPasswordVerifyPage: FC = () => {
    return (
        <SignLayout cancelText="Отменить" cancelPath={AppRoutes.SIGN_IN}>
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <SignTitle>Восстановление пароля</SignTitle>
                    <ResetPasswordThirdStep />
                </div>
            </div>
        </SignLayout>
    );
};

export default ResetPasswordVerifyPage;
