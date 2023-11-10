import cn from "classnames";
import { memo } from "react";

import { OfferInfoCard } from "@/entities/Offer";

import { mockedOfferData } from "../../model/data/mockedOfferData";
import styles from "./OfferPageContent.module.scss";

interface OfferPageContentProps {
    className?: string;
    id: string;
}

export const OfferPageContent = memo((props: OfferPageContentProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { className, id } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            <OfferInfoCard offer={mockedOfferData} />
        </div>
    );
});
