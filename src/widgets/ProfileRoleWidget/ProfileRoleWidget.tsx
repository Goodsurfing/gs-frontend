import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorType } from "@/types/api/error";

import { useLocale } from "@/app/providers/LocaleProvider";

import { RoleCard } from "@/features/ProfileRole";

import { useGetProfileInfoQuery } from "@/entities/Profile";
import { useCreateVolunteerMutation } from "@/entities/Volunteer";

import { getHostRegistrationUrl } from "@/shared/config/routes/AppUrls";
import { getErrorText } from "@/shared/lib/getErrorText";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";

import styles from "./ProfileRoleWidget.module.scss";
import { roleData } from "./model/data/roleData";
import { RoleInfo } from "./model/types/profileRoleWidget";

export const ProfileRoleWidget: FC = () => {
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [modalDescription, setModalDescription] = useState<string>("");
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [toast, setToast] = useState<ToastAlert>();
    const { locale } = useLocale();
    const navigate = useNavigate();

    const [createVolunteer, { isLoading }] = useCreateVolunteerMutation();
    const { data } = useGetProfileInfoQuery();

    const handleVolunteerClick = () => {
        setModalOpen(true);
        setModalDescription(
            "Вы уверены что хотите стать волонтёром? Вам станет доступен дашборд волонтёра",
        );
        setSelectedRole("volunteer");
    };

    const handleHostClick = () => {
        setModalOpen(true);
        setModalDescription(
            "Вы уверены что хотите стать организатором мероприятий? Для этого вы должны заполнить информацию о организации",
        );
        setSelectedRole("host");
    };

    const handleCardClick = (role: string) => {
        if (role === "volunteer") {
            handleVolunteerClick();
        } else {
            handleHostClick();
        }
    };

    const handleConfirmClick = () => {
        if (selectedRole === "volunteer") {
            createVolunteer()
                .unwrap()
                .then(() => {
                    setModalOpen(false);
                    setToast({
                        text: "Вы успешно стали волонтёром",
                        type: HintType.Success,
                    });
                })
                .catch((error: ErrorType) => {
                    setModalOpen(false);
                    setToast({
                        text: getErrorText(error),
                        type: HintType.Error,
                    });
                });
        } else {
            navigate(getHostRegistrationUrl(locale));
        }
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const renderRole = (rolesProfile: RoleInfo[]) => {
        if (!data) return;
        return rolesProfile.map((role, index) => {
            const isDisabled = (role.id === "volunteer" && data.volunteer !== undefined)
                || (role.id === "host" && data.host !== undefined);

            return (
                <RoleCard
                    titleRole={role.titleRole}
                    descriptionRole={role.descriptionRole}
                    imageRole={role.imageRole}
                    buttonText={role.buttonText}
                    buttonDisabled={isDisabled}
                    key={index}
                    onClick={() => handleCardClick(role.id)}
                />
            );
        });
    };
    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            {renderRole(roleData)}
            <ConfirmActionModal
                isModalOpen={isModalOpen}
                description={modalDescription}
                onConfirm={() => handleConfirmClick()}
                onClose={() => handleModalClose()}
                buttonsDisabled={isLoading}
            />
        </div>
    );
};
