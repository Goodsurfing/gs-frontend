import React, { FC } from "react";
import { AdminUsersSearchInput } from "../AdminUsersSearchInput/AdminUsersSearchInput";
import { AdminCourseAuthorFileds } from "@/entities/Admin";
import styles from "./AdminUsersSearchForm.module.scss";
import { getFullName } from "@/shared/lib/getFullName";

interface AdminUsersSearchFormProps {
    value: AdminCourseAuthorFileds | null;
    onChange: (value: AdminCourseAuthorFileds | null) => void;
}

export const AdminUsersSearchForm: FC<AdminUsersSearchFormProps> = (props) => {
    const { value, onChange } = props;

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
            <AdminUsersSearchInput onChange={onChange} />
            <div className={styles.selectedUser}>
                {value && (
                    <div className={styles.top}>
                        <p>Добавленный автор</p>
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
