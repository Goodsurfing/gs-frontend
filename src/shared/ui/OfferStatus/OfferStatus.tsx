import React, { FC } from "react";
import cn from "classnames";
import styles from "./OfferStatus.module.scss";
import { OfferStatus as OfferStatusType } from "@/entities/Offer";
import { useOfferStatus } from "@/shared/hooks/useOfferStatus";

interface OfferStatusProps {
    status: OfferStatusType;
}

export const OfferStatus: FC<OfferStatusProps> = (props) => {
    const { status } = props;
    const { getOfferStatus } = useOfferStatus();

    return (
        <div className={cn(styles.wrapper, { [styles[status]]: status })}>
            {getOfferStatus(status)}
        </div>
    );
};
