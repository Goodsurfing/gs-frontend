import cn from "classnames";
import React, {
    FC, memo, useCallback, useEffect, useState,
    useTransition,
} from "react";

import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { Offer, useLazyGetHostOffersByIdQuery } from "@/entities/Offer";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";

import styles from "./HostOffersCard.module.scss";
import "./HostOffersCard.scss";
import { Text } from "@/shared/ui/Text/Text";
import { OfferCard } from "@/widgets/OffersMap";
import { Locale } from "@/entities/Locale";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

interface HostOffersCardProps {
    className?: string;
    hostId: string;
    locale: Locale;
}

const ITEMS_PER_PAGE = 15;

export const HostOffersCard: FC<HostOffersCardProps> = memo((props: HostOffersCardProps) => {
    const { className, hostId, locale } = props;
    const { t } = useTranslation("host");
    const [isPending, startTransition] = useTransition();

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

            startTransition(() => {
                if (isInitial) {
                    setHostOffers(result);
                    setPage(2);
                } else {
                    setHostOffers((prev) => [...prev, ...result]);
                    setPage((prevPage) => prevPage + 1);
                }
            });
        } catch { /* empty */ }
    }, [getHostOffers, hostId, page]);

    useEffect(() => {
        fetchHostOffers(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const Row = ({ index, style }: ListChildComponentProps) => {
        const offer = hostOffers[index];
        return (
            <div style={style}>
                <OfferCard
                    key={offer.id}
                    locale={locale}
                    status={offer.status === "active" ? "opened" : "closed"}
                    data={offer}
                />
            </div>
        );
    };

    return (
        <div id="2" className={cn(className, styles.wrapper)}>
            <Text title={t("personalHost.Вакансии")} titleSize="h3" />
            <div className={styles.container} id="offers-scroll-container">
                <InfiniteScroll
                    dataLength={hostOffers.length}
                    next={() => fetchHostOffers(false)}
                    hasMore={hasMore}
                    loader={isPending ? <MiniLoader className={styles.loader} /> : null}
                    scrollThreshold="70%"
                    scrollableTarget="offers-scroll-container"
                >
                    <List
                        height={hostOffers.length > 3 ? 560 : 200 * hostOffers.length}
                        itemCount={hostOffers.length}
                        itemSize={200}
                        width="100%"
                    >
                        {Row}
                    </List>
                </InfiniteScroll>
            </div>
        </div>
    );
});
