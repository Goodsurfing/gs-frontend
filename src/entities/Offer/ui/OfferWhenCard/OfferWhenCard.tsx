import { memo } from "react";

import cn from "classnames";

import { InfoCard, InfoCardItem } from "@/shared/ui/InfoCard/InfoCard";

import { OfferWhen } from "../../model/types/offerWhen";

import styles from "./OfferWhen.module.scss";

interface OfferWhenProps {
    className?: string;
    offerWhen: OfferWhen;
}

export const OfferWhenCard = memo((props: OfferWhenProps) => {
    const { className, offerWhen } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            <InfoCard>
                {offerWhen.periods?.[0].start && (
                    <InfoCardItem title="Когда" text={offerWhen.periods?.[0].start} />
                )}
                <InfoCardItem title="Минимум дней" text={offerWhen.durationMinDays} />
                <InfoCardItem title="Максимум дней" text={offerWhen.durationMaxDays} />
                {offerWhen.periods?.[0].end && (
                    <InfoCardItem title="Прием заявок до" text={offerWhen.periods?.[0].end} />
                )}
            </InfoCard>
        </div>
    );
});
