import React, { FC } from "react";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";

// import SignInContainer from "@/containers/SignInContainer/SignInContainer";

import { getMainPageUrl, useLocale } from "@/routes";

import { AuthByEmail } from "@/features/AuthByEmail";

import styles from "./SignInPage.module.scss";

const SignInPage: FC = () => {
    const { locale } = useLocale();
    return (
        <SignLayout cancelPath={getMainPageUrl(locale)} cancelText="Отменить">
            <div className={styles.wrapper}>
                {/* <SignInContainer /> */}
                <AuthByEmail />
            </div>
        </SignLayout>
    );
};

export default SignInPage;
