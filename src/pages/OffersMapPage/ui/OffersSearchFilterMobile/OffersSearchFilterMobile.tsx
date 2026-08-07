import cn from "classnames";
import React, {
    FC, useCallback, useMemo, useState, useTransition,
} from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ReactSVG } from "react-svg";

import { useLocale } from "@/app/providers/LocaleProvider";

import {
    OfferPagination,
    OffersMap,
    SwitchClosedOffers,
} from "@/widgets/OffersMap";
import type { MapViewportBounds } from "@/widgets/OffersMap/ui/OffersMap/OffersMap";
import { OfferCard } from "@/widgets/OffersMap/ui/OfferCard/OfferCard";
import { SearchOffers } from "@/widgets/OffersMap/ui/SearchOffers/SearchOffers";
import { SelectSort } from "@/widgets/OffersMap/ui/SelectSort/SelectSort";

import { OfferApi, OfferMap } from "@/entities/Offer";

// import { getUserAuthData } from "@/entities/User";
import searchIcon from "@/shared/assets/icons/search-icon.svg";
// import { useAppSelector } from "@/shared/hooks/redux";
import Button from "@/shared/ui/Button/Button";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { SquareButton } from "@/shared/ui/SquareButton/SquareButton";
import { Text } from "@/shared/ui/Text/Text";

import { OffersMobileFilter } from "../OffersMobileFilter/OffersMobileFilter";
import styles from "./OffersSearchFilterMobile.module.scss";

type SelectedTabType = "filter" | "map" | "offers";

interface OffersSearchFilterMobileProps {
    className?: string;
    allOffersMapData: OfferMap[];
    isLoadingAllOffersMap: boolean;
    isMapError?: boolean;
    onRetryMap?: () => void;
    data?: OfferApi[];
    isLoading: boolean;
    isError?: boolean;
    onRetry?: () => void;
    onApplySearch: (search: string) => void;
    onSubmit: () => void;
    onResetFilters: () => void;
    total: number;
    currentPage: number;
    offersPerPage: number;
    onChangePage: (pageItem: number) => void;
    selectedOfferId?: number;
    onSelectOffer?: (offerId: number) => void;
    selectedOfferCoordinates?: { latitude: number; longitude: number } | null;
    offerIdsWithoutLocation?: Set<number>;
    onBoundsChange?: (bounds: MapViewportBounds) => void;
}

const MemoizedOfferCard = React.memo(OfferCard);
const MemoizedSearchOffers = React.memo(SearchOffers);

