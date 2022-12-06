import React, { FC } from "react";

import SignLayout from "@/components/ui/SignLayout/SignLayout";
import SignTitle from "@/components/ui/SignTitle/SignTitle";

import ResetPasswordThirdStep from "@/containers/ResetPasswordContainer/ResetPasswordThirdStep/ResetPasswordThirdStep";

import { AppRoutesEnum } from "@/routes/types";

import styles from "./ResetPasswordVerifyPage.module.scss";

const ResetPasswordVerifyPage: FC = () => {
    return (
        <SignLayout cancelText={"Отменить"} cancelPath={AppRoutesEnum.SIGNIN}>
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
