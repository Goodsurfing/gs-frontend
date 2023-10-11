import React, { ReactNode, useRef, useState } from "react";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import cn from "classnames";

import styles from "./VerticalSlider.module.scss";

interface VerticalMultiplySliderProps<T> {
    data: T[];
    renderItem: (item: T) => ReactNode;
    className?:string;
}

interface btnNavState {
    canSwipeNext: boolean;
    canSwipePrev: boolean;
}

// eslint-disable-next-line @typescript-eslint/comma-dangle
export const VerticalSlider = <T,>({
    className,
    data,
    renderItem,
}: VerticalMultiplySliderProps<T>) => {
    const swiperRef = useRef<SwiperCore | null>(null);
    const [btnNav, setBtnNav] = useState<btnNavState>({
        canSwipePrev: false,
        canSwipeNext: true,
    });

    const renderSlides = (sliderData: T[]) => sliderData.map((item, index) => <SwiperSlide key={index}>{renderItem(item)}</SwiperSlide>);

    return (
        <div className={cn(className, styles.wrapper)}>
            <div className={styles.swiperWrapper}>
                <Swiper
                    style={{ height: "90%" }}
                    setWrapperSize={false}
                    onSlideChange={(swiper) => {
                        setBtnNav((prev) => ({
                            ...prev,
                            canSwipeNext: !swiper.isEnd,
                            canSwipePrev: !swiper.isBeginning,
                        }));
                    }}
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
            {data.length > 4 && (
                <>
                    <div
                        onClick={() => swiperRef.current?.slideNext()}
                        className={`${styles.slideBtnNext} ${
                            btnNav.canSwipeNext && styles.active
                        }`}
                    />
                    <div
                        onClick={() => swiperRef.current?.slidePrev()}
                        className={`${styles.slideBtnPrev} ${
                            btnNav.canSwipePrev && styles.active
                        }`}
                    />
                </>
            )}
        </div>
    );
};
