import React, { FC } from "react";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";

import SignInContainer from "@/containers/SignInContainer/SignInContainer";

import { AppRoutesEnum } from "@/routes/types";

import styles from "./SignInPage.module.scss";

const SignInPage: FC = () => {
    return (
        <SignLayout cancelPath={AppRoutesEnum.HOME} cancelText="Отменить">
            <div className={styles.wrapper}>
                <SignInContainer />
            </div>
        </SignLayout>
    );
};

export default SignInPage;
