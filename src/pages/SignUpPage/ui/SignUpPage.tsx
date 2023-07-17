import React, { FC } from "react";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";

import SignUpContainer from "@/containers/SignUpContainer/SignUpContainer";

import styles from "./SignUpPage.module.scss";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

const SignUpPage: FC = () => {
    const { locale } = useLocale();
    return (
        <SignLayout cancelPath={getMainPageUrl(locale)} cancelText="Отменить">
            <div className={styles.wrapper}>
                <SignUpContainer />
            </div>
        </SignLayout>
    );
};

export default SignUpPage;
