import React, { FC } from "react";

import SignLayout from "@/components/ui/SignLayout/SignLayout";

import { AppRoutesEnum } from "@/routes/types";

import styles from "./SignUpPage.module.scss";

const SignUpPage: FC = () => {
    return (
        <SignLayout cancelPath={AppRoutesEnum.HOME} cancelText={"Отменить"}>
            <div className={styles.wrapper}>
                <h1>Hi</h1>
            </div>
        </SignLayout>
    );
};

export default SignUpPage;
