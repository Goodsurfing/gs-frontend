import { FC } from "react";

import { HostDescriptionForm } from "@/features/HostDescription";

import { useGetProfileInfoQuery } from "@/entities/Profile";

import styles from "./HostMainInfoPage.module.scss";

const HostMainInfoPage: FC = () => {
    // const { profile, error, isLoading } = useUser();
    const {
        data: myProfile, isLoading, isError, refetch: profileRefetch,
    } = useGetProfileInfoQuery();

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Основная информация</h2>
            <HostDescriptionForm
                className={styles.className}
                host={myProfile?.host}
                myProfile={myProfile}
                isLoading={isLoading}
                isError={isError}
                profileRefetch={profileRefetch}
            />
        </div>
    );
};

export default HostMainInfoPage;
