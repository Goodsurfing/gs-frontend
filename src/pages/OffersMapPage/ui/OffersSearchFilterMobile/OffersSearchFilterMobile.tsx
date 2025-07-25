import cn from "classnames";
import React, { FC, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ReactSVG } from "react-svg";

import { useTranslation } from "react-i18next";
import {
    OfferPagination,
    OffersMap,
    SwitchClosedOffers,
} from "@/widgets/OffersMap";
import { OfferCard } from "@/widgets/OffersMap/ui/OfferCard/OfferCard";
import { SelectSort } from "@/widgets/OffersMap/ui/SelectSort/SelectSort";

// import { getUserAuthData } from "@/entities/User";

import searchIcon from "@/shared/assets/icons/search-icon.svg";
// import { useAppSelector } from "@/shared/hooks/redux";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { SquareButton } from "@/shared/ui/SquareButton/SquareButton";
import { Text } from "@/shared/ui/Text/Text";

import { OffersMobileFilter } from "../OffersMobileFilter/OffersMobileFilter";
import styles from "./OffersSearchFilterMobile.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { Offer } from "@/entities/Offer";
import { SearchOffers } from "@/widgets/OffersMap/ui/SearchOffers/SearchOffers";

type SelectedTabType = "filter" | "map" | "offers";

interface OffersSearchFilterMobileProps {
    className?: string;
    data?: Offer[];
    isLoading: boolean;
    onSubmit: () => void;
    onResetFilters: () => void;
    currentPage: number;
    offersPerPage: number;
    onChangePage: (pageItem: number) => void;
}

export const OffersSearchFilterMobile: FC<OffersSearchFilterMobileProps> = (
    props,
) => {
    const {
        className, data, isLoading, onSubmit,
        onResetFilters, currentPage, offersPerPage,
        onChangePage,
    } = props;
    const { control } = useFormContext();
    const { t } = useTranslation("offers-map");

    // const isAuth = useAppSelector(getUserAuthData);
    const { locale } = useLocale();

    const [selectedTab, setSelectedTab] = useState<SelectedTabType>("offers");

    const currentOffers = useMemo(() => {
        const startIndex = (currentPage - 1) * offersPerPage;
        const endIndex = startIndex + offersPerPage;
        return data?.slice(startIndex, endIndex);
    }, [currentPage, offersPerPage, data]);

    const isOffersTabOpened = selectedTab === "offers";
    const isFilterTabOpened = selectedTab === "filter";
    const isMapTabOpened = selectedTab === "map";

    const handleSubmit = () => {
        onSubmit();
        setSelectedTab("offers");
    };

    const renderOfferCards = useMemo(() => {
        if (data) {
            return currentOffers?.map((offer) => (
                <OfferCard
                    locale={locale}
                    classNameCard={styles.offerCard}
                    className={cn(styles.offer, {
                        [styles.closed]: true,
                    })}
                    status={offer.status === "active" ? "opened" : "closed"}
                    data={offer}
                    key={offer.id}
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
    }, [currentOffers, data, locale, t]);

    const handleOffersTab = () => {
        if (selectedTab !== "offers") {
            setSelectedTab("offers");
        }
    };

    const handleFilterTab = () => {
        if (selectedTab !== "filter") {
            setSelectedTab("filter");
        }
    };

    const handleMapTab = () => {
        if (selectedTab !== "map") {
            setSelectedTab("map");
        }
    };

    if (isLoading) {
        return (
            <div className={cn(styles.wrapper, className)}>
                <MiniLoader className={styles.miniLoader} />
            </div>
        );
    }

    const totalPages = data ? Math.ceil(data.length / offersPerPage) : 1;

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.top}>
                <SquareButton
                    className={cn(styles.button, styles.icon, {
                        [styles.active]: isOffersTabOpened,
                    })}
                    isActive={isOffersTabOpened}
                    onClick={handleOffersTab}
                >
                    {t("Список вакансий")}
                    <ReactSVG src={searchIcon} />
                </SquareButton>
                <div className={styles.buttons}>
                    <SquareButton
                        className={cn(styles.button)}
                        isActive={isMapTabOpened}
                        onClick={handleMapTab}
                    >
                        {t("Карта")}
                    </SquareButton>
                    <SquareButton
                        className={cn(styles.button)}
                        isActive={isFilterTabOpened}
                        onClick={handleFilterTab}
                    >
                        {t("Фильтр")}
                    </SquareButton>
                </div>
                {isOffersTabOpened && (
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
            {isOffersTabOpened && (
                <>
                    <div className={styles.searchWrapper}>
                        <Controller
                            name="search"
                            control={control}
                            render={({ field }) => (
                                <SearchOffers
                                    onSubmit={() => handleSubmit()}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder={t("Поиск")}
                                    buttonText={t("Посмотреть все")}
                                />
                            )}
                        />
                    </div>
                    <div className={styles.offersCount}>
                        {data ? data.length : 0}
                        {" "}
                        {t("вариантов")}
                    </div>
                    <div className={styles.list}>{renderOfferCards}</div>
                    <OfferPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onChangePage}
                    />
                </>
            )}
            {isMapTabOpened && (
                <OffersMap
                    className={styles.offersMap}
                    classNameMap={styles.offersMap}
                    offersData={data}
                />
            )}
            {isFilterTabOpened && (
                <OffersMobileFilter
                    onSubmitFilters={handleSubmit}
                    onResetFilters={onResetFilters}
                />
            )}
        </div>
    );
};
