import cn from "classnames";
import React, { FC, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ReactSVG } from "react-svg";

import {
    OfferPagination,
    OffersMap,
    SwitchClosedOffers,
} from "@/widgets/OffersMap";
import { OfferCard } from "@/widgets/OffersMap/ui/OfferCard/OfferCard";
import { SelectSort } from "@/widgets/OffersMap/ui/SelectSort/SelectSort";

import { useGetOffersQuery } from "@/entities/Offer/api/offerApi";
import { getUserAuthData } from "@/entities/User";

import searchIcon from "@/shared/assets/icons/search-icon.svg";
import { useAppSelector } from "@/shared/hooks/redux";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { SquareButton } from "@/shared/ui/SquareButton/SquareButton";
import { Text } from "@/shared/ui/Text/Text";

import { OffersMobileFilter } from "../OffersMobileFilter/OffersMobileFilter";
import styles from "./OffersSearchFilterMobile.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

type SelectedTabType = "filter" | "map" | "offers";

interface OffersSearchFilterMobileProps {
    className?: string;
}

export const OffersSearchFilterMobile: FC<OffersSearchFilterMobileProps> = (
    props,
) => {
    const { className } = props;
    const { control } = useFormContext();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const offersPerPage = 10;

    const { data, isLoading } = useGetOffersQuery();
    const isAuth = useAppSelector(getUserAuthData);
    const { locale } = useLocale();

    const [selectedTab, setSelectedTab] = useState<SelectedTabType>("offers");

    const currentOffers = useMemo(() => {
        const startIndex = (currentPage - 1) * offersPerPage;
        const endIndex = startIndex + offersPerPage;
        return data?.slice(startIndex, endIndex);
    }, [data, currentPage]);

    const isOffersTabOpened = selectedTab === "offers";
    const isFilterTabOpened = selectedTab === "filter";
    const isMapTabOpened = selectedTab === "map";

    const renderOfferCards = useMemo(() => {
        if (data) {
            return currentOffers?.map((offer) => (
                <OfferCard
                    locale={locale}
                    classNameCard={styles.offerCard}
                    className={cn(styles.offer, {
                        [styles.closed]: true,
                    })}
                    status="opened"
                    data={offer}
                    key={offer.id}
                    isFavoriteIconShow={!!isAuth}
                />
            ));
        }
        return (
            <Text
                className={styles.error}
                textSize="primary"
                text="Вакансии не были найдены"
            />
        );
    }, [currentOffers, data, isAuth, locale]);

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
                    Список вакансий
                    <ReactSVG src={searchIcon} />
                </SquareButton>
                <div className={styles.buttons}>
                    <SquareButton
                        className={cn(styles.button)}
                        isActive={isMapTabOpened}
                        onClick={handleMapTab}
                    >
                        Карта
                    </SquareButton>
                    <SquareButton
                        className={cn(styles.button)}
                        isActive={isFilterTabOpened}
                        onClick={handleFilterTab}
                    >
                        Фильтр
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
                            name="showClosedOffers"
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
                    <div className={styles.offersCount}>1 055 вариантов</div>
                    <div className={styles.list}>{renderOfferCards}</div>
                    <OfferPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
            {isMapTabOpened && (
                <OffersMap
                    className={styles.offersMap}
                    classNameMap={styles.offersMap}
                />
            )}
            {isFilterTabOpened && <OffersMobileFilter />}
        </div>
    );
};
