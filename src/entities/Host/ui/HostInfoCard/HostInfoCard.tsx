import cn from "classnames";
import React, { FC, memo } from "react";

import { FullHost } from "../../model/types/host";
import styles from "./HostInfoCard.module.scss";
import { HostDescriptionCard } from "../HostDescriptionCard/HostDescriptionCard";

interface HostInfoCardProps {
    className?: string;
    host: FullHost;
}

export const HostInfoCard: FC<HostInfoCardProps> = memo(
    (props: HostInfoCardProps) => {
        const { className, host } = props;
        return (
            <div className={cn(className, styles.wrapper)}>
                <HostDescriptionCard host={host.host} />
            </div>
        );
    },
);
