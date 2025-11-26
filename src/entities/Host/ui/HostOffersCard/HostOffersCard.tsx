import cn from "classnames";
import React, {
    FC,
    memo,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";

import { OfferCard } from "@/widgets/OffersMap";

import { Locale } from "@/entities/Locale";
import { HostOffer, useLazyGetHostOffersByIdQuery } from "@/entities/Offer";

import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { Text } from "@/shared/ui/Text/Text";

import styles from "./HostOffersCard.module.scss";
import "./HostOffersCard.scss";

interface HostOffersCardProps {
    className?: string;
    hostId: string;
    locale: Locale;
}

const LIMIT = 10;

export const HostOffersCard: FC<HostOffersCardProps> = memo((props: HostOffersCardProps) => {
    const { className, hostId, locale } = props;
    const { t } = useTranslation("host");

    const [hostOffers, setHostOffers] = useState<HostOffer[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [getHostOffers] = useLazyGetHostOffersByIdQuery();

    const pageRef = useRef(1);

    const fetchHostOffers = useCallback(
        async (isInitial: boolean) => {
            setLoading(true);
            try {
                const currentPage = isInitial ? 1 : pageRef.current;
                const result = await getHostOffers({
                    organizationId: hostId,
                    limit: LIMIT,
                    page: currentPage,
                }).unwrap();

                const newOffers = result.data;
                const totalOffers = result.pagination.total;
                const isLastPage = totalOffers === 0 || currentPage * LIMIT >= totalOffers;

                if (isInitial) {
                    setHostOffers(newOffers);
                    pageRef.current = 2;
                } else {
                    setHostOffers((prev) => [...prev, ...newOffers]);
                    pageRef.current += 1;
                }

                setHasMore(!isLastPage);
            } catch (error) {
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        },
        [getHostOffers, hostId], // `page` не в зависимостях — используем ref
    );

    useEffect(() => {
        fetchHostOffers(true);
    }, [fetchHostOffers]);

    return (
        <div id="2" className={cn(className, styles.wrapper)}>
            <Text title={t("personalHost.Вакансии")} titleSize="h3" />
            <div className={styles.container}>
                {loading && <MiniLoader />}
                {!loading && hostOffers.length === 0 && (
                    <div>{t("personalHost.У организации пока нет вакансий")}</div>
                )}
            </div>

            <div className={styles.containerList} id="offers-scroll-container">
                <InfiniteScroll
                    dataLength={hostOffers.length}
                    next={() => fetchHostOffers(false)}
                    hasMore={hasMore}
                    loader={<MiniLoader className={styles.loader} />}
                    scrollThreshold="70%"
                    scrollableTarget="offers-scroll-container"
                    height={560}
                >
                    <div>
                        {hostOffers.map((offer) => {
                            const {
                                id, title, shortDescription, address, imagePath, categories,
                                acceptedApplicationsCount, averageRating, reviewsCount,
                            } = offer;
                            return (
                                <OfferCard
                                    key={offer.id}
                                    locale={locale}
                                    status={offer.status === "active" ? "opened" : "closed"}
                                    data={{
                                        id,
                                        title,
                                        shortDescription,
                                        address,
                                        imagePath,
                                        categories,
                                        acceptedApplicationsCount,
                                        averageRating,
                                        reviewsCount,
                                    }}
                                />
                            );
                        })}
                    </div>
                </InfiniteScroll>
            </div>
        </div>
    );
});
