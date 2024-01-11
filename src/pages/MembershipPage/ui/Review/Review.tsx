import React, { FC } from "react";
import cn from "classnames";
import styles from "./Review.module.scss";

interface ReviewProps {
    className?: string;
}

export const Review: FC<ReviewProps> = (props: ReviewProps) => {
    const { className } = props;
    return (
        <section className={cn(className, styles.wrapper)}>Review</section>
    );
};
