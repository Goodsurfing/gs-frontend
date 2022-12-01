import React, { FC } from "react";
import { Link } from "react-router-dom";

import SignTitle from "@/components/ui/SignTitle/SignTitle";

import SignUpForm from "@/containers/SignUpContainer/SignUpForm/SignUpForm";
import SocialAuthContainer from "@/containers/SocialAuthContainer/SocialAuthContainer";

import styles from "./SignUpContainer.module.scss";

const SignUpContainer: FC = () => {
    return (
        <div className={styles.wrapper}>
            <SignTitle>Регистрация пользователя</SignTitle>
            <SignUpForm />
            <div className={styles.confirm}>
                Нажимая кнопку «Зарегистрироваться», я принимаю{" "}
                <Link to={"/"}>Политику конфеденциальности ГудСёрфинга</Link>.
            </div>
            <SocialAuthContainer />
        </div>
    );
};

export default SignUpContainer;
