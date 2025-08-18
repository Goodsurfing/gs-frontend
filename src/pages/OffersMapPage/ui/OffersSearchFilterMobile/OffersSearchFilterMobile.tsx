import cn from "classnames";
import React, { FC, useCallback, useMemo, useState, useTransition } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ReactSVG } from "react-svg";

import { useLocale } from "@/app/providers/LocaleProvider";

import {
    OfferPagination,
    OffersMap,
    SwitchClosedOffers,
} from "@/widgets/OffersMap";
import { OfferCard } from "@/widgets/OffersMap/ui/OfferCard/OfferCard";
import { SearchOffers } from "@/widgets/OffersMap/ui/SearchOffers/SearchOffers";
import { SelectSort } from "@/widgets/OffersMap/ui/SelectSort/SelectSort";

import { Offer } from "@/entities/Offer";

// import { getUserAuthData } from "@/entities/User";
import searchIcon from "@/shared/assets/icons/search-icon.svg";
// import { useAppSelector } from "@/shared/hooks/redux";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { SquareButton } from "@/shared/ui/SquareButton/SquareButton";
import { Text } from "@/shared/ui/Text/Text";

import { OffersMobileFilter } from "../OffersMobileFilter/OffersMobileFilter";
import styles from "./OffersSearchFilterMobile.module.scss";

type SelectedTabType = "filter" | "map" | "offers";

interface OffersSearchFilterMobileProps {
    className?: string;
    data?: Offer[];
    isLoading: boolean;
    onApplySearch: (search: string) => void;
    onSubmit: () => void;
    onResetFilters: () => void;
    currentPage: number;
    offersPerPage: number;
    onChangePage: (pageItem: number) => void;
}

// Мемоизируем дочерние компоненты, чтобы избежать ненужных перерендеров
const MemoizedOfferCard = React.memo(OfferCard);
const MemoizedSearchOffers = React.memo(SearchOffers);

export const OffersSearchFilterMobile: FC<OffersSearchFilterMobileProps> = ({
    className,
    data,
    isLoading,
    onApplySearch,
    onSubmit,
    onResetFilters,
    currentPage,
    offersPerPage,
    onChangePage,
}) => {
    const { control } = useFormContext();
    const { t } = useTranslation("offers-map");
    const { locale } = useLocale();
    const [selectedTab, setSelectedTab] = useState<SelectedTabType>("offers");

    const [isPending, startTransition] = useTransition();

    const handleApplySearch = useCallback(
        (search: string) => {
            onApplySearch(search);
        },
        [onApplySearch]
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

    const tabStates = useMemo(
        () => ({
            isOffersTabOpened: selectedTab === "offers",
            isFilterTabOpened: selectedTab === "filter",
            isMapTabOpened: selectedTab === "map",
        }),
        [selectedTab]
    );

    const currentOffers = useMemo(() => {
        const startIndex = (currentPage - 1) * offersPerPage;
        const endIndex = startIndex + offersPerPage;
        return data?.slice(startIndex, endIndex) || [];
    }, [currentPage, offersPerPage, data]);

    const renderOfferCards = useMemo(() => {
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

        return currentOffers.map((offer) => (
            <MemoizedOfferCard
                locale={locale}
                classNameCard={styles.offerCard}
                className={cn(styles.offer, {
                    [styles.closed]: offer.status !== "active",
                })}
                status={offer.status === "active" ? "opened" : "closed"}
                data={offer}
                key={offer.id}
            />
        ));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentOffers, locale, t, isLoading, isPending, data]);

    const totalPages = useMemo(
        () => (data ? Math.ceil(data.length / offersPerPage) : 1),
        [data, offersPerPage]
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
                        {data ? data.length : 0} {t("вариантов")}
                    </div>
                    <div className={styles.list}>{renderOfferCards}</div>
                    <OfferPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={changeCurrentPage}
                    />
                </>
            )}
            {tabStates.isMapTabOpened && (
                <OffersMap
                    className={styles.offersMap}
                    classNameMap={styles.offersMap}
                    offersData={data}
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
