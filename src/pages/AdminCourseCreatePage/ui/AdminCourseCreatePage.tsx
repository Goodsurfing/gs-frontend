import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";
import { AdminCourseFields, adminCreateCourseApiAdapter, useCreateAdminCourseMutation } from "@/entities/Admin";
import { AdminCourseForm } from "@/features/Admin";
import { getAdminCoursesPageUrl } from "@/shared/config/routes/AppUrls";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import styles from "./AdminCourseCreatePage.module.scss";

const AdminCourseCreatePage = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [toast, setToast] = useState<ToastAlert>();
    const [createCourse, { isLoading }] = useCreateAdminCourseMutation();

    const onSuccess = () => {
        navigate(getAdminCoursesPageUrl(locale));
    };

    const onSubmit = async (data: AdminCourseFields) => {
        setToast(undefined);
        const preparedData = adminCreateCourseApiAdapter(data);
        try {
            await createCourse(preparedData).unwrap();
            onSuccess();
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении курса",
                type: HintType.Error,
            });
        }
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Добавление курса</h1>
            <Breadcrumbs items={[{ label: "Курсы", to: getAdminCoursesPageUrl(locale) },
                { label: "Создание курса" },
            ]}
            />
            <AdminCourseForm onSubmit={onSubmit} isLoading={isLoading} />
        </div>
    );
};

export default AdminCourseCreatePage;
