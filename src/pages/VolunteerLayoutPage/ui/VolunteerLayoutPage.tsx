import React from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/widgets/PageLayout";
import { useVolunteerSidebarData } from "@/shared/data/sidebar/volunteer-pages";
import Preloader from "@/shared/ui/Preloader/Preloader";

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
        <PageLayout sidebarContent={SideMenuData}>
            <Outlet />
        </PageLayout>
    );
};

export default VolunteerLayoutPage;
