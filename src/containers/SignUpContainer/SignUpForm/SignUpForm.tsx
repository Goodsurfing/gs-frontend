import React, { FC } from "react";

import InputField from "@/components/InputField/InputField";

import styles from "./SignUpForm.module.scss";
import ButtonLink from "@/components/ui/ButtonLink/ButtonLink";

const SignUpForm: FC = () => {
    return (
        <form>
            <InputField type={"email"} placeholder={"E-mail"} />
            <InputField type={"password"} placeholder={"Пароль"} />
        </form>
    );
};

export default SignUpForm;
