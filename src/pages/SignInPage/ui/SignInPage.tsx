import React, { FC } from "react";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";

import SignInContainer from "@/containers/SignInContainer/SignInContainer";

import styles from "./SignInPage.module.scss";
import { getMainPageUrl, useLocale } from "@/routes";

const SignInPage: FC = () => {
    const { locale } = useLocale();
    return (
        <SignLayout cancelPath={getMainPageUrl(locale)} cancelText="Отменить">
            <div className={styles.wrapper}>
                <SignInContainer />
            </div>
        </SignLayout>
    );
};

export default SignInPage;
