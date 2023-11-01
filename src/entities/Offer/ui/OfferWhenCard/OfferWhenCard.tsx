import cn from "classnames";
import { memo } from "react";

import { InfoCard, InfoCardItem } from "@/shared/ui/InfoCard/InfoCard";

import { OfferWhen } from "../../model/types/offerWhen";
import styles from "./OfferWhenCard.module.scss";

interface OfferWhenProps {
    className?: string;
    offerWhen: OfferWhen;
}

export const OfferWhenCard = memo((props: OfferWhenProps) => {
    const { className, offerWhen: { periods, durationMinDays, durationMaxDays } } = props;
    const period = periods?.[0];
    const offerPeriodStart = period ? period.start : "Точная дата не указана";
    const offerPeriodEnd = period ? period.end : "Точная дата не указана";

    return (
        <div className={cn(className)}>
            <InfoCard>
                <InfoCardItem
                    className={styles.left}
                    title="Когда"
                    text={offerPeriodStart}
                />
                <div className={styles.right}>
                    <InfoCardItem
                        title="Минимум дней"
                        text={durationMinDays}
                    />
                    <InfoCardItem
                        title="Максимум дней"
                        text={durationMaxDays}
                    />
                    <InfoCardItem
                        title="Прием заявок до"
                        text={offerPeriodEnd}
                    />
                </div>
            </InfoCard>
        </div>
    );
});
