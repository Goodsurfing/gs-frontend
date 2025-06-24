import cn from "classnames";
import React, {
    FC, memo, useCallback, useEffect, useRef, useState,
} from "react";

import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { Offer, useLazyGetHostOffersByIdQuery } from "@/entities/Offer";

import styles from "./HostOffersCard.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { Text } from "@/shared/ui/Text/Text";
import { OfferCard } from "@/widgets/OffersMap";

interface HostOffersCardProps {
    className?: string;
    hostId: string;
}

const ITEMS_PER_PAGE = 4;

export const HostOffersCard: FC<HostOffersCardProps> = memo((props: HostOffersCardProps) => {
    const { className, hostId } = props;
    const { t } = useTranslation("host");
    const { locale } = useLocale();

    const loadedPagesRef = useRef<Set<number>>(new Set());
    const [hostOffers, setHostOffers] = useState<Offer[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [getHostOffers] = useLazyGetHostOffersByIdQuery();

    const fetchHostOffers = useCallback(async () => {
        if (loadedPagesRef.current.has(page)) return;

        const result = await getHostOffers({
            organizationId: hostId,
            itemsPerPage: ITEMS_PER_PAGE,
            page,
        }).unwrap();

        if (result.length < ITEMS_PER_PAGE) {
            setHasMore(false);
        }

        loadedPagesRef.current.add(page);
        setHostOffers((prev) => {
            const merged = [...prev, ...result];
            const unique = Array.from(new Map(merged.map((o) => [o.id, o])).values());
            return unique;
        });
    }, [getHostOffers, hostId, page]);

    useEffect(() => {
        fetchHostOffers();
    }, [fetchHostOffers, page]);

    const fetchMoreHostOffers = () => {
        setPage((prevPage) => prevPage + 1);
    };

    return (
        <div id="2" className={cn(className, styles.wrapper)}>
            <Text title={t("personalHost.Вакансии")} titleSize="h3" />
            <InfiniteScroll
                className={styles.container}
                dataLength={hostOffers.length}
                next={fetchMoreHostOffers}
                hasMore={hasMore}
                loader={<Text text="Загрузка..." />}
                scrollThreshold={0.6}
            >
                {hostOffers.map((offer) => (
                    <OfferCard
                        key={offer.id}
                        locale={locale}
                        status={offer.status === "active" ? "opened" : "closed"}
                        data={offer}
                    />
                ))}
            </InfiniteScroll>
        </div>
    );
});
