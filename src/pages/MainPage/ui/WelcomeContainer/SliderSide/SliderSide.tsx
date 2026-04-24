import React, { FC, memo } from "react";
import { Autoplay, EffectFade, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import { useLocale } from "@/app/providers/LocaleProvider";
import Slide from "./Slide/Slide";
import { useTranslatedSliderData } from "./Slider.data";
import styles from "./SliderSide.module.scss";

const SliderSide: FC = memo(() => {
    const sliderData = useTranslatedSliderData();
    const { locale } = useLocale();

    return (
        <div className={styles.wrapper}>
            <Swiper
                modules={[Pagination, Autoplay, EffectFade]}
                effect="fade"
                slidesPerView={1}
                autoplay={{ delay: 7000, disableOnInteraction: false }}
                pagination={{
                    clickable: true,
                    bulletClass: `swiper-pagination-bullet ${styles.bullet}`,
                    bulletActiveClass: `swiper-pagination-bullet-active ${styles.bulletActive}`,
                }}
            >
                {sliderData
                    && sliderData.map((item, index) => (
                        <SwiperSlide key={index}>
                            <Slide {...item} locale={locale} />
                        </SwiperSlide>
                    ))}
            </Swiper>
        </div>
    );
});

export default SliderSide;
