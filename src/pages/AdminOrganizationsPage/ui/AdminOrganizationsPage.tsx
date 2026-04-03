import React from "react";
import { AdminOrganizationsTable } from "@/widgets/Admin";
import styles from "./AdminOrganizationsPage.module.scss";

const AdminOrganizationsPage = () => (
    <div className={styles.wrapper}>
        <h1>Все организации</h1>
        <AdminOrganizationsTable />
    </div>
);

export default AdminOrganizationsPage;
