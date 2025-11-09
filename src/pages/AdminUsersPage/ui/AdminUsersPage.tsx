import React from "react";
import styles from "./AdminUsersPage.module.scss";
import { AdminUsersTable } from "@/widgets/Admin";

const AdminUsersPage = () => (
    <div className={styles.wrapper}>
        <h1>Все пользователи</h1>
        <AdminUsersTable />
    </div>
);

export default AdminUsersPage;
