import React, { FC } from "react";
import { Link } from "react-router-dom";

import SignTitle from "@/components/ui/SignTitle/SignTitle";

import SignInForm from "@/containers/SignInContainer/SignInForm/SignInForm";
import SocialAuthContainer from "@/containers/SocialAuthContainer/SocialAuthContainer";

import { AppRoutesEnum } from "@/routes/types";

import styles from "./SignInContainer.module.scss";

const SignInContainer: FC = () => {
    return (
        <div className={styles.wrapper}>
            <SignTitle>Вход</SignTitle>
            <SignInForm />
            <div className={styles.socials}>
                <SocialAuthContainer />
            </div>

            <div className={styles.redirect}>
                Не зарегистрированы на Гудсерфинге?{" "}
                <Link to={AppRoutesEnum.SIGNUP}>Зарегистрироваться</Link>.
            </div>
        </div>
    );
};

export default SignInContainer;
