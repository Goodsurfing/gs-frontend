import React, { FC } from "react";

import { AppRoutes } from "app/router";

import { SignLayout } from "widgets/SignLayout";
import SignUpContainer from "widgets/SignUpContainer/SignUpContainer";

import styles from "./SignUpPage.module.scss";

const SignUpPage: FC = () => (
    <SignLayout cancelPath={AppRoutes.MAIN} cancelText="Отменить">
        <div className={styles.wrapper}>
            <SignUpContainer />
        </div>
    </SignLayout>
);

export default SignUpPage;
