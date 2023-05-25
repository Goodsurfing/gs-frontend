import SignLayout from "shared/ui/SignLayout/SignLayout";
import React, { FC } from "react";

import SignInContainer from "widgets/SignInContainer/SignInContainer";

import { AppRoutesEnum } from "routes/types";

import styles from "./SignInPage.module.scss";

const SignInPage: FC = () => (
    <SignLayout cancelPath={AppRoutesEnum.HOME} cancelText="Отменить">
        <div className={styles.wrapper}>
            <SignInContainer />
        </div>
    </SignLayout>
);

export default SignInPage;
