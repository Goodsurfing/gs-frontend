import cn from "classnames";
import React, {
    FC, useCallback, useMemo, useState,
} from "react";

import { useTranslation } from "react-i18next";
import { Controller, useFormContext } from "react-hook-form";
import { Text } from "@/shared/ui/Text/Text";

import { HeaderList } from "../HeaderList/HeaderList";
import { OfferCard } from "../OfferCard/OfferCard";
import { OfferPagination } from "../OfferPagination/OfferPagination";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { useLocale } from "@/app/providers/LocaleProvider";
import { Offer } from "@/entities/Offer";
import { SearchOffers } from "../SearchOffers/SearchOffers";
import styles from "./OffersList.module.scss";
import { OffersFilterFields } from "@/pages/OffersMapPage/model/types";

interface OffersListProps {
    className?: string;
    mapOpenValue: boolean;
    onChangeMapOpen: () => void;
    onSubmit: () => void;
    data?: Offer[];
    isLoading: boolean;
}

export const OffersList: FC<OffersListProps> = (props) => {
    const {
        mapOpenValue, onChangeMapOpen, data, onSubmit, isLoading, className,
    } = props;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const offersPerPage = 10;

    const { control } = useFormContext<OffersFilterFields>();
    const { locale } = useLocale();
    const { t } = useTranslation("offers-map");

    const currentOffers = useMemo(() => {
        const startIndex = (currentPage - 1) * offersPerPage;
        const endIndex = startIndex + offersPerPage;
        return data?.slice(startIndex, endIndex);
    }, [data, currentPage]);

    const changeMapOpen = useCallback(() => {
        onChangeMapOpen();
    }, [onChangeMapOpen]);

    const changeCurrentPage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const renderOfferCards = useMemo(
        () => {
            if (!currentOffers || currentOffers.length === 0) {
                return (
                    <Text
                        className={styles.error}
                        textSize="primary"
                        text="Вакансии не были найдены"
                    />
                );
            }
            return currentOffers?.map((offer) => (
                <OfferCard
                    locale={locale}
                    classNameCard={styles.offerCard}
                    className={cn(styles.offer, {
                        [styles.closed]: !mapOpenValue,
                    })}
                    status={offer.status === "active" ? "opened" : "closed"}
                    data={offer}
                    key={offer.id}
                    // isFavoriteIconShow={!!isAuth}
                />
            ));
        },
        [currentOffers, locale, mapOpenValue],
    );

    if (isLoading) {
        return (
            <div className={cn(styles.wrapper, className)}>
                <MiniLoader className={styles.miniLoader} />
            </div>
        );
    }

    if (!data) {
        return (
            <div className={cn(styles.wrapper, className)}>
                <div className={styles.searchWrapper}>
                    <Controller
                        name="search"
                        control={control}
                        render={({ field }) => (
                            <SearchOffers
                                onSubmit={onSubmit}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={t("Поиск")}
                                buttonText={t("Посмотреть все")}
                            />
                        )}
                    />
                </div>
                <HeaderList
                    offersLength={0}
                    isShowMap={mapOpenValue}
                    onChangeShowMap={changeMapOpen}
                />
                <div
                    className={cn(styles.list, {
                        [styles.closed]: !mapOpenValue,
                    })}
                >
                    <Text
                        className={styles.error}
                        textSize="primary"
                        text={t("Вакансии не были найдены")}
                    />
                </div>
            </div>
        );
    }

    const totalPages = Math.ceil(data.length / offersPerPage);

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.searchWrapper}>
                <Controller
                    name="search"
                    control={control}
                    render={({ field }) => (
                        <SearchOffers
                            onSubmit={onSubmit}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={t("Поиск")}
                            buttonText={t("Посмотреть все")}
                        />
                    )}
                />
            </div>
            <HeaderList
                offersLength={data.length}
                isShowMap={mapOpenValue}
                onChangeShowMap={onChangeMapOpen}
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
            />
        </div>
    );
};
