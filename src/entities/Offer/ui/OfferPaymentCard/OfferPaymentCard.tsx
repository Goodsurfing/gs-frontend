import cn from "classnames";
import React, { FC, memo } from "react";

import { InfoCard, InfoCardItem } from "@/shared/ui/InfoCard/InfoCard";

import { combineToFullPayment } from "./lib/offerPaymentCardUtils";
import { OfferConditions } from "../../model/types/offerConditions";

interface OfferPaymentCardProps {
    className?: string;
    conditions: OfferConditions;
}

export const OfferPaymentCard: FC<OfferPaymentCardProps> = memo(
    (props: OfferPaymentCardProps) => {
        const { className, conditions } = props;

        return (
            <div className={cn(className)}>
                <InfoCard>
                    {conditions.volunteerContributions && (
                        <InfoCardItem
                            title="Необходимый взнос"
                            text={combineToFullPayment(
                                conditions.volunteerContributions,
                                conditions.currency,
                            )}
                        />
                    )}
                    {conditions.volunteerRemuneration && (
                        <InfoCardItem
                            title="Денежное вознаграждение"
                            text={combineToFullPayment(
                                conditions.volunteerRemuneration,
                                conditions.currency,
                            )}
                        />
                    )}
                </InfoCard>
            </div>
        );
    },
);
