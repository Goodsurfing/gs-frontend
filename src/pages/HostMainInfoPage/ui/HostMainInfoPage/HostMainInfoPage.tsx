import { FC } from "react";
import { useTranslation } from "react-i18next";

import { HostPagesSidebarData } from "@/shared/data/host-pages";

import { HostDescriptionForm, useGetHostInfo } from "@/features/HostDescription";

import { PageLayout } from "@/widgets/PageLayout";

import styles from "./HostMainInfoPage.module.scss";

const HostMainInfoPage: FC = () => {
    const { t } = useTranslation();

    const hostData = useGetHostInfo();

    return (
        <PageLayout sidebarContent={HostPagesSidebarData}>
            <div className={styles.wrapper}>
                <HostDescriptionForm
                    className={styles.className}
                    host={hostData?.host}
                    isLoading={hostData.isLoading}
                    error={hostData?.error}
                />
            </div>
        </PageLayout>
    );
};

export default HostMainInfoPage;
