import React, { FC } from "react";
import { Link } from "react-router-dom";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";

import SignUpForm from "@/containers/SignUpContainer/SignUpForm/SignUpForm";
import SocialAuthContainer from "@/containers/SocialAuthContainer/SocialAuthContainer";

import styles from "./SignUpContainer.module.scss";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

const SignUpContainer: FC = () => {
    const { locale } = useLocale();
    return (
        <div className={styles.wrapper}>
            <SignTitle>Регистрация пользователя</SignTitle>
            <SignUpForm />
            <div className={styles.confirm}>
                Нажимая кнопку «Зарегистрироваться», я принимаю
                <Link to={getMainPageUrl(locale)}>Политику конфеденциальности ГудСёрфинга</Link>
                .
            </div>
            <div className={styles.socials}>
                <SocialAuthContainer />
            </div>
            <p className={styles.attention}>
                Мы не постим ничего без вашего ведома
            </p>
        </div>
    );
};

export default SignUpContainer;
