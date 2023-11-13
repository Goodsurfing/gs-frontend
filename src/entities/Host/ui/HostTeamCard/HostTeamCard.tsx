import React, { FC, memo } from "react";
import cn from "classnames";
import { TeamUser } from "@/features/TeamForm/model/types/team";
import styles from "./HostTeamCard.module.scss";

interface HostTeamCardProps {
    team: TeamUser[]
}

export const HostTeamCard: FC<HostTeamCardProps> = memo((props: HostTeamCardProps) => {
    const {} = props;
    return (
        <div>HostTeamCard</div>
    );
});
