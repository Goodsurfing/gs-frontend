import cn from "classnames";
import React, { FC, memo } from "react";

import styles from "./TitleVideoGallery.module.scss";

interface TitleVideoGalleryProps {
    className?: string;
}

export const TitleVideoGallery: FC<TitleVideoGalleryProps> = memo(
    (props: TitleVideoGalleryProps) => {
        const { className } = props;
        return (
            <div className={cn(className, styles.wrapper)}>
                <h2>Видео о себе</h2>
                <p className={styles.description}>
                    Запишите и добавьте через Youtube небольшое презентационное
                    видео. В видео расскажите о себе, о своих навыках и опыте и
                    мотивации путешествовать со смыслом. Видео может быть
                    несколько.
                </p>
            </div>
        );
    },
);
