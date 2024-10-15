import cn from "classnames";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/swiper.min.css";

import defaultImage from "@/shared/assets/images/personalCardMOCK.png";
import defaultImage1 from "@/shared/assets/images/default-offer-image.svg";
import defaultImage2 from "@/shared/assets/images/findJobHeader.png";

import styles from "./Gallery.module.scss";
import { ImageGallerySlider } from "@/shared/ui/ImageGallerySlider/ImageGallerySlider";

interface GalleryProps {
    className?: string;
}

const data = [defaultImage, defaultImage1, defaultImage2, defaultImage];

export const Gallery: FC<GalleryProps> = (props: GalleryProps) => {
    const { className } = props;
    const { t } = useTranslation("about-project");

    return (
        <section className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>
                {t("Фото со встреч и командной работы")}
            </h2>
            <ImageGallerySlider images={data} className={styles.gallery} />
        </section>
    );
};
