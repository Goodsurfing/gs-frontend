import { memo } from "react";
import cn from "classnames";

import bg from "@/shared/assets/images/personalCardMOCK.png";

import { PersonalCard } from "@/entities/PersonalCard";

import styles from "./HostPersonalCard.module.scss";
import { HostPersonalCardCategory } from "../HostPersonalCardCategory/HostPersonalCardCategory";
import { HostPersonalCardImageBlock } from "../HostPersonalCardImageBlock/HostPersonalCardImageBlock";

interface HostPersonalCardProps {
    className?: string;
}

export const HostPersonalCard = memo((props: HostPersonalCardProps) => {
    const { className } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            <PersonalCard
                image={bg}
                title="Природный парк «Вулканы Камчатки» ждет волонтеров!"
                categories={<HostPersonalCardCategory />}
                imageBlock={<HostPersonalCardImageBlock />}
                // medals={}
                status=""
                rating={4.3}
            />
        </div>
    );
});
