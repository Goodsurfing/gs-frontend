import React, { FC } from "react";

import InputField from "@/components/InputField/InputField";
import Button from "@/components/ui/Button/Button";

import styles from "./ResetPasswordFirstStep.module.scss";

const ResetPasswordFirstStep: FC = () => {
    return (
        <form className={styles.form}>
            <InputField type={"email"} placeholder={"E-mail"} />

            <Button type={"primary"}>Отправить</Button>
        </form>
    );
};

export default ResetPasswordFirstStep;
