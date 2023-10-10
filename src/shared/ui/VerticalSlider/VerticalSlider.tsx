import React, { ReactNode, useRef } from "react";
import {
    Swiper, SwiperSlide, useSwiper, SwiperRef,
} from "swiper/react";
import sliderArrow from "@/shared/assets/icons/slider-arrow.svg";

import styles from "./VerticalSlide.module.scss";

interface VerticalMultiplySliderProps<T> {
    data:T[];
    renderItem: (item:T) => ReactNode
}

// eslint-disable-next-line @typescript-eslint/comma-dangle
export const VerticalSlider = <T,>({ data, renderItem }: VerticalMultiplySliderProps<T>) => {
    const swiperRef = useRef<Swiper | null>(null);

    const renderSlides = (sliderData: T[]) => sliderData.map((item, index) => {
        console.log(`Item at index ${index}:`, item);
        return (
            <SwiperSlide key={index}>{renderItem(item)}</SwiperSlide>
        );
    });

    return (
        <div className={styles.wrapper}>
            <div className={styles.swiperWrapper}>
                <Swiper
                    style={{ height: "100%" }}
                    setWrapperSize={false}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    direction="vertical"
                    slidesPerView={4}
                    spaceBetween={60}
                    pagination={{ clickable: true }}
                    navigation
                >
                    {renderSlides(data)}
                </Swiper>
            </div>
            <img
                src={sliderArrow}
                alt="ARROW"
                onClick={() => swiperRef.current.slideNext()}
                className={styles.slideBtnNext}
                // style={{
                //     width: 30, height: 30, position: "absolute", top: "80%", zIndex: 10, left: "50%", padding: 10,
                // }}
            />
            <img
                src={sliderArrow}
                alt="ARROW"
                onClick={() => swiperRef.current.slidePrev()}
                className={styles.slideBtnPrev}
                // style={{
                //     width: 30, height: 30, position: "absolute", top: 0, zIndex: 10, left: "50%", padding: 10, transform: rotate(270deg);
                // }}
            />
        </div>
    );
};
