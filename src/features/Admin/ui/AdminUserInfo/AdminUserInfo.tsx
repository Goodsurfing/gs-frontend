import React, { FC } from "react";
import cn from "classnames";
import { AdminUserInfoForm } from "../AdminUserInfoForm/AdminUserInfoForm";
import { mockedProfileData } from "@/entities/Profile/model/data/mockedProfileData";
import styles from "./AdminUserInfo.module.scss";

interface AdminUserInfoProps {
    className?: string;
}

export const AdminUserInfo: FC<AdminUserInfoProps> = (props) => {
    const { className } = props;

    return (
        <div className={cn(className, styles.wrapper)}>
            <div className={styles.header} />
            <div className={styles.body}>
                {mockedProfileData[0] && <AdminUserInfoForm profile={mockedProfileData[0]} />}
            </div>
        </div>
    );
};
