import cn from "classnames";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import maxIcon from "@/shared/assets/icons/social-brand/max.png";
import tgIcon from "@/shared/assets/icons/social-brand/telegram.png";
import vkIcon from "@/shared/assets/icons/social-brand/vk.png";

import styles from "./SocialLinks.module.scss";

/**
 * GS-187: ссылки на соцсети Гудсёрфинга в меню шапки — в выпадающем
 * «Сообществе» на компьютере и внизу бургер-меню на телефоне. Иконки — как в
 * рассылках (присланы в задаче): Telegram и ВК круглые, MAX — скруглённый
 * квадрат.
 */
export const SOCIAL_LINKS = [
    {
        name: "Telegram", href: "https://t.me/goodsurfing", icon: tgIcon, shape: "circle",
    },
    {
        name: "MAX", href: "https://max.ru/goodsurfing", icon: maxIcon, shape: "square",
    },
    {
        name: "VK", href: "https://vk.com/goodsurfing", icon: vkIcon, shape: "circle",
    },
] as const;

interface SocialLinksProps {
    className?: string;
}

export const SocialLinks: FC<SocialLinksProps> = ({ className }) => {
    const { t } = useTranslation();
    const caption = t("main.welcome.header.socials");

    return (
        <div className={cn(styles.socials, className)}>
            <span className={styles.caption}>{caption}</span>
            <ul className={styles.links} aria-label={caption}>
                {SOCIAL_LINKS.map(({
                    name, href, icon, shape,
                }) => (
                    <li key={name}>
                        <a
                            className={cn(styles.link, styles[shape])}
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={name}
                            title={name}
                        >
                            <img src={icon} alt="" aria-hidden="true" width="32" height="32" />
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};
