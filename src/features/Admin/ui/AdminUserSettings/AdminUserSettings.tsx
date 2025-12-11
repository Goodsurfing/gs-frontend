import React, { FC, useState } from "react";
import styles from "./AdminUserSettings.module.scss";
import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { AdminUpdateAchievement } from "../AdminUpdateAchievement/AdminUpdateAchievement";
import {
    adminUpdateUserAdapter,
    AdminUser, useDeleteUserMutation,
    useGetPublicAchievementsQuery, useToggleAdminUserActiveMutation,
    useUpdateAdminUserMutation,
} from "@/entities/Admin";
import { getFullName } from "@/shared/lib/getFullName";
import { Achievement } from "@/types/achievements";
import { AdminUpdateSkills } from "../AdminUpdateSkills/AdminUpdateSkills";
import { Skill } from "@/types/skills";

interface AdminUserSettingsProps {
    userId: string;
    data: AdminUser;
}

export const AdminUserSettings: FC<AdminUserSettingsProps> = (props) => {
    const { userId, data } = props;
    const { isActive, firstName, lastName } = data;
    const userName = getFullName(firstName, lastName);
    const { data: achievementsData } = useGetPublicAchievementsQuery();
    const [updateUser] = useUpdateAdminUserMutation();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
    const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
    const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
    const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);

    const [toast, setToast] = useState<ToastAlert | undefined>();

    const [toggleAdminUserActive,
        { isLoading: isTogglingActive }] = useToggleAdminUserActiveMutation();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    const handleConfirmDelete = async () => {
        setToast(undefined);
        try {
            await deleteUser(userId).unwrap();
            setToast({
                text: "Пользователь успешно удалён",
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Не удалось удалить пользователя",
                type: HintType.Error,
            });
        } finally {
            closeDeleteModal();
        }
    };

    const openToggleModal = () => setIsToggleModalOpen(true);
    const closeToggleModal = () => setIsToggleModalOpen(false);

    const handleConfirmToggle = async () => {
        setToast(undefined);
        try {
            await toggleAdminUserActive(userId).unwrap();
            setToast({
                text: `Пользователь успешно ${isActive ? "заблокирован" : "разблокирован"}`,
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: `Ошибка при ${isActive ? "блокировке" : "разблокировке"} пользователя`,
                type: HintType.Error,
            });
        } finally {
            closeToggleModal();
        }
    };

    const openMembershipModal = () => setIsMembershipModalOpen(true);
    const closeMembershipModal = () => setIsMembershipModalOpen(false);

    const handleConfirmMembership = () => {
        setToast({
            text: "Активация членства: не реализовано",
            type: HintType.Error,
        });
        closeMembershipModal();
    };

    const openAchievementModal = () => setIsAchievementModalOpen(true);
    const closeAchievementModal = () => setIsAchievementModalOpen(false);

    const handleAchievementsConfirm = async (selected: Achievement[]) => {
        const formattedData = adminUpdateUserAdapter({ ...data, achievements: selected });

        try {
            await updateUser({ id: userId, body: formattedData });
            setToast({
                text: `Присвоено достижений: ${selected.length}`,
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Не удалось обновить достижения",
                type: HintType.Error,
            });
        } finally {
            closeAchievementModal();
        }
    };

    const openSkillsModal = () => setIsSkillsModalOpen(true);
    const closeSkillsModal = () => setIsSkillsModalOpen(false);

    const handleSkillsConfirm = async (selected: Skill[]) => {
        const formattedData = adminUpdateUserAdapter({ ...data, skills: selected });

        try {
            await updateUser({ id: userId, body: formattedData });
            setToast({
                text: `Обновлено навыков: ${selected.length}`,
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Не удалось обновить навыки",
                type: HintType.Error,
            });
        } finally {
            closeSkillsModal();
        }
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <Button
                className={styles.button}
                color={isActive ? "RED" : "GREEN"}
                size="SMALL"
                variant="FILL"
                onClick={openToggleModal}
                disabled={isTogglingActive}
            >
                {data.isActive ? "Заблокировать" : "Разблокировать"}
            </Button>
            <Button
                className={styles.button}
                color="RED"
                size="SMALL"
                variant="FILL"
                onClick={openDeleteModal}
                disabled={isDeleting}
            >
                Удалить пользователя
            </Button>
            <Button
                className={styles.button}
                color="GREEN"
                size="SMALL"
                variant="FILL"
                onClick={openMembershipModal}
            >
                Активировать членство
            </Button>
            <Button
                className={styles.button}
                color="BLUE"
                size="SMALL"
                variant="FILL"
                onClick={openAchievementModal}
            >
                Присвоить достижения
            </Button>
            <Button
                className={styles.button}
                color="BLUE"
                size="SMALL"
                variant="FILL"
                onClick={openSkillsModal}
            >
                Редактировать навыки
            </Button>
            <ConfirmActionModal
                isModalOpen={isDeleteModalOpen}
                description={`Вы уверены, что хотите безвозвратно удалить пользователя "${userName}"?`}
                onConfirm={handleConfirmDelete}
                onClose={closeDeleteModal}
                confirmTextButton="Удалить"
                cancelTextButton="Отмена"
                isLoading={isDeleting}
            />
            <ConfirmActionModal
                isModalOpen={isToggleModalOpen}
                description={
                    isActive
                        ? `Заблокировать пользователя "${userName}"? Он не сможет входить в аккаунт.`
                        : `Разблокировать пользователя "${userName}"? Он снова сможет входить в аккаунт.`
                }
                onConfirm={handleConfirmToggle}
                onClose={closeToggleModal}
                confirmTextButton={isActive ? "Заблокировать" : "Разблокировать"}
                cancelTextButton="Отмена"
                isLoading={isTogglingActive}
            />
            <ConfirmActionModal
                isModalOpen={isMembershipModalOpen}
                description={`Активировать платное членство для "${userName}"?`}
                onConfirm={handleConfirmMembership}
                onClose={closeMembershipModal}
                confirmTextButton="Активировать"
                cancelTextButton="Отмена"
            />
            <AdminUpdateAchievement
                achievements={achievementsData ?? []}
                currentAchievementIds={data.achievements.map((item) => item.id)}
                isModalOpen={isAchievementModalOpen}
                onClose={closeAchievementModal}
                onConfirm={handleAchievementsConfirm}
            />
            <AdminUpdateSkills
                currentSkillIds={data.skills.map((item) => item.id)}
                isModalOpen={isSkillsModalOpen}
                onClose={closeSkillsModal}
                onConfirm={handleSkillsConfirm}
            />
        </div>
    );
};
