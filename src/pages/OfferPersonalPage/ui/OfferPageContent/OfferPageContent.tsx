import { memo } from "react";

import cn from "classnames";

import styles from "./OfferPageContent.module.scss";
import { OfferInfoCard } from "@/entities/Offer";

interface OfferPageContentProps {
    className?: string;
    id: string;
}

export const OfferPageContent = memo((props: OfferPageContentProps) => {
    const { className, id } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            <OfferInfoCard />
        </div>
    );
});
