import cn from "classnames";
import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import { useConditionItems } from "@/features/OfferConditions/model/data/conditionItems";
import {
    ExtraAvailiablesItems,
    GoodsItems,
} from "@/features/OfferConditions/model/types/conditionsData";

import {
    ExtraFeatures,
    Facilities,
} from "@/entities/Offer/model/types/offerConditions";
import styles from "./OfferTermsCard.module.scss";
import { TermsCard } from "../FacilityCard/TermsCard";
import { Text } from "@/shared/ui/Text/Text";
import { FoodImageObject, HouseImageObject, TransferImageObject } from "@/shared/data/conditions";
import { getMediaContent } from "@/shared/lib/getMediaContent";

interface OfferTermsCardProps {
    facilities: Facilities[];
    housing: HouseImageObject[];
    paidTravel: TransferImageObject[];
    nutrition: FoodImageObject[];
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
            getTranslation, goodsItems, extraAvailiablesItems,
        } = useConditionItems();
        const { t } = useTranslation("offer");

        const renderHousing = (
            housingItems: HouseImageObject[],
        ) => housingItems.map((item) => (
            <TermsCard
                icon={getMediaContent(item.image.contentUrl) ?? ""}
                text={getTranslation(item.name) ?? ""}
                key={item.id}
            />
        ));

        const renderPaidTravel = (
            paidTravelItems: TransferImageObject[],
        ) => paidTravelItems.map((item) => (
            <TermsCard
                icon={getMediaContent(item.image.contentUrl) ?? ""}
                text={getTranslation(item.name) ?? ""}
                key={item.id}
            />
        ));

        const renderFood = (
            nutritionItems: FoodImageObject[],
        ) => nutritionItems.map((item) => (
            <TermsCard
                icon={getMediaContent(item.image.contentUrl) ?? ""}
                text={getTranslation(item.name) ?? ""}
                key={item.id}
            />
        ));

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
                    {renderPaidTravel(paidTravel)}
                    {renderHousing(housing)}
                    {renderFood(nutrition)}
                    {renderExtraAvailiables(extraAvailiablesItems, extraFeatures)}
                </div>
            </div>
        );
    },
);
