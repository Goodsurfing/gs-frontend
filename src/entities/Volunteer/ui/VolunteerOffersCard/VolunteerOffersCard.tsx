import cn from "classnames";
import React, {
    FC, memo, useEffect,
    useState,
} from "react";

import InfiniteScroll from "react-infinite-scroll-component";
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

const ITEMS_PER_PAGE = 10;

export const VolunteerOffersCard: FC<VolunteerOffersCardProps> = memo(
    (props: VolunteerOffersCardProps) => {
        const { className, offers } = props;
        const { locale } = useLocale();
        const [getOfferById] = useLazyGetOfferByIdQuery();

        const [offersData, setOffersData] = useState<Offer[]>([]);
        const [loading, setLoading] = useState(false);
        const [page, setPage] = useState(1);
        const [hasMore, setHasMore] = useState(true);

        const fetchOffers = async (isInitial: boolean = false) => {
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

                if (isInitial) {
                    setOffersData(filtered);
                    setPage(2);
                } else {
                    setOffersData((prev) => [...prev, ...filtered]);
                    setPage((prev) => prev + 1);
                }
            } catch { /* empty */ } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchOffers(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [offers]);

        const loadMore = () => {
            if (!loading && hasMore) {
                fetchOffers(false);
            }
        };

        return (
            <div className={cn(className, styles.wrapper)}>
                <Text title="Вакансии" titleSize="h3" />

                {loading && <MiniLoader />}

                {!loading && offersData.length === 0 && (
                    <div>У организации пока нет вакансий</div>
                )}

                <div className={styles.container} id="offers-scroll-container">
                    <InfiniteScroll
                        dataLength={offersData.length}
                        next={loadMore}
                        hasMore={hasMore}
                        loader={null}
                        // scrollThreshold="70%"
                        scrollableTarget="offers-scroll-container"
                    >
                        {offersData.map((offer) => (
                            <OfferCard
                                key={offer.id}
                                locale={locale}
                                status={offer.status === "active" ? "opened" : "closed"}
                                data={offer}
                            />
                        ))}
                    </InfiniteScroll>
                </div>
            </div>
        );
    },
);
