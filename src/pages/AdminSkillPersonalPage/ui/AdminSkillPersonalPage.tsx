import React from "react";
import { useParams } from "react-router-dom";
import { AdminSkillInfo } from "@/widgets/Admin";
import styles from "./AdminSkillPersonalPage.module.scss";

const AdminSkillPersonalPage = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <div className={styles.wrapper}>
                <h2>Произошла ошибка! Неверный id навыка</h2>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <AdminSkillInfo skillId={Number(id)} />
        </div>
    );
};

export default AdminSkillPersonalPage;
