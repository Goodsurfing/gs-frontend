import React, { FC, useMemo, useState } from "react";

import {
    AboutProjectInfoFields,
    AboutProjectPrinciples,
    useGetAdminAbouProjectPageInfoQuery,
    useUpdateAdminAbouProjectPageInfoMutation,
} from "@/entities/Admin";
import { AdminAboutProjectForm } from "@/features/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import styles from "./AdminAboutProjectInfo.module.scss";

export const AdminAboutProjectInfo: FC = () => {
    const { data: aboutProjectData, isLoading } = useGetAdminAbouProjectPageInfoQuery();
    const [updateAboutProject,
        { isLoading: isUpdateLoading }] = useUpdateAdminAbouProjectPageInfoMutation();

    const [toast, setToast] = useState<ToastAlert>();

    const initialData = useMemo<AboutProjectInfoFields | undefined>(() => {
        if (!aboutProjectData) {
            return undefined;
        }

        return {
            mission: aboutProjectData.mission,
            howAllStart: aboutProjectData.howAllStart,
            principles: aboutProjectData.principles,
            galleryImages: aboutProjectData.galleryImages,
        };
    }, [aboutProjectData]);

    const onSubmit = async (data: AboutProjectInfoFields) => {
        setToast(undefined);
        const principlesTemp: (Omit<AboutProjectPrinciples, "image"> & {
            imageId: string;
        })[] = data.principles.map((principle) => ({
            name: principle.name,
            description: principle.description,
            imageId: principle.image.id,
        }));

        try {
            await updateAboutProject({
                mission: data.mission,
                howAllStart: data.howAllStart,
                principles: principlesTemp,
                galleryImageIds: data.galleryImages.map((image) => image.id),
            }).unwrap();

            setToast({
                text: "Страница успешно сохранена",
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении страницы",
                type: HintType.Error,
            });
        }
    };

    if (isLoading) {
        return <MiniLoader />;
    }

    if (!aboutProjectData || !initialData) {
        return (
            <div className={styles.wrapper}>
                <h1>Страница &quot;О гудсёрфинге&quot;</h1>
                <h2>Данные по данной странице отсутствуют</h2>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Страница &quot;О гудсёрфинге&quot;</h1>
            <AdminAboutProjectForm
                initialData={initialData}
                onComplete={onSubmit}
                isLoading={isUpdateLoading}
            />
        </div>
    );
};
