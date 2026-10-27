import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";

import ResetPasswordFirstStep from "@/features/ResetPasswordContainer/ui/ResetPasswordFirstStep/ResetPasswordFirstStep";
import ResetPasswordSecondStep from "@/features/ResetPasswordContainer/ui/ResetPasswordSecondStep/ResetPasswordSecondStep";

import styles from "./ResetPasswordContainer.module.scss";

const ResetPasswordContainer: FC = () => {
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [userEmail, setUserEmail] = useState<string>("");

    const onChangeStep = (email: string) => {
        setCurrentStep((prev) => prev + 1);
        setUserEmail(email);
    };

    return (
        <div className={styles.wrapper}>
            <SignTitle>{t("Восстановление пароля")}</SignTitle>
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
