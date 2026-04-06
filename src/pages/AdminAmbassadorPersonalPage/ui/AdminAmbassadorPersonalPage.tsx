import React from "react";
import { useParams } from "react-router-dom";
import { AdminAmbassadorInfo } from "@/widgets/Admin";
import styles from "./AdminAmbassadorPersonalPage.module.scss";

const AdminAmbassadorPersonalPage = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <div>
                <h2>Произошла ошибка! Неверный id амбассадора</h2>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <AdminAmbassadorInfo id={id} />
        </div>
    );
};

export default AdminAmbassadorPersonalPage;
