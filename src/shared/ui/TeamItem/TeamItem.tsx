import React, { FC, memo } from "react";

import telegramIcon from "@/shared/assets/icons/social-icons/telegram-mini-logo.svg";
import vkIcon from "@/shared/assets/icons/social-icons/vk-mini-logo.svg";
import IconComponent from "@/shared/ui/IconComponent/IconComponent";

import styles from "./TeamItem.module.scss";

interface TeamItemProps {
    image: string;
    name: string;
    description: string;
    address?: string;
    vk?: string;
    telegram?: string;
}

export const TeamItem: FC<TeamItemProps> = memo((props: TeamItemProps) => {
    const {
        image, description, name, address, telegram, vk,
    } = props;
    return (
        <div className={styles.wrapper}>
            <img src={image} alt="" className={styles.image} />
            <div className={styles.info}>
                <span className={styles.name}>{name}</span>
                <span className={styles.description}>{description}</span>
                {address && <span className={styles.address}>{address}</span>}
                {(vk && telegram) && (
                    <div className={styles.icons}>
                        <IconComponent
                            icon={vkIcon}
                            alt="vkontakte"
                            className={styles.vk}
                        />
                        <IconComponent
                            icon={telegramIcon}
                            alt="telegram"
                            className={styles.telegram}
                        />
                    </div>
                )}
            </div>
        </div>
    );
});
