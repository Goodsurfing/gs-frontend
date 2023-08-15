import { memo } from "react";

import cn from "classnames";

import { ExtraConditions } from "@/entities/Offer";

import styles from "./OfferFinishingTouchesExtras.module.scss";

interface OfferFinishingTouchesExtrasProps {
    className?: string;
    value: ExtraConditions;
    onChange: (value: ExtraConditions) => void;
}

export const OfferFinishingTouchesExtras = memo((props: OfferFinishingTouchesExtrasProps) => {
    const { className, onChange, value } = props;
    return (
        <div className={cn(styles.wrapper, className)}>
            
        </div>
    );
});
