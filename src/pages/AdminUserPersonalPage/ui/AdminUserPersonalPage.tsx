import React from "react";
import { useParams } from "react-router-dom";
import { AdminPersonalUserInfoForm } from "@/widgets/Admin";
import styles from "./AdminUserPersonalPage.module.scss";

const AdminUserPersonalPage = () => {
    const { id } = useParams<{ id: string }>();

    const renderForm = () => {
        if (!id) return <span>Введён неправильный id</span>;
        return (
            <AdminPersonalUserInfoForm userId={id} />
        );
    };

    return (
        <main className={styles.wrapper}>
            <div className={styles.titleWrapper}>
                <h2 className={styles.title}>Информация о пользователе</h2>
            </div>
            {renderForm()}
        </main>
    );
};

export default AdminUserPersonalPage;
