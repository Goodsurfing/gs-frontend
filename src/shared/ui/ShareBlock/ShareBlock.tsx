import React, { FC } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./ShareBlock.module.scss";
import {
    instaIcon,
    telegramIcon,
    vkIcon,
} from "@/shared/data/icons/socialIcons";

interface ShareBlockProps {
    className?: string
    label?: string
    vk: string;
    instagram: string;
    telegram: string;
}

export const ShareBlock: FC<ShareBlockProps> = (props: ShareBlockProps) => {
    const {
        className, label = "Поделиться", vk, instagram, telegram,
    } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            <span>{label}</span>
            <div className={styles.container}>
                <Link to={vk}>
                    <img src={vkIcon} alt="vkontakte" className={styles.icon} />
                </Link>
                <Link to={instagram}>
                    <img
                        src={instaIcon}
                        alt="instagram"
                        className={styles.icon}
                    />
                </Link>
                <Link to={telegram}>
                    <img
                        src={telegramIcon}
                        alt="telegram"
                        className={styles.icon}
                    />
                </Link>
            </div>
        </div>
    );
};
