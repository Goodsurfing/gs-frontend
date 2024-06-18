import { FC } from "react";

import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { useProfileSidebarData } from "@/shared/data/sidebar/profile-pages";

import { PageLayout } from "@/widgets/PageLayout";

const ProfileLayoutPage: FC = () => {
    // const { t } = useTranslation("about-me");
    const { SideMenuData } = useProfileSidebarData();
    return (
        <PageLayout sidebarContent={SideMenuData}>
            <Outlet />
        </PageLayout>
    );
};

export default ProfileLayoutPage;
