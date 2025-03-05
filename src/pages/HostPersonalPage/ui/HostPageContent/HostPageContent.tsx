import cn from "classnames";
import React, { FC, memo } from "react";

import { Host } from "@/entities/Host";

import styles from "./HostPageContent.module.scss";
import { HostInfoCard } from "@/entities/Host/ui/HostInfoCard/HostInfoCard";

interface HostPageContentProps {
    className?: string;
    hostData: Host;
}

export const HostPageContent: FC<HostPageContentProps> = memo(
    (props: HostPageContentProps) => {
        const { hostData, className } = props;
        return (
            <div className={cn(styles.wrapper, className)}>
                <HostInfoCard host={hostData} />
            </div>
        );
    },
);
