import cn from "classnames";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import maxIcon from "@/shared/assets/icons/social-brand/max.png";
import tgIcon from "@/shared/assets/icons/social-brand/telegram.png";
import vkIcon from "@/shared/assets/icons/social-brand/vk.png";

import styles from "./SocialLinks.module.scss";

/**
 * GS-187: заметная плашка со ссылками на соцсети Гудсёрфинга в самом верху
 * главной, над шапкой (как «Подписывайтесь на наш телеграм-канал» на старом
 * сайте). Не закреплена: уезжает при прокрутке. Иконки — как в рассылках
 * (присланы в задаче): Telegram и ВК круглые, MAX — скруглённый квадрат.
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
    const caption = t("main.welcome.header.socials-cta");

    return (
        <aside className={cn(styles.ribbon, className)} aria-label={caption}>
            <span className={styles.caption}>{caption}</span>
            <ul className={styles.links}>
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
                            <img src={icon} alt="" aria-hidden="true" width="28" height="28" />
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    );
};
