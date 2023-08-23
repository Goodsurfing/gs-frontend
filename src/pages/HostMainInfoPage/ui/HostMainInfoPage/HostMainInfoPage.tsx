import { FC } from "react";
import { useTranslation } from "react-i18next";

import { HostDescriptionForm } from "@/features/HostDescription";

import { useUser } from "@/entities/Profile";

import styles from "./HostMainInfoPage.module.scss";

const HostMainInfoPage: FC = () => {
    const { t } = useTranslation();

    const { profile, error, isLoading } = useUser();

    return (
        <div className={styles.wrapper}>
            <HostDescriptionForm
                className={styles.className}
                host={profile?.organizations?.[0]}
                isLoading={isLoading}
                error={error}
            />
        </div>
    );
};

export default HostMainInfoPage;
