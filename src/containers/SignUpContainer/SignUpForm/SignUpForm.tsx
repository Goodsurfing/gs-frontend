import React, { FC } from "react";

import InputField from "@/components/InputField/InputField";

import styles from "./SignUpForm.module.scss";

const SignUpForm: FC = () => {
    return (
        <form>
            <InputField />
        </form>
    );
};

export default SignUpForm;
