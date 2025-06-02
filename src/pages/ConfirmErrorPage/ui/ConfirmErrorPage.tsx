import { FC } from "react";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";

import { getSignInPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./ConfirmErrorPage.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

const ConfirmErrorPage: FC = () => {
    const { locale } = useLocale();

    return (
        <SignLayout cancelText="Отменить" cancelPath={getSignInPageUrl(locale)}>
            <div className={styles.wrapper}>
                <SignTitle>Произошла неизвестная ошибка!</SignTitle>
                <div className={styles.content}>
                    <div className={styles.notification}>
                        <a href={getSignInPageUrl(locale)}>Попробуйте ещё раз.</a>
                    </div>
                </div>
            </div>
        </SignLayout>
    );
};

export default ConfirmErrorPage;
