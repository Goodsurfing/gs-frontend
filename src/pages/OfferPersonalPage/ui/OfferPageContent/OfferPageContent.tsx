import cn from "classnames";
import { memo } from "react";

import { OfferInfoCard, useGetOfferByIdQuery } from "@/entities/Offer";

import styles from "./OfferPageContent.module.scss";

interface OfferPageContentProps {
    className?: string;
    id: string;
}

export const OfferPageContent = memo((props: OfferPageContentProps) => {
    const { className, id } = props;
    const { data, isError } = useGetOfferByIdQuery(id);

    if (!data || isError) {
        return (
            <div className={cn(className, styles.wrapper)}>
                <span>Произошла ошибка в загрузке данных</span>
            </div>
        );
    }

    return (
        <div className={cn(className, styles.wrapper)}>
            <OfferInfoCard offer={data} />
        </div>
    );
});
