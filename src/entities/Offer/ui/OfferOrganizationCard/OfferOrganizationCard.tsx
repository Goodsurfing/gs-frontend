import React, { FC, memo } from "react";
import cn from "classnames";

import { useTranslation } from "react-i18next";
import organizationDefaultImage from "@/shared/assets/images/offers/organizationSmallMOCK.png";

import styles from "./OfferOrganizationCard.module.scss";
import { OfferOrganization } from "@/entities/Offer";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getHostPersonalPageUrl } from "@/shared/config/routes/AppUrls";

interface OfferOrganizationCardProps {
    organization: OfferOrganization;
    className?: string;
}

export const OfferOrganizationCard: FC<OfferOrganizationCardProps> = memo(
    (props: OfferOrganizationCardProps) => {
        const {
            organization,
            className,
        } = props;
        const { locale } = useLocale();
        const { t } = useTranslation("offer");
        return (
            <div className={cn(className, styles.wrapper)}>
                <h3 className={styles.title}>{t("personalOffer.Организация")}</h3>
                <div className={styles.container}>
                    <div className={styles.fullInfoContainer}>
                        <div className={styles.nameContainer}>
                            <img
                                className={styles.image}
                                src={organizationDefaultImage}
                                alt="organization"
                            />
                            <span className={styles.name}>{organization.name}</span>
                        </div>
                        <p className={styles.description}>{organization.type}</p>
                    </div>
                    <ButtonLink className={styles.button} type="outlined" path={getHostPersonalPageUrl(locale, organization.id)}>
                        {t("personalOffer.Подробнее")}
                    </ButtonLink>
                </div>
            </div>
        );
    },
);
