import { useVirtualizer } from "@tanstack/react-virtual";
import cn from "classnames";
import React, {
    FC,
    memo,
    useCallback,
    useEffect,
    useRef,
    useState,
    useTransition,
} from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";

import { OfferCard } from "@/widgets/OffersMap";

import { Locale } from "@/entities/Locale";
import { Offer, useLazyGetHostOffersByIdQuery } from "@/entities/Offer";

import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { Text } from "@/shared/ui/Text/Text";

import styles from "./HostOffersCard.module.scss";
import "./HostOffersCard.scss";

interface HostOffersCardProps {
    className?: string;
    hostId: string;
    locale: Locale;
}

const ITEMS_PER_PAGE = 10;

export const HostOffersCard: FC<HostOffersCardProps> = memo(
    (props: HostOffersCardProps) => {
        const { className, hostId, locale } = props;
        const { t } = useTranslation("host");
        const [isPending, startTransition] = useTransition();

        const [hostOffers, setHostOffers] = useState<Offer[]>([]);
        const [page, setPage] = useState(1);
        const [hasMore, setHasMore] = useState(true);
        const [getHostOffers] = useLazyGetHostOffersByIdQuery();

        const scrollContainerRef = useRef<HTMLDivElement>(null);

        const fetchHostOffers = useCallback(
            async (isInitial: boolean) => {
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
                } catch {
                    /* empty */
                }
            },
            [getHostOffers, hostId, page],
        );

        useEffect(() => {
            fetchHostOffers(true);
        }, [fetchHostOffers]);

        const rowVirtualizer = useVirtualizer({
            count: hostOffers.length,
            getScrollElement: () => scrollContainerRef.current,
            estimateSize: () => 190,
            overscan: 5,
        });

        const virtualItems = rowVirtualizer.getVirtualItems();

        return (
            <div id="2" className={cn(className, styles.wrapper)}>
                <Text title={t("personalHost.Вакансии")} titleSize="h3" />
                {(hostOffers.length <= 3) ? (
                    <div className={styles.container}>
                        {hostOffers.map((offer) => (
                            <OfferCard
                                locale={locale}
                                status={
                                    offer.status === "active"
                                        ? "opened"
                                        : "closed"
                                }
                                data={offer}
                            />
                        ))}
                    </div>
                ) : (
                    <div
                        className={styles.containerList}
                        ref={scrollContainerRef}
                        id="offers-scroll-container"
                    >
                        <InfiniteScroll
                            dataLength={hostOffers.length}
                            next={() => fetchHostOffers(false)}
                            hasMore={hasMore}
                            loader={
                                isPending ? (
                                    <MiniLoader className={styles.loader} />
                                ) : null
                            }
                            scrollThreshold="70%"
                            scrollableTarget="offers-scroll-container"
                        >
                            <div
                                style={{
                                    height: rowVirtualizer.getTotalSize(),
                                    position: "relative",
                                }}
                            >
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        transform: `translateY(${
                                            virtualItems[0]?.start ?? 0
                                        }px)`,
                                    }}
                                >
                                    {virtualItems.map(({ index }) => {
                                        const offer = hostOffers[index];
                                        return (
                                            <div
                                                key={index}
                                                ref={rowVirtualizer.measureElement}
                                                data-index={index}
                                            >
                                                <OfferCard
                                                    locale={locale}
                                                    status={
                                                        offer.status === "active"
                                                            ? "opened"
                                                            : "closed"
                                                    }
                                                    data={offer}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </InfiniteScroll>
                    </div>
                )}

            </div>
        );
    },
);
