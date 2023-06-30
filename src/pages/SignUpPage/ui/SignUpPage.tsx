import React, { FC } from "react";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";

import SignUpContainer from "@/containers/SignUpContainer/SignUpContainer";

import { RoutePath } from "@/routes/config/RouterConfig";

import styles from "./SignUpPage.module.scss";

const SignUpPage: FC = () => (
    <SignLayout cancelPath={RoutePath.main} cancelText="Отменить">
        <div className={styles.wrapper}>
            <SignUpContainer />
        </div>
    </SignLayout>
);

export default SignUpPage;
