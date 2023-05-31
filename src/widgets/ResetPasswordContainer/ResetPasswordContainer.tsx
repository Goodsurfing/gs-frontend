import React, { FC, useState } from "react";

// eslint-disable-next-line max-len
import ResetPasswordFirstStep from "widgets/ResetPasswordContainer/ResetPasswordFirstStep/ResetPasswordFirstStep";
// eslint-disable-next-line max-len
import ResetPasswordSecondStep from "widgets/ResetPasswordContainer/ResetPasswordSecondStep/ResetPasswordSecondStep";
import SignTitle from "widgets/SignTitle/SignTitle";

import styles from "./ResetPasswordContainer.module.scss";

const ResetPasswordContainer: FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [userEmail, setUserEmail] = useState<string>("");

  const onChangeStep = (email: string) => {
    setCurrentStep((prev) => prev + 1);
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
