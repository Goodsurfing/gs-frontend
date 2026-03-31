import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useFundraiseSideMenuData } from "@/shared/data/sidebar/fundraise-pages";
import { PageLayout } from "@/widgets/PageLayout";
import Preloader from "@/shared/ui/Preloader/Preloader";

export const FundraiseLayoutPage = () => {
    const { SideMenuData } = useFundraiseSideMenuData();
    const { ready } = useTranslation("host");

    if (!ready) {
        return <Preloader />;
    }

    return (
        <PageLayout sidebarContent={SideMenuData}>
            <Outlet />
        </PageLayout>
    );
};
