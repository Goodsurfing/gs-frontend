import React, { FC, useEffect, useState } from "react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";

import cn from "classnames";

import arrowSliderIcon from "@/shared/assets/icons/slider-arrow.svg";
import { OfferApi, OfferSort, useLazyGetOffersQuery } from "@/entities/Offer";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useAppSelector } from "@/shared/hooks/redux";
import { getUserAuthData } from "@/entities/User";
import { useGetProfileInfoQuery } from "@/entities/Profile";
import Offer from "../Offer/Offer";
import styles from "./OffersSlider.module.scss";
import { pickSliderOffers } from "./pickSliderOffers";

interface OffersSliderProps {
    className?: string;
}

export const OffersSlider: FC<OffersSliderProps> = (props) => {
    const { className } = props;
    const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
    const [nextEl, setNextEl] = useState<HTMLElement | null>(null);
    const [offers, setOffers] = useState<OfferApi[]>([]);
    const [getOffersData, { isLoading }] = useLazyGetOffersQuery();
    const { locale } = useLocale();

    const isAuth = useAppSelector(getUserAuthData);
    const { data: myProfileData, isLoading: isProfileLoading } = useGetProfileInfoQuery(
        undefined,
        { skip: !isAuth },
    );

    useEffect(() => {
        if (isProfileLoading) return;

        const fetchOffers = async () => {
            try {
                let personal: OfferApi[] = [];
                const favoriteCategories = myProfileData?.favoriteCategories ?? [];
                // GS-90: волонтёр сам выбрал интересующие его категории на
                // дашборде (тот же выбор, что двигает
                // OffersRecomendationsWidget) — это точнее общей
                // admin-подборки, поэтому приоритетнее isFeatured.
                if (favoriteCategories.length > 0) {
                    const personalResult = await getOffersData({
                        categoryIds: favoriteCategories,
                        sort: OfferSort.Recommendation,
                    }).unwrap();
                    personal = personalResult.data;
                }
                if (personal.length > 0) {
                    setOffers(pickSliderOffers(personal));
                    return;
                }

                const featured = await getOffersData({ isFeatured: true }).unwrap();
                if (featured.data.length > 0) {
                    setOffers(pickSliderOffers(featured.data));
                    return;
                }
                const recommended = await getOffersData({
                    sort: OfferSort.Recommendation,
                }).unwrap();
                setOffers(pickSliderOffers(recommended.data));
            } catch {
                setOffers([]);
            }
        };
        fetchOffers();
    }, [getOffersData, isProfileLoading, myProfileData]);

    if (isLoading) {
        return (
            <div className={cn(className, styles.wrapper)}>
                <MiniLoader />
            </div>
        );
    }

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
                    {offers
                        && offers.map((item, index) => (
                            <SwiperSlide key={index}>
                                <Offer offer={item} locale={locale} />
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
