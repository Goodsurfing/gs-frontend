import cn from "classnames";
import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";

import defaultImage from "@/shared/assets/images/personalCardMOCK.png";

import styles from "./Gallery.module.scss";

interface GalleryProps {
    className?: string;
}

const data = [defaultImage, defaultImage, defaultImage, defaultImage];

export const Gallery: FC<GalleryProps> = (props: GalleryProps) => {
    const { className } = props;
    const { t } = useTranslation("about-project");
    const renderSlides = useMemo(
        () => data.map((image, index) => (
            <SwiperSlide>
                <img
                    className={styles.slide}
                    src={image}
                    alt=""
                    key={index}
                />
            </SwiperSlide>
        )),
        [],
    );

    return (
        <section className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>
                {t("Фото со встреч и командной работы")}
            </h2>
            <Swiper
                className={styles.swiper}
                wrapperClass={styles.swiperWrapper}
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={3}
                navigation
                speed={1000}
            >
                <div style={{ display: "flex" }}>
                    {renderSlides}
                </div>
            </Swiper>
        </section>
    );
};
