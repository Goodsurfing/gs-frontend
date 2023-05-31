import React, { FC } from "react";

import { AppRoutes } from "app/router";

import ResetPasswordContainer from "widgets/ResetPasswordContainer/ResetPasswordContainer";
import SignLayout from "widgets/SignLayout/SignLayout";

import styles from "./ResetPasswordPage.module.scss";

const ResetPasswordPage: FC = () => (
    <SignLayout cancelText="Отменить" cancelPath={AppRoutes.SIGN_IN}>
        <div className={styles.wrapper}>
            <ResetPasswordContainer />
        </div>
    </SignLayout>
);

export default ResetPasswordPage;
