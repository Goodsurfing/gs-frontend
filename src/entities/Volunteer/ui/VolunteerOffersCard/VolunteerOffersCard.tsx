import { useVirtualizer } from "@tanstack/react-virtual";
import cn from "classnames";
import React, {
    FC, memo, useCallback, useEffect,
    useRef,
    useState,
    useTransition,
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTranslation } from "react-i18next";
import { Offer, useLazyGetOfferByIdQuery } from "@/entities/Offer";

import styles from "./VolunteerOffersCard.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { OfferCard } from "@/widgets/OffersMap";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { Text } from "@/shared/ui/Text/Text";

interface VolunteerOffersCardProps {
    className?: string;
    offers: string[];
}

const ITEMS_PER_PAGE = 15;

export const VolunteerOffersCard: FC<VolunteerOffersCardProps> = memo(
    (props: VolunteerOffersCardProps) => {
        const { className, offers } = props;
        const { locale } = useLocale();
        const [getOfferById] = useLazyGetOfferByIdQuery();
        const { t } = useTranslation("profile");
        const [isPending, startTransition] = useTransition();

        const [offersData, setOffersData] = useState<Offer[]>([]);
        const [loading, setLoading] = useState(false);
        const [page, setPage] = useState(1);
        const [hasMore, setHasMore] = useState(true);

        const scrollContainerRef = useRef<HTMLDivElement>(null);

        const fetchOffers = useCallback(async (isInitial: boolean = false) => {
            if (!offers || offers.length === 0) return;

            setLoading(true);
            try {
                const currentPage = isInitial ? 1 : page;
                const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                const endIndex = startIndex + ITEMS_PER_PAGE;

                const currentOffers = offers.slice(startIndex, endIndex);

                const newHasMore = endIndex < offers.length;
                setHasMore(newHasMore);

                if (currentOffers.length === 0) {
                    return;
                }

                const ids = currentOffers.map((url) => {
                    const parts = url.split("/");
                    return parts.pop();
                });

                const promises = ids.map((id) => {
                    if (!id) return null;
                    return getOfferById(id).unwrap().catch(() => null);
                });

                const results = await Promise.all(promises);
                const filtered = results.filter((offer): offer is Offer => offer !== null);

                startTransition(() => {
                    if (isInitial) {
                        setOffersData(filtered);
                        setPage(2);
                    } else {
                        setOffersData((prev) => [...prev, ...filtered]);
                        setPage((prev) => prev + 1);
                    }
                });
            } catch { /* empty */ } finally {
                setLoading(false);
            }
        }, [getOfferById, offers, page]);

        useEffect(() => {
            fetchOffers(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [fetchOffers]);

        const loadMore = () => {
            if (!loading && hasMore) {
                fetchOffers(false);
            }
        };

        const rowVirtualizer = useVirtualizer({
            count: offersData.length,
            getScrollElement: () => scrollContainerRef.current,
            estimateSize: () => 190,
            overscan: 5,
        });

        const virtualItems = rowVirtualizer.getVirtualItems();

        return (
            <div className={cn(className, styles.wrapper)} id="2">
                <Text title={t("personal.Вакансии")} titleSize="h3" />

                <div className={styles.container} id="offers-scroll-container">
                    {loading && <MiniLoader />}
                    {(!loading && offersData.length === 0) && (
                        <div>
                            {t("personal.У волонтера пока нет вакансий в которых он участвовал")}
                        </div>
                    )}
                    <div
                        className={styles.containerList}
                        ref={scrollContainerRef}
                        id="offers-scroll-container"
                    >
                        {(offersData.length <= 3 ? (
                            <div className={styles.container}>
                                {offersData.map((offer) => (
                                    <OfferCard
                                        key={offer.id}
                                        locale={locale}
                                        status={offer.status === "active" ? "opened" : "closed"}
                                        data={offer}
                                    />
                                ))}
                            </div>
                        ) : (
                            <InfiniteScroll
                                dataLength={offersData.length}
                                next={loadMore}
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
                                            const offer = offersData[index];
                                            return (
                                                <div
                                                    key={index}
                                                    ref={rowVirtualizer.measureElement}
                                                    data-index={index}
                                                >
                                                    <OfferCard
                                                        locale={locale}
                                                        status={offer.status === "active" ? "opened" : "closed"}
                                                        data={offer}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </InfiniteScroll>
                        ))}

                    </div>
                </div>
            </div>
        );
    },
);
