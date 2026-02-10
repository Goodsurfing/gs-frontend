import React, { FC, useState } from "react";
import {
    AdminExpertFields, useCreateAdminExpertMutation, useGetCourseExpertsQuery,
    useUpdateAdminExpertMutation,
} from "@/entities/Admin";
import { Modal } from "@/shared/ui/Modal/Modal";
import styles from "./AdminExpertSelectorModal.module.scss";
import { AdminExpertFormModal } from "../AdminExpertFormModal/AdminExpertFormModal";

interface AdminExpertSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedExperts: AdminExpertFields[];
    onExpertsChange: (experts: AdminExpertFields[]) => void;
}

export const AdminExpertSelectorModal: FC<AdminExpertSelectorModalProps> = ({
    isOpen,
    onClose,
    selectedExperts,
    onExpertsChange,
}) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingExpert, setEditingExpert] = useState<AdminExpertFields | null>(null);
    const { data: expertsData, isLoading, refetch } = useGetCourseExpertsQuery({});
    const [createCourseExpert] = useCreateAdminExpertMutation();
    const [updateCourseExpert] = useUpdateAdminExpertMutation();
    const experts = expertsData?.data ?? [];

    const handleAddExpert = () => {
        setEditingExpert(null);
        setIsFormOpen(true);
    };

    const handleEditExpert = (expert: AdminExpertFields) => {
        setEditingExpert(expert);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingExpert(null);
    };

    const handleFormSubmit = async (expert: AdminExpertFields) => {
        const {
            image, firstName, lastName, city, country,
            project, id,
        } = expert;

        const preparedData = {
            imageId: image?.id ?? "",
            firstName: firstName ?? "",
            lastName: lastName ?? "",
            city: city ?? "",
            country: country ?? "",
            project: project ?? "",
        };

        try {
            if (editingExpert) {
                updateCourseExpert({
                    expertId: id,
                    body: preparedData,
                });
            } else {
                await createCourseExpert(preparedData).unwrap();
            }
            await refetch();
            handleCloseForm();
        } catch (error) {
            console.error("Error submitting expert:", error);
        }
    };

    const handleSelectExpert = (expert: AdminExpertFields) => {
        if (selectedExperts.some((e) => e.id === expert.id)) {
            onExpertsChange(selectedExperts.filter((e) => e.id !== expert.id));
        } else {
            onExpertsChange([...selectedExperts, expert]);
        }
    };

    const isSelected = (expertId: string) => selectedExperts.some((e) => e.id === expertId);

    let expertsContent;
    if (isLoading) {
        expertsContent = (
            <div className={styles.loading}>Загрузка экспертов...</div>
        );
    } else if (experts.length === 0) {
        expertsContent = (
            <div className={styles.emptyState}>
                <p>Нет доступных экспертов</p>
                <button
                    type="button"
                    className={styles.emptyButton}
                    onClick={handleAddExpert}
                >
                    Добавить первого эксперта
                </button>
            </div>
        );
    } else {
        expertsContent = experts.map((expert) => (
            <div key={expert.id} className={styles.expertCard}>
                <div className={styles.cardHeader}>
                    <div className={styles.expertInfo}>
                        <h3 className={styles.expertName}>
                            {expert.firstName}
                            {" "}
                            {expert.lastName}
                        </h3>
                    </div>
                </div>

                <div className={styles.cardActions}>
                    <button
                        type="button"
                        className={`${styles.selectButton} ${isSelected(expert.id) ? styles.selected : ""}`}
                        onClick={() => handleSelectExpert(expert)}
                    >
                        {isSelected(expert.id) ? "✓ Выбран" : "Выбрать"}
                    </button>
                    <button
                        type="button"
                        className={styles.editButton}
                        onClick={() => handleEditExpert(expert)}
                    >
                        Редактировать
                    </button>
                </div>
            </div>
        ));
    }

    if (!isOpen) return null;

    return (
        <Modal
            onClose={onClose}
            isShowCloseIcon
            className={styles.modalWrapper}
        >
            <div className={styles.container}>
                {!isFormOpen ? (
                    <>
                        <div className={styles.header}>
                            <h2 className={styles.title}>Выбор экспертов</h2>
                            <button
                                type="button"
                                className={styles.addButton}
                                onClick={handleAddExpert}
                            >
                                + Добавить эксперта
                            </button>
                        </div>

                        <div className={styles.expertsGrid}>
                            {expertsContent}
                        </div>

                        <div className={styles.selectedExperts}>
                            <h3 className={styles.selectedTitle}>
                                Выбрано экспертов:
                                {" "}
                                {selectedExperts.length}
                            </h3>
                            {selectedExperts.length > 0 && (
                                <div className={styles.selectedList}>
                                    {selectedExperts.map((expert) => (
                                        <div key={expert.id} className={styles.selectedItem}>
                                            <span>
                                                {expert.firstName}
                                                {" "}
                                                {expert.lastName}
                                            </span>
                                            <button
                                                type="button"
                                                className={styles.removeButton}
                                                onClick={() => handleSelectExpert(expert)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={styles.footerActions}>
                            <button
                                type="button"
                                className={styles.closeButton}
                                onClick={onClose}
                            >
                                Готово
                            </button>
                        </div>
                    </>
                ) : (
                    <AdminExpertFormModal
                        isOpen={isFormOpen}
                        onClose={handleCloseForm}
                        onSubmit={handleFormSubmit}
                        initialData={editingExpert}
                        isLoading={false}
                    />
                )}
            </div>
        </Modal>
    );
};
