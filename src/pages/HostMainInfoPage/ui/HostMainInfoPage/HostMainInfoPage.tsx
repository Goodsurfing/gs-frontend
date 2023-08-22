import { FC } from "react";
import { useTranslation } from "react-i18next";

import { HostPagesSidebarData } from "@/shared/data/sidebar/host-pages";

import { HostDescriptionForm } from "@/features/HostDescription";

import { PageLayout } from "@/widgets/PageLayout";

import styles from "./HostMainInfoPage.module.scss";
import { useUser } from "@/entities/Profile";

const HostMainInfoPage: FC = () => {
    const { t } = useTranslation();

    const { profile, error, isLoading } = useUser();

    return (
        <PageLayout sidebarContent={HostPagesSidebarData}>
            <div className={styles.wrapper}>
                <HostDescriptionForm
                    className={styles.className}
                    host={profile?.organizations?.[0]}
                    isLoading={isLoading}
                    error={error}
                />
            </div>
        </PageLayout>
    );
};

export default HostMainInfoPage;
