import { FC } from "react";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";

import ResetPasswordContainer from "@/containers/ResetPasswordContainer/ResetPasswordContainer";

import { useLocale } from "@/app/providers/LocaleProvider";

import styles from "./ResetPasswordPage.module.scss";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";

const ResetPasswordPage: FC = () => {
    const { locale } = useLocale();
    return (
        <SignLayout cancelText="Отменить" cancelPath={getMainPageUrl(locale)}>
            <div className={styles.wrapper}>
                <ResetPasswordContainer />
            </div>
        </SignLayout>
    );
};

export default ResetPasswordPage;
