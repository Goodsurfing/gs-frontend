import { FC } from "react";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";

import { getSignInPageUrl, getSignUpPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./EmailAlreadyConfirmedPage.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

const EmailAlreadyConfirmedPage: FC = () => {
    const { locale } = useLocale();

    return (
        <SignLayout cancelText="Отменить" cancelPath={getSignUpPageUrl(locale)}>
            <div className={styles.wrapper}>
                <SignTitle>Почта уже была подтверждена</SignTitle>
                <div className={styles.content}>
                    <div className={styles.notification}>
                        Похоже, эта почта уже подтверждена.
                        {" "}
                        <a href={getSignInPageUrl(locale)}>Перейти ко входу</a>
                    </div>
                </div>
            </div>
        </SignLayout>
    );
};

export default EmailAlreadyConfirmedPage;
