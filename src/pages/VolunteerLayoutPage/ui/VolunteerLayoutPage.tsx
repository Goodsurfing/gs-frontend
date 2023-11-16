import React from "react";
import { Outlet } from "react-router-dom";
import { PageLayout } from "@/widgets/PageLayout";

const VolunteerLayoutPage = () => (
    <PageLayout sidebarContent={SideMenuData}>
        <Outlet />
    </PageLayout>
);

export default VolunteerLayoutPage;
