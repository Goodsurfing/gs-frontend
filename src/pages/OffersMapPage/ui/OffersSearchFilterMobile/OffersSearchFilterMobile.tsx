import React, { FC, useMemo } from "react";
import cn from "classnames";
import { Controller, useFormContext } from "react-hook-form";
import { mockedOffersData } from "@/entities/Offer/model/data/mockedOfferData";
import styles from "./OffersSearchFilterMobile.module.scss";
import { SquareButton } from "@/shared/ui/SquareButton/SquareButton";
import { SelectSort } from "@/widgets/OffersMap/ui/SelectSort/SelectSort";
import { SwitchClosedOffers } from "@/widgets/OffersMap";
import { OfferCard } from "@/widgets/OffersMap/ui/OfferCard/OfferCard";

interface OffersSearchFilterMobileProps {
    className?: string;
}

export const OffersSearchFilterMobile: FC<OffersSearchFilterMobileProps> = (props) => {
    const { className } = props;
    const { control } = useFormContext();

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
            />
        )),
        [],
    );

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.top}>
                <div className={styles.buttons}>
                    <SquareButton className={styles.button}>Карта</SquareButton>
                    <SquareButton className={styles.button}>Фильтр</SquareButton>
                </div>
                <Controller
                    name="sortValue"
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
            </div>
            <div className={styles.list}>{renderOfferCards}</div>
        </div>
    );
};
