import { FC } from "react";

import { HostDescriptionForm } from "@/features/HostDescription";

import { useUser } from "@/entities/Profile";

import styles from "./HostMainInfoPage.module.scss";

const HostMainInfoPage: FC = () => {
    const { profile, error, isLoading } = useUser();

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Основная информация</h2>
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
