import React, { FC, useState } from "react";

import SignTitle from "@/components/ui/SignTitle/SignTitle";

import ResetPasswordFirstStep from "@/containers/ResetPasswordContainer/ResetPasswordFirstStep/ResetPasswordFirstStep";
import ResetPasswordSecondStep from "@/containers/ResetPasswordContainer/ResetPasswordSecondStep/ResetPasswordSecondStep";
import ResetPasswordThirdStep from "@/containers/ResetPasswordContainer/ResetPasswordThirdStep/ResetPasswordThirdStep";

import styles from "./ResetPasswordContainer.module.scss";

const ResetPasswordContainer: FC = () => {
    const [currentStep, setCurrentStep] = useState<number>(1);

    return (
        <div className={styles.wrapper}>
            <SignTitle>Восстановление пароля</SignTitle>
            {currentStep === 1 ? (
                <ResetPasswordFirstStep />
            ) : currentStep === 2 ? (
                <ResetPasswordSecondStep />
            ) : currentStep === 3 ? (
                <ResetPasswordThirdStep />
            ) : (
                ""
            )}
        </div>
    );
};

export default ResetPasswordContainer;
