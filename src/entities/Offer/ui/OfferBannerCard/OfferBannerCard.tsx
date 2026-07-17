import React from "react";
import { useTranslation } from "react-i18next";
import { BannerMarketingType, useGetBannerMarketingQuery } from "@/entities/Admin";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import styles from "./OfferBannerCard.module.scss";

export const OfferBannerCard = () => {
    const { t } = useTranslation();
    const { data } = useGetBannerMarketingQuery(
        { type: BannerMarketingType.VACANCY_PAGE },
    );

    if (!data) {
        return null;
    }

    const bannerImage = data.image?.contentUrl;

    return (
        <section
            className={styles.wrapper}
            style={bannerImage ? { backgroundImage: `url(${bannerImage})` } : undefined}
        >
            <div className={styles.content}>
                <p className={styles.description}>{data.description}</p>
                <ButtonLink
                    type="white-outlined"
                    path={data.url}
                    className={styles.linkButton}
                >
                    {t("Подробнее")}
                </ButtonLink>
            </div>
        </section>
    );
};
