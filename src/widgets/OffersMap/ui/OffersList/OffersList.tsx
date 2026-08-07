import cn from "classnames";
import React, {
    FC, useCallback, useMemo, useTransition,
} from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";

import { OfferApi } from "@/entities/Offer";
import { getOfferImagePath } from "./getOfferImagePath";

import Button from "@/shared/ui/Button/Button";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { Text } from "@/shared/ui/Text/Text";

import { HeaderList } from "../HeaderList/HeaderList";
import { OfferCard } from "../OfferCard/OfferCard";
import { OfferPagination } from "../OfferPagination/OfferPagination";
import styles from "./OffersList.module.scss";

interface OffersListProps {
    className?: string;
    mapOpenValue: boolean;
    onChangeMapOpen: () => void;
    data?: OfferApi[];
    isLoading: boolean;
    isError?: boolean;
    onRetry?: () => void;
    currentPage: number;
    offersPerPage: number;
    total: number;
    onChangePage: (pageItem: number) => void;
    selectedOfferId?: number;
    onSelectOffer?: (offerId: number) => void;
    offerIdsWithoutLocation?: Set<number>;
}

export const OffersList: FC<OffersListProps> = (props: OffersListProps) => {
    const {
        mapOpenValue,
        onChangeMapOpen,
        data,
        className,
        currentPage,
        offersPerPage,
        total,
        onChangePage,
        isLoading,
        isError,
        onRetry,
        selectedOfferId,
        onSelectOffer,
        offerIdsWithoutLocation,
    } = props;

    const { locale } = useLocale();
    const { t } = useTranslation("offers-map");
    const [isPending, startTransition] = useTransition();

    const changeMapOpen = useCallback(() => {
        onChangeMapOpen();
    }, [onChangeMapOpen]);

    const changeCurrentPage = useCallback(
        (page: number) => {
            startTransition(() => {
                onChangePage(page);
            });
        },
        [onChangePage],
    );

    const renderOfferCards = useMemo(() => {
        // Отдельно от "вакансий не найдены": иначе реальный сбой запроса
        // (500, обрыв сети) выглядит для человека так же, как "по вашим
        // фильтрам ничего нет" — он решает, что раздела просто нет, а не
        // пробует обновить страницу.
        if (isError) {
            return (
                <div className={styles.error}>
                    <Text
                        textSize="primary"
                        text={t("Не удалось загрузить вакансии")}
                    />
                    <Text
                        textSize="secondary"
                        text={t("Проверьте соединение и попробуйте ещё раз")}
                    />
                    {onRetry && (
                        <Button
                            className={styles.retryButton}
                            color="BLUE"
                            size="MEDIUM"
                            variant="OUTLINE"
                            onClick={onRetry}
                        >
                            {t("Попробовать снова")}
                        </Button>
                    )}
                </div>
            );
        }
        if (isLoading || isPending) {
            return <MiniLoader className={styles.miniLoader} />;
        }
        if (data) {
            if (data.length === 0) {
                return (
                    <Text
                        className={styles.error}
                        textSize="primary"
                        text={t("Вакансии не были найдены")}
                    />
                );
            }
            return data.map((offer) => (
                <OfferCard
                    locale={locale}
                    classNameCard={styles.offerCard}
                    className={cn(styles.offer, {
                        [styles.closed]: !mapOpenValue,
                    })}
                    status={offer.status === "active" ? "opened" : "closed"}
                    data={{
                        id: offer.id,
                        title: offer.title,
                        shortDescription: offer.shortDescription,
                        imagePath: getOfferImagePath(offer.image),
                        categories: offer.categories.map((cat) => cat.name),
                        address: offer.address,
                        acceptedApplicationsCount: offer.acceptedApplicationsCount,
                        averageRating: offer.averageRating,
                        reviewsCount: offer.reviewsCount,
                    }}
                    key={offer.id}
                    isSelected={offer.id === selectedOfferId}
                    onSelect={onSelectOffer}
                    hasLocation={!offerIdsWithoutLocation?.has(offer.id)}
                    // isFavoriteIconShow={!!isAuth}
                />
            ));
        }
        return (
            <Text
                className={styles.error}
                textSize="primary"
                text={t("Вакансии не были найдены")}
            />
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        data, isLoading, isError, onRetry, locale, mapOpenValue, t, selectedOfferId,
        onSelectOffer, offerIdsWithoutLocation,
    ]);

    const totalPages = Math.ceil(total / offersPerPage);

    return (
        <div className={cn(styles.wrapper, className)}>
            <HeaderList
                offersLength={total}
                isShowMap={mapOpenValue}
                onChangeShowMap={changeMapOpen}
            />

            <div
                className={cn(styles.list, { [styles.closed]: !mapOpenValue })}
            >
                {renderOfferCards}
            </div>
            <OfferPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={changeCurrentPage}
                className={styles.pagination}
            />
        </div>
    );
};
