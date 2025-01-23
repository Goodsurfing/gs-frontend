import cn from "classnames";
import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import { useConditionItems } from "@/features/OfferConditions/model/data/conditionItems";
import {
    ExtraAvailiablesItems,
    FoodItems, GoodsItems, LiveItems, PayedRideItems,
} from "@/features/OfferConditions/model/types/conditionsData";

import {
    ExtraFeatures,
    Facilities, Housing, Nutrition, Travel,
} from "@/entities/Offer/model/types/offerConditions";
import styles from "./OfferTermsCard.module.scss";
import { TermsCard } from "../FacilityCard/TermsCard";
import { Text } from "@/shared/ui/Text/Text";

interface OfferTermsCardProps {
    facilities: Facilities[];
    housing: Housing[];
    paidTravel: Travel[];
    nutrition: Nutrition[];
    extraFeatures: ExtraFeatures[];
    className?: string;
}

export const OfferTermsCard: FC<OfferTermsCardProps> = memo(
    (props: OfferTermsCardProps) => {
        // eslint-disable-next-line no-empty-pattern
        const {
            facilities, className, housing, paidTravel, nutrition, extraFeatures,
        } = props;
        const {
            goodsItems, extraAvailiablesItems,
            foodItems, liveItems, payedRideItems,
        } = useConditionItems();
        const { t } = useTranslation("offer");

        const renderHousing = (
            housingData: LiveItems[],
            housingItems: Housing[],
        ) => {
            const resultItems = housingData.filter((item) => housingItems.includes(item.id));

            return resultItems.map((item) => (
                <TermsCard
                    icon={item.icon}
                    text={item.text}
                    key={item.id}
                />
            ));
        };

        const renderPaidTravel = (
            paidTravelData: PayedRideItems[],
            paidTravelItems: Travel[],
        ) => {
            const resultItems = paidTravelData.filter((item) => paidTravelItems.includes(item.id));

            return resultItems.map((item) => (
                <TermsCard
                    icon={item.icon}
                    text={item.text}
                    key={item.id}
                />
            ));
        };

        const renderFood = (
            nutritionData: FoodItems[],
            nutritionItems: Nutrition[],
        ) => {
            const resultItems = nutritionData.filter((item) => nutritionItems.includes(item.id));

            return resultItems.map((item) => (
                <TermsCard
                    icon={item.icon}
                    text={item.text}
                    key={item.id}
                />
            ));
        };

        const renderFacilities = (
            facilitiesData: GoodsItems[],
            facilitiesItems: Facilities[],
        ) => {
            const resultItems = facilitiesData.filter((item) => facilitiesItems.includes(item.id));

            return resultItems.map((item) => (
                <TermsCard
                    icon={item.icon}
                    text={item.text}
                    key={item.id}
                />
            ));
        };

        const renderExtraAvailiables = (
            extraData: ExtraAvailiablesItems[],
            extraItems: ExtraFeatures[],
        ) => {
            const resultItems = extraData.filter((item) => extraItems.includes(item.id));

            return resultItems.map((item) => (
                <TermsCard
                    icon={item.icon}
                    text={item.text}
                    key={item.id}
                />
            ));
        };

        return (
            <div className={cn(className, styles.wrapper)} id="terms">
                <Text title={t("personalOffer.Условия")} titleSize="h3" />
                <div className={styles.container}>
                    {renderFacilities(goodsItems, facilities)}
                    {renderPaidTravel(payedRideItems, paidTravel)}
                    {renderHousing(liveItems, housing)}
                    {renderFood(foodItems, nutrition)}
                    {renderExtraAvailiables(extraAvailiablesItems, extraFeatures)}
                </div>
            </div>
        );
    },
);
