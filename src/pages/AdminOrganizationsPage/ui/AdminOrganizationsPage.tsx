import React from "react";
import styles from "./AdminOrganizationsPage.module.scss";
import { AdminOrganizationsTable } from "@/widgets/Admin";

const AdminOrganizationsPage = () => (
    <div className={styles.wrapper}>
        <h1>Все организации</h1>
        <AdminOrganizationsTable />
    </div>
);

export default AdminOrganizationsPage;
