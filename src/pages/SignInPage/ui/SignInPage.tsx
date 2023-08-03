import { FC } from "react";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";

import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

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
