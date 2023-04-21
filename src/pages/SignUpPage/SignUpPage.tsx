import SignLayout from "@/UI/SignLayout/SignLayout";
import React, { FC } from "react";

import SignUpContainer from "@/containers/SignUpContainer/SignUpContainer";

import { AppRoutesEnum } from "@/routes/types";

import styles from "./SignUpPage.module.scss";

const SignUpPage: FC = () => {
    return (
        <SignLayout cancelPath={AppRoutesEnum.HOME} cancelText="Отменить">
            <div className={styles.wrapper}>
                <SignUpContainer />
            </div>
        </SignLayout>
    );
};

export default SignUpPage;
