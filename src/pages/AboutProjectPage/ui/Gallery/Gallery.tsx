import cn from "classnames";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/swiper.min.css";

import { ImageGallerySlider } from "@/shared/ui/ImageGallerySlider/ImageGallerySlider";
import { Image } from "@/types/media";
import { BASE_URL } from "@/shared/constants/api";
import styles from "./Gallery.module.scss";

interface GalleryProps {
    className?: string;
    gallery: Image[];
}

export const Gallery: FC<GalleryProps> = (props: GalleryProps) => {
    const { className, gallery } = props;
    const { t } = useTranslation("about-project");

    return (
        <section className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>
                {t("Фото со встреч и командной работы")}
            </h2>
            <ImageGallerySlider
                images={gallery.map((img) => `${BASE_URL}${img.contentUrl.slice(1)}`)}
                className={styles.gallery}
            />
        </section>
    );
};
