import React, { FC } from "react";
import { AdminOrganizationInfoForm } from "../AdminOrganizationInfoForm/AdminOrganizationInfoForm";
import { AdminOrganization } from "@/entities/Admin";

interface AdminUserInfoProps {
    className?: string;
    organizationId: string;
    data: AdminOrganization;
}

export const AdminOrganizationInfo: FC<AdminUserInfoProps> = (props) => {
    const { className, organizationId, data } = props;
    return (
        <div className={className}>
            <AdminOrganizationInfoForm
                organization={data}
                organizationId={organizationId}
            />
        </div>
    );
};
