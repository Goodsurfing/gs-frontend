import React, { FC } from "react";

import SignTitle from "@/components/ui/SignTitle/SignTitle";

import SignUpForm from "@/containers/SignUpContainer/SignUpForm/SignUpForm";

import styles from "./SignUpContainer.module.scss";

interface SignUpContainerProps {}

const SignUpContainer: FC<SignUpContainerProps> = (props) => {
    return (
        <div className={styles.wrapper}>
            <SignTitle>Регистрация пользователя</SignTitle>
            <SignUpForm />
        </div>
    );
};

export default SignUpContainer;
