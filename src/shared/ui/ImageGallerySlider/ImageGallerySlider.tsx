import cn from "classnames";
import React, { FC, useState } from "react";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import { GalleryItem } from "@/types/media";

import { getMediaContentsArray } from "@/shared/lib/getMediaContent";

import { ModalGallery } from "../ModalGallery/ModalGallery";
import styles from "./ImageGallerySlider.module.scss";

interface ImageGallerySliderProps {
    className?: string;
    images: (string | GalleryItem)[];
}

export const ImageGallerySlider: FC<ImageGallerySliderProps> = (props) => {
    const { className, images } = props;
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [galleryItem, setGalleryItem] = useState<number>(0);
    const galleryItems = getMediaContentsArray(images);

    const handleModalClose = () => {
        setModalOpen(false);
    };

    return (
        <div className={cn(className, styles.wrapper)}>
            <Swiper
                spaceBetween={30}
                slidesPerView={3}
                modules={[Navigation]}
                className={styles.swiper}
                navigation
                wrapperClass={styles.swiperWrapper}
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                    },
                    640: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                    },
                }}
            >
                {galleryItems.map((image, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={image}
                            alt={`slide ${image}`}
                            className={styles.image}
                            onClick={() => {
                                setModalOpen(true);
                                setGalleryItem(index);
                            }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
            <ModalGallery
                isOpen={isModalOpen}
                onClose={handleModalClose}
                images={galleryItems}
                initialSlide={galleryItem}
            />
        </div>
    );
};
