import React from "react";
import { Outlet } from "react-router-dom";
import { PageLayout } from "@/widgets/PageLayout";
import { useVolunteerSidebarData } from "@/shared/data/sidebar/volunteer-pages";

const VolunteerLayoutPage = () => {
    const { SideMenuData } = useVolunteerSidebarData();
    return (
        <PageLayout sidebarContent={SideMenuData}>
            <Outlet />
        </PageLayout>
    );
};

export default VolunteerLayoutPage;
