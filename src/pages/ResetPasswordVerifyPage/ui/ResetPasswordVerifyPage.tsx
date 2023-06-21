import SignLayout from "@/UI/SignLayout/SignLayout";
import SignTitle from "@/UI/SignTitle/SignTitle";
import React, { FC } from "react";

import ResetPasswordThirdStep from "@/containers/ResetPasswordContainer/ResetPasswordThirdStep/ResetPasswordThirdStep";

import { AppRoutesEnum } from "@/routes/types";

import styles from "./ResetPasswordVerifyPage.module.scss";

const ResetPasswordVerifyPage: FC = () => {
    return (
        <SignLayout cancelText="Отменить" cancelPath={AppRoutesEnum.SIGNIN}>
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
