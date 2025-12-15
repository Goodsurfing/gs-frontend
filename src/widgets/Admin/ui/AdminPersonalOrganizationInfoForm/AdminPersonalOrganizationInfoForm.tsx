import React, { FC } from "react";
import { AdminOrganizationInfo, AdminOrganizationSettings } from "@/features/Admin";
import { OrganizationInfoTable, useGetOrganizationByIdQuery } from "@/entities/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

interface AdminPersonalOrganizationInfoFormProps {
    organizationId: string;
}

export const AdminPersonalOrganizationInfoForm: FC<
AdminPersonalOrganizationInfoFormProps> = (props) => {
    const { organizationId } = props;
    const { data, isLoading } = useGetOrganizationByIdQuery(organizationId);

    if (isLoading) {
        return (
            <MiniLoader />
        );
    }

    if (!data) {
        return (
            <div>Организация не была найдена</div>
        );
    }

    return (
        <div>
            <AdminOrganizationSettings />
            <OrganizationInfoTable organizationId={organizationId} data={data} />
            <AdminOrganizationInfo organizationId={organizationId} data={data} />
        </div>
    );
};
