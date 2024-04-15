import React, {
    FC, useMemo,
} from "react";

import cn from "classnames";
import { mockedOffersData } from "@/entities/Offer/model/data/mockedOfferData";

import { OfferCard } from "../OfferCard/OfferCard";
import styles from "./OffersList.module.scss";
import { OfferPagination } from "../OfferPagination/OfferPagination";

interface OffersListProps {
    className?: string
    mapOpenValue: boolean;
    onChangeMapOpen: () => void;
}

export const OffersList: FC<OffersListProps> = (props) => {
    const { mapOpenValue, onChangeMapOpen, className } = props;

    const renderOfferCards = useMemo(
        () => mockedOffersData.map((offer) => (
            <OfferCard status="opened" data={offer} key={offer.id} />
        )),
        [],
    );

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.list}>
                {renderOfferCards}
                {renderOfferCards}
                {renderOfferCards}
                {renderOfferCards}
                {renderOfferCards}
            </div>
            <OfferPagination />
        </div>
    );
};
