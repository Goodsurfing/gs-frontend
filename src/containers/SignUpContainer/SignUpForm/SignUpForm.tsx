import React, { FC } from "react";

import InputField from "@/components/InputField/InputField";
import Button from "@/components/ui/Button/Button";

import styles from "./SignUpForm.module.scss";

const SignUpForm: FC = () => {
    return (
        <form className={styles.form}>
            <InputField type={"email"} placeholder={"E-mail"} />
            <InputField type={"password"} placeholder={"Пароль"} />
            <Button type={"primary"} className={styles.btn}>
                Зарегистрироваться
            </Button>
        </form>
    );
};

export default SignUpForm;
