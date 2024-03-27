import cn from "classnames";
import React, { FC, memo, useCallback } from "react";

import {
    ExtraConditionsData, useExtraConditionsData,
} from "@/features/OfferFinishingTouches/model/data/extraConditionsData";

import { IconTextComponent } from "@/shared/ui/IconTextComponent/IconTextComponent";
import { Text } from "@/shared/ui/Text/Text";

import {
    ExtraConditions,
    OfferFinishingTouches,
} from "../../model/types/offerFinishingTouches";
import styles from "./OfferConditionsCard.module.scss";

interface OfferConditionsCardProps {
    className?: string;
    finishingTouches: OfferFinishingTouches;
}

type ConditionsMap = {
    [key in ExtraConditions]?: ExtraConditionsData;
};

export const OfferConditionsCard: FC<OfferConditionsCardProps> = memo(
    (props: OfferConditionsCardProps) => {
        const {
            className,
            finishingTouches: { extraConditions },
        } = props;
        const { extraConditionsData } = useExtraConditionsData();

        const renderConditionsCard = useCallback(() => {
            const conditionsMap: ConditionsMap = extraConditionsData.reduce(
                (acc: ConditionsMap, cur) => {
                    acc[cur.id] = cur;
                    return acc;
                },
                {},
            );
            return extraConditions?.map((id) => {
                const condition = conditionsMap[id];
                return (
                    condition && (
                        <IconTextComponent
                            text={condition.text}
                            icon={condition.icon}
                            alt={condition.text}
                            key={condition.id}
                        />
                    )
                );
            });
        }, [extraConditions, extraConditionsData]);

        return (
            <div className={cn(className, styles.wrapper)}>
                <Text title="Требования к участнику" titleSize="h3" />
                <div className={styles.cards}>{renderConditionsCard()}</div>
            </div>
        );
    },
);
