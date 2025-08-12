import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import styles from "./ResetPasswordSecondStep.module.scss";

interface ResetPasswordSecondStepProps {
    email: string;
}

const ResetPasswordSecondStep: FC<ResetPasswordSecondStepProps> = ({
    email,
}) => {
    const { t } = useTranslation();
    return (
        <div className={styles.wrapper}>
            <div className={styles.notification}>
                {t("login.На")} <span>{email}</span>{" "}
                {t(
                    "login.было отправлено письмо со ссылкой для восстановления пароля."
                )}
            </div>
            <p>
                {t(
                    "login.Если вы не видите письмо, проверьте, не попало ли оно в папку «Спам»."
                )}
            </p>
        </div>
    );
};

export default ResetPasswordSecondStep;
