import React, { FC } from "react";
import { AdminUsersSearchInput } from "../AdminUsersSearchInput/AdminUsersSearchInput";
import { AdminCourseAuthorFileds } from "@/entities/Admin";
import { getFullName } from "@/shared/lib/getFullName";
import styles from "./AdminUsersSearchForm.module.scss";

interface AdminUsersSearchFormProps {
    value: AdminCourseAuthorFileds | null;
    onChange: (value: AdminCourseAuthorFileds | null) => void;
    label?: string;
}

export const AdminUsersSearchForm: FC<AdminUsersSearchFormProps> = (props) => {
    const { value, onChange, label } = props;

    const renderSelectedUser = () => {
        if (!value) return;
        return (
            <div className={styles.userCard}>
                <b>{value.id}</b>
                <p>{getFullName(value.firstName, value.lastName)}</p>
            </div>
        );
    };

    return (
        <div className={styles.wrapper}>
            <AdminUsersSearchInput onChange={onChange} label={label} />
            <div className={styles.selectedUser}>
                {value && (
                    <div className={styles.top}>
                        <p>Добавленный пользователь</p>
                        <button
                            type="button"
                            onClick={() => onChange(null)}
                            className={styles.delete}
                        >
                            (Удалить)
                        </button>
                    </div>
                )}
                <div className={styles.container}>
                    {renderSelectedUser()}
                </div>
            </div>
        </div>
    );
};
