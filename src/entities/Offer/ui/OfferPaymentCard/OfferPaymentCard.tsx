import cn from "classnames";
import React, { FC, memo } from "react";

import { InfoCard, InfoCardItem } from "@/shared/ui/InfoCard/InfoCard";

import { Payment } from "../../model/types/offerConditions";
import { combineToFullPayment } from "./lib/offerPaymentCardUtils";

interface OfferPaymentCardProps {
    className?: string;
    payment: Payment;
}

export const OfferPaymentCard: FC<OfferPaymentCardProps> = memo(
    (props: OfferPaymentCardProps) => {
        const { className, payment } = props;

        return (
            <div className={cn(className)}>
                <InfoCard>
                    {payment.contribution && (
                        <InfoCardItem
                            title="Необходимый взнос"
                            text={combineToFullPayment(
                                payment.contribution,
                                payment.currency,
                            )}
                        />
                    )}
                    {payment.reward && (
                        <InfoCardItem
                            title="Денежное вознаграждение"
                            text={combineToFullPayment(
                                payment.reward,
                                payment.currency,
                            )}
                        />
                    )}
                </InfoCard>
            </div>
        );
    },
);
