import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FeedbackStatus,
    useDeleteAdminFeedbackMutation,
    useGetAdminFeedbackByIdQuery,
    useUpdateAdminFeedbackMutation,
} from "@/entities/Admin";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import { getAdminFeedbackPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import Button from "@/shared/ui/Button/Button";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import styles from "./AdminFeedbackInfo.module.scss";

interface AdminFeedbackInfoProps {
    feedbackId: string;
}

const STATUS_LABEL: Record<FeedbackStatus, string> = {
    [FeedbackStatus.New]: "Новое",
    [FeedbackStatus.Processed]: "Обработано",
};

export const AdminFeedbackInfo: FC<AdminFeedbackInfoProps> = (props) => {
    const { feedbackId } = props;
    const { data: feedback, isLoading } = useGetAdminFeedbackByIdQuery(feedbackId);
    const [updateFeedback, { isLoading: isUpdating }] = useUpdateAdminFeedbackMutation();
    const [deleteFeedback, { isLoading: isDeleting }] = useDeleteAdminFeedbackMutation();
    const [toast, setToast] = useState<ToastAlert>();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { locale } = useLocale();
    const navigate = useNavigate();

    const handleToggleStatus = async () => {
        if (!feedback) return;
        setToast(undefined);

        const nextStatus = feedback.status === FeedbackStatus.New
            ? FeedbackStatus.Processed
            : FeedbackStatus.New;

        try {
            await updateFeedback({
                id: feedbackId,
                body: { status: nextStatus },
            }).unwrap();
            setToast({
                text: "Статус обращения обновлён",
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Произошла ошибка при обновлении статуса",
                type: HintType.Error,
            });
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteFeedback(feedbackId).unwrap();
            navigate(getAdminFeedbackPageUrl(locale));
        } catch {
            setToast({
                text: "Произошла ошибка при удалении",
                type: HintType.Error,
            });
            setIsDeleteModalOpen(false);
        }
    };

    if (isLoading) {
        return (<MiniLoader />);
    }

    if (!feedback) {
        return (
            <div className={styles.wrapper}>
                <h1>Обращение</h1>
                <Breadcrumbs items={[{ label: "Обращения", to: getAdminFeedbackPageUrl(locale) },
                    { label: "Просмотр обращения" },
                ]}
                />
                <h2>Данные по данному обращению отсутствуют</h2>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h1>Обращение</h1>
            <Breadcrumbs items={[{ label: "Обращения", to: getAdminFeedbackPageUrl(locale) },
                { label: "Просмотр обращения" },
            ]}
            />
            <div className={styles.card}>
                <div className={styles.row}>
                    <span className={styles.label}>Дата</span>
                    <span>{feedback.created}</span>
                </div>
                <div className={styles.row}>
                    <span className={styles.label}>Имя</span>
                    <span>{feedback.name}</span>
                </div>
                <div className={styles.row}>
                    <span className={styles.label}>E-mail</span>
                    <a href={`mailto:${feedback.email}`}>{feedback.email}</a>
                </div>
                <div className={styles.row}>
                    <span className={styles.label}>Статус</span>
                    <span>{STATUS_LABEL[feedback.status]}</span>
                </div>
                <div className={styles.row}>
                    <span className={styles.label}>Сообщение</span>
                    <p className={styles.message}>{feedback.message}</p>
                </div>
            </div>
            <div className={styles.actions}>
                <Button
                    onClick={handleToggleStatus}
                    variant="FILL"
                    size="MEDIUM"
                    color="BLUE"
                    disabled={isUpdating}
                >
                    {feedback.status === FeedbackStatus.New
                        ? "Отметить обработанным"
                        : "Вернуть в новые"}
                </Button>
                <Button
                    onClick={() => setIsDeleteModalOpen(true)}
                    variant="OUTLINE"
                    size="MEDIUM"
                    color="RED"
                    disabled={isDeleting}
                >
                    Удалить
                </Button>
            </div>
            <ConfirmActionModal
                isModalOpen={isDeleteModalOpen}
                description="Вы уверены, что хотите удалить это обращение? Это действие нельзя отменить."
                onConfirm={handleConfirmDelete}
                onClose={() => setIsDeleteModalOpen(false)}
                confirmTextButton="Удалить"
                cancelTextButton="Отмена"
                isLoading={isDeleting}
                buttonsDisabled={isDeleting}
            />
        </div>
    );
};
