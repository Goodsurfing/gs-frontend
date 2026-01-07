import React from "react";
import { useParams } from "react-router-dom";
import { AdminPersonalUserInfoForm } from "@/widgets/Admin";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { getAdminUsersPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./AdminUserPersonalPage.module.scss";

const AdminUserPersonalPage = () => {
    const { id } = useParams<{ id: string }>();
    const { locale } = useLocale();

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
                <Breadcrumbs items={[{ label: "Все пользователи", to: getAdminUsersPageUrl(locale) },
                    { label: "Редактирование пользователя" },
                ]}
                />
            </div>
            {renderForm()}
        </main>
    );
};

export default AdminUserPersonalPage;
