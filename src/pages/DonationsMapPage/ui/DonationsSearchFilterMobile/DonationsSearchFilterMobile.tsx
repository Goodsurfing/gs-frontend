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
import { OfferCard } from "@/widgets/OffersMap/ui/OfferCard/OfferCard";
import { SearchOffers } from "@/widgets/OffersMap/ui/SearchOffers/SearchOffers";
import { SelectSort } from "@/widgets/OffersMap/ui/SelectSort/SelectSort";

import searchIcon from "@/shared/assets/icons/search-icon.svg";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { SquareButton } from "@/shared/ui/SquareButton/SquareButton";
import { Text } from "@/shared/ui/Text/Text";
import {
    DonationCard, donationCardAdapter, DonationFilterFields, GetDonations, GetDonationsMap,
} from "@/entities/Donation";
import styles from "./DonationsSearchFilterMobile.module.scss";
import { SearchDonations } from "@/widgets/Donation";

type SelectedTabType = "filter" | "map" | "donations";

interface DonationsSearchFilterMobileProps {
    className?: string;
    allDonationsMapData: GetDonationsMap[];
    isLoadingAllDonationsMap: boolean;
    data?: GetDonations[];
    isLoading: boolean;
    onApplySearch: (search: string) => void;
    onSubmit: () => void;
    onResetFilters: () => void;
    total: number;
    currentPage: number;
    donationsPerPage: number;
    onChangePage: (pageItem: number) => void;
}

const MemoizedDonationCard = React.memo(DonationCard);
const MemoizedSearchDonations = React.memo(SearchDonations);

export const DonationsSearchFilterMobile: FC<DonationsSearchFilterMobileProps> = ({
    className,
    data,
    allDonationsMapData,
    isLoadingAllDonationsMap,
    isLoading,
    onApplySearch,
    onSubmit,
    onResetFilters,
    currentPage,
    donationsPerPage,
    total,
    onChangePage,
}) => {
    const { control } = useFormContext<DonationFilterFields>();
    const { t } = useTranslation("donation");
    const { locale } = useLocale();
    const [selectedTab, setSelectedTab] = useState<SelectedTabType>("donations");

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
        setSelectedTab("donations");
    }, [onSubmit]);

    const handleReset = useCallback(() => {
        onResetFilters();
        setSelectedTab("donations");
    }, [onResetFilters]);

    const handleDonationsTab = useCallback(() => {
        setSelectedTab("donations");
    }, []);

    const handleFilterTab = useCallback(() => {
        setSelectedTab("filter");
    }, []);

    const handleMapTab = useCallback(() => {
        setSelectedTab("map");
    }, []);

    const tabStates = useMemo(
        () => ({
            isDonationsTabOpened: selectedTab === "donations",
            isFilterTabOpened: selectedTab === "filter",
            isMapTabOpened: selectedTab === "map",
        }),
        [selectedTab],
    );

    const renderDonationCards = useMemo(() => {
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
                    text={t("Сборы не были найдены")}
                />
            );
        }

        return data.map((donation) => (
            <MemoizedDonationCard
                locale={locale}
                className={cn(styles.donation)}
                data={donationCardAdapter(donation)}
                key={donation.id}
            />
        ));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locale, t, isLoading, isPending, data]);

    const totalPages = useMemo(
        () => (data ? Math.ceil(total / donationsPerPage) : 1),
        [data, donationsPerPage, total],
    );

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.top}>
                <SquareButton
                    className={cn(styles.button, styles.icon, {
                        [styles.active]: tabStates.isDonationsTabOpened,
                    })}
                    isActive={tabStates.isDonationsTabOpened}
                    onClick={handleDonationsTab}
                >
                    {t("Список сборов")}
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
                {tabStates.isDonationsTabOpened && (
                    <Controller
                        name="sort"
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
                    className={styles.offersMap}
                    classNameMap={styles.offersMap}
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
