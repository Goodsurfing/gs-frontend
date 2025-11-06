import React from "react";
import { AdminOrganizationInfo, AdminOrganizationSettings } from "@/features/Admin";
import { OrganizationInfoTable } from "@/entities/Admin";

export const AdminPersonalOrganizationInfoForm = () => (
    <div>
        <AdminOrganizationSettings />
        <OrganizationInfoTable />
        <AdminOrganizationInfo />
    </div>
);
