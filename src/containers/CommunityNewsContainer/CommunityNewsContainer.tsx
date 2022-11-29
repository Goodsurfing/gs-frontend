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
                <div ref={(node) => setPrevEl(node)} className={styles.arrow}>
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
                            },
                            768: {
                                slidesPerView: 2,
                            },
                            0: {
                                slidesPerView: 1,
                            },
                        }}
                    >
                        {communityNewsData &&
                            communityNewsData.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <CommunityNewsItem {...item} />
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </div>
                <div ref={(node) => setNextEl(node)} className={styles.arrow}>
                    <img src={arrowSliderIcon} alt="Next" />
                </div>
            </div>
        </div>
    );
};

export default CommunityNewsContainer;
