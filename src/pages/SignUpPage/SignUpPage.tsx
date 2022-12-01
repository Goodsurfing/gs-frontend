import React, { FC } from "react";

import SignLayout from "@/components/ui/SignLayout/SignLayout";

import SignUpContainer from "@/containers/SignUpContainer/SignUpContainer";

import { AppRoutesEnum } from "@/routes/types";

import styles from "./SignUpPage.module.scss";

const SignUpPage: FC = () => {
    return (
        <SignLayout cancelPath={AppRoutesEnum.HOME} cancelText={"Отменить"}>
            <div className={styles.wrapper}>
                <SignUpContainer />
            </div>
        </SignLayout>
    );
};

export default SignUpPage;
