import React, { FC, useState } from "react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";

import cn from "classnames";
import Offer from "@/containers/OffersContainer/Offer/Offer";
import { offersData } from "@/containers/OffersContainer/Offers.data";

import arrowSliderIcon from "@/shared/assets/icons/slider-arrow.svg";
import styles from "./OffersContainer.module.scss";

interface OffersContainerProps {
    className?: string;
}

const OffersContainer: FC<OffersContainerProps> = (props) => {
    const { className } = props;
    const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
    const [nextEl, setNextEl] = useState<HTMLElement | null>(null);

    return (
        <div className={cn(className, styles.wrapper)}>
            <div
                ref={(node) => setPrevEl(node)}
                className={styles.arrow}
            >
                <img src={arrowSliderIcon} alt="Previous" />
            </div>
            <div className={styles.slider}>
                <Swiper
                    className={styles.swiper}
                    modules={[Navigation]}
                    spaceBetween={10}
                    slidesPerView={3}
                    navigation={{ prevEl, nextEl }}
                    breakpoints={{
                        1100: {
                            slidesPerView: 3,
                            spaceBetween: 10,
                        },
                        992: {
                            slidesPerView: 3,

                        },
                        480: {
                            slidesPerView: 2,

                        },
                        400: {
                            slidesPerView: 1,

                        },
                        0: {
                            slidesPerView: 1,
                        },
                    }}
                >
                    {offersData
                        && offersData.map((item, index) => (
                            <SwiperSlide key={index}>
                                <Offer {...item} />
                            </SwiperSlide>
                        ))}
                </Swiper>
            </div>
            <div
                ref={(node) => setNextEl(node)}
                className={styles.arrow}
            >
                <img src={arrowSliderIcon} alt="Next" />
            </div>
        </div>
    );
};

export default OffersContainer;
