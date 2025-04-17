import cn from "classnames";
import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import styles from "./TitleVideoGallery.module.scss";

interface TitleVideoGalleryProps {
    className?: string;
}

export const TitleVideoGallery: FC<TitleVideoGalleryProps> = memo(
    (props: TitleVideoGalleryProps) => {
        const { className } = props;
        const { t } = useTranslation("volunteer");
        return (
            <div className={cn(className, styles.wrapper)}>
                <h2>{t("volunteer-gallery.Видео о себе")}</h2>
                <p className={styles.description}>
                    {t("volunteer-gallery.Добавьте одно или несколько видео через URL (например, с YouTube, Vk, Vimeo). В видео расскажите о себе, о своих навыках и опыте и мотивации путешествовать со смыслом. Видео может быть несколько.")}
                </p>
            </div>
        );
    },
);
