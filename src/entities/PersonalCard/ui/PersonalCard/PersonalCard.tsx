import { memo, ReactNode } from "react";

import cn from "classnames";
import star from "@/shared/assets/icons/star.svg";

import styles from "./PersonalCard.module.scss";
import Button from "@/shared/ui/Button/Button";
import IconComponent from "@/shared/ui/IconComponent/IconComponent";

interface PersonalCardProps {
    className?: string;
    title?: string;
    image?: string;
    categories?: ReactNode; // todo: backend & entity
    rating?: number;
    location?: string;
    imageBlock?: ReactNode;
    medals?: ReactNode;
}

export const PersonalCard = memo((props: PersonalCardProps) => {
    const {
        className,
        categories,
        rating,
        imageBlock,
        title,
        location,
        image,
        medals,
    } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            <img className={styles.backgroundImage} src={image} alt={title} />
            <div className={styles.content}>
                <div className={styles.left}>
                    <div className={styles.topPart}>
                        <h1 className={styles.title}>{title}</h1>
                        <div className={styles.info}>
                            {categories}
                            <span className={styles.location}>{location}</span>
                            <div className={styles.rating}>
                                <IconComponent className={styles.star} icon={star} />
                                <span className={styles.ratingText}>{rating}</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.botPart}>
                        {imageBlock}
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.medals}>
                        {medals}MEDALS
                    </div>
                    <Button size="SMALL" variant="FILL" color="BLUE">
                        Редактировать
                    </Button>
                </div>
            </div>
        </div>
    );
});
