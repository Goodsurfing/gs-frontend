import React, { FC, memo } from "react";
import cn from "classnames";

import { Payment } from "../../model/types/offerConditions";
import styles from "./OfferPaymentCard.module.scss";
import { InfoCard, InfoCardItem } from "@/shared/ui/InfoCard/InfoCard";
import { combineToFullPayment } from "./lib/offerPaymentCardUtils";

interface OfferPaymentCardProps {
    className?: string;
    payment: Payment;
}

export const OfferPaymentCard:FC<OfferPaymentCardProps> = memo((props: OfferPaymentCardProps) => {
    const { className, payment } = props;

    return (
        <div className={cn(className)}>
            <InfoCard>
                {payment.contribution && (
                    <InfoCardItem
                        className={styles.container}
                        title="Необходимый взнос"
                        text={combineToFullPayment(payment.contribution, payment.currency)}
                    />
                )}
                {payment.reward && (
                    <InfoCardItem
                        className={styles.container}
                        title="Денежное вознаграждение"
                        text={combineToFullPayment(payment.reward, payment.currency)}
                    />
                )}
            </InfoCard>
        </div>
    );
});
