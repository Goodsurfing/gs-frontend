import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Host } from "@/entities/Host";

import Button from "@/shared/ui/Button/Button";

import { Avatar } from "@/shared/ui/Avatar/Avatar";
import styles from "./HostlHeaderCard.module.scss";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { Profile } from "@/entities/Profile";
import { getHostRegistrationUrl } from "@/shared/config/routes/AppUrls";
import { Locale } from "@/entities/Locale";

interface HostlHeaderCardProps {
    host: Host;
    profile: Profile;
    locale: Locale;
}

export const HostlHeaderCard: FC<HostlHeaderCardProps> = memo(
    (props: HostlHeaderCardProps) => {
        const {
            host: {
                name, type, address, avatar, owner,
            },
            profile,
            locale,
        } = props;
        const { t } = useTranslation("host");
        const showButton = owner.id === profile.id;
        const navigate = useNavigate();

        const navigateTo = () => {
            navigate(getHostRegistrationUrl(locale));
        };

        return (
            <div className={styles.wrapper}>
                <Avatar icon={getMediaContent(avatar)} size="DEFAULT" className={styles.image} alt="avatar" />
                <div className={styles.containerInfo}>
                    <span className={styles.type}>
                        {t("personalHost.Организация/")}
                        {type}
                    </span>
                    <h3 className={styles.name}>{name}</h3>
                    <span className={styles.address}>{address}</span>
                </div>
                <div className={styles.btnMedalsContainer}>
                    <span>MEDALS</span>
                    {showButton && (
                        <Button color="BLUE" size="SMALL" variant="FILL" className={styles.button} onClick={navigateTo}>
                            {t("personalHost.Редактировать профиль")}
                        </Button>
                    )}
                </div>
            </div>
        );
    },
);
