import React from "react";
import { AdminPersonalUserInfoForm } from "@/widgets/Admin";
import styles from "./AdminUserPersonalPage.module.scss";

const AdminUserPersonalPage = () => (
    <main className={styles.wrapper}>
        <div className={styles.titleWrapper}>
            <h2 className={styles.title}>Информация о пользователе</h2>
        </div>
        <AdminPersonalUserInfoForm />
    </main>
);

export default AdminUserPersonalPage;
