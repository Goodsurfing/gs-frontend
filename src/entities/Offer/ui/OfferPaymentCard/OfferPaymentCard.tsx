import cn from "classnames";
import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
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
        const { t } = useTranslation("offer");

        if ((!conditions.volunteerContributions) && (!conditions.volunteerRemuneration)) {
            return (null);
        }

        return (
            <div className={cn(className)}>
                <InfoCard>
                    {conditions.volunteerContributions ? (
                        <InfoCardItem
                            title={t("personalOffer.Необходимый взнос")}
                            text={combineToFullPayment(
                                conditions.volunteerContributions,
                                conditions.currency,
                            )}
                        />
                    ) : null}
                    {conditions.volunteerRemuneration ? (
                        <InfoCardItem
                            title={t("personalOffer.Денежное вознаграждение")}
                            text={combineToFullPayment(
                                conditions.volunteerRemuneration,
                                conditions.currency,
                            )}
                        />
                    ) : null}
                </InfoCard>
            </div>
        );
    },
);
