import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { TeamCard } from "@/features/TeamForm";
import { TeamUser } from "../../model/types/host";

import styles from "./HostTeamCard.module.scss";

interface HostTeamCardProps {
    team: TeamUser[];
    className?: string;
}

export const HostTeamCard: FC<HostTeamCardProps> = memo(
    (props: HostTeamCardProps) => {
        const { team, className } = props;
        const { t } = useTranslation("host");

        const renderCard = useMemo(() => team.map((user) => (
            <TeamCard teamUser={user} disableDeleteIcn key={user.id} />
        )), [team]);

        return (
            <div className={cn(className, styles.wrapper)}>
                <h3>{t("personalHost.Команда")}</h3>
                <div className={styles.container}>
                    {renderCard}
                </div>
            </div>
        );
    },
);
