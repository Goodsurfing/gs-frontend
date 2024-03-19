import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSideMenuData } from "@/shared/data/sidebar/offer-pages";
import { PageLayout } from "@/widgets/PageLayout";
import Preloader from "@/shared/ui/Preloader/Preloader";

export const OfferLayoutPage = () => {
    const { SideMenuData } = useSideMenuData();
    const { ready } = useTranslation("offer");

    if (!ready) {
        return <Preloader />;
    }

    return (
        <PageLayout sidebarContent={SideMenuData}>
            <Outlet />
        </PageLayout>
    );
};
