import React, { FC, memo } from "react";

import { useNavigate } from "react-router-dom";
import telegramIcon from "@/shared/assets/icons/social-icons/telegram-mini-logo.svg";
import vkIcon from "@/shared/assets/icons/social-icons/vk-mini-logo.svg";
import IconComponent from "@/shared/ui/IconComponent/IconComponent";

import styles from "./TeamItem.module.scss";
import { getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { Locale } from "@/entities/Locale";

interface TeamItemProps {
    id?: string | null;
    image?: string;
    name: string;
    description: string;
    address?: string;
    vk?: string;
    telegram?: string;
    locale: Locale;
}

export const TeamItem: FC<TeamItemProps> = memo((props: TeamItemProps) => {
    const {
        id, image, description, name, address, telegram, vk, locale,
    } = props;
    const navigate = useNavigate();

    const onNavigate = () => {
        if (id) {
            navigate(getVolunteerPersonalPageUrl(locale, id));
        }
    };

    return (
        <div
            className={styles.wrapper}
            style={{ cursor: id ? "pointer" : "default" }}
            onClick={onNavigate}
        >
            {image ? <img src={image} alt="" className={styles.image} />
                : <div className={styles.emptyImage} />}
            <div className={styles.info}>
                <span className={styles.name}>{name}</span>
                <span className={styles.description}>{description}</span>
                {address && <span className={styles.address}>{address}</span>}
                <div className={styles.icons}>
                    {vk && (
                        <a href={vk} target="_blank" rel="noreferrer">
                            <IconComponent
                                icon={vkIcon}
                                alt="vkontakte"
                                className={styles.vk}
                            />
                        </a>
                    )}
                    {telegram && (
                        <a href={telegram} target="_blank" rel="noreferrer">
                            <IconComponent
                                icon={telegramIcon}
                                alt="telegram"
                                className={styles.telegram}
                            />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
});
