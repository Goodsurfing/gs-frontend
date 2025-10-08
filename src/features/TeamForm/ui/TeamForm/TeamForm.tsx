/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useLocale } from "@/app/providers/LocaleProvider";
import { Text as TextShared } from "@/shared/ui/Text/Text";

interface TeamFormProps {
    hostId: string;
    hostEmail: string;
}

export const TeamForm: FC<TeamFormProps> = (props) => {
    const { hostId, hostEmail } = props;
    const [toast, setToast] = useState<ToastAlert>();
    const { t, ready } = useTranslation("host");
    const { locale } = useLocale();

    const {
        data: hostMembers,
        isLoading: isMembersLoading,
        isError,
    } = useGetHostMembersByIdQuery(hostId);
    const [deleteMember, { isLoading: isDeleteLoading }] = useDeleteHostMemberMutation();

    const handleDeleteClick = useCallback(
        async (id: number) => {
            setToast(undefined);
            if (isDeleteLoading) return;
            await deleteMember({ organizationId: hostId, memberId: id.toString() })
                .unwrap()
                .then(() => {
                    setToast({
                        text: t("hostTeam.Участник был удалён"),
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
                locale={locale}
            />
        ));
    };

    const onError = () => {
        setToast(undefined);
        setTimeout(() => {
            setToast({
                text: t("hostTeam.Произошла ошибка"),
                type: HintType.Error,
            });
        }, 0);
    };

    const onSuccess = () => {
        setToast(undefined);
        setTimeout(() => {
            setToast({
                text: t("hostTeam.Участник был добавлен"),
                type: HintType.Success,
            });
        }, 0);
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
            <h3>Функция станет доступна позже.</h3>
            {/* <TeamInput
                hostId={hostId}
                hostEmail={hostEmail}
                hostMembers={hostMembers ?? []}
                locale={locale}
                onError={onError}
                onSuccess={onSuccess}
            />
            <div className={styles.containerList}>
                {renderTeamUsers(hostMembers)}
            </div> */}
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
