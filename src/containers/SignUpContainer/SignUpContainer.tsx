import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
// import SocialAuthContainer from "@/containers/SocialAuthContainer/SocialAuthContainer";
import SignUpForm from "@/containers/SignUpContainer/SignUpForm/SignUpForm";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getPrivacyPolicyPageUrl } from "@/shared/config/routes/AppUrls";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";

import styles from "./SignUpContainer.module.scss";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { AuthByVk } from "@/features/AuthByVk";

const SignUpContainer: FC = () => {
    const { locale } = useLocale();
    const { t, ready } = useTranslation();

    if (!ready) {
        return (<Preloader />);
    }

    return (
        <div className={styles.wrapper}>
            <SignTitle>{t("login.Регистрация пользователя")}</SignTitle>
            <SignUpForm />
            <div className={styles.confirm}>
                {t("login.Нажимая кнопку «Зарегистрироваться», я принимаю")}
                {" "}
                <Link to={getPrivacyPolicyPageUrl(locale)}>
                    {t("login.Политику конфеденциальности ГудСёрфинга")}
                </Link>
                .
            </div>
            <AuthByVk redirect="signup"/>
            {/* <div className={styles.socials}>
                <SocialAuthContainer />
            </div> */}
            <p className={styles.attention}>
                {t("login.Мы не постим ничего без вашего ведома")}
            </p>
        </div>
    );
};

export default SignUpContainer;
