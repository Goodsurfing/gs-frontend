import React from "react";
import styles from "./AdminUserPersonalPage.module.scss";
import { AdminUserInfo, AdminUserSettings } from "@/features/Admin";
import { UserInfoTable } from "@/entities/Admin";

const AdminUserPersonalPage = () => (
    <main className={styles.wrapper}>
        <div className={styles.titleWrapper}>
            <h2 className={styles.title}>Информация о пользователе</h2>
        </div>
        <AdminUserSettings />
        <UserInfoTable />
        <AdminUserInfo />
    </main>
);

export default AdminUserPersonalPage;
