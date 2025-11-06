import React from "react";
import styles from "./AdminPersonalOrganizationPage.module.scss";
import { AdminPersonalOrganizationInfoForm } from "@/widgets/Admin";

const AdminPersonalOrganizationPage = () => (
    <div className={styles.wrapper}>
        <div className={styles.titleWrapper}>
            <h2 className={styles.title}>Информация о организаторе</h2>
        </div>
        <AdminPersonalOrganizationInfoForm />
    </div>
);

export default AdminPersonalOrganizationPage;
