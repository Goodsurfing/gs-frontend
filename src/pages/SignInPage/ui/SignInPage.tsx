import React, { FC } from "react";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";

import SignInContainer from "@/containers/SignInContainer/SignInContainer";

import { RoutePath } from "@/routes/config/RouterConfig";

import styles from "./SignInPage.module.scss";

const SignInPage: FC = () => (
    <SignLayout cancelPath={RoutePath.main} cancelText="Отменить">
        <div className={styles.wrapper}>
            <SignInContainer />
        </div>
    </SignLayout>
);

export default SignInPage;
