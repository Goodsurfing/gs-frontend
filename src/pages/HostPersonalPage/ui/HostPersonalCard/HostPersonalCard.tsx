import { memo } from "react";

import mockBackgroundImage from "@/shared/assets/images/personalCardMOCK.png";

import { PersonalCard } from "@/entities/PersonalCard";

import { HostPersonalCardCategory } from "../HostPersonalCardCategory/HostPersonalCardCategory";
import { HostPersonalCardImageBlock } from "../HostPersonalCardImageBlock/HostPersonalCardImageBlock";

interface HostPersonalCardProps {
    onImagesClick: () => void;
}

export const HostPersonalCard = memo((props: HostPersonalCardProps) => {
    const { onImagesClick } = props;
    return (
        <PersonalCard
            image={mockBackgroundImage}
            title="Природный парк «Вулканы Камчатки» ждет волонтеров!"
            location="Камчатка, Россия"
            rating={4.3}
            categories={<HostPersonalCardCategory />}
            imageBlock={<HostPersonalCardImageBlock onImagesClick={onImagesClick} />}
        />
    );
});
