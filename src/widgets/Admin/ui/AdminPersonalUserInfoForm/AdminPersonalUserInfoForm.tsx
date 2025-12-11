import React, { FC } from "react";
import { AdminUserInfo, AdminUserSettings } from "@/features/Admin";
import { useGetUserByIdQuery, UserInfoTable } from "@/entities/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

interface AdminPersonalUserInfoFormProps {
    userId: string;
}

export const AdminPersonalUserInfoForm: FC<AdminPersonalUserInfoFormProps> = (props) => {
    const { userId } = props;
    const { data, isLoading } = useGetUserByIdQuery(userId);

    if (isLoading) {
        return (
            <MiniLoader />
        );
    }

    if (!data) {
        return (
            <div>
                <span>Данные по пользователю не были найдены</span>
            </div>
        );
    }

    return (
        <div>
            <AdminUserSettings data={data} userId={userId} />
            <UserInfoTable data={data} userId={userId} />
            <AdminUserInfo data={data} userId={userId} />
        </div>
    );
};
