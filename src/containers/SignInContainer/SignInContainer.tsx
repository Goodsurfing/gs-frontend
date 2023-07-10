import React, { FC } from "react";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";

import LocaleLink from "@/components/LocaleLink/LocaleLink";

import SignInForm from "@/containers/SignInContainer/SignInForm/SignInForm";
import SocialAuthContainer from "@/containers/SocialAuthContainer/SocialAuthContainer";

import styles from "./SignInContainer.module.scss";
import { getSignUpPageUrl, useLocale } from "@/routes";

const SignInContainer: FC = () => {
    const { locale } = useLocale();
    return (
        <div className={styles.wrapper}>
            <SignTitle>Вход</SignTitle>
            <SignInForm />
            <div className={styles.socials}>
                <SocialAuthContainer />
            </div>
            <div className={styles.redirect}>
                Не зарегистрированы на Гудсерфинге?
                <LocaleLink to={getSignUpPageUrl(locale)}>
                    Зарегистрироваться
                </LocaleLink>
                .
            </div>
        </div>
    );
};

export default SignInContainer;
