import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import cn from "classnames";
import { ErrorType } from "@/types/api/error";

import { useLocale } from "@/app/providers/LocaleProvider";

import { RoleCard } from "@/features/ProfileRole";

import { useGetProfileInfoQuery } from "@/entities/Profile";
import { CreateVolunteerRequest, useCreateVolunteerMutation } from "@/entities/Volunteer";

import { getHostRegisterPageUrl, getOfferPersonalPageUrl, getVolunteerDashboardPageUrl } from "@/shared/config/routes/AppUrls";
import { getErrorText } from "@/shared/lib/getErrorText";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";

import styles from "./ProfileRoleWidget.module.scss";
import { useRoleData } from "./model/data/roleData";
import { RoleInfo } from "./model/types/profileRoleWidget";

interface ProfileRoleWidgetProps {
    className?: string;
}

export const ProfileRoleWidget: FC<ProfileRoleWidgetProps> = (props) => {
    const { className } = props;
    const [searchParams] = useSearchParams();
    const next = searchParams.get("next");
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [modalDescription, setModalDescription] = useState<string>("");
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [toast, setToast] = useState<ToastAlert>();

    const { locale } = useLocale();
    const navigate = useNavigate();
    const { t } = useTranslation("profile");

    const { roleData } = useRoleData();

    const [createVolunteer, { isLoading }] = useCreateVolunteerMutation();
    const { data: myProfile, refetch: profileRefetch } = useGetProfileInfoQuery();

    const handleVolunteerClick = () => {
        setModalOpen(true);
        setModalDescription(
            t(
                "role.Вы уверены что хотите стать волонтёром? Вам станет доступен дашборд волонтёра",
            ),
        );
        setSelectedRole("volunteer");
    };

    const handleHostClick = () => {
        setModalOpen(true);
        setModalDescription(
            t(
                "role.Вы уверены что хотите стать организатором мероприятий? Для этого вы должны заполнить информацию о организации",
            ),
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

    const handleConfirmClick = async () => {
        if (selectedRole === "volunteer") {
            // Crutch on backend
            const emptyFieldsFormData: CreateVolunteerRequest = {
                externalInfo: "",
                skills: [],
                additionalSkills: [],
            };

            await createVolunteer(emptyFieldsFormData)
                .unwrap()
                .then(() => {
                    setModalOpen(false);
                    setToast({
                        text: "Вы успешно стали волонтёром",
                        type: HintType.Success,
                    });
                    profileRefetch();
                    setTimeout(() => {
                        if (next) {
                            navigate(getOfferPersonalPageUrl(locale, next));
                        } else {
                            navigate(getVolunteerDashboardPageUrl(locale));
                        }
                    }, 3000);
                })
                .catch((error: ErrorType) => {
                    setModalOpen(false);
                    setToast({
                        text: getErrorText(error),
                        type: HintType.Error,
                    });
                });
        } else {
            navigate(getHostRegisterPageUrl(locale));
        }
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const renderRole = (rolesProfile: RoleInfo[]) => {
        if (!myProfile) return;
        return rolesProfile.map((role, index) => {
            const isDisabled = (role.id === "volunteer" && myProfile.volunteer !== null)
                || (role.id === "host" && myProfile.hostId !== null);

            const buttonText = isDisabled ? role.disabledButtonText : role.buttonText;
            return (
                <RoleCard
                    titleRole={role.titleRole}
                    descriptionRole={role.descriptionRole}
                    imageRole={role.imageRole}
                    buttonText={buttonText}
                    buttonDisabled={isDisabled}
                    key={index}
                    onClick={() => handleCardClick(role.id)}
                />
            );
        });
    };
    return (
        <div className={cn(styles.wrapper, className)}>
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
