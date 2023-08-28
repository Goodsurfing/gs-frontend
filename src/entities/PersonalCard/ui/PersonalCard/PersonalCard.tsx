import { memo, ReactNode } from "react";

import cn from "classnames";

import styles from "./PersonalCard.module.scss";

interface PersonalCardProps {
    className?: string;
    title: string;
    image: string;
    categories: ReactNode; // todo: backend & entity
    rating: number;
    status: string;
    imageBlock: ReactNode;
    medals?: ReactNode;
}

export const PersonalCard = memo((props: PersonalCardProps) => {
    const {
        className,
        categories,
        rating,
        imageBlock,
        title,
        status,
        image,
        medals,
    } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            <div className={styles.left}>
                <h3 className={styles.title}>{title}</h3>
                <div className={styles.category}>
                </div>
                <div className={styles.imageBlock}>
                    {imageBlock}
                </div>
            </div>
        </div>
    );
});
