import React, { FC } from "react";

import InputField from "@/components/InputField/InputField";
import Button from "@/components/ui/Button/Button";

import styles from "./ResetPasswordThirdStep.module.scss";

const ResetPasswordThirdStep: FC = () => {
    return (
        <form className={styles.form}>
            <InputField type={"password"} text={"Новый пароль"} />
            <InputField type={"password"} text={"Повторите новый пароль"} />

            <Button variant={"primary"}>Отправить</Button>
        </form>
    );
};

export default ResetPasswordThirdStep;
