import cn from "classnames";
import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import { Host } from "../../model/types/host";
import { Text } from "@/shared/ui/Text/Text";
import {
    facebookIcon,
    instaIcon,
    telegramIcon,
    vkIcon,
} from "@/shared/data/icons/socialIcons";
import styles from "./HostDescriptionCard.module.scss";

interface HostDescriptionCardProps {
    className?: string;
    host: Host;
}

export const HostDescriptionCard: FC<HostDescriptionCardProps> = memo(
    (props: HostDescriptionCardProps) => {
        const {
            className,
            host: {
                description, facebook, instagram, telegram, vk,
            },
        } = props;
        const { t } = useTranslation("host");
        return (
            <div id="1" className={cn(className, styles.wrapper)}>
                <Text title={t("personalHost.Об организации")} titleSize="h3" />
                <p className={styles.description}>{description || "Организатор не указал данную информацию"}</p>
                <div className={styles.socials}>
                    {vk !== "" && (
                        <a href={vk} target="_blank" rel="noreferrer" className={styles.social}>
                            <img src={vkIcon} alt={vkIcon} />
                            <p className={styles.socialLabel}>Вконтакте</p>
                        </a>
                    )}
                    {telegram !== "" && (
                        <a href={telegram} target="_blank" rel="noreferrer" className={styles.social}>
                            <img src={telegramIcon} alt={telegramIcon} />
                            <p className={styles.socialLabel}>Telegram</p>
                        </a>
                    )}
                    {facebook !== "" && (
                        <a href={facebook} target="_blank" rel="noreferrer" className={styles.social}>
                            <img src={facebookIcon} alt={facebookIcon} />
                            <p className={styles.socialLabel}>Facebook</p>
                        </a>
                    )}
                    {instagram !== "" && (
                        <a href={instagram} target="_blank" rel="noreferrer" className={styles.social}>
                            <img src={instaIcon} alt={instaIcon} />
                            <p className={styles.socialLabel}>Instagram</p>
                        </a>
                    )}
                </div>
            </div>
        );
    },
);
