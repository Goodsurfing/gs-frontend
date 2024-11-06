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

import { mockedOffersData } from "@/entities/Offer/model/data/mockedOfferData";

import searchIcon from "@/shared/assets/icons/search-icon.svg";
import { SquareButton } from "@/shared/ui/SquareButton/SquareButton";

import { OffersMobileFilter } from "../OffersMobileFilter/OffersMobileFilter";
import styles from "./OffersSearchFilterMobile.module.scss";

type SelectedTabType = "filter" | "map" | "offers";

interface OffersSearchFilterMobileProps {
    className?: string;
}

export const OffersSearchFilterMobile: FC<OffersSearchFilterMobileProps> = (
    props,
) => {
    const { className } = props;
    const { control } = useFormContext();
    const [selectedTab, setSelectedTab] = useState<SelectedTabType>("offers");

    const isOffersTabOpened = selectedTab === "offers";
    const isFilterTabOpened = selectedTab === "filter";
    const isMapTabOpened = selectedTab === "map";

    const renderOfferCards = useMemo(
        () => mockedOffersData.map((offer) => (
            <OfferCard
                classNameCard={styles.offerCard}
                className={cn(styles.offer, {
                    [styles.closed]: true,
                })}
                status="opened"
                data={offer}
                key={offer.id}
                isFavoriteIconShow
            />
        )),
        [],
    );

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
                    <OfferPagination currentPage={1} totalPages={5} onPageChange={() => {}} />
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
