import React, { FC } from "react";
import { AdminOrganizationInfoForm } from "../AdminOrganizationInfoForm/AdminOrganizationInfoForm";
import { mockedHostData } from "@/entities/Host/model/data/mockedHostData";

interface AdminUserInfoProps {
    className?: string;
}

export const AdminOrganizationInfo: FC<AdminUserInfoProps> = (props) => {
    const { className } = props;
    return (
        <div className={className}>
            <AdminOrganizationInfoForm organization={mockedHostData} />
        </div>
    );
};
