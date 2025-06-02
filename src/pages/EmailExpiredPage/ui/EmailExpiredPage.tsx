import { FC } from "react";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";

import { getSignUpPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./EmailExpiredPage.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

const EmailExpiredPage: FC = () => {
    const { locale } = useLocale();

    return (
        <SignLayout cancelText="Отменить" cancelPath={getSignUpPageUrl(locale)}>
            <div className={styles.wrapper}>
                <SignTitle>Истёк срок подтверждения почты</SignTitle>
                <div className={styles.content}>
                    <div className={styles.notification}>
                        Ссылка для подтверждения больше недействительна — её срок истёк.
                        Вы можете
                        {" "}
                        <a href={getSignUpPageUrl(locale)}>зарегистрироваться снова</a>
                        , чтобы получить новую.
                    </div>
                </div>
            </div>
        </SignLayout>
    );
};

export default EmailExpiredPage;
