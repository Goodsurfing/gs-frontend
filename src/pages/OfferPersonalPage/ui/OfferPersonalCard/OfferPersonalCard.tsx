import { memo, useEffect, useState } from "react";

import mockBackgroundImage from "@/shared/assets/images/personalCardMOCK.png";

import { PersonalCard } from "@/entities/PersonalCard";

import { OfferPersonalCardCategory } from "../OfferPersonalCardCategory/OfferPersonalCardCategory";
import { OfferPersonalCardImageBlock } from "../OfferPersonalCardImageBlock/OfferPersonalCardImageBlock";
import { Offer, useGetOfferByIdQuery } from "@/entities/Offer";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { getMediaContent } from "@/shared/lib/getMediaContent";

interface OfferPersonalCardProps {
    onImagesClick: () => void;
    id: string
}

export const OfferPersonalCard = memo((props: OfferPersonalCardProps) => {
    const { onImagesClick, id } = props;
    const { data, isLoading } = useGetOfferByIdQuery(id);

    if (isLoading) {
        return (
            <Preloader />
        );
    }

    return (
        <PersonalCard
            image={getMediaContent(data?.description?.image)}
            title={data?.description?.title}
            location={data?.where?.address}
            rating={4.3}
            categories={<OfferPersonalCardCategory />}
            imageBlock={<OfferPersonalCardImageBlock onImagesClick={onImagesClick} />}
        />
    );
});
