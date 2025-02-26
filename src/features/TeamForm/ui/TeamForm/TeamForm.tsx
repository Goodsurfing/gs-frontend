import React, { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ErrorType } from "@/types/api/error";

import {
    HostMember,
    useDeleteHostMemberMutation,
    useGetHostMembersByIdQuery,
} from "@/entities/Host";

import { getErrorText } from "@/shared/lib/getErrorText";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import { InfoText } from "@/shared/ui/InfoText/InfoText";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

import { TeamCard } from "../TeamCard/TeamCard";
import { TeamInput } from "../TeamInput/TeamInput";
import { Text } from "../Text/Text";
import styles from "./TeamForm.module.scss";

interface TeamFormProps {
    hostId: string;
}

export const TeamForm: FC<TeamFormProps> = (props) => {
    const { hostId } = props;
    const [toast, setToast] = useState<ToastAlert>();
    const { t, ready } = useTranslation("host");

    const {
        data: hostMembers,
        isLoading: isMembersLoading,
        isError,
    } = useGetHostMembersByIdQuery(hostId);
    const [deleteMember, { isLoading: isDeleteLoading }] = useDeleteHostMemberMutation();

    const handleDeleteClick = useCallback(
        (id: number) => {
            setToast(undefined);
            if (isDeleteLoading) return;
            deleteMember({ organizationId: hostId, memberId: id.toString() })
                .unwrap()
                .then(() => {
                    setToast({
                        text: t("hostTeam.Участник был добавлен"),
                        type: HintType.Success,
                    });
                })
                .catch((error: ErrorType) => {
                    setToast({
                        text: getErrorText(error),
                        type: HintType.Error,
                    });
                });
        },
        [deleteMember, hostId, isDeleteLoading, t],
    );

    const renderTeamUsers = (users: HostMember[] | undefined) => {
        if (isMembersLoading) {
            return <MiniLoader />;
        }
        if (isError) {
            return <InfoText>{t("hostTeam.Произошла ошибка")}</InfoText>;
        }
        if (!users) return null;

        if (!users.length) return <InfoText>{t("hostTeam.Команда не была заполнена")}</InfoText>;

        return users.map((teamUser) => (
            <TeamCard
                key={teamUser.id}
                teamUser={teamUser}
                onDeleteClick={handleDeleteClick}
            />
        ));
    };

    const onError = () => {
        setToast({
            text: t("hostTeam.Произошла ошибка"),
            type: HintType.Error,
        });
    };

    const onSuccess = () => {
        setToast({
            text: t("hostTeam.Участник был добавлен"),
            type: HintType.Success,
        });
    };

    const refreshToast = () => {
        setToast(undefined);
    };

    if (!ready) {
        return (
            <div className={styles.wrapper}>
                <MiniLoader />
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <Text />
            <TeamInput
                hostId={hostId}
                refreshToast={refreshToast}
                onError={onError}
                onSuccess={onSuccess}
            />
            <div className={styles.containerList}>
                {renderTeamUsers(hostMembers)}
            </div>
            {/* <Button
                className={styles.btn}
                variant="FILL"
                color="BLUE"
                size="MEDIUM"
            >
                Сохранить
            </Button> */}
        </div>
    );
};
