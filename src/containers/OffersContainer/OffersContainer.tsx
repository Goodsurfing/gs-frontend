import React, { FC, useState } from "react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";

import Offer from "@/containers/OffersContainer/Offer/Offer";
import { offersData } from "@/containers/OffersContainer/Offers.data";

import arrowSliderIcon from "@/shared/assets/icons/slider-arrow.svg";

import styles from "./OffersContainer.module.scss";

const OffersContainer: FC = () => {
    const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
    const [nextEl, setNextEl] = useState<HTMLElement | null>(null);

    return (
        <div className={styles.wrapper}>
            <div
                ref={(node) => setPrevEl(node)}
                className={styles.arrow}
            >
                <img src={arrowSliderIcon} alt="Previous" />
            </div>
            <div className={styles.slider}>
                <Swiper
                    modules={[Pagination, Navigation]}
                    spaceBetween={0}
                    slidesPerView={3}
                    centerInsufficientSlides
                    navigation={{ prevEl, nextEl }}
                    breakpoints={{
                        1100: {
                            slidesPerView: 3,
                            spaceBetween: 10,
                            slidesOffsetBefore: 0,
                            slidesOffsetAfter: 0,
                            centeredSlides: false,
                        },
                        992: {
                            slidesPerView: 2,
                            slidesOffsetBefore: 40,
                            slidesOffsetAfter: 10,
                            centeredSlides: false,
                        },
                        480: {
                            slidesPerView: 1,
                            slidesOffsetBefore: 40,
                            centeredSlides: false,
                        },
                        400: {
                            slidesPerView: 1,
                            slidesOffsetBefore: 20,
                            centeredSlides: false,
                        },
                        0: {
                            slidesPerView: 1,
                            slidesOffsetAfter: 120,
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
