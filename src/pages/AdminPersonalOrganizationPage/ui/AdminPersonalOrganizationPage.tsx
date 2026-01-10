import React from "react";
import { useParams } from "react-router-dom";
import { AdminPersonalOrganizationInfoForm } from "@/widgets/Admin";
import { getAdminOrganizationsPageUrl } from "@/shared/config/routes/AppUrls";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./AdminPersonalOrganizationPage.module.scss";

const AdminPersonalOrganizationPage = () => {
    const { id } = useParams<{ id: string; }>();
    const { locale } = useLocale();

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
                <Breadcrumbs items={[{ label: "Все организации", to: getAdminOrganizationsPageUrl(locale) },
                    { label: "Редактирование организации" },
                ]}
                />
            </div>
            <AdminPersonalOrganizationInfoForm organizationId={id} />
        </div>
    );
};

export default AdminPersonalOrganizationPage;
