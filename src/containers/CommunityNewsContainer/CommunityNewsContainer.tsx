import React, { FC, useState } from "react";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import { communityNewsData } from "@/containers/CommunityNewsContainer/CommunityNews.data";
import CommunityNewsItem from "@/containers/CommunityNewsContainer/CommunityNewsItem/CommunityNewsItem";

import arrowSliderIcon from "@/assets/icons/slider-arrow.svg";

import styles from "./CommunityNewsContainer.module.scss";

const CommunityNewsContainer: FC = () => {
    const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
    const [nextEl, setNextEl] = useState<HTMLElement | null>(null);

    return (
        <div className={styles.wrapper}>
            <p className={styles.description}>
                Объединяет всех, кто увлечён путешествиями и готов поделиться
                своим опытом.
            </p>
            <div className={styles.container}>
                <div
                    ref={(node) => {
                        return setPrevEl(node);
                    }}
                    className={styles.arrow}
                >
                    <img src={arrowSliderIcon} alt="Previous" />
                </div>
                <div className={styles.slider}>
                    <Swiper
                        modules={[Pagination, Navigation]}
                        spaceBetween={10}
                        slidesPerView={3}
                        navigation={{ prevEl, nextEl }}
                        breakpoints={{
                            1100: {
                                slidesPerView: 3,
                                spaceBetween: 10,
                                slidesOffsetBefore: 0,
                                centeredSlides: false,
                            },
                            992: {
                                slidesPerView: 2,
                                slidesOffsetBefore: 10,
                                centeredSlides: false,
                            },
                            480: {
                                slidesPerView: 1,
                                slidesOffsetBefore: 80,
                                centeredSlides: false,
                            },
                            400: {
                                slidesPerView: 1,
                                slidesOffsetBefore: 20,
                                centeredSlides: false,
                            },
                            0: {
                                slidesPerView: 1,
                                slidesOffsetBefore: 0,
                                centeredSlides: true,
                            },
                        }}
                    >
                        {communityNewsData
                            && communityNewsData.map((item, index) => {
                                return (
                                    <SwiperSlide key={index}>
                                        <CommunityNewsItem {...item} />
                                    </SwiperSlide>
                                );
                            })}
                    </Swiper>
                </div>
                <div
                    ref={(node) => {
                        return setNextEl(node);
                    }}
                    className={styles.arrow}
                >
                    <img src={arrowSliderIcon} alt="Next" />
                </div>
            </div>
        </div>
    );
};

export default CommunityNewsContainer;
