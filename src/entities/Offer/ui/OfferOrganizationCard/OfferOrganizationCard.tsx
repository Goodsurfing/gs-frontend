import cn from "classnames";
import React, { FC, memo } from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";

import { OfferOrganization } from "@/entities/Offer";
import { getHostPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

import styles from "./OfferOrganizationCard.module.scss";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { useGetTypeOrganization } from "@/shared/hooks/useGetTypeOrganization";

interface OfferOrganizationCardProps {
    organization: OfferOrganization;
    className?: string;
}

export const OfferOrganizationCard: FC<OfferOrganizationCardProps> = memo(
    (props: OfferOrganizationCardProps) => {
        const { organization, className } = props;
        const { locale } = useLocale();
        const { t } = useTranslation("offer");
        const { getTranslate } = useGetTypeOrganization();

        return (
            <div className={cn(className, styles.wrapper)} id="organization">
                <h3 className={styles.title}>
                    {t("personalOffer.Организация")}
                </h3>
                <div className={styles.container}>
                    <div className={styles.fullInfoContainer}>
                        <div className={styles.nameContainer}>
                            <Avatar
                                className={styles.image}
                                icon={getMediaContent(organization.image?.contentUrl)}
                            />
                            {/* <img
                                className={styles.image}
                                src={organizationDefaultImage}
                                alt="organization"
                            /> */}
                            <span className={styles.name}>
                                {organization.name}
                            </span>
                        </div>
                        <p className={styles.description}>
                            {getTranslate(organization.type)}
                        </p>
                    </div>
                    <ButtonLink
                        className={styles.button}
                        type="outlined"
                        path={getHostPersonalPageUrl(locale, organization.id)}
                    >
                        {t("personalOffer.Подробнее")}
                    </ButtonLink>
                </div>
            </div>
        );
    },
);
