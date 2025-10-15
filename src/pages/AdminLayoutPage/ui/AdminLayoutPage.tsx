import React from "react";
import { Outlet } from "react-router-dom";
import { useAdminPagesSidebarData } from "@/shared/data/sidebar/admin-pages";
import { AdminLayout } from "@/widgets/AdminLayout";

const AdminLayoutPage = () => {
    const { AdminPagesSidebarData } = useAdminPagesSidebarData();

    return (
        <AdminLayout sidebarContent={AdminPagesSidebarData}><Outlet /></AdminLayout>
    );
};

export default AdminLayoutPage;
