import React, { FC } from "react";
import cn from "classnames";
import styles from "./ShareBlock.module.scss";
import {
    telegramIcon,
    vkIcon,
} from "@/shared/data/icons/socialIcons";

interface ShareBlockProps {
    className?: string
    label?: string
    url: string;
    textTitle: string;
}

export const ShareBlock: FC<ShareBlockProps> = (props: ShareBlockProps) => {
    const {
        className, label = "Поделиться", textTitle, url,
    } = props;
    const sharVkUrl = `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(textTitle)}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(textTitle)}`;

    const handleVkShare = () => {
        window.open(
            sharVkUrl,
            "Поделиться ВКонтакте",
            "width=600,height=400",
        );
    };

    return (
        <div className={cn(className, styles.wrapper)}>
            <span>{label}</span>
            <div className={styles.container}>
                <img src={vkIcon} alt="vkontakte" className={styles.icon} onClick={handleVkShare} />
                {/* <img
                    src={instaIcon}
                    alt="instagram"
                    className={styles.icon}
                /> */}
                <img
                    src={telegramIcon}
                    alt="telegram"
                    className={styles.icon}
                    onClick={() => window.open(telegramUrl, "_blank")}
                />
            </div>
        </div>
    );
};
