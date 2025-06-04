import cn from "classnames";
import React, {
    FC, memo, useEffect, useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { OfferCard } from "@/widgets/OffersMap";

import { Offer, useLazyGetOffersQuery } from "@/entities/Offer";
import { getUserAuthData } from "@/entities/User";

import {
    getProfilePreferencesPageUrl,
} from "@/shared/config/routes/AppUrls";
import { useAppSelector } from "@/shared/hooks/redux";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

import styles from "./OffersRecomendationsWidget.module.scss";
import { useGetProfileInfoQuery } from "@/entities/Profile";

interface OffersRecomendationsWidgetProps {
    className?: string;
}

export const OffersRecomendationsWidget: FC<OffersRecomendationsWidgetProps> = memo(
    (props: OffersRecomendationsWidgetProps) => {
        const { className } = props;
        const isAuth = useAppSelector(getUserAuthData);
        const { locale } = useLocale();
        const { t } = useTranslation("volunteer");
        const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);

        const { data: myProfileData, isLoading: isProfileLoading } = useGetProfileInfoQuery();
        const [getOffers, { isLoading: isOffersLoading }] = useLazyGetOffersQuery();

        useEffect(() => {
            const fetchOffers = async () => {
                try {
                    if (myProfileData && myProfileData.favoriteCategories.length > 0) {
                        const resultOffers = await getOffers(
                            { categories: myProfileData.favoriteCategories },
                        ).unwrap();
                        setFilteredOffers(resultOffers.slice(0, 10));
                    }
                } catch {
                    setFilteredOffers([]);
                }
            };
            fetchOffers();
        }, [getOffers, myProfileData]);

        const renderOffers = () => {
            if (isProfileLoading || isOffersLoading) {
                return <MiniLoader />;
            }

            if (filteredOffers.length > 0) {
                return filteredOffers.map((offer) => (
                    <OfferCard
                        locale={locale}
                        status={offer.status === "active" ? "opened" : "closed"}
                        data={offer}
                        key={offer.id}
                        isFavoriteIconShow={!!isAuth}
                    />
                ));
            }
            return null;
        };

        return (
            <div className={cn(className, styles.wrapper)}>
                <div className={styles.top}>
                    <h3>
                        {t(
                            "volunteer-dashboard.Возможности, которые вам понравятся",
                        )}
                    </h3>
                    <Link
                        to={getProfilePreferencesPageUrl(locale)}
                        className={styles.settings}
                    >
                        {t("volunteer-dashboard.Настроить")}
                    </Link>
                </div>
                <div className={styles.container}>{renderOffers()}</div>
            </div>
        );
    },
);
