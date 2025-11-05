import React from "react";
import { AdminUserInfo, AdminUserSettings } from "@/features/Admin";
import { UserInfoTable } from "@/entities/Admin";

export const AdminPersonalUserInfoForm = () => (
    <div>
        <AdminUserSettings />
        <UserInfoTable />
        <AdminUserInfo />
    </div>
);
