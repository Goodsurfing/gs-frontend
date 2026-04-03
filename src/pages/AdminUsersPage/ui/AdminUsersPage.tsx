import React from "react";
import { AdminUsersTable } from "@/widgets/Admin";
import styles from "./AdminUsersPage.module.scss";

const AdminUsersPage = () => (
    <div className={styles.wrapper}>
        <h1>Все пользователи</h1>
        <AdminUsersTable />
    </div>
);

export default AdminUsersPage;
