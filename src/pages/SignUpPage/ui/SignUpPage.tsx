import React, { FC } from "react";

import { AppRoutes } from "app/router";

import SignUpContainer from "widgets/SignUpContainer/SignUpContainer";

import SignLayout from "shared/ui/SignLayout/SignLayout";

import styles from "./SignUpPage.module.scss";

const SignUpPage: FC = () => (
    <SignLayout cancelPath={AppRoutesEnum.HOME} cancelText="Отменить">
        <div className={styles.wrapper}>
            <SignUpContainer />
        </div>
    </SignLayout>
);

export default SignUpPage;
