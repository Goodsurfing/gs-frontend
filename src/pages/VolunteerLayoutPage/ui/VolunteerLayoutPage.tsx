import React from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/widgets/PageLayout";
import { useVolunteerSidebarData } from "@/shared/data/sidebar/volunteer-pages";
import Preloader from "@/shared/ui/Preloader/Preloader";
import styles from "./VolunteerLayoutPage.module.scss";

const VolunteerLayoutPage = () => {
    const { SideMenuData } = useVolunteerSidebarData();
    const { ready: volunterReady } = useTranslation("volunteer");
    const { ready: offerReady } = useTranslation("offer");

    if (!volunterReady || !offerReady) {
        return (
            <Preloader />
        );
    }

    return (
        <PageLayout sidebarContent={SideMenuData} wrapperClassName={styles.wrapper}>
            <Outlet />
        </PageLayout>
    );
};

export default VolunteerLayoutPage;
