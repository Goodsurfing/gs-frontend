import React, { FC, memo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Host } from "@/entities/Host";
import { Locale } from "@/entities/Locale";

import { getHostRegistrationUrl } from "@/shared/config/routes/AppUrls";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import Button from "@/shared/ui/Button/Button";

import styles from "./HostlHeaderCard.module.scss";
import { useGetTypeOrganization } from "@/shared/hooks/useGetTypeOrganization";

interface HostlHeaderCardProps {
    host: Host;
    locale: Locale;
    isEdit: boolean;
}

export const HostlHeaderCard: FC<HostlHeaderCardProps> = memo(
    (props: HostlHeaderCardProps) => {
        const {
            host: {
                name, type, address, avatar,
            },
            locale,
            isEdit,
        } = props;
        const { t } = useTranslation("host");
        const navigate = useNavigate();
        const { getTranslate } = useGetTypeOrganization();

        const navigateTo = () => {
            navigate(getHostRegistrationUrl(locale));
        };

        return (
            <div className={styles.wrapper}>
                <Avatar
                    icon={getMediaContent(avatar)}
                    size="DEFAULT"
                    className={styles.image}
                    alt="avatar"
                />
                <div className={styles.containerInfo}>
                    <span className={styles.type}>
                        {t("personalHost.Организация/")}
                        {getTranslate(type)}
                    </span>
                    <h3 className={styles.name}>{name}</h3>
                    <span className={styles.address}>{address}</span>
                </div>
                <div className={styles.btnMedalsContainer}>
                    {isEdit && (
                        <Button
                            color="BLUE"
                            size="SMALL"
                            variant="FILL"
                            className={styles.button}
                            onClick={navigateTo}
                        >
                            {t("personalHost.Редактировать профиль")}
                        </Button>
                    )}
                </div>
            </div>
        );
    },
);
