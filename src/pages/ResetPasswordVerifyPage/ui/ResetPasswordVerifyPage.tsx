import SignLayout from "shared/ui/SignLayout/SignLayout";
import SignTitle from "shared/ui/SignTitle/SignTitle";
import React, { FC } from "react";

import ResetPasswordThirdStep from "widgets/ResetPasswordContainer/ResetPasswordThirdStep/ResetPasswordThirdStep";

import { AppRoutesEnum } from "routes/types";

import styles from "./ResetPasswordVerifyPage.module.scss";

const ResetPasswordVerifyPage: FC = () => (
    <SignLayout cancelText="Отменить" cancelPath={AppRoutesEnum.SIGNIN}>
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <SignTitle>Восстановление пароля</SignTitle>
                <ResetPasswordThirdStep />
            </div>
        </div>
    </SignLayout>
);

export default ResetPasswordVerifyPage;
