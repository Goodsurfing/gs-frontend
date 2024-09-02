import React, { FC } from "react";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Modal } from "../Modal/Modal";
import { GalleryItem } from "@/types/media";
import styles from "./ModalGallery.module.scss";
import { getMediaContentsArray } from "@/shared/lib/getMediaContent";

interface GalleryModalProps {
    images?: GalleryItem[];
    initialSlide?: number;
    isOpen: boolean;
    onClose: () => void;
}

export const ModalGallery: FC<GalleryModalProps> = (props) => {
    const {
        onClose, images, initialSlide = 0, isOpen,
    } = props;

    if (!images || !isOpen) {
        return null;
    }

    const gallery = getMediaContentsArray(images);

    return (
        <Modal
            onClose={onClose}
            isShowCloseIcon
        >
            <div className={styles.wrapper}>
                <Swiper
                    modules={[Navigation]}
                    initialSlide={initialSlide}
                    navigation
                    pagination={{ clickable: true }}
                >
                    {gallery.map((image, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={image}
                                alt={`Slide ${index}`}
                                className={styles.modalImage}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </Modal>
    );
};
