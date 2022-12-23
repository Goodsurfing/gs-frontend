import React, { FC } from "react";

import SignLayout from "@/components/ui/SignLayout/SignLayout";

import ResetPasswordContainer from "@/containers/ResetPasswordContainer/ResetPasswordContainer";

import { AppRoutesEnum } from "@/routes/types";

import styles from "./ResetPasswordPage.module.scss";

const ResetPasswordPage: FC = () => {
    return (
        <SignLayout cancelText="Отменить" cancelPath={AppRoutesEnum.SIGNIN}>
            <div className={styles.wrapper}>
                <ResetPasswordContainer />
            </div>
        </SignLayout>
    );
};

export default ResetPasswordPage;
