import React, { FC } from "react";

import SignTitle from "@/components/ui/SignTitle/SignTitle";

import SignInForm from "@/containers/SignInContainer/SignInForm/SignInForm";

import styles from "./SignInContainer.module.scss";

const SignInContainer: FC = () => {
    return (
        <div className={styles.wrapper}>
            <SignTitle>Вход</SignTitle>
            <SignInForm />
        </div>
    );
};

export default SignInContainer;
