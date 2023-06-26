import React, { FC, useState } from "react";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";

import ResetPasswordFirstStep from "@/containers/ResetPasswordContainer/ResetPasswordFirstStep/ResetPasswordFirstStep";
import ResetPasswordSecondStep from "@/containers/ResetPasswordContainer/ResetPasswordSecondStep/ResetPasswordSecondStep";

import styles from "./ResetPasswordContainer.module.scss";

const ResetPasswordContainer: FC = () => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [userEmail, setUserEmail] = useState<string>("");

    const onChangeStep = (email: string) => {
        setCurrentStep((prev) => {
            return prev + 1;
        });
        setUserEmail(email);
    };

    return (
        <div className={styles.wrapper}>
            <SignTitle>Восстановление пароля</SignTitle>
            {currentStep === 1 ? (
                <ResetPasswordFirstStep changeStep={onChangeStep} />
            ) : null}
            {currentStep === 2 ? (
                <ResetPasswordSecondStep email={userEmail} />
            ) : null}
        </div>
    );
};

export default ResetPasswordContainer;
