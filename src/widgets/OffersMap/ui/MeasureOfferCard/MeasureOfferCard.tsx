import { Offer } from "@/entities/Offer";
import { FC, useEffect, useRef } from "react";
import { OfferCard } from "../OfferCard/OfferCard";
import { Locale } from "@/entities/Locale";
import cn from 'classnames'
import styles from './MeasuredOfferCard.module.scss'

export const MeasuredOfferCard: FC<{
    offer: Offer;
    locale: Locale;
    mapOpenValue: boolean;
    setSize: (h: number) => void;
}> = ({ offer, locale, mapOpenValue, setSize }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            setSize(ref.current.getBoundingClientRect().height);
        }
    }, [offer, setSize]);

    return (
        <div ref={ref}>
            <OfferCard
                locale={locale}
                classNameCard={styles.offerCard}
                className={cn(styles.offer, { [styles.closed]: !mapOpenValue })}
                status={offer.status === "active" ? "opened" : "closed"}
                data={offer}
            />
        </div>
    );
};
