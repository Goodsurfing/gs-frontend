import { Outlet } from "react-router-dom";
import { SideMenuData } from "@/shared/data/sidebar/offer-pages";
import { PageLayout } from "@/widgets/PageLayout";

export const OfferLayoutPage = () => (
    <PageLayout sidebarContent={SideMenuData}>
        <Outlet />
    </PageLayout>
);
