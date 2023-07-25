import React, { FC, memo } from "react";
import { Autoplay, EffectFade, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import Slide from "@/containers/WelcomeContainer/SliderSide/Slide/Slide";
import { sliderData } from "@/containers/WelcomeContainer/SliderSide/Slider.data";

import styles from "./SliderSide.module.scss";

const SliderSide: FC = memo(() => {
    return (
        <div className={styles.wrapper}>
            <Swiper
                modules={[Pagination, Autoplay, EffectFade]}
                effect="fade"
                slidesPerView={1}
                autoplay
                pagination={{ clickable: true }}
            >
                {sliderData &&
                    sliderData.map((item, index) => {
                        return (
                            <SwiperSlide key={index}>
                                <Slide {...item} />
                            </SwiperSlide>
                        );
                    })}
            </Swiper>
        </div>
    );
});

export default SliderSide;
