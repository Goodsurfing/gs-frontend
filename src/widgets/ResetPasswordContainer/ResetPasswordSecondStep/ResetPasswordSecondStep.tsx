import React, { FC } from "react";

import styles from "./ResetPasswordSecondStep.module.scss";

interface ResetPasswordSecondStepProps {
    email: string;
}

const ResetPasswordSecondStep: FC<ResetPasswordSecondStepProps> = ({
  email,
}) => (
    <div className={styles.wrapper}>
        <div className={styles.notification}>
            На
            {" "}
            <span>{email}</span>
            {" "}
            было отправлено письмо со ссылкой для
            восстановления пароля.
        </div>
        <p>
            Если вы не видите письмо, проверьте, не попало ли оно в папку
            «Спам».
        </p>
    </div>
);

export default ResetPasswordSecondStep;
