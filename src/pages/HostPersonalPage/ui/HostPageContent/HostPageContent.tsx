import cn from "classnames";
import React, { FC, memo } from "react";

import { HostInfoCard } from "@/entities/Host";
import { mockedFullHostData } from "@/entities/Host/model/data/mockedHostData";

import styles from "./HostPageContent.module.scss";

interface HostPageContentProps {
    className?: string;
    id: string;
}

export const HostPageContent: FC<HostPageContentProps> = memo(
    (props: HostPageContentProps) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, className } = props;
        return (
            <div className={cn(styles.wrapper, className)}>
                <HostInfoCard host={mockedFullHostData} />
            </div>
        );
    },
);
