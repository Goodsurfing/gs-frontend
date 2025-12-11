import React, { FC } from "react";
import cn from "classnames";
import { AdminUserInfoForm } from "../AdminUserInfoForm/AdminUserInfoForm";
import { AdminUser } from "@/entities/Admin";

interface AdminUserInfoProps {
    className?: string;
    data: AdminUser;
    userId: string;
}

export const AdminUserInfo: FC<AdminUserInfoProps> = (props) => {
    const { className, data, userId } = props;

    return (
        <div className={cn(className)}>
            <AdminUserInfoForm user={data} userId={userId} />
        </div>
    );
};
