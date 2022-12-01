import React, { FC } from "react";
import { Link } from "react-router-dom";

import Checkbox from "@/components/Checkbox/Checkbox";
import InputField from "@/components/InputField/InputField";
import Button from "@/components/ui/Button/Button";

import { AppRoutesEnum } from "@/routes/types";

import styles from "./SignInForm.module.scss";

const SignInForm: FC = () => {
    return (
        <form className={styles.form}>
            <InputField type={"email"} placeholder={"E-mail"} />

            <InputField type={"password"} placeholder={"Пароль"} />

            <Button type={"primary"}>Войти</Button>

            <div className={styles.help}>
                <Checkbox text={"Запомнить меня"} />
                <Link to={AppRoutesEnum.RESET} className={styles.forget}>
                    Забыли пароль?
                </Link>
            </div>
        </form>
    );
};

export default SignInForm;
