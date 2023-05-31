import React, { FC, memo } from "react";

import styles from "./Slide.module.scss";

interface SlideProps {
    title: string;
    text: string;
    image: string;
}

const Slide: FC<SlideProps> = ({ text, title, image }) => (
    <div
        className={styles.slide}
        style={{ backgroundImage: `url(${image})` }}
    >
        <div className={styles.content}>
            <h1>{title}</h1>
            <p>{text}</p>
        </div>
    </div>
);

export const MemoSlide = memo(Slide);
