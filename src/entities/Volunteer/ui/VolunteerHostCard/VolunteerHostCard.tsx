import cn from "classnames";
import React, { FC, memo } from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";

import { Host } from "@/entities/Host";

import organizationDefaultImage from "@/shared/assets/images/offers/organizationSmallMOCK.png";
import { getHostPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

import styles from "./VolunteerHostCard.module.scss";

interface VolunteerHostCardProps {
    host: Host;
    className?: string;
}

export const VolunteerHostCard: FC<VolunteerHostCardProps> = memo(
    (props: VolunteerHostCardProps) => {
        const { host, className } = props;
        const { locale } = useLocale();
        const { t } = useTranslation("offer");
        return (
            <div className={cn(className, styles.wrapper)} id="organization">
                <h3 className={styles.title}>
                    {t("personalOffer.Организация")}
                </h3>
                <div className={styles.container}>
                    <div className={styles.fullInfoContainer}>
                        <div className={styles.nameContainer}>
                            <img
                                className={styles.image}
                                src={organizationDefaultImage}
                                alt="organization"
                            />
                            <span className={styles.name}>
                                {host.name}
                            </span>
                        </div>
                        <p className={styles.description}>
                            {host.type}
                        </p>
                    </div>
                    <ButtonLink
                        className={styles.button}
                        type="outlined"
                        path={getHostPersonalPageUrl(locale, host.id)}
                    >
                        {t("personalOffer.Подробнее")}
                    </ButtonLink>
                </div>
            </div>
        );
    },
);
