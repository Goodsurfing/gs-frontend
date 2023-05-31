import React, { FC } from "react";

import { AppRoutes } from "app/router";

import SignInForm from "widgets/SignInContainer/SignInForm/SignInForm";
import SocialAuthContainer from "widgets/SocialAuthContainer/SocialAuthContainer";

import { LocaleLink } from "shared/ui/LocaleLink";
import { SignTitle } from "shared/ui/SignTitle";

import styles from "./SignInContainer.module.scss";

const SignInContainer: FC = () => (
    <div className={styles.wrapper}>
        <SignTitle>Вход</SignTitle>
        <SignInForm />
        <div className={styles.socials}>
            <SocialAuthContainer />
        </div>

        <div className={styles.redirect}>
            Не зарегистрированы на Гудсерфинге?
            <LocaleLink to={AppRoutes.SIGN_UP}>
                Зарегистрироваться
            </LocaleLink>
            .
        </div>
    </div>
);

export default SignInContainer;