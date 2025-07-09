import cn from "classnames";
import React, {
    FC, memo, useCallback, useEffect, useState,
} from "react";

import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { Offer, useLazyGetHostOffersByIdQuery } from "@/entities/Offer";

import styles from "./HostOffersCard.module.scss";
import { Text } from "@/shared/ui/Text/Text";
import { OfferCard } from "@/widgets/OffersMap";
import { Locale } from "@/entities/Locale";

interface HostOffersCardProps {
    className?: string;
    hostId: string;
    locale: Locale;
}

const ITEMS_PER_PAGE = 10;

export const HostOffersCard: FC<HostOffersCardProps> = memo((props: HostOffersCardProps) => {
    const { className, hostId, locale } = props;
    const { t } = useTranslation("host");

    const [hostOffers, setHostOffers] = useState<Offer[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [getHostOffers] = useLazyGetHostOffersByIdQuery();

    const fetchHostOffers = useCallback(async (isInitial: boolean) => {
        try {
            const currentPage = isInitial ? 1 : page;
            const result = await getHostOffers({
                organizationId: hostId,
                itemsPerPage: ITEMS_PER_PAGE,
                page: currentPage,
            }).unwrap();

            if (result.length < ITEMS_PER_PAGE) {
                setHasMore(false);
            }

            if (isInitial) {
                setHostOffers(result);
                setPage(2);
            } else {
                setHostOffers((prev) => [...prev, ...result]);
                setPage((prevPage) => prevPage + 1);
            }
        } catch { /* empty */ }
    }, [getHostOffers, hostId, page]);

    useEffect(() => {
        fetchHostOffers(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderOfferCards = (offersItems: Offer[]) => offersItems.map((offer) => (
        <OfferCard
            key={offer.id}
            locale={locale}
            status={offer.status === "active" ? "opened" : "closed"}
            data={offer}
        />
    ));

    return (
        <div id="2" className={cn(className, styles.wrapper)}>
            <Text title={t("personalHost.Вакансии")} titleSize="h3" />
            <div className={styles.container} id="offers-scroll-container">
                <InfiniteScroll
                    dataLength={hostOffers.length}
                    next={() => fetchHostOffers(false)}
                    hasMore={hasMore}
                    loader={null}
                    scrollThreshold="70%"
                    scrollableTarget="offers-scroll-container"
                >
                    {renderOfferCards(hostOffers)}
                </InfiniteScroll>
            </div>
        </div>
    );
});
