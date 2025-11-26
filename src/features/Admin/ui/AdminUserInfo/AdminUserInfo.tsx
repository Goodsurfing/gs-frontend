import React, { FC } from "react";
import cn from "classnames";
import { AdminUserInfoForm } from "../AdminUserInfoForm/AdminUserInfoForm";
import { mockedProfileData } from "@/entities/Profile/model/data/mockedProfileData";

interface AdminUserInfoProps {
    className?: string;
}

export const AdminUserInfo: FC<AdminUserInfoProps> = (props) => {
    const { className } = props;

    return (
        <div className={cn(className)}>
            {mockedProfileData[0] && <AdminUserInfoForm profile={mockedProfileData[0]} />}
        </div>
    );
};
