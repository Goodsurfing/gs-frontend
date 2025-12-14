import { FC } from "react";

import { useTranslation } from "react-i18next";
import { HostDescriptionForm } from "@/features/HostDescription";

import { useGetProfileInfoQuery } from "@/entities/Profile";

import styles from "./HostMainInfoPage.module.scss";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

const HostMainInfoPage: FC = () => {
    const { t, ready } = useTranslation("host");
    const { ready: profileIsReady } = useTranslation("profile");

    const {
        data: myProfile, isLoading, isError, refetch: profileRefetch,
    } = useGetProfileInfoQuery();

    if (!ready || !profileIsReady) {
        return (
            <div className={styles.wrapper}>
                <MiniLoader />
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>{t("hostDescription.Основная информация")}</h2>
            <HostDescriptionForm
                className={styles.className}
                host={myProfile?.hostId}
                myProfile={myProfile}
                isLoading={isLoading}
                isError={isError}
                profileRefetch={profileRefetch}
            />
        </div>
    );
};

export default HostMainInfoPage;
