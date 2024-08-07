import { FC } from "react";

import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { useProfileSidebarData } from "@/shared/data/sidebar/profile-pages";

import { PageLayout } from "@/widgets/PageLayout";
import Preloader from "@/shared/ui/Preloader/Preloader";

const ProfileLayoutPage: FC = () => {
    const { ready } = useTranslation("profile");
    const { SideMenuData } = useProfileSidebarData();

    if (!ready) {
        return <Preloader />;
    }

    return (
        <PageLayout sidebarContent={SideMenuData}>
            <Outlet />
        </PageLayout>
    );
};

export default ProfileLayoutPage;
