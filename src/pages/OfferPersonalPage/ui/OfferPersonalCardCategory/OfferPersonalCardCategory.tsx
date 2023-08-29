import { memo } from "react";

import cn from "classnames";

import styles from "./OfferPersonalCardCategory.module.scss";

interface OfferPersonalCardCategoryProps {
    className?: string
}

export const OfferPersonalCardCategory = memo((props: OfferPersonalCardCategoryProps) => {
    const { className } = props;
    return (
        <div className={cn(className, styles.category)}>
            <span className={styles.text}>Заповедники и парки</span>
        </div>
    );
});
