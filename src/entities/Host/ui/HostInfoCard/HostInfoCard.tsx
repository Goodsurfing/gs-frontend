import cn from "classnames";
import React, { FC, memo } from "react";

import { mockedOffersData } from "@/entities/Offer/model/data/mockedOfferData";

import { FullHost } from "../../model/types/host";
import { HostDescriptionCard } from "../HostDescriptionCard/HostDescriptionCard";
import { HostOffersCard } from "../HostOffersCard/HostOffersCard";
import styles from "./HostInfoCard.module.scss";

interface HostInfoCardProps {
    className?: string;
    host: FullHost;
}

export const HostInfoCard: FC<HostInfoCardProps> = memo(
    (props: HostInfoCardProps) => {
        const { className, host } = props;
        return (
            <div className={cn(className, styles.wrapper)}>
                <HostDescriptionCard
                    host={host.host}
                    className={styles.container}
                />
                <HostOffersCard
                    offers={mockedOffersData}
                    className={styles.container}
                />
            </div>
        );
    },
);
