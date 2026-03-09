import React, { FC } from "react";
import cn from "classnames";
import { DonationStatus as DonationStatusType } from "../../model/types/donationSchema";
import { useDonationStatus } from "@/shared/hooks/useDonationStatus";
import styles from "./DonationStatus.module.scss";

interface DonationStatusProps {
    status: DonationStatusType;
}

export const DonationStatus: FC<DonationStatusProps> = (props) => {
    const { status } = props;
    const { getDonationStatus } = useDonationStatus();

    return (
        <div className={cn(styles.wrapper, { [styles[status]]: status })}>
            {getDonationStatus(status)}
        </div>
    );
};
