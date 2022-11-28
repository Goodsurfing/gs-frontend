import React, { FC } from "react";
import { Autoplay, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import styles from "./SliderSide.module.scss";

const SliderSide: FC = () => {
    return (
        <div className={styles.wrapper}>
            <Swiper
                modules={[Pagination, Autoplay]}
                className="h-full"
                spaceBetween={50}
                slidesPerView={1}
                autoplay
                pagination={{ clickable: true }}
            >
                <SwiperSlide>
                    <h1>Hi</h1>
                </SwiperSlide>
                <SwiperSlide>
                    <h1>Hi</h1>
                </SwiperSlide>
                <SwiperSlide>
                    <h1>Hi</h1>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default SliderSide;
