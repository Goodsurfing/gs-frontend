import cn from "classnames";
import React, { FC, memo, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TeamCard } from "@/features/TeamForm/ui/TeamCard/TeamCard";

import { useGetHostMembersByIdQuery } from "../../api/hostApi";
import styles from "./HostTeamCard.module.scss";

interface HostTeamCardProps {
    hostId: string;
    className?: string;
}

export const HostTeamCard: FC<HostTeamCardProps> = memo(
    (props: HostTeamCardProps) => {
        const { hostId, className } = props;
        const { t } = useTranslation("host");
        const { data: hostMembers, isError } = useGetHostMembersByIdQuery(hostId);

        const renderCard = useMemo(() => {
            if (!hostMembers) return null;
            return hostMembers.map((user) => (
                <TeamCard teamUser={user} disableDeleteIcn key={user.id} />
            ));
        }, [hostMembers]);

        if (!hostMembers || isError) {
            return null;
        }

        return (
            <div className={cn(className, styles.wrapper)}>
                <h3>{t("personalHost.Команда")}</h3>
                <div className={styles.container}>{renderCard}</div>
            </div>
        );
    },
);
