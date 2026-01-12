import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSideMenuData } from "@/shared/data/sidebar/admin-offer-pages";
import { AdminLayout } from "@/widgets/AdminLayout";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import { getAdminSignInPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import Preloader from "@/shared/ui/Preloader/Preloader";
import styles from "./AdminOfferLayoutPage.module.scss";

const AdminOfferLayoutPage = () => {
    const { SideMenuData } = useSideMenuData();
    const { locale } = useLocale();
    const navigate = useNavigate();
    const { isUserAdmin } = useAuth();

    useEffect(() => {
        if (!isUserAdmin) {
            navigate(getAdminSignInPageUrl(locale), { replace: true });
        }
    }, [isUserAdmin, locale, navigate]);

    if (!isUserAdmin) {
        return (
            <Preloader />
        );
    }

    return (
        <AdminLayout
            classNameSidebarLinks={styles.sidebarLinks}
            sidebarContent={SideMenuData}
        >
            <Outlet />
        </AdminLayout>
    );
};

export default AdminOfferLayoutPage;
