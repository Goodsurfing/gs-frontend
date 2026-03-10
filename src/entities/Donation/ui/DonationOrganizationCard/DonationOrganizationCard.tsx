import cn from "classnames";
import React, { FC, memo } from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getHostPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

import { getMediaContent } from "@/shared/lib/getMediaContent";
import { Image } from "@/types/media";
import styles from "./DonationOrganizationCard.module.scss";

interface DonationOrganization {
    id: string;
    name: string;
    image: Image | null;
    description: string;
}

interface DonationOrganizationCardProps {
    data: DonationOrganization;
    className?: string;
}

export const DonationOrganizationCard: FC<DonationOrganizationCardProps> = memo(
    (props: DonationOrganizationCardProps) => {
        const { data, className } = props;
        const {
            id, name, image, description,
        } = data;
        const { locale } = useLocale();
        const { t } = useTranslation("donation");

        return (
            <div className={cn(className, styles.wrapper)} id="organization">
                <h3 className={styles.title}>
                    {t("donationPersonal.Организация")}
                </h3>
                <div className={styles.container}>
                    <div className={styles.fullInfoContainer}>
                        <div className={styles.nameContainer}>
                            <Avatar
                                className={styles.image}
                                icon={getMediaContent(image?.contentUrl)}
                            />
                            <span className={styles.name}>
                                {name}
                            </span>
                        </div>
                        <p className={styles.description}>
                            {description}
                        </p>
                    </div>
                    <ButtonLink
                        className={styles.button}
                        type="outlined"
                        path={getHostPersonalPageUrl(locale, id)}
                    >
                        {t("donationPersonal.Подробнее")}
                    </ButtonLink>
                </div>
            </div>
        );
    },
);
