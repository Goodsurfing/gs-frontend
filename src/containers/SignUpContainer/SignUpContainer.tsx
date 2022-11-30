import React, { FC } from "react";

import SignTitle from "@/components/ui/SignTitle/SignTitle";

import styles from "./SignUpContainer.module.scss";

interface SignUpContainerProps {}

const SignUpContainer: FC<SignUpContainerProps> = (props) => {
    return (
        <div className={styles.wrapper}>
            <SignTitle>Регистрация пользователя</SignTitle>
        </div>
    );
};

export default SignUpContainer;
