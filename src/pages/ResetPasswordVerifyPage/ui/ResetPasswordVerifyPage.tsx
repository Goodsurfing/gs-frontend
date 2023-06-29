import React, { FC } from "react";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";

import ResetPasswordThirdStep from "@/containers/ResetPasswordContainer/ResetPasswordThirdStep/ResetPasswordThirdStep";

import styles from "./ResetPasswordVerifyPage.module.scss";
import { RoutePath } from "@/routes/config/RouterConfig";

const ResetPasswordVerifyPage: FC = () => (
    <SignLayout cancelText="Отменить" cancelPath={RoutePath.sign_in}>
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <SignTitle>Восстановление пароля</SignTitle>
                <ResetPasswordThirdStep />
            </div>
        </div>
    </SignLayout>
);

export default ResetPasswordVerifyPage;
