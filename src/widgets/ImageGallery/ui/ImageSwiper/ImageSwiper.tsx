import React, { FC, memo, useMemo } from "react";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import styles from "./ImageSwiper.module.scss";

type ImageSwiperProps = {
    images: string[];
    initialSlide: number;
};

export const ImageSwiper: FC<ImageSwiperProps> = memo(
    (props: ImageSwiperProps) => {
        const { images, initialSlide } = props;

        const renderImage = useMemo(
            () => images
                .map((image, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={image}
                            alt="gallery"
                            className={styles.image}
                        />
                    </SwiperSlide>
                )),
            [images],
        );

        return (
            <Swiper
                initialSlide={initialSlide}
                centeredSlides
                slidesPerView={1}
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
            >
                {renderImage}
            </Swiper>
        );
    },
);
