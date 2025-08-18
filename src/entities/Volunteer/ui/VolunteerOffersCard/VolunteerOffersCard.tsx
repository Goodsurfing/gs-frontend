import cn from "classnames";
import React, {
    FC, memo, useEffect,
    useState,
} from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
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
        const { t } = useTranslation("volunteer");

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

        const Row = ({ index, style }: ListChildComponentProps) => {
            const offer = offersData[index];
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
            <div className={cn(className, styles.wrapper)} id="2">
                <Text title={t("personalVolunteer.Вакансии")} titleSize="h3" />

                <div className={styles.container} id="offers-scroll-container">
                    {loading && <MiniLoader />}
                    {!loading && offersData.length === 0 && (
                        <div>
                            {t("personalVolunteer.У волонтера пока нет вакансий в которых он участвовал")}
                        </div>
                    )}
                    <InfiniteScroll
                        dataLength={offersData.length}
                        next={loadMore}
                        hasMore={hasMore}
                        loader={null}
                        scrollableTarget="offers-scroll-container"
                    >
                        <List
                            height={offersData.length > 3 ? 560 : 200 * offersData.length}
                            itemCount={offersData.length}
                            itemSize={200} 
                            width="100%"
                        >
                            {Row}
                        </List>
                    </InfiniteScroll>
                </div>
            </div>
        );
    },
);
