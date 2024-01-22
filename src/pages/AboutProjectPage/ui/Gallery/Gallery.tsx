import cn from "classnames";
import React, { FC, useMemo } from "react";
import { Navigation, Pagination } from "swiper";
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
            <h2 className={styles.title}>Фото со встреч и командной работы</h2>
            <Swiper
                className={styles.swiper}
                wrapperClass={styles.swiperWrapper}
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={3}
                navigation
                pagination={{ clickable: true }}
                speed={1000}
            >
                {renderSlides}
            </Swiper>
        </section>
    );
};
