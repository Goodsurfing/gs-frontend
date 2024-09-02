import React, { FC, useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
    const { control } = useForm({ mode: "onChange" });
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
                        text: "Участник был добавлен",
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
        [deleteMember, hostId, isDeleteLoading],
    );

    const renderTeamUsers = (users: HostMember[] | undefined) => {
        if (isMembersLoading) {
            return <MiniLoader />;
        }
        if (isError) {
            return <InfoText>Произошла ошибка</InfoText>;
        }
        if (!users) return null;

        if (!users.length) return <InfoText>Команда не была заполнена</InfoText>;

        return users.map((teamUser) => (
            <TeamCard
                key={teamUser.id}
                teamUser={teamUser}
                onDeleteClick={handleDeleteClick}
            />
        ));
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <Text />
            <Controller
                control={control}
                name="team"
                render={({ field }) => (
                    <TeamInput
                        inputValue={field.value}
                        onInputChange={field.onChange}
                        teamUsers={hostMembers ?? []}
                    />
                )}
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
