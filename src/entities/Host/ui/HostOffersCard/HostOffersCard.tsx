import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { useGetHostOffersByIdQuery } from "@/entities/Offer";

import styles from "./HostOffersCard.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { Text } from "@/shared/ui/Text/Text";
import { useAppSelector } from "@/shared/hooks/redux";
import { getUserAuthData } from "@/entities/User";
import { OfferCard } from "@/widgets/OffersMap";

interface HostOffersCardProps {
    className?: string;
    hostId: string;
}

export const HostOffersCard: FC<HostOffersCardProps> = memo(
    (props: HostOffersCardProps) => {
        const { className, hostId } = props;
        const { t } = useTranslation("host");
        const isAuth = useAppSelector(getUserAuthData);
        const { data: hostOffers, isError } = useGetHostOffersByIdQuery(hostId);
        const { locale } = useLocale();

        const renderOffers = useMemo(
            () => {
                if (!hostOffers) return null;

                return hostOffers
                    .slice(0, 3)
                    .map((offer) => (
                        <OfferCard
                            locale={locale}
                            status={offer.status === "active" ? "opened" : "closed"}
                            data={offer}
                            key={offer.id}
                            isFavoriteIconShow={!!isAuth}
                        />

                    ));
            },
            [hostOffers, isAuth, locale],
        );

        if ((hostOffers?.length === 0) || isError) {
            return null;
        }

        return (
            <div id="2" className={cn(className, styles.wrapper)}>
                <Text title={t("personalHost.Вакансии")} titleSize="h3" />
                <div className={styles.container}>
                    {renderOffers}
                </div>
            </div>
        );
    },
);
