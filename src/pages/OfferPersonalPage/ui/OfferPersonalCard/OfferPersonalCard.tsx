import { memo } from "react";

import mockBackgroundImage from "@/shared/assets/images/personalCardMOCK.png";

import { PersonalCard } from "@/entities/PersonalCard";

import { OfferPersonalCardCategory } from "../OfferPersonalCardCategory/OfferPersonalCardCategory";
import { OfferPersonalCardImageBlock } from "../OfferPersonalCardImageBlock/OfferPersonalCardImageBlock";

interface OfferPersonalCardProps {
    onImagesClick: () => void;
    id: string
}

export const OfferPersonalCard = memo((props: OfferPersonalCardProps) => {
    const { onImagesClick, id } = props;
    return (
        <PersonalCard
            image={mockBackgroundImage}
            title="Природный парк «Вулканы Камчатки» ждет волонтеров!"
            location="Камчатка, Россия"
            rating={4.3}
            categories={<OfferPersonalCardCategory />}
            imageBlock={<OfferPersonalCardImageBlock onImagesClick={onImagesClick} />}
        />
    );
});
