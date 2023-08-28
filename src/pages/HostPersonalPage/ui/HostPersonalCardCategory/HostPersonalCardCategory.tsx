import { memo } from "react";

import cn from "classnames";

import styles from "./HostPersonalCardCategory.module.scss";

interface HostPersonalCardCategoryProps {
    className?: string
}

export const HostPersonalCardCategory = memo((props: HostPersonalCardCategoryProps) => {
    const { className } = props;
    return (
        <div className={cn(className, styles.category)}>
            <span className={styles.text}>Заповедники и парки</span>
        </div>
    );
});
