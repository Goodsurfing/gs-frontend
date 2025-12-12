import React from "react";
import { useParams } from "react-router-dom";
import styles from "./AdminPersonalOrganizationPage.module.scss";
import { AdminPersonalOrganizationInfoForm } from "@/widgets/Admin";

const AdminPersonalOrganizationPage = () => {
    const { id } = useParams<{ id: string; }>();

    if (!id) {
        return (
            <div className={styles.wrapper}>
                Введён некорректный id организации
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.titleWrapper}>
                <h2 className={styles.title}>Информация о организаторе</h2>
            </div>
            <AdminPersonalOrganizationInfoForm organizationId={id} />
        </div>
    );
};

export default AdminPersonalOrganizationPage;