export const OffersSearchFilterMobile: FC<OffersSearchFilterMobileProps> = ({
    className,
    data,
    allOffersMapData,
    isLoadingAllOffersMap,
    isMapError,
    onRetryMap,
    isLoading,
    isError,
    onRetry,
    onApplySearch,
    onSubmit,
    onResetFilters,
    currentPage,
    offersPerPage,
    total,
    onChangePage,
    selectedOfferId,
    onSelectOffer,
    selectedOfferCoordinates,
    offerIdsWithoutLocation,
    onBoundsChange,
}) => {
    const { control } = useFormContext();
    const { t } = useTranslation("offers-map");
    const { locale } = useLocale();
    // Ссылка вида /offers-map?offerId=... (шеринг конкретной вакансии) должна
    // сразу показывать её на карте — иначе человек попадает в список вакансий
    // и должен ещё сам догадаться вручную переключиться на вкладку "Карта".
    const [selectedTab, setSelectedTab] = useState<SelectedTabType>(
        () => (selectedOfferId ? "map" : "offers"),
    );

    const [isPending, startTransition] = useTransition();

    const handleApplySearch = useCallback(
        (search: string) => {
            onApplySearch(search);
        },
        [onApplySearch],
    );

    const changeCurrentPage = useCallback((page: number) => {
        startTransition(() => {
            onChangePage(page);
        });
    }, [onChangePage]);

    const handleSubmit = useCallback(() => {
        onSubmit();
        setSelectedTab("offers");
    }, [onSubmit]);

    const handleReset = useCallback(() => {
        onResetFilters();
        setSelectedTab("offers");
    }, [onResetFilters]);

    const handleOffersTab = useCallback(() => {
        setSelectedTab("offers");
    }, []);

    const handleFilterTab = useCallback(() => {
        setSelectedTab("filter");
    }, []);

    const handleMapTab = useCallback(() => {
        setSelectedTab("map");
    }, []);

    // На десктопе список и карта видны бок о бок, поэтому клик по карточке
    // просто выделяет метку на уже открытой карте. На мобильном они на
    // разных вкладках — без переключения на "Карта" клик по карточке в
    // списке визуально не приводил бы ни к чему (карту пользователь тогда
    // не видит), хотя выбор внутри состояния уже происходил бы. Тот же
    // сценарий, что и на десктопе ("фокус на точке → табличка с фото"), но
    // с явным переходом на вкладку карты вместо соседней колонки.
    const handleSelectOffer = useCallback((offerId: number) => {
        onSelectOffer?.(offerId);
        setSelectedTab("map");
    }, [onSelectOffer]);

    const tabStates = useMemo(
        () => ({
            isOffersTabOpened: selectedTab === "offers",
            isFilterTabOpened: selectedTab === "filter",
            isMapTabOpened: selectedTab === "map",
        }),
        [selectedTab],
    );

    const renderOfferCards = useMemo(() => {
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
            return (
                <div className={cn(styles.wrapper, className)}>
                    <MiniLoader className={styles.miniLoader} />
                </div>
            );
        }
        if (!data || data.length === 0) {
            return (
                <Text
                    className={styles.error}
                    textSize="primary"
                    text={t("Вакансии не были найдены")}
                />
            );
        }

        return data.map((offer) => (
            <MemoizedOfferCard
                locale={locale}
                classNameCard={styles.offerCard}
                className={cn(styles.offer, {
                    [styles.closed]: offer.status !== "active",
                })}
                status={offer.status === "active" ? "opened" : "closed"}
                data={{
                    id: offer.id,
                    title: offer.title,
                    shortDescription: offer.shortDescription,
                    imagePath: offer.image?.contentUrl,
                    categories: offer.categories.map((cat) => cat.name),
                    address: offer.address,
                    acceptedApplicationsCount: offer.acceptedApplicationsCount,
                    averageRating: offer.averageRating,
                    reviewsCount: offer.reviewsCount,
                }}
                key={offer.id}
                isSelected={offer.id === selectedOfferId}
                onSelect={handleSelectOffer}
                hasLocation={!offerIdsWithoutLocation?.has(offer.id)}
            />
        ));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        locale, t, isLoading, isPending, isError, onRetry, data, selectedOfferId,
        handleSelectOffer, offerIdsWithoutLocation,
    ]);

    const totalPages = useMemo(
        () => (data ? Math.ceil(total / offersPerPage) : 1),
        [data, offersPerPage, total],
    );

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.top}>
                <SquareButton
                    className={cn(styles.button, styles.icon, {
                        [styles.active]: tabStates.isOffersTabOpened,
                    })}
                    isActive={tabStates.isOffersTabOpened}
                    onClick={handleOffersTab}
                >
                    {t("Список вакансий")}
                    <ReactSVG src={searchIcon} />
                </SquareButton>
                <div className={styles.buttons}>
                    <SquareButton
                        className={cn(styles.button)}
                        isActive={tabStates.isMapTabOpened}
                        onClick={handleMapTab}
                    >
                        {t("Карта")}
                    </SquareButton>
                    <SquareButton
                        className={cn(styles.button)}
                        isActive={tabStates.isFilterTabOpened}
                        onClick={handleFilterTab}
                    >
                        {t("Фильтр")}
                    </SquareButton>
                </div>
                {tabStates.isOffersTabOpened && (
                    <>
                        <Controller
                            name="offersSort.sortValue"
                            control={control}
                            render={({ field }) => (
                                <SelectSort
                                    value={field.value}
                                    onChange={field.onChange}
                                    className={styles.sortWrapper}
                                    classNameControl={styles.sort}
                                    classNameDropdown={styles.sortDropdown}
                                />
                            )}
                        />
                        <Controller
                            name="offersSort.showClosedOffers"
                            control={control}
                            render={({ field }) => (
                                <SwitchClosedOffers
                                    value={field.value}
                                    onChange={field.onChange}
                                    className={styles.closedOffers}
                                />
                            )}
                        />
                    </>
                )}
            </div>
            {tabStates.isOffersTabOpened && (
                <>
                    <div className={styles.searchWrapper}>
                        <MemoizedSearchOffers
                            onSubmit={handleApplySearch}
                            onResetFilters={handleReset}
                            placeholder={t("Поиск")}
                            buttonText={t("Посмотреть все")}
                        />
                    </div>
                    <div className={styles.offersCount}>
                        {total}
                        {" "}
                        {t("вариантов")}
                    </div>
                    <div className={styles.list}>{renderOfferCards}</div>
                    <OfferPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={changeCurrentPage}
                        className={styles.pagination}
                    />
                </>
            )}
            {tabStates.isMapTabOpened && (
                <OffersMap
                    offersData={allOffersMapData}
                    isOffersLoading={isLoadingAllOffersMap}
                    isOffersError={isMapError}
                    onRetry={onRetryMap}
                    className={styles.offersMap}
                    classNameMap={styles.offersMap}
                    selectedOfferId={selectedOfferId}
                    selectedOfferCoordinates={selectedOfferCoordinates}
                    onBoundsChange={onBoundsChange}
                />
            )}
            {tabStates.isFilterTabOpened && (
                <OffersMobileFilter
                    onSubmitFilters={handleSubmit}
                    onResetFilters={onResetFilters}
                />
            )}
        </div>
    );
};
