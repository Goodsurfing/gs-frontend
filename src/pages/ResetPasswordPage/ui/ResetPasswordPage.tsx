import SignLayout from "shared/ui/SignLayout/SignLayout";
import React, { FC } from "react";

import ResetPasswordContainer from "widgets/ResetPasswordContainer/ResetPasswordContainer";

import { AppRoutesEnum } from "routes/types";

import styles from "./ResetPasswordPage.module.scss";

const ResetPasswordPage: FC = () => (
    <SignLayout cancelText="Отменить" cancelPath={AppRoutesEnum.SIGNIN}>
        <div className={styles.wrapper}>
            <ResetPasswordContainer />
        </div>
    </SignLayout>
);

export default ResetPasswordPage;
