import cn from "classnames";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import maxIcon from "@/shared/assets/icons/social-brand/max.svg";
import tgIcon from "@/shared/assets/icons/social-brand/telegram.svg";
import vkIcon from "@/shared/assets/icons/social-brand/vk.svg";

import styles from "./SocialRibbon.module.scss";

/**
 * GS-187: заметная плашка на главной со ссылками на соцсети Гудсёрфинга —
 * как «Подписывайтесь на наш телеграм-канал» на старом сайте, но со всеми
 * тремя каналами. Иконки — как в рассылках.
 */
export const SOCIAL_LINKS = [
    { name: "Telegram", href: "https://t.me/goodsurfing", icon: tgIcon },
    { name: "MAX", href: "https://max.ru/goodsurfing", icon: maxIcon },
    { name: "VK", href: "https://vk.com/goodsurfing", icon: vkIcon },
] as const;

interface SocialRibbonProps {
    className?: string;
}

export const SocialRibbon: FC<SocialRibbonProps> = ({ className }) => {
    const { t } = useTranslation("main");

    return (
        <aside className={cn(styles.ribbon, className)} aria-label={t("Подписывайтесь на наши соцсети")}>
            <span className={styles.text}>{t("Подписывайтесь на наши соцсети")}</span>
            <ul className={styles.links}>
                {SOCIAL_LINKS.map(({ name, href, icon }) => (
                    <li key={name}>
                        <a
                            className={styles.link}
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={name}
                            title={name}
                        >
                            <img src={icon} alt="" aria-hidden="true" width="24" height="24" />
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    );
};
