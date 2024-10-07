import cn from "classnames";
import React, { FC, useMemo, useState } from "react";

import { HeaderList } from "../HeaderList/HeaderList";
import { OfferCard } from "../OfferCard/OfferCard";
import { OfferPagination } from "../OfferPagination/OfferPagination";
import styles from "./OffersList.module.scss";
import { useGetOffersQuery } from "@/entities/Offer/api/offerApi";
import Preloader from "@/shared/ui/Preloader/Preloader";

interface OffersListProps {
    className?: string;
    mapOpenValue: boolean;
    onChangeMapOpen: () => void;
}

export const OffersList: FC<OffersListProps> = (props) => {
    const { mapOpenValue, onChangeMapOpen, className } = props;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;

    const { data, isLoading } = useGetOffersQuery({
        page: currentPage,
        perPage: itemsPerPage,
    });

    const renderOfferCards = useMemo(
        () => data?.map((offer) => (
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
        [data, mapOpenValue],
    );

    if (isLoading) {
        return (
            <div className={cn(styles.wrapper, className)}>
                <Preloader />
            </div>
        );
    }

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
                totalPages={data?.totalPages || 1}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};
