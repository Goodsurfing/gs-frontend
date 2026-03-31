import React, { FC, useEffect, useState } from "react";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import { useTranslation } from "react-i18next";
import CommunityNewsItem from "@/containers/CommunityNewsContainer/CommunityNewsItem/CommunityNewsItem";

import { useLazyGetBlogListQuery } from "@/entities/Blog";
import { useLocale } from "@/app/providers/LocaleProvider";
import { AdminSort } from "@/entities/Admin";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import styles from "./CommunityNewsContainer.module.scss";

const CommunityNewsContainer: FC = () => {
    const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
    const [nextEl, setNextEl] = useState<HTMLElement | null>(null);
    const { t } = useTranslation("main");
    const { locale } = useLocale();

    const [getBlogList, { data, isLoading }] = useLazyGetBlogListQuery();

    useEffect(() => {
        getBlogList({
            page: 1,
            limit: 20,
            sort: AdminSort.LikeBlogDesc,
            lang: locale,
        });
    }, [locale, getBlogList]);

    const renderSlider = isLoading ? <MiniLoader /> : (
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
                {data
                            && data.data.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <CommunityNewsItem
                                        id={item.id.toString()}
                                        title={item.name}
                                        date={item.created}
                                        image={getMediaContent(item.image.thumbnails?.large)}
                                        locale={locale}
                                    />
                                </SwiperSlide>
                            ))}
            </Swiper>
        </div>
    );

    return (
        <div className={styles.wrapper}>
            <p className={styles.description}>
                {t("Объединяет всех, кто увлечён путешествиями и готов поделиться своим опытом.")}
            </p>
            <div className={styles.container}>
                <div
                    ref={(node) => setPrevEl(node)}
                    className={styles.arrow}
                >
                    <span className={styles.arrowIcon} aria-hidden="true" />
                </div>
                {renderSlider}
                <div
                    ref={(node) => setNextEl(node)}
                    className={styles.arrow}
                >
                    <span className={styles.arrowIcon} aria-hidden="true" />
                </div>
            </div>
        </div>
    );
};

export default CommunityNewsContainer;
