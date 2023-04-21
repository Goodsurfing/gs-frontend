import SignTitle from "@/UI/SignTitle/SignTitle";
import React, { FC } from "react";

import LocaleLink from "@/components/LocaleLink/LocaleLink";

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
                <LocaleLink to={AppRoutesEnum.SIGNUP}>
                    Зарегистрироваться
                </LocaleLink>
                .
            </div>
        </div>
    );
};

export default SignInContainer;
