import cn from "classnames";
import React, { FC, useMemo, useState } from "react";

import { useGetOffersQuery } from "@/entities/Offer/api/offerApi";

import { Text } from "@/shared/ui/Text/Text";

import { HeaderList } from "../HeaderList/HeaderList";
import { OfferCard } from "../OfferCard/OfferCard";
import { OfferPagination } from "../OfferPagination/OfferPagination";
import styles from "./OffersList.module.scss";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

interface OffersListProps {
    className?: string;
    mapOpenValue: boolean;
    onChangeMapOpen: () => void;
}

export const OffersList: FC<OffersListProps> = (props) => {
    const { mapOpenValue, onChangeMapOpen, className } = props;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const offersPerPage = 10;

    const { data, isLoading } = useGetOffersQuery();

    const currentOffers = useMemo(() => {
        const startIndex = (currentPage - 1) * offersPerPage;
        const endIndex = startIndex + offersPerPage;
        return data?.slice(startIndex, endIndex);
    }, [data, currentPage]);

    const renderOfferCards = useMemo(
        () => currentOffers?.map((offer) => (
            <OfferCard
                classNameCard={styles.offerCard}
                className={cn(styles.offer, {
                    [styles.closed]: !mapOpenValue,
                })}
                status="opened"
                data={offer}
                key={offer.id}
            />
        )),
        [currentOffers, mapOpenValue],
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
                <HeaderList
                    isShowMap={mapOpenValue}
                    onChangeShowMap={onChangeMapOpen}
                />
                <div
                    className={cn(styles.list, {
                        [styles.closed]: !mapOpenValue,
                    })}
                >
                    <Text
                        className={styles.error}
                        textSize="primary"
                        text="Вакансии не были найдены"
                    />
                </div>
            </div>
        );
    }

    const totalPages = Math.ceil(data.length / offersPerPage);

    return (
        <div className={cn(styles.wrapper, className)}>
            <HeaderList
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
                onPageChange={setCurrentPage}
            />
        </div>
    );
};
