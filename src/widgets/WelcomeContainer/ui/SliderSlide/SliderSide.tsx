import { FC, memo } from "react";
import { Autoplay, EffectFade, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import { sliderData } from "widgets/WelcomeContainer/model/data/SliderSlideData/Slider.data";

import { MemoSlide as Slide } from "../Slide/Slide";

import styles from "./SliderSide.module.scss";

const SliderSide: FC = () => (
    <div className={styles.wrapper}>
        <Swiper
            modules={[Pagination, Autoplay, EffectFade]}
            effect="fade"
            slidesPerView={1}
            autoplay
            pagination={{ clickable: true }}
        >
            {sliderData
                    && sliderData.map((item, index) => (
                        <SwiperSlide key={index}>
                            <Slide {...item} />
                        </SwiperSlide>
                    ))}
        </Swiper>
    </div>
);

export const MemoSliderSide = memo(SliderSide);
