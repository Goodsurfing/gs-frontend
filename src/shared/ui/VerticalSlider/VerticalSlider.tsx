import cn from "classnames";
import React, { ReactNode, useRef, useState } from "react";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import styles from "./VerticalSlider.module.scss";

interface VerticalMultiplySliderProps<T> {
    data: T[];
    renderItem: (item: T) => ReactNode;
    className?: string;
    classNameWrapper?: string;
    classNameSlide?: string;
}

interface BtnNavState {
    canSwipeNext: boolean;
    canSwipePrev: boolean;
}

// eslint-disable-next-line @typescript-eslint/comma-dangle
/** Slider for vertical scrolling of components
 *
 * Usage example
 *
 * ```tsx
 * <VerticalSlider
 *      data={data} //array of objects
 *      renderItem={(item: IUserPost)=> (<UserPost item={IUserPost} />)}
 * />
 * ```
 */
// eslint-disable-next-line @typescript-eslint/comma-dangle
export const VerticalSlider = <T,>({
    className,
    classNameWrapper,
    classNameSlide,
    data,
    renderItem,
}: VerticalMultiplySliderProps<T>) => {
    const swiperRef = useRef<SwiperCore | null>(null);
    const [btnNav, setBtnNav] = useState<BtnNavState>({
        canSwipePrev: false,
        canSwipeNext: true,
    });

    const renderSlides = (sliderData: T[]) => sliderData.map((item, index) => (
        <SwiperSlide className={cn(classNameSlide)} key={index}>
            {renderItem(item)}
        </SwiperSlide>
    ));

    return (
        <div className={cn(className, styles.wrapper)}>
            <div className={styles.swiperWrapper}>
                <Swiper
                    wrapperClass={cn(classNameWrapper)}
                    style={{ height: "100%" }}
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
                    slidesPerView={3}
                    spaceBetween={20}
                    pagination={{ clickable: true }}
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
