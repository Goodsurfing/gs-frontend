import React, { FC, useState } from "react";
import {
    AdminCourseFields, adminCreateCourseApiAdapter, useGetAdminCourseByIdQuery,
    useUpdateAdminCourseMutation,
} from "@/entities/Admin";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { AdminCourseForm } from "@/features/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { getAdminCoursesPageUrl } from "@/shared/config/routes/AppUrls";
import styles from "./AdminCourseInfo.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

interface AdminCourseInfoProps {
    courseId: string;
}

export const AdminCourseInfo: FC<AdminCourseInfoProps> = (props) => {
    const { courseId } = props;
    const { data: courseData, isLoading } = useGetAdminCourseByIdQuery(courseId);
    const [updateCourse, { isLoading: isUpdateLoading }] = useUpdateAdminCourseMutation();
    const [toast, setToast] = useState<ToastAlert>();
    const { locale } = useLocale();

    const onSubmit = async (data: AdminCourseFields) => {
        setToast(undefined);
        const preparedData = adminCreateCourseApiAdapter(data);

        try {
            await updateCourse({
                id: courseId,
                body: preparedData,
            }).unwrap();
            setToast({
                text: "Курс успешно сохранен",
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении курса",
                type: HintType.Error,
            });
        }
    };

    if (isLoading) {
        return (<MiniLoader />);
    }

    if (!courseData) {
        return (
            <div className={styles.wrapper}>
                <h1>Страница курса</h1>
                <Breadcrumbs items={[{ label: "Курсы", to: getAdminCoursesPageUrl(locale) },
                    { label: "Редактирование курса" },
                ]}
                />
                <h2>Данные по данному курсу отсутсвуют</h2>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Страница курса</h1>
            <Breadcrumbs items={[{ label: "Курсы", to: getAdminCoursesPageUrl(locale) },
                { label: "Редактирование курса" },
            ]}
            />
            <AdminCourseForm
                course={courseData}
                onSubmit={onSubmit}
                isLoading={isUpdateLoading}
            />
        </div>
    );
};
