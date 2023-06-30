import React, { FC } from "react";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";

import ResetPasswordContainer from "@/containers/ResetPasswordContainer/ResetPasswordContainer";

import { RoutePath } from "@/routes/config/RouterConfig";

import styles from "./ResetPasswordPage.module.scss";

const ResetPasswordPage: FC = () => (
    <SignLayout cancelText="Отменить" cancelPath={RoutePath.sign_in}>
        <div className={styles.wrapper}>
            <ResetPasswordContainer />
        </div>
    </SignLayout>
);

export default ResetPasswordPage;
