import React from "react";
import styles from "./AdminOrganizationsPage.module.scss";
import { AdminOrganizationsTable } from "@/widgets/Admin";

const AdminOrganizationsPage = () => (
    <div className={styles.wrapper}><AdminOrganizationsTable /></div>
);

export default AdminOrganizationsPage;
