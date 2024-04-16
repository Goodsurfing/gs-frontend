import React, {
    FC, useMemo,
} from "react";

import cn from "classnames";
import { mockedOffersData } from "@/entities/Offer/model/data/mockedOfferData";

import { OfferCard } from "../OfferCard/OfferCard";
import styles from "./OffersList.module.scss";
import { OfferPagination } from "../OfferPagination/OfferPagination";
import { HeaderList } from "../HeaderList/HeaderList";

interface OffersListProps {
    className?: string
    mapOpenValue: boolean;
    onChangeMapOpen: () => void;
}

export const OffersList: FC<OffersListProps> = (props) => {
    const { mapOpenValue, onChangeMapOpen, className } = props;

    const renderOfferCards = useMemo(
        () => mockedOffersData.map((offer) => (
            <OfferCard className={cn(styles.offer, { [styles.closed]: !mapOpenValue })} status="opened" data={offer} key={offer.id} />
        )),
        [mapOpenValue],
    );

    return (
        <div className={cn(styles.wrapper, className)}>
            <HeaderList isShowMap={mapOpenValue} onChangeShowMap={onChangeMapOpen} />
            <div className={cn(styles.list, { [styles.closed]: !mapOpenValue })}>
                {renderOfferCards}
            </div>
            <OfferPagination />
        </div>
    );
};
