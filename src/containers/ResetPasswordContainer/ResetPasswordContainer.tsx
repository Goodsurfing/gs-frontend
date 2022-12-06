import React, { FC, useState } from "react";

import SignTitle from "@/components/ui/SignTitle/SignTitle";

import ResetPasswordFirstStep from "@/containers/ResetPasswordContainer/ResetPasswordFirstStep/ResetPasswordFirstStep";
import ResetPasswordSecondStep from "@/containers/ResetPasswordContainer/ResetPasswordSecondStep/ResetPasswordSecondStep";

import styles from "./ResetPasswordContainer.module.scss";

const ResetPasswordContainer: FC = () => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [email, setEmail] = useState<string>("");

    const onChangeStep = (email: string) => {
        setCurrentStep((prev) => prev + 1);
        setEmail(email);
    };

    return (
        <div className={styles.wrapper}>
            <SignTitle>Восстановление пароля</SignTitle>
            {currentStep === 1 ? (
                <ResetPasswordFirstStep changeStep={onChangeStep} />
            ) : currentStep === 2 ? (
                <ResetPasswordSecondStep email={email} />
            ) : (
                ""
            )}
        </div>
    );
};

export default ResetPasswordContainer;
