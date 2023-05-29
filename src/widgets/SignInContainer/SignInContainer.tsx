import SignTitle from "shared/ui/SignTitle/SignTitle";
import React, { FC } from "react";

import LocaleLink from "shared/ui/LocaleLink/ui/LocaleLink";

import SignInForm from "widgets/SignInContainer/SignInForm/SignInForm";
import SocialAuthContainer from "widgets/SocialAuthContainer/SocialAuthContainer";

import { AppRoutesEnum } from "routes/types";

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
            {" "}
            <LocaleLink to={AppRoutesEnum.SIGNUP}>
                Зарегистрироваться
            </LocaleLink>
            .
        </div>
    </div>
);

export default SignInContainer;
