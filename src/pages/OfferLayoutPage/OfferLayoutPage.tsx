import { Outlet } from "react-router-dom";
import { useSideMenuData } from "@/shared/data/sidebar/offer-pages";
import { PageLayout } from "@/widgets/PageLayout";

export const OfferLayoutPage = () => {
    const { SideMenuData } = useSideMenuData();
    return (
        <PageLayout sidebarContent={SideMenuData}>
            <Outlet />
        </PageLayout>
    );
};
