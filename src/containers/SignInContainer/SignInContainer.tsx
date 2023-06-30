import React, { FC } from "react";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";

import LocaleLink from "@/components/LocaleLink/LocaleLink";

import SignInForm from "@/containers/SignInContainer/SignInForm/SignInForm";
import SocialAuthContainer from "@/containers/SocialAuthContainer/SocialAuthContainer";

import { RoutePath } from "@/routes/config/RouterConfig";

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
            <LocaleLink to={RoutePath.sign_up}>
                Зарегистрироваться
            </LocaleLink>
            .
        </div>
    </div>
);

export default SignInContainer;
